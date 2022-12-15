import React, { useState } from 'react'
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import Text from '@components/Text'
import { moneyFormat, convertToAngka } from '@utils/convertRupiah'
import { useSelector, useDispatch } from 'react-redux'
import { theme } from '@utils/theme'
import TextInput from '@components/TextInput'
import CustomButton from '@components/Button'
import Button from '@components/Button'
import { showErrorToast, showSuccessToast } from 'components/Toast'
import { addCustomer, editCustomer, deleteCustomer } from '@services/customer'

const AddCustomer = ({ navigation, route }: any) => {
  const isEdit = route?.params?.isEdit || false
  const id = route?.params?.id || ''
  const { user } = useSelector((state: any) => state.auth)
  const [modalDateVisible, setModalDateVisible] = useState(false)
  const [customer, setCustomer] = useState<any>({
    name: route?.params?.name || null,
    email: route?.params?.email || '',
    phone_number: route?.params?.phone_number || '',
  })

  const onChange = (type: string) => (value: any) => {
    setCustomer({
      ...customer,
      [type]: value,
    })
  }

  const onSave = async () => {
    const { name, email, phone_number } = customer

    const payload = {
      name: name,
      email: email,
      phone_number: phone_number,
      merchant_id: user.merchant.id
    }

    // if (isEdit) {
    //   delete payload.addon_category_id
    // }

    if (isEdit) {
      try {
        const data = await editCustomer(id, payload)
        if (data.status === 200) {
          showSuccessToast('Data Pelanggan berhasil diubah')
          navigation.navigate('ManageCustomer')
        }
      } catch (error) {
        showErrorToast(error.message)
      }
    } else {
      try {
        const data = await addCustomer(payload);
        if (data.status === 200) {
          showSuccessToast('Data Pelanggan berhasil ditambah')
          navigation.goBack()
        }
      } catch (error) {
        showErrorToast(error.message)
      }
    }
  }

  const onDeleteCustomer = () => {
    Alert.alert(
      'Hapus?',
      'Kamu yakin untuk menghapus Produk ini?',
      [
        {
          text: 'Batal',
        },
        {
          text: 'Ya',
          onPress: async () => {
            try {
              const data = await deleteCustomer(id)
              if (data.status === 200) {
                showSuccessToast('Data Pelanggan berhasil dihapus')
                navigation.navigate('ManageCustomer')
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
    <View style={styles.container}>
      <Text style={styles.inputTitle}>Nama Pelanggan</Text>
      <TextInput
        value={customer.name}
        placeholder="Nama"
        onChangeText={onChange('name')}
        type="default"
      />
      <Text style={styles.inputTitle}>Email Pelanggan</Text>
      <TextInput
        value={customer.email}
        placeholder="Email"
        onChangeText={onChange('email')}
        type="default"
      />
      <Text style={styles.inputTitle}>No. Pelanggan</Text>
      <TextInput
        value={customer.phone_number}
        placeholder="0812XXXXXX"
        onChangeText={onChange('phone_number')}
        type="default"
        isNumber
      />
      <View style={styles.buttonWrapper}>
        {isEdit ? (
          <View style={styles.buttonRow}>
            <Button mode="outlined" onPress={onDeleteCustomer} style={styles.buttonWidth}>
              <Text style={styles.buttonTextDelete}>HAPUS</Text>
            </Button>
            <Button mode="default" onPress={onSave} loading={!customer.name || !customer.email || !customer.phone_number} style={styles.buttonWidth}>
              <Text style={styles.buttonText}>SIMPAN</Text>
            </Button>
          </View>
        ) : (
            <Button mode="default" onPress={onSave} loading={!customer.name || !customer.email || !customer.phone_number}>
              <Text style={styles.buttonText}>SIMPAN</Text>
            </Button>
          )}
      </View>
    </View>
  )
}

export default AddCustomer

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flex: 1,
    padding: 16,
  },
  inputTitle: {
    fontSize: 14,
    paddingLeft: 5,
  },
  buttonText: {
    color: theme.colors.white,
    fontFamily: 'Jost-SemiBold',
  },
  buttonTextDelete: {
    color: theme.colors.primary,
    fontFamily: 'Jost-SemiBold',
  },
  wrapSelectTypeOrder: { flexDirection: 'row', marginHorizontal: -8, marginBottom: 6 },
  selectButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 2,
    borderRadius: 10,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  inputDesc: {
    height: 200,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonWidth: {
    width: '45%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expDate: {
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
  placeholder: {
    color: theme.colors.grey,
    fontSize: 12,
    paddingLeft: 8,
  },
})
