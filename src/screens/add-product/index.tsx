import React, {useState, useEffect, useRef} from 'react'
import {View, SafeAreaView, StyleSheet, Image, TouchableOpacity, ScrollView, Alert} from 'react-native'
import FormData from 'form-data'
import {launchImageLibrary} from 'react-native-image-picker'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {useNavigation} from '@react-navigation/native'
import {addProduct, editProduct, deleteProduct} from '@services/products'
import {setIngredientItem} from '@store/actions/ingredient'
import CheckBox from '@react-native-community/checkbox'
import {showErrorToast, showSuccessToast} from 'components/Toast'
import {useSelector, useDispatch} from 'react-redux'
import {getCategory} from 'store/actions/category'
import {moneyFormat, convertToAngka} from '@utils/convertRupiah'
import {theme} from '@utils/theme'
import Text from '@components/Text'
import Button from '@components/Button'
import Modalize from '@components/Modalize'
import TextInput from '@components/TextInput'

const options: any = {
  quality: 0.4,
  mediaType: 'photo',
  maxHeight: 400,
}

const AddProduct = ({route}: any) => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const id = route?.params?.id || ''
  const addonCategory = route?.params?.addonCategory || []
  const isEdit = route?.params?.isEdit
  let checked = route?.params?.checked || {}

  const modalFilterRef: any = useRef()
  const [disabled, setDisabled] = useState(true)
  const category = useSelector((state: any) => state.category.rows)
  const {dataIngredient} = useSelector((state: any) => state.ingredient)
  const [product, setProduct] = useState<any>({
    name: route?.params?.name || '',
    price: route?.params?.price || '',
    description: route?.params?.description || '',
    image: '',
    imageUri: route?.params?.image || '',
    category_id: route?.params?.category_id || '',
    categoryName: route?.params?.categoryName || '',
    stock: route?.params?.stock?.toString() || '',
    is_disc_percentage: route?.params?.is_disc_percentage || false,
    disc: route?.params?.disc?.toString() || '',
  })

  useEffect(() => {
    dispatch(getCategory())
  }, [])

  useEffect(() => {
    onIsFilled()
  }, [product.name, product.description, product.stock, product.price, product.category_id])

  const onChange = (type: string) => (value: any) => {
    setProduct({
      ...product,
      [type]: value,
    })
  }

  const handleUploadPhoto = () => {
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        // console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setProduct({
          ...product,
          image: response?.assets[0]!,
          imageUri: response?.assets[0].uri!,
        })
      }
    })
  }

  const navigateToIngredient = () => {
    if (!dataIngredient.length) {
      dispatch(setIngredientItem([]))
      navigation.navigate('SelectIngredient')
    } else {
      navigation.navigate('SelectIngredient')
    }
  }

  const onPressAddon = () => {
    // eslint-disable-next-line no-shadow
    const setChecked = Object.assign({}, ...addonCategory.map(({id}: any) => ({[id]: true})))
    checked = setChecked
    return navigation.navigate('SelectAddon', {checked, addonCategory})
  }

  const onCreateProduct = async () => {
    const {name, description, stock, price, category_id, image, is_disc_percentage, disc} = product

    const addonCategories = addonCategory.map((item: any) => item.id)
    // eslint-disable-next-line no-shadow
    const ingredients = dataIngredient.map(({id, qty}: any) => ({id, qty}))

    const formData: any = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('stock', Number(stock))
    formData.append('price', convertToAngka(price))
    formData.append('category_id', category_id)
    formData.append('addon_categories', JSON.stringify(addonCategories))
    formData.append('ingredients', JSON.stringify(ingredients))

    if (image) {
      formData.append('image', {
        uri: image.uri,
        name: image.fileName,
        type: image.type,
      })
    }

    if (isEdit) {
      formData.append('is_disc_percentage', is_disc_percentage)
      formData.append('disc', Number(disc))
    }

    if (isEdit) {
      try {
        const data = await editProduct(id, formData)
        if (data.status === 200) {
          showSuccessToast('Data poduk berhasil diubah')
          navigation.navigate('ManageProductList')
        }
      } catch (error) {
        showErrorToast(error.message)
      }
    } else {
      try {
        const data = await addProduct(formData)
        if (data.status === 200) {
          showSuccessToast('Data produk berhasil diubah')
          navigation.navigate('ManageProductList')
        }
      } catch (error) {
        showErrorToast(error.message)
      }
    }
  }

  const onDeleteProduct = () => {
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
              const data = await deleteProduct(id)
              if (data.status === 200) {
                showSuccessToast('Data produk berhasil dihapus')
                navigation.navigate('ManageProductList')
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

  const onIsFilled = () => {
    const {name, description, stock, price, category_id} = product

    let isFilled = true

    const formsData: any = {
      name,
      description,
      stock,
      price,
      category_id,
    }
    Object.keys(formsData).forEach((n: any) => {
      if (!formsData[n]) {
        isFilled = false
      }
    })
    setDisabled(isFilled)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          <Text style={styles.inputTitle}>Nama Produk</Text>
          <TextInput
            value={product.name}
            placeholder="Masukkan nama produk"
            onChangeText={onChange('name')}
            type="default"
          />
          <Text style={styles.inputTitle}>Harga Jual</Text>
          <TextInput
            value={moneyFormat(product.price)}
            placeholder="Masukan harga produk"
            onChangeText={onChange('price')}
            type="default"
            isNumber
          />
          <Text style={styles.inputTitle}>Foto Produk</Text>
          <View style={styles.photoWrapper}>
            {product.imageUri ? (
              <Image source={{uri: product.imageUri}} style={styles.photo} />
            ) : (
              <View style={styles.photo}>
                <Ionicons name="ios-image-outline" size={25} color={theme.colors.grey} />
              </View>
            )}
            {product.imageUri ? (
              <TouchableOpacity
                onPress={() => {
                  setProduct({
                    ...product,
                    image: '',
                    imageUri: '',
                  })
                }}>
                <AntDesign name="close" size={20} style={styles.closeIcon} color={theme.colors.blackSemiTransparent} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleUploadPhoto} style={styles.buttonPhoto} activeOpacity={0.6}>
                <Text style={styles.photoText}>PILIH FOTO</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.inputTitle}>Deskripsi Produk</Text>
          <TextInput
            value={product.description}
            placeholder="Masukan deskripsi produk"
            onChangeText={onChange('description')}
            type="default"
            multiline
            numberOfLines={5}
            style={styles.inputDesc}
            textAlignVertical="top"
          />
          <Text style={styles.inputTitle}>Kategori Produk</Text>
          <TouchableOpacity onPress={() => modalFilterRef?.current?.open()} style={styles.category}>
            {product.categoryName ? (
              <Text>{product.categoryName}</Text>
            ) : (
              <Text style={styles.placeholder}>Pilih kategori produk</Text>
            )}
            <AntDesign name="right" size={20} color={theme.colors.blackSemiTransparent} />
          </TouchableOpacity>
          <Text style={styles.inputTitle}>Stok</Text>
          <TextInput
            value={product.stock}
            placeholder="Masukan stok produk"
            onChangeText={onChange('stock')}
            type="default"
            isNumber
          />
          <Text style={styles.inputTitle}>Tambah Varian</Text>
          <TouchableOpacity onPress={onPressAddon} style={styles.addon}>
            <View style={styles.row}>
              {addonCategory.length ? (
                addonCategory?.map((item: any) => (
                  <View style={styles.chip}>
                    <Text>{item.name}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.placeholder}>Pilih varian produk</Text>
              )}
            </View>
            <AntDesign name="right" size={20} color={theme.colors.blackSemiTransparent} />
          </TouchableOpacity>
          <Text style={styles.inputTitle}>Tambah Bahan</Text>
          <TouchableOpacity onPress={navigateToIngredient} style={styles.addon}>
            <View style={styles.row}>
              {dataIngredient.length ? (
                dataIngredient?.map((item: any) => (
                  <View style={styles.chip}>
                    <Text>{item.name}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.placeholder}>Pilih bahan baku</Text>
              )}
            </View>
            <AntDesign name="right" size={20} color={theme.colors.blackSemiTransparent} />
          </TouchableOpacity>
          {isEdit && (
            <>
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
                  value={product.is_disc_percentage}
                  onValueChange={(selected: boolean) => {
                    setProduct({
                      ...product,
                      is_disc_percentage: selected,
                    })
                  }}
                />
                <Text style={styles.inputTitle}>Tambah Diskon (%)</Text>
              </View>
              <TextInput
                placeholder="Masukan besaran diskon"
                onChangeText={onChange('disc')}
                type="default"
                isNumber
                value={product.disc}
                disabled={product.is_disc_percentage}
              />
            </>
          )}
        </ScrollView>
      </View>

      <View style={styles.buttonWrapper}>
        {isEdit ? (
          <View style={styles.buttonRow}>
            <Button mode="outlined" onPress={onDeleteProduct} style={styles.buttonWidth}>
              <Text style={styles.buttonTextDelete}>HAPUS</Text>
            </Button>
            <Button mode="default" onPress={onCreateProduct} loading={!disabled} style={styles.buttonWidth}>
              <Text style={styles.buttonText}>SIMPAN</Text>
            </Button>
          </View>
        ) : (
          <Button mode="default" onPress={onCreateProduct} loading={!disabled}>
            <Text style={styles.buttonText}>SIMPAN</Text>
          </Button>
        )}
      </View>
      <Modalize ref={modalFilterRef}>
        <View style={styles.modalContentWrapper}>
          {category.map((e: any) => (
            <TouchableOpacity
              key={e.id}
              style={styles.modalContent}
              onPress={() => {
                setProduct({...product, category_id: e.id, categoryName: e.name})
                modalFilterRef?.current?.close()
              }}>
              <Text type="semibold">{e.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modalize>
    </SafeAreaView>
  )
}

export default AddProduct

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
