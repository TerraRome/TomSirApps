import React, {useState} from 'react'
import {View, StyleSheet, Alert} from 'react-native'
import CheckBox from '@react-native-community/checkbox'
import Text from '@components/Text'
import {theme} from '@utils/theme'
import TextInput from '@components/TextInput'
import CustomButton from '@components/Button'
import {showErrorToast, showSuccessToast} from 'components/Toast'
import {addAddonCategory, deleteAddonCategory, editAddonCategory} from '@services/addon'

const AddAddonCategory = ({navigation, route}: any) => {
  const isEdit = route?.params?.isEdit || false
  const id = route?.params?.id || ''

  const [addonCategory, setAddonCategory] = useState<any>({
    name: route?.params?.name || '',
    isRequired: route?.params?.isRequired === 1 ? true : false,
    maxLimit: route?.params?.maxLimit?.toString() || '1',
  })

  const onChange = (type: string) => (value: any) => {
    setAddonCategory({
      ...addonCategory,
      [type]: value,
    })
  }

  const onSave = async () => {
    const {name, isRequired, maxLimit} = addonCategory
    const payload = {
      name: name,
      is_required: isRequired,
      max_limit: Number(maxLimit),
    }

    if (isEdit) {
      try {
        const data = await editAddonCategory(payload, id)
        if (data.status === 200) {
          showSuccessToast('Data varian kategori berhasil diubah')
          navigation.navigate('AddonCategory')
        }
      } catch (error) {
        showErrorToast(error.message)
      }
    } else {
      try {
        const data = await addAddonCategory(payload)
        if (data.status === 200) {
          showSuccessToast('Data varian kategori berhasil ditambah')
          navigation.navigate('AddonCategory')
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
              const data = await deleteAddonCategory(id)
              if (data.status === 200) {
                showSuccessToast('Data varian kategori berhasil dihapus')
                navigation.navigate('AddonCategory')
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
    <View style={styles.container}>
      <Text style={styles.inputTitle}>Nama</Text>
      <TextInput value={addonCategory.name} placeholder="Topping" onChangeText={onChange('name')} type="default" />
      <Text style={styles.inputTitle}>Max Limit</Text>
      <TextInput
        value={addonCategory.maxLimit}
        placeholder="1"
        onChangeText={onChange('maxLimit')}
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
          value={addonCategory.isRequired}
          onValueChange={(selected: boolean) => {
            setAddonCategory({
              ...addonCategory,
              isRequired: selected,
            })
          }}
        />
        <Text style={styles.inputTitle}>Wajib Dipilih</Text>
      </View>
      <View style={styles.buttonWrapper}>
        {isEdit ? (
          <View style={styles.buttonRow}>
            <CustomButton mode="outlined" onPress={onDelete} style={styles.buttonWidth}>
              <Text style={styles.buttonTextDelete}>HAPUS</Text>
            </CustomButton>
            <CustomButton mode="default" onPress={onSave} loading={!addonCategory.name} style={styles.buttonWidth}>
              <Text style={styles.buttonText}>SIMPAN</Text>
            </CustomButton>
          </View>
        ) : (
          <CustomButton mode="default" onPress={onSave} loading={!addonCategory.name}>
            <Text style={styles.buttonText}>SIMPAN</Text>
          </CustomButton>
        )}
      </View>
    </View>
  )
}

export default AddAddonCategory

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
