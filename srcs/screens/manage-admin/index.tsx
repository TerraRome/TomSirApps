import React, {useEffect, useState, useRef} from 'react'
import {SafeAreaView, View, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native'
import Text from '@components/Text'
import TextInput from '@components/TextInput'
import Button from '@components/Button'
import Modalize from '@components/Modalize'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {theme} from '@utils/theme'
import {useNavigation} from '@react-navigation/native'
import {useSelector, useDispatch} from 'react-redux'
import {getMerchant} from 'store/actions/merchant'
import {addUser, editUser, deleteUser} from 'services/user'
import {showErrorToast, showSuccessToast} from 'components/Toast'

const ManageAdmin = ({navigation, route}: any) => {
  const dispatch = useDispatch()
  const id = route?.params?.id || ''
  const isEdit = route?.params?.isEdit
  const modalFilterMerchant: any = useRef()
  const modalFilterRole: any = useRef()
  const merchantState = useSelector((state: any) => state.auth.merchant)
  const userState = useSelector((state: any) => state.auth.user)
  const isAdmin = userState?.role === 'admin'
  const merchant = useSelector((state: any) => state.merchants.rows)
  const [user, setUser] = useState<any>({
    fullname: route?.params?.fullname || '',
    email: route?.params?.email || '',
    password: route?.params?.password || '',
    role: route?.params?.role || '',
    merchant_id: route?.params?.merchant_id || '',
    merchantName: route?.params?.merchantName || '',
    role_id: route?.params?.role_id || '',
  })

  const dataRole = [
    {id: 1, name: 'admin'},
    {id: 2, name: 'staff'},
  ]

  useEffect(() => {
    dispatch(getMerchant())
  }, [])

  const onChange = (type: string) => (value: any) => {
    setUser({
      ...user,
      [type]: value,
    })
  }

  const onCreateUser = async () => {
    const {fullname, email, password, role, merchant_id} = user

    const formData: any = new FormData()
    formData.append('fullname', fullname)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('role', role)
    formData.append('merchant_id', isAdmin ? merchantState.id : merchant_id)

    if (isEdit) {
      try {
        const data = await editUser(id, formData)
        if (data.status === 200) {
          showSuccessToast('Berhasil memperbarui data pengguna')
          navigation.navigate('ManageAdminList')
        }
      } catch (error) {
        showErrorToast(error.message)
      }
    } else {
      try {
        const data = await addUser(formData)
        if (data.status === 200) {
          showSuccessToast('Berhasil menambah data pengguna')
          navigation.navigate('ManageAdminList')
        }
      } catch (error) {
        showErrorToast(error.message)
      }
    }
  }

  const onDeleteUser = () => {
    Alert.alert(
      'Hapus?',
      'Kamu yakin untuk menghapus User ini?',
      [
        {
          text: 'Batal',
        },
        {
          text: 'Ya',
          onPress: async () => {
            try {
              const data = await deleteUser(id)
              if (data.status === 200) {
                showSuccessToast('Berhasil menghapus akun pengguna')
                navigation.navigate('ManageAdminList')
              }
            } catch ({message}) {
              showErrorToast(message)
            }
          },
        },
      ],
      {
        cancelable: true,
      },
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          <Text style={styles.inputTitle}>Nama</Text>
          <TextInput
            type="default"
            placeholder="Masukan Nama"
            value={user.fullname}
            onChangeText={onChange('fullname')}
          />
          <Text style={styles.inputTitle}>Email</Text>
          <TextInput type="default" placeholder="Masukan Email" value={user.email} onChangeText={onChange('email')} />
          <Text style={styles.inputTitle}>Password</Text>
          <TextInput
            type="default"
            placeholder="Masukan Password"
            value={user.password}
            onChangeText={onChange('password')}
            isPassword={true}
          />
          <Text style={styles.inputTitle}>Role</Text>
          <TouchableOpacity onPress={() => modalFilterRole?.current?.open()} style={styles.filter}>
            <Text>{user.role || ''}</Text>
            <AntDesign name="right" size={20} color={theme.colors.blackSemiTransparent} />
          </TouchableOpacity>
          {isEdit ? null : (
            <View>
              <Text style={styles.inputTitle}>Merchant</Text>
              {isAdmin ? (
                <View style={styles.filter}>
                  <Text>{merchantState.name}</Text>
                </View>
              ) : (
                <TouchableOpacity onPress={() => modalFilterMerchant?.current?.open()} style={styles.filter}>
                  <Text>{user.merchantName || ''}</Text>
                  <AntDesign name="right" size={20} color={theme.colors.blackSemiTransparent} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      </View>

      <View style={styles.buttonWrapper}>
        {isEdit ? (
          <View style={styles.buttonRow}>
            <Button mode="outlined" onPress={onDeleteUser} style={styles.buttonWidth}>
              <Text style={styles.buttonTextDelete}>Hapus</Text>
            </Button>
            <Button mode="default" onPress={onCreateUser} style={styles.buttonWidth}>
              <Text style={styles.buttonText}>SIMPAN</Text>
            </Button>
          </View>
        ) : (
          <Button mode="default" onPress={onCreateUser}>
            <Text style={styles.buttonText}>SIMPAN</Text>
          </Button>
        )}
      </View>

      <Modalize ref={modalFilterMerchant}>
        <View style={styles.modalContentWrapper}>
          {merchant.map((e: any) => (
            <TouchableOpacity
              key={e.id}
              style={styles.modalContent}
              onPress={() => {
                setUser({...user, merchant_id: e.id, merchantName: e.name})
                modalFilterMerchant?.current?.close()
              }}>
              <Text type="semibold">{e.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modalize>
      <Modalize ref={modalFilterRole}>
        <View style={styles.modalContentWrapper}>
          {dataRole.map((e: any) => (
            <TouchableOpacity
              key={e.id}
              style={styles.modalContent}
              onPress={() => {
                setUser({...user, role_id: e.id, role: e.name})
                modalFilterRole?.current?.close()
              }}>
              <Text type="semibold">{e.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modalize>
    </SafeAreaView>
  )
}

export default ManageAdmin

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  content: {
    margin: 16,
    flex: 1,
  },
  scrollView: {
    marginBottom: 100,
  },
  inputTitle: {
    fontSize: 14,
    paddingLeft: 5,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonWidth: {
    width: '45%',
  },
  buttonText: {
    color: theme.colors.white,
    fontFamily: 'Jost-SemiBold',
  },
  modalContentWrapper: {
    padding: 16,
  },
  filter: {
    width: '100%',
    borderColor: theme.colors.defaultBorderColor,
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalContent: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgray',
  },
  buttonTextDelete: {
    color: theme.colors.primary,
    fontFamily: 'Jost-SemiBold',
  },
})
