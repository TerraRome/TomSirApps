import Button from '@components/Button'
import Text from '@components/Text'
import TextInput from '@components/TextInput'
import { addMerchant, editMerchants } from '@services/merchant'
import { getMerchantById } from '@store/actions/merchant'
import { theme } from '@utils/theme'
import { showErrorToast, showSuccessToast } from 'components/Toast'
import React, { useState } from 'react'
import { Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useDispatch, useSelector } from 'react-redux'

const options: any = {
  quality: 1,
  mediaType: 'photo',
  maxWidth: 200,
  maxHeight: 200,
}

const ManageMerchant = ({ navigation, route }: any) => {
  const dispatch = useDispatch()
  const id = route?.params?.id || ''
  const isEdit = route?.params?.isEdit
  const { user } = useSelector((state: any) => state.auth)
  const isAdmin = user?.role === 'admin'

  const [merchant, setMerchant] = useState<any>({
    name: route?.params?.name || '',
    address: route?.params?.address || '',
    phone: route?.params?.phone || '',
    footer_note: route?.params?.footer_note || '',
    image: '',
    imageUri: route?.params?.image || '',
  })

  const onChange = (type: string) => (value: any) => {
    setMerchant({
      ...merchant,
      [type]: value,
    })
  }

  const handleUploadPhoto = () => {
    launchImageLibrary(options, response => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        // console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setMerchant({
          ...merchant,
          image: response?.assets[0]!,
          imageUri: response?.assets[0].uri!,
        })
      }
    })
  }

  const onCreateMerchant = async () => {
    const { name, address, phone, footer_note, image } = merchant

    const formData: any = new FormData()
    formData.append('name', name)
    formData.append('address', address)
    formData.append('phone_number', phone)
    formData.append('footer_note', footer_note)

    if (image) {
      formData.append('image', {
        uri: image.uri,
        name: image.fileName,
        type: image.type,
      })
    }

    if (isEdit) {
      try {
        const data = await editMerchants(id, formData)
        if (data.status === 200) {
          showSuccessToast('Berhasil memperbarui data merchant')
          if (isAdmin) {
            dispatch(getMerchantById)
            navigation.navigate('ManageStore')
          } else {
            navigation.navigate('ManageMerchantList')
          }
        }
      } catch (error: any) {
        showErrorToast(error.message)
      }
    } else {
      try {
        const data = await addMerchant(formData)
        if (data.status === 200) {
          showSuccessToast('Berhasil mendaftarkan merchant')
          navigation.navigate('ManageMerchantList')
        }
      } catch (error: any) {
        showErrorToast(error.message)
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          <Text style={styles.inputTitle}>Nama</Text>
          <TextInput type="default" placeholder="Masukan Nama" value={merchant.name} onChangeText={onChange('name')} />
          <Text style={styles.inputTitle}>Alamat</Text>
          <TextInput
            type="default"
            placeholder="Masukan Alamat"
            value={merchant.address}
            onChangeText={onChange('address')}
          />
          <Text style={styles.inputTitle}>Nomor Telepon</Text>
          <TextInput
            type="default"
            placeholder="Masukan Nomor Telepon"
            value={merchant.phone}
            onChangeText={onChange('phone')}
          />
          <Text style={styles.inputTitle}>Footer Note</Text>
          <TextInput
            type="default"
            multiline
            placeholder="Mis. Password Wifi"
            style={{ height: 70 }}
            value={merchant.footer_note}
            onChangeText={onChange('footer_note')}
          />
          <Text style={styles.inputTitle}>Logo Merchant</Text>
          <View style={styles.photoWrapper}>
            {merchant.imageUri ? (
              <Image source={{ uri: merchant.imageUri }} style={styles.photo} />
            ) : (
              <View style={styles.photo}>
                <Ionicons name="ios-image-outline" size={25} color={theme.colors.grey} />
              </View>
            )}
            {merchant.imageUri ? (
              <TouchableOpacity
                onPress={() => {
                  setMerchant({
                    ...merchant,
                    image: '',
                    imageUri: '',
                  })
                }}>
                <AntDesign name="close" size={20} style={styles.closeIcon} color={theme.colors.blackSemiTransparent} />
              </TouchableOpacity>
            ) : (
              <Button mode="default" style={styles.buttonPhoto} onPress={handleUploadPhoto}>
                <Text style={styles.photoText}>PILIH FOTO</Text>
              </Button>
            )}
          </View>
        </ScrollView>
      </View>

      <View style={styles.buttonWrapper}>
        {isEdit ? (
          <Button mode="default" onPress={onCreateMerchant}>
            <Text style={styles.buttonText}>SIMPAN</Text>
          </Button>
        ) : (
          <Button mode="default" onPress={onCreateMerchant}>
            <Text style={styles.buttonText}>SIMPAN</Text>
          </Button>
        )}
      </View>
    </SafeAreaView>
  )
}

export default ManageMerchant

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
  buttonTextDelete: {
    color: theme.colors.primary,
    fontFamily: 'Jost-SemiBold',
  },
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
    height: 50,
    width: 125,
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
  },
  photoText: {
    color: theme.colors.white,
    fontFamily: 'Jost-SemiBold',
    fontSize: 14,
  },
  closeIcon: {
    marginRight: 10,
  },
})
