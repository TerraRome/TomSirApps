import React, {useState} from 'react'
import {View, StyleSheet, Alert} from 'react-native'
import CheckBox from '@react-native-community/checkbox'
import Text from '@components/Text'
import {moneyFormat, convertToAngka} from '@utils/convertRupiah'
import {theme} from '@utils/theme'
import TextInput from '@components/TextInput'
import CustomButton from '@components/Button'
import {showErrorToast, showSuccessToast} from 'components/Toast'
import {addAddonMenu, deleteAddonMenu, editAddonMenu} from '@services/addon'

const AddAddonMenu = ({navigation, route}: any) => {
  const isEdit = route?.params?.isEdit || false
  const id = route?.params?.id || ''

  const [addonMenu, setAddonMenu] = useState<any>({
    name: route?.params?.name || '',
    price: route?.params?.price?.toString() || '',
    isActive: route?.params?.isActive === 0 ? false : true || true,
  })

  const onChange = (type: string) => (value: any) => {
    setAddonMenu({
      ...addonMenu,
      [type]: value,
    })
  }

  const onSave = async () => {
    const {name, price, isActive} = addonMenu

    const payload = {
      name: name,
      price: convertToAngka(price),
      is_active: isActive,
      addon_category_id: id,
    }

    if (isEdit) {
      delete payload.addon_category_id
    }

    if (isEdit) {
      try {
        const data = await editAddonMenu(payload, id)
        if (data.status === 200) {
          showSuccessToast('Data varian menu berhasil diubah')
          navigation.navigate('AddonMenu')
        }
      } catch (error) {
        showErrorToast(error.message)
      }
    } else {
      try {
        const data = await addAddonMenu(payload)
        if (data.status === 200) {
          showSuccessToast('Data varian menu berhasil ditambah')
          navigation.navigate('AddonMenu')
        }
      } catch (error) {
        showErrorToast(error.message)
      }
    }
  }

  const onDelete = () => {
    Alert.alert(
      'Hapus?',
      'Kamu yakin untuk menghapus addon kategori ini?',
      [
        {
          text: 'Batal',
        },
        {
          text: 'Ya',
          onPress: async () => {
            try {
              const data = await deleteAddonMenu(id)
              if (data.status === 200) {
                showSuccessToast('Data varian menu berhasil dihapus')
                navigation.navigate('AddonMenu')
              }
            } catch (error) {
              showErrorToast(error.message)
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
      <Text style={styles.inputTitle}>Nama Menu</Text>
      <TextInput value={addonMenu.name} placeholder="Hot" onChangeText={onChange('name')} type="default" />
      <Text style={styles.inputTitle}>Harga</Text>
      <TextInput
        value={moneyFormat(addonMenu.price)}
        placeholder="1000"
        onChangeText={onChange('price')}
        type="default"
        isNumber
      />
      <View style={styles.checkboxContainer}>
        <CheckBox
          disabled={false}
          tintColors={{true: theme.colors.primary}}
          onTintColor={theme.colors.grey2}
          onFillColor={theme.colors.grey2}
          onCheckColor={theme.colors.white}
          animationDuration={0.2}
          lineWidth={1.5}
          boxType={'square'}
          value={addonMenu.isActive}
          onValueChange={(selected: boolean) => {
            setAddonMenu({
              ...addonMenu,
              isActive: selected,
            })
          }}
        />
        <Text style={styles.inputTitle}>Aktifkan Menu</Text>
      </View>
      <View style={styles.buttonWrapper}>
        {isEdit ? (
          <View style={styles.buttonRow}>
            <CustomButton mode="outlined" onPress={onDelete} style={styles.buttonWidth}>
              <Text style={styles.buttonTextDelete}>HAPUS</Text>
            </CustomButton>
            <CustomButton
              mode="default"
              onPress={onSave}
              loading={!addonMenu.name || !addonMenu.price}
              style={styles.buttonWidth}>
              <Text style={styles.buttonText}>SIMPAN</Text>
            </CustomButton>
          </View>
        ) : (
          <CustomButton mode="default" onPress={onSave} loading={!addonMenu.price || !addonMenu.name}>
            <Text style={styles.buttonText}>SIMPAN</Text>
          </CustomButton>
        )}
      </View>
    </View>
  )
}

export default AddAddonMenu

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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
