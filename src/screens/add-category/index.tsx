import React, {useState} from 'react'
import {View, StyleSheet, Alert} from 'react-native'
import Text from '@components/Text'
import {theme} from '@utils/theme'
import TextInput from '@components/TextInput'
import CustomButton from '@components/Button'
import {showErrorToast, showSuccessToast} from 'components/Toast'
import {addCategory, editCategory, deleteCategory} from '@services/category'

const AddCategory = ({navigation, route}: any) => {
  const isEdit = route?.params?.isEdit || false
  const id = route?.params?.id || ''

  const [emoji, setEmoji] = useState('')
  const [category, setCategory] = useState(route?.params?.name || '')

  const onChangeText = (value: string) => {
    setCategory(value)
  }

  const onChangeEmoji = (value: string) => {
    setEmoji(value)
  }

  const onSave = async () => {
    const payload = emoji ? {name: category, icon: emoji} : {name: category}

    if (isEdit) {
      try {
        const data = await editCategory(payload, id)
        if (data.status === 200) {
          showSuccessToast('Data kategori berhasil diubah')
          navigation.navigate('CategoryList')
        }
      } catch ({message}) {
        showErrorToast(message)
      }
    } else {
      try {
        const data = await addCategory(payload)
        if (data.status === 200) {
          showSuccessToast('Data kategori berhasil ditambah')
          navigation.navigate('CategoryList')
        }
      } catch ({message}) {
        showErrorToast(message)
      }
    }
  }

  const onDelete = () => {
    Alert.alert(
      'Hapus?',
      'Kamu yakin untuk menghapus kategori ini?',
      [
        {
          text: 'Batal',
        },
        {
          text: 'Ya',
          onPress: async () => {
            try {
              const data = await deleteCategory(id)
              if (data.status === 200) {
                showSuccessToast('Data bahan berhasil dihapus')
                navigation.navigate('CategoryList')
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
      <Text style={styles.inputTitle}>Nama Kategori*</Text>
      <TextInput
        value={category}
        placeholder="Coffee"
        onChangeText={(value: string) => onChangeText(value)}
        type="default"
      />
      <Text style={styles.inputTitle}>Icon kategori</Text>
      <TextInput value={emoji} placeholder="🍔" onChangeText={(value: string) => onChangeEmoji(value)} type="default" />
      <View style={styles.buttonWrapper}>
        {isEdit ? (
          <View style={styles.buttonRow}>
            <CustomButton mode="outlined" onPress={onDelete} style={styles.buttonWidth}>
              <Text style={styles.buttonTextDelete}>HAPUS</Text>
            </CustomButton>
            <CustomButton mode="default" onPress={onSave} loading={!category} style={styles.buttonWidth}>
              <Text style={styles.buttonText}>SIMPAN</Text>
            </CustomButton>
          </View>
        ) : (
          <CustomButton mode="default" onPress={onSave} loading={!category}>
            <Text style={styles.buttonText}>SIMPAN</Text>
          </CustomButton>
        )}
      </View>
    </View>
  )
}

export default AddCategory

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
})
