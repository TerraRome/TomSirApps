import CustomButton from '@components/Button'
import Text from '@components/Text'
import TextInput from '@components/TextInput'
import CheckBox from '@react-native-community/checkbox'
import { addRegistration } from '@services/registration'
import { convertToAngka, moneyFormat } from '@utils/convertRupiah'
import { theme } from '@utils/theme'
import { showErrorToast, showSuccessToast } from 'components/Toast'
import moment from 'moment'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import { debounce } from 'utils/debounce'

const AddAddonMenu = ({ navigation, route }: any) => {
  const isEdit = route?.params?.isEdit || false
  const id = route?.params?.id || ''
  const { user } = useSelector((state: any) => state.auth)

  const [addonMenu, setAddonMenu] = useState<any>({
    tanggal: '',
    modal: null,
    isActive: true || true,
  })

  const onChange = (type: string) => (value: any) => {
    setAddonMenu({
      ...addonMenu,
      [type]: value,
    })
  }

  const onSave = async () => {
    const { modal, isActive } = addonMenu

    const payload = {
      tanggal: moment().format('YYYY-MM-DD'),
      jumlah: isActive === true ? 0 : convertToAngka(modal),
      status: isActive,
      merchant_id: user.merchant.id
    }

    try {
      const data = await addRegistration(payload)
      if (data.status === 200) {
        showSuccessToast('Data modal berhasil ditambah')
        navigation.reset({
          index: 0,
          routes: [{ name: 'DrawerNavigator' }],
        });
      }
    } catch (error: any) {
      showErrorToast(error.message)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.inputTitle}>Tanggal Registrasi</Text>
      <TextInput value={moment().format('YYYY-MM-DD')} placeholder="Hot" onChangeText={onChange('tanggal')} type="default" />
      <Text style={styles.inputTitle}>Jumlah Modal</Text>
      <TextInput
        value={moneyFormat(addonMenu.modal)}
        placeholder="1000"
        onChangeText={onChange('modal')}
        type="default"
        isNumber
        disabled={!addonMenu.isActive}
      />
      <View style={styles.checkboxContainer}>
        <CheckBox
          disabled={false}
          tintColors={{ true: theme.colors.primary }}
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
              price: null
            })
          }}
        />
        <Text style={styles.inputTitle}>Tanpa Modal</Text>
      </View>
      <View style={styles.buttonWrapper}>
        <CustomButton mode="default" onPress={debounce(onSave)} loading={!addonMenu.modal && !addonMenu.isActive}>
          <Text style={styles.buttonText}>SIMPAN</Text>
        </CustomButton>
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
