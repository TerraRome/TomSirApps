import React, { useState } from 'react'
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import AntDesign from 'react-native-vector-icons/AntDesign'
import CheckBox from '@react-native-community/checkbox'
import Text from '@components/Text'
import { moneyFormat, convertToAngka } from '@utils/convertRupiah'
import { useSelector, useDispatch } from 'react-redux'
import { theme } from '@utils/theme'
import { formatYYMMDD } from '@utils/formatDate'
import Button from '@components/Button'
import moment from 'moment'
import TextInput from '@components/TextInput'
import CustomButton from '@components/Button'
import { showErrorToast, showSuccessToast } from 'components/Toast'
import { addKas, editKas, deleteKas } from '@services/kas'

const TYPE_KAS = [
  { label: 'Debit', id: 'debit' },
  { label: 'Kredit', id: 'kredit' },
]

const ManageKas = ({ navigation, route }: any) => {
  const isEdit = route?.params?.isEdit || false
  const id = route?.params?.id || ''
  const { user } = useSelector((state: any) => state.auth)
  const [modalDateVisible, setModalDateVisible] = useState(false)
  const [typeKas, setTypeKas] = useState('debit')
  const [kasMenu, setKasMenu] = useState<any>({
    jumlah: route?.params?.jumlah || null,
    tanggal: route?.params?.tanggal || '',
    deskripsi: route?.params?.deskripsi || '',
  })

  const onChange = (type: string) => (value: any) => {
    setKasMenu({
      ...kasMenu,
      [type]: value,
    })
  }

  const onSave = async () => {
    const { jumlah, tanggal, deskripsi } = kasMenu

    const payload = {
      tanggal: tanggal,
      type: typeKas,
      jumlah: convertToAngka(jumlah),
      deskripsi: deskripsi,
      merchant_id: user.merchant.id
    }

    // if (isEdit) {
    //   delete payload.addon_category_id
    // }

    if (isEdit) {
      try {
        const data = await editKas(id, payload)
        if (data.status === 200) {
          showSuccessToast('Data kas berhasil diubah')
          navigation.navigate('ManageKas')
        }
      } catch (error) {
        showErrorToast(error.message)
      }
    } else {
      try {
        const data = await addKas(payload)
        if (data.status === 200) {
          showSuccessToast('Data kas berhasil ditambah')
          navigation.goBack()
        }
      } catch (error) {
        showErrorToast(error.message)
      }
    }
  }

  const toggleDatePicker = () => setModalDateVisible(!modalDateVisible)

  const handleConfirm = (date: Date) => {
    setKasMenu({ ...kasMenu, tanggal: formatYYMMDD(date) })
    toggleDatePicker()
  }

  const onDeleteKas = () => {
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
              const data = await deleteKas(id)
              if (data.status === 200) {
                showSuccessToast('Data Kas berhasil dihapus')
                navigation.navigate('ManageKas')
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
      <Text style={styles.inputTitle}>Tanggal Transaksi</Text>
      <TouchableOpacity
        onPress={toggleDatePicker}
        style={styles.expDate}
      >
        {kasMenu.tanggal ? <Text>{kasMenu.tanggal}</Text> : <Text style={styles.placeholder}>2021-06-26</Text>}
        <AntDesign name="right"
          size={20}
          color={theme.colors.blackSemiTransparent}
        />
      </TouchableOpacity>
      <View style={styles.wrapSelectTypeOrder}>
        {TYPE_KAS.map((e: any) => (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              setTypeKas(e.id)
            }}
            style={[
              styles.selectButton,
              {
                backgroundColor: e.id == typeKas ? 'rgba(42,190,173,0.2)' : 'rgba(148,152,159,0.1)',
                borderColor: e.id == typeKas ? theme.colors.primary : 'transparent',
              },
            ]}>
            <Text color={e.id === typeKas ? theme.colors.primary : theme.colors.grey}>{e.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.inputTitle}>Jumlah Transaksi</Text>
      <TextInput
        value={moneyFormat(kasMenu.jumlah)}
        placeholder="1000"
        onChangeText={onChange('jumlah')}
        type="default"
        isNumber
      />
      <Text style={styles.inputTitle}>Deskripsi Transaksi</Text>
      <TextInput
        value={kasMenu.deskripsi}
        placeholder="Masukan deskripsi transaksi"
        onChangeText={onChange('deskripsi')}
        type="default"
        multiline
        numberOfLines={5}
        style={styles.inputDesc}
        textAlignVertical="top"
      />
      <View style={styles.buttonWrapper}>
        {isEdit ? (
          <View style={styles.buttonRow}>
            <Button mode="outlined" onPress={onDeleteKas} style={styles.buttonWidth}>
              <Text style={styles.buttonTextDelete}>HAPUS</Text>
            </Button>
            <Button mode="default" onPress={onSave} loading={!kasMenu.jumlah || !kasMenu.deskripsi || !kasMenu.tanggal} style={styles.buttonWidth}>
              <Text style={styles.buttonText}>SIMPAN</Text>
            </Button>
          </View>
        ) : (
            <Button mode="default" onPress={onSave} loading={!kasMenu.jumlah || !kasMenu.deskripsi || !kasMenu.tanggal}>
              <Text style={styles.buttonText}>SIMPAN</Text>
            </Button>
          )}
      </View>
      <DateTimePickerModal
        isVisible={modalDateVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={toggleDatePicker}
      />
    </View>
  )
}

export default ManageKas

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
