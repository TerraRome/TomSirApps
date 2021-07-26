/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react'
import {View, StyleSheet, Alert, TouchableOpacity,ScrollView} from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Text from '@components/Text'
import {theme} from '@utils/theme'
import {moneyFormat, convertToAngka} from '@utils/convertRupiah'
import {
  addIngredient,
  editIngredient,
  deleteIngredient,
} from '@services/ingredient'
import TextInput from '@components/TextInput'
import CustomButton from '@components/Button'
import {formatYYMMDD} from '@utils/formatDate'
import {showErrorToast, showSuccessToast} from 'components/Toast'

const AddIngredient = ({navigation, route}: any) => {
  const isEdit = route?.params?.isEdit || false
  const [disabled, setDisabled] = useState(true)
  const [modalDateVisible, setModalDateVisible] = useState(false)
  const id = route?.params?.id || ''

  const [ingredients, setIngredients] = useState({
    name: route?.params?.name || '',
    unit: route?.params?.unit || '',
    stock: route?.params?.stock?.toString() || '',
    price: route?.params?.price?.toString() || '',
    expDate: route?.params?.expDate || '',
  })

  useEffect(() => {
    onIsFilled()
  }, [ingredients.name, ingredients.unit, ingredients.stock, ingredients.price, ingredients.expDate])


  const onIsFilled = () => {
    const {name, unit, stock, price, expDate} = ingredients

    let isFilled = true

    const formsData: any = {
      name,
      unit,
      stock,
      price,
      expDate,
    }
    Object.keys(formsData).forEach((n: any) => {
      if (!formsData[n]) {
        isFilled = false
      }
    })
    setDisabled(isFilled)
  }

  const onChange = (type: string) => (value: string) => {
    setIngredients({
      ...ingredients,
      [type]: value,
    })
  }

  const toggleDatePicker = () => setModalDateVisible(!modalDateVisible)

  const handleConfirm = (date: Date) => {
    setIngredients({...ingredients, expDate: formatYYMMDD(date)})
    toggleDatePicker()
  }

  const onSave = async () => {
    const {name, unit, stock, price, expDate} = ingredients

    const payload = { name, unit, stock: Number(stock), price: convertToAngka(price), exp_date: expDate }

    if (isEdit) {
      try {
        const data = await editIngredient(payload, id)
        if (data.status === 200) {
          showSuccessToast('Data bahan berhasil diubah')
          navigation.navigate('IngredientList')
        }
      } catch (error) {
        showErrorToast(error.message)
      }
    } else {
      try {
        const data = await addIngredient(payload)
        if (data.status === 200) {
          showSuccessToast('Data bahan berhasil ditambah')
          navigation.navigate('IngredientList')
        }
      } catch (error) {
        showErrorToast(error.message)
      }
    }

  }

  const onDelete = () => {
    Alert.alert(
      'Hapus?',
      'Kamu yakin untuk menghapus bahan ini?',
      [
        {
          text: 'Batal',
        },
        {
          text: 'Ya',
          onPress: async () => {
            try {
              const data = await deleteIngredient(id)
              if (data.status === 200) {
                showSuccessToast('Data bahan berhasil dihapus')
                navigation.navigate('IngredientList')
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
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
      <Text style={styles.inputTitle}>Nama Bahan</Text>
      <TextInput
        value={ingredients.name}
        placeholder="Garam"
        onChangeText={onChange('name')}
        type="default"
      />
      <Text style={styles.inputTitle}>Stok Bahan</Text>
      <TextInput
        value={ingredients.stock}
        placeholder="200"
        onChangeText={onChange('stock')}
        type="default"
        isNumber
      />
      <Text style={styles.inputTitle}>Harga Bahan</Text>
      <TextInput
        value={moneyFormat(ingredients.price)}
        placeholder="2.000"
        onChangeText={onChange('price')}
        type="default"
        isNumber
      />
      <Text style={styles.inputTitle}>Unit</Text>
      <TextInput
        value={ingredients.unit}
        placeholder="gram"
        onChangeText={onChange('unit')}
        type="default"
      />
      <Text style={styles.inputTitle}>Tanggal Expired</Text>
      <TouchableOpacity
        onPress={toggleDatePicker}
        style={styles.expDate}
      >
        {ingredients.expDate ? <Text>{ingredients.expDate}</Text> : <Text style={styles.placeholder}>2021-06-26</Text>}
        <AntDesign name="right"
          size={20}
          color={theme.colors.blackSemiTransparent}
        />
      </TouchableOpacity>
      </ScrollView>
      <View style={styles.buttonWrapper}>
        {isEdit ? (
          <View style={styles.buttonRow}>
            <CustomButton mode="outlined" onPress={onDelete} style={styles.buttonWidth}>
              <Text style={styles.buttonTextDelete}>HAPUS</Text>
            </CustomButton>
            <CustomButton mode="default" onPress={onSave} loading={false} style={styles.buttonWidth}>
              <Text style={styles.buttonText}>SIMPAN</Text>
            </CustomButton>
          </View>
        ) : (
          <CustomButton mode="default" onPress={onSave} loading={!disabled}>
            <Text style={styles.buttonText}>SIMPAN</Text>
          </CustomButton>
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

export default AddIngredient

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
  scrollView: {
    marginBottom: 100,
  },
  placeholder: {
    color: theme.colors.grey,
    fontSize: 12,
    paddingLeft: 8,
  },
})
