import React, {useState, useEffect} from 'react'
import {View, StyleSheet, TouchableOpacity, Image, FlatList, Alert} from 'react-native'
import Modal from 'react-native-modal'
import DropDownPicker from 'react-native-dropdown-picker'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {useSelector, useDispatch} from 'react-redux'
import {getIngredient, addIngredientItem, removeIngredientItem, changeIngredientItem} from '@store/actions/ingredient'
import TextInput from '@components/TextInput'
import Text from '@components/Text'
import {theme} from '@utils/theme'
import Button from '@components/Button'
import {showErrorToast} from '@components/Toast'

const SelectIngredient = ({navigation}: any) => {
  const dispatch = useDispatch()
  const [ingredientQty, setIngredientQty] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState('')
  const [ingredientItem, setIngredientItem] = useState('')
  const [isModalVisible, setModalVisible] = useState(false)
  const [isDropdowVisible, setDropdownVisible] = useState(false)
  const {rows, dataIngredient} = useSelector((state: any) => state.ingredient)

  useEffect(() => {
    dispatch(getIngredient())
  }, [])

  const convertData = (data: any) => {
    const newData = data.map(({id, name, unit}: any) => {
      return {
        label: name,
        value: `${id},${name},${unit}`,
      }
    })
    return newData
  }

  const onPressAdd = () => {
    const qty = Number(ingredientQty)

    const ingredient = ingredientItem.split(',')
    const data = {id: ingredient[0], name: ingredient[1], unit: ingredient[2], qty}
    if (isEdit) {
      dispatch(changeIngredientItem(data))
    } else {
      if (dataIngredient.some((item: any) => item.id === ingredient[0])) {
        showErrorToast('Bahan baku sudah ada')
        return
      }
      dispatch(addIngredientItem(data))
    }
    toggleModal()
    setIngredientItem('')
    setIngredientQty('')
    setIsEdit(false)
  }

  const onPressEdit = (item: any) => {
    setIngredientItem(`${item.id},${item.name},${item.unit}`)
    setIngredientQty(String(item.qty))
    setSelectedUnit(item.unit)
    setIsEdit(true)
    toggleModal()
  }

  const onPressDelete = (item: any) => {
    Alert.alert(
      'Hapus?',
      'Kamu yakin ingin menghapus bahan ini?',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Hapus',
          onPress: async () => {
            dispatch(removeIngredientItem(item))
          },
        },
      ],
      {
        cancelable: true,
      },
    )
  }

  const getIngredientName = (): string => {
    const ingredient = ingredientItem.split(',')
    return ingredient[1]
  }

  const toggleModal = () => setModalVisible(!isModalVisible)

  const renderModal = () => (
    <Modal isVisible={isModalVisible} useNativeDriver style={styles.modal} deviceHeight={'100%'} backdropOpacity={0.3}>
      <View style={styles.modalView}>
        <View style={styles.spacer}>
          <Text style={styles.inputTitle}>Pilih Bahan</Text>
          <DropDownPicker
            placeholder={getIngredientName() || 'Select an item'}
            open={isDropdowVisible}
            disabled={isEdit}
            value={ingredientItem}
            items={convertData(rows)}
            setOpen={setDropdownVisible}
            setValue={setIngredientItem}
            textStyle={styles.fontFamily}
            onChangeValue={(value: any) => {
              const unit = value.split(',').pop()
              setSelectedUnit(unit)
            }}
            containerStyle={styles.dropdownContainer}
            dropDownContainerStyle={styles.dropdownStyle}
            style={styles.dropdownMainStyle}
          />
          <Text style={styles.inputTitle}>Jumlah</Text>
          <View style={styles.row}>
            <View style={styles.qtyInput}>
              <TextInput
                value={ingredientQty}
                placeholder="20"
                onChangeText={(value: string) => setIngredientQty(value)}
                type="default"
                isNumber
              />
            </View>
            <View style={styles.qtyUnit}>
              <Text>{selectedUnit}</Text>
            </View>
          </View>
        </View>
        <View style={styles.butttonAdd}>
          <TouchableOpacity
            onPress={() => {
              toggleModal()
              setIngredientItem('')
              setIngredientQty('')
              setIsEdit(false)
            }}>
            <Text color={theme.colors.blackSemiTransparent} size={8.5} type="semibold">
              BATAL
            </Text>
          </TouchableOpacity>
          <View style={styles.gap2} />
          <TouchableOpacity onPress={onPressAdd} disabled={!ingredientItem || !ingredientQty}>
            <Text color={theme.colors.primary} size={8.5} type="semibold">
              {isEdit ? 'UBAH' : 'TAMBAH'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  const renderDivider = () => <View style={styles.divider} />

  const renderEmptyList = () => (
    <View style={styles.center}>
      <Image source={require('@assets/images/undraw_empty.png')} style={styles.emptyImage} />
      <Text style={styles.center} type="semibold">
        Belum ada bahan dipilih
      </Text>
    </View>
  )

  const renderItem = ({item}: {item: any}) => {
    return (
      <View style={styles.productList}>
        <Text size={9} type="regular">
          {item?.name}
        </Text>
        <View style={styles.row}>
          <Text size={9} type="regular">
            {item?.qty} {item?.unit}
          </Text>
          <View style={styles.gap} />
          <TouchableOpacity onPress={() => onPressEdit(item)}>
            <AntDesign name="edit" size={18} color={theme.colors.blackSemiTransparent} />
          </TouchableOpacity>
          <View style={styles.gap} />
          <TouchableOpacity onPress={() => onPressDelete(item)}>
            <AntDesign name="delete" size={18} color={theme.colors.blackSemiTransparent} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonNewWrapper}>
        <TouchableOpacity
          style={styles.buttonNew}
          onPress={() => {
            setIsEdit(false)
            toggleModal()
          }}>
          <Text style={styles.buttonNewText} type="semibold">
            + Tambah Bahan
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={dataIngredient}
        keyExtractor={(_, index: number) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyList}
        ItemSeparatorComponent={renderDivider}
      />
      {renderModal()}
      <View style={styles.buttonWrapper}>
        <Button mode="default" onPress={() => navigation.navigate('AddProduct')} style={styles.buttonAdd}>
          <Text style={styles.buttonText}>Pilih Bahan</Text>
        </Button>
      </View>
    </View>
  )
}

export default SelectIngredient

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  inputTitle: {
    paddingTop: 8,
    fontSize: 14,
    paddingLeft: 5,
  },
  modal: {
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 10,
  },
  spacer: {
    padding: 16,
  },
  dropdownStyle: {
    borderColor: theme.colors.defaultBorderColor,
  },
  dropdownContainer: {
    height: 56,
    borderRadius: 16,
  },
  dropdownMainStyle: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderColor: theme.colors.defaultBorderColor,
    marginTop: 8,
  },
  fontFamily: {
    fontFamily: 'Jost-Regular',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.defaultBorderColor,
  },
  butttonAdd: {
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexDirection: 'row',
  },
  gap: {
    width: 24,
  },
  button: {
    backgroundColor: theme.colors.primary,
    height: 20,
    width: 100,
  },
  buttonText: {
    color: theme.colors.white,
    fontFamily: 'Jost-SemiBold',
  },
  buttonNew: {
    borderColor: theme.colors.primary,
    borderWidth: 1,
    width: 120,
    borderRadius: 6,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonNewText: {
    color: theme.colors.primary,
  },
  buttonNewWrapper: {
    alignItems: 'flex-start',
    padding: 16,
  },
  emptyImage: {
    width: 300,
    height: 300,
    marginTop: 32,
    resizeMode: 'contain',
  },
  center: {
    alignSelf: 'center',
  },
  productList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
  },
  buttonAdd: {
    backgroundColor: theme.colors.primary,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  qtyInput: {
    flex: 8,
    marginRight: 8,
  },
  qtyUnit: {
    flex: 1,
    justifyContent: 'center',
  },
  gap2: {
    width: 16,
  },
})
