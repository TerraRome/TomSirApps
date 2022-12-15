import React, { useState, useEffect, useRef } from 'react'
import { View, Switch, SafeAreaView, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native'
import FormData from 'form-data'
import { launchImageLibrary } from 'react-native-image-picker'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { addTypeOrder, editTypeOrder, deleteTypeOrder } from '@services/typeorder'
import { showErrorToast, showSuccessToast } from 'components/Toast'
import { useSelector, useDispatch } from 'react-redux'
import { theme } from '@utils/theme'
import Text from '@components/Text'
import Button from '@components/Button'
import Modalize from '@components/Modalize'
import TextInput from '@components/TextInput'

const options: any = {
  quality: 0.4,
  mediaType: 'photo',
  maxHeight: 400,
}

const AddTypeOrder = ({ route }: any) => {
  const navigation = useNavigation()
  const id = route?.params?.id || ''
  const isEdit = route?.params?.isEdit
  const {user} = useSelector((state: any) => state.auth)

  const modalFilterRef: any = useRef()
  const [typeOrder, setTypeOrder] = useState<any>({
    name: route?.params?.name || '',
    status: route?.params?.status || false,
  })

  const onChange = (type: any) => (value: any) => {
    setTypeOrder({
      ...typeOrder,
      [type]: value,
    })
  }

  const onCreateProduct = async () => {
    const { name, status } = typeOrder

    const payload = {
      name: name,
      status: status,
      merchant_id: user.merchant.id
    }

    if (isEdit) {
      try {
        const data = await editTypeOrder(id, payload)
        if (data.status === 200) {
          showSuccessToast('Data Tipe order berhasil diubah')
          navigation.navigate('ManageTypeOrder')
        }
      } catch (error) {
        showErrorToast(error.message)
      }
    } else {
      try {
        const data = await addTypeOrder(payload)
        if (data.status === 200) {
          showSuccessToast('Data Tipe order berhasil ditambah')
          navigation.goBack()
        }
      } catch (error) {
        showErrorToast(error.message)
      }
    }
  }

  const onDeleteProduct = () => {
    Alert.alert(
      'Hapus?',
      'Kamu yakin untuk menghapus tipe order ini?',
      [
        {
          text: 'Batal',
        },
        {
          text: 'Ya',
          onPress: async () => {
            try {
              const data = await deleteTypeOrder(id)
              if (data.status === 200) {
                showSuccessToast('Data tipe order berhasil dihapus')
                navigation.navigate('ManageTypeOrder')
              }
            } catch ({ message }) {
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
          <Text style={styles.inputTitle}>Nama Produk</Text>
          <TextInput
            value={typeOrder.name}
            placeholder="Masukkan nama produk"
            onChangeText={onChange('name')}
            type="default"
          />
          <Text style={styles.inputTitle}>Harge Jual per Tipe Pesanan</Text>
          <View style={styles.switchView}>
            <Text style={styles.inputTitle2}>*Terapkan harga berbeda untuk setiap tipe pesanan</Text>
            <Switch
              style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
              trackColor={{ false: "#767577", true: theme.colors.primary }}
              thumbColor={typeOrder.status ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={onChange('status')}
              value={typeOrder.status}
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.buttonWrapper}>
        {isEdit ? (
          <View style={styles.buttonRow}>
            <Button mode="outlined" onPress={onDeleteProduct} style={styles.buttonWidth}>
              <Text style={styles.buttonTextDelete}>HAPUS</Text>
            </Button>
            <Button mode="default" onPress={onCreateProduct} loading={!typeOrder.name} style={styles.buttonWidth}>
              <Text style={styles.buttonText}>SIMPAN</Text>
            </Button>
          </View>
        ) : (
            <Button mode="default" onPress={onCreateProduct} loading={!typeOrder.name}>
              <Text style={styles.buttonText}>SIMPAN</Text>
            </Button>
          )}
      </View>
    </SafeAreaView>
  )
}

export default AddTypeOrder

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  content: {
    margin: 16,
    flex: 1,
  },
  inputTitle: {
    fontSize: 14,
    paddingLeft: 5,
  },
  inputTitle2: {
    color: 'grey',
    fontSize: 14,
    paddingLeft: 5,
  },
  switchView: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginRight: 15 },
  photoWrapper: {
    height: 80,
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.defaultBorderColor,
    borderRadius: 10,
    marginVertical: 8,
    padding: 6,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photo: {
    height: 70,
    width: 70,
    backgroundColor: theme.colors.disabled,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  buttonPhoto: {
    height: 40,
    width: 100,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
    borderRadius: 6,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoText: {
    color: theme.colors.primary,
    fontFamily: 'Jost-SemiBold',
    fontSize: 14,
  },
  inputDesc: {
    height: 200,
  },
  closeIcon: {
    marginRight: 10,
  },
  buttonSave: {
    bottom: 16,
    right: 16,
    left: 16,
    height: 50,
    position: 'absolute',
  },
  category: {
    width: '100%',
    borderColor: theme.colors.defaultBorderColor,
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addon: {
    width: '100%',
    borderColor: theme.colors.defaultBorderColor,
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  modalContent: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgray',
  },
  modalContentWrapper: {
    padding: 16,
  },
  scrollView: {
    marginBottom: 100,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    paddingVertical: 6,
    width: 'auto',
    paddingHorizontal: 20,
    borderColor: theme.colors.blackSemiTransparent,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 6,
  },
  buttonText: {
    color: theme.colors.white,
    fontFamily: 'Jost-SemiBold',
  },
  buttonTextDelete: {
    color: theme.colors.primary,
    fontFamily: 'Jost-SemiBold',
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
  placeholder: {
    color: theme.colors.grey,
    fontSize: 12,
    paddingLeft: 8,
  },
})
