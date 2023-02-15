import Button from '@components/Button'
import Modalize from '@components/Modalize'
import Text from '@components/Text'
import TextInput from '@components/TextInput'
import CheckBox from '@react-native-community/checkbox'
import { useNavigation } from '@react-navigation/native'
// import { addPriceProduct, deletePriceProduct, editPriceProduct } from '@services/price-product'
import { addProduct, deleteProduct, editProduct } from '@services/products'
import { setIngredientItem } from '@store/actions/ingredient'
import { convertToAngka, moneyFormat } from '@utils/convertRupiah'
import { theme } from '@utils/theme'
import { showErrorToast, showSuccessToast } from 'components/Toast'
import FormData from 'form-data'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useDispatch, useSelector } from 'react-redux'
import { getCategory } from 'store/actions/category'
import { getTypeOrder } from 'store/actions/typeorder'

const options: any = {
  quality: 0.4,
  mediaType: 'photo',
  maxHeight: 400,
}

const AddProduct = ({ route }: any) => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const id = route?.params?.id || ''
  const addonCategory = route?.params?.addonCategory || []
  const isEdit = route?.params?.isEdit
  const isPriceEdit = route?.params?.sell_type
  // const priceProduct = route?.params?.priceInfo
  // const priceInfo = isPriceEdit ? JSON.parse(priceProduct['price_info']) : ""
  let checked = route?.params?.checked || {}

  const modalFilterRef: any = useRef()
  const [more, setMore] = useState(true)
  const [disabled, setDisabled] = useState(true)
  const category = useSelector((state: any) => state.category.rows)
  const { dataIngredient } = useSelector((state: any) => state.ingredient)
  const typeOrder = useSelector((state: any) => state.typeOrder.statusRows)
  const [orderType, setOrder] = useState(typeOrder)
  const [product, setProduct] = useState<any>({
    name: route?.params?.name || '',
    sell_type: route?.params?.sell_type || false,
    modal: route?.params?.modal || 0,
    price: route?.params?.price || 0,
    sku: route?.params?.sku || '',
    barcode: route?.params?.barcode || '',
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
    dispatch(getTypeOrder())
    // if (isPriceEdit) {
    //   changeOrderType();
    // }
  }, [])
  // }, [priceProduct])

  // const changeOrderType = () => {
  //   let newArr = [...orderType];
  //   for (var key1 of Object.keys(typeOrder)) {
  //     for (var key2 of Object.keys(priceInfo)) {
  //       if (typeOrder[key1].name == priceInfo[key2].name && priceInfo[key2].note != null) {
  //         newArr[parseInt(key1)] = {
  //           name: orderType[key1].name,
  //           note: convertToAngka(priceInfo[key2].note)
  //         };
  //       }
  //     }
  //   }
  //   setOrder(newArr);
  // }

  const handleChange = (index: any) => (e: any) => {
    let newArr = [...orderType]; // copying the old datas array
    newArr[index] = {
      name: orderType[index].name,
      note: convertToAngka(e)
    };
    setOrder(newArr);
  }

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
    const setChecked = Object.assign({}, ...addonCategory.map(({ id }: any) => ({ [id]: true })))
    checked = setChecked
    return navigation.navigate('SelectAddon', { checked, addonCategory })
  }

  const onCreateProduct = async () => {
    const { name, description, sell_type, stock, modal, price, sku, barcode, category_id, image, is_disc_percentage, disc } = product

    const addonCategories = addonCategory.map((item: any) => item.id)
    const ingredients = dataIngredient.map(({ id, qty }: any) => ({ id, qty }))
    // const queryParams = {
    //   price_info: JSON.stringify(orderType)
    // }

    const formData: any = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('sell_type', sell_type)
    formData.append('stock', Number(stock))
    formData.append('modal', convertToAngka(modal))
    formData.append('price', convertToAngka(price))
    formData.append('sku', sku)
    formData.append('barcode', barcode)
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

    // if (isPriceEdit) {
    //   try {
    //     if (product.sell_type == false) {
    //       await deletePriceProduct(priceProduct['id'])
    //     } else {
    //       await editPriceProduct(priceProduct['id'], queryParams)
    //     }
    //   } catch (error: any) {
    //     showErrorToast(error.message)
    //   }
    // } else {
    //   try {
    //     const { data: { data } } = await addPriceProduct(queryParams)
    //     formData.append('price_product_id', data.id)
    //   } catch (error: any) {
    //     showErrorToast(error.message)
    //   }
    // }

    if (isEdit) {
      try {
        const data = await editProduct(id, formData)
        if (data.status === 200) {
          showSuccessToast('Data poduk berhasil diubah')
          navigation.navigate('ManageProductList')
        }
      } catch (error: any) {
        showErrorToast(error.message)
      }
    } else {
      try {
        const data = await addProduct(formData)
        if (data.status === 200) {
          // showSuccessToast('Data produk berhasil ditambah')
          navigation.navigate('ManageProductList')
        }
      } catch (error: any) {
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
              // if (isPriceEdit) {
              //   const data = await deletePriceProduct(priceProduct['id'])
              //   if (data.status === 200) {
              //     showSuccessToast('Data Harga berhasil dihapus')
              //   }
              // }
            } catch ({ message }: any) {
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
    const { name, stock, price, category_id } = product

    let isFilled = true

    const formsData: any = {
      name,
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
          {/* <Text style={styles.inputTitle}>Harge Jual per Tipe Pesanan</Text>
          <View style={styles.switchView}>
            <Text style={styles.inputTitle2}>*Terapkan harga berbeda untuk setiap tipe pesanan</Text>
            <Switch
              style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
              trackColor={{ false: "#767577", true: theme.colors.primary }}
              thumbColor={product.sell_type ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={onChange('sell_type')}
              value={product.sell_type}
            />
          </View>
          {product.sell_type ? (
            <View style={{ backgroundColor: '#a9a9a9', padding: 10 }}>
              {orderType.map((e: any, i: any) => (
                <View>
                  <Text style={styles.inputTitle}>{e.name}</Text>
                  <TextInput
                    value={moneyFormat(e.note)}
                    placeholder="Masukkan Harga"
                    onChangeText={handleChange(i)}
                    type="default"
                    isNumber
                  />
                </View>
              ))}
            </View>
          ) : null} */}
          {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.Title1}>Data Tambahan</Text>
            <TouchableOpacity onPress={() => setMore(!more)}>
              {more ? <AntDesign name={'right'} size={25} /> : <AntDesign name={'down'} size={25} />}
            </TouchableOpacity>
          </View> */}
          {/* {more ? null : <> */}
          <Text style={styles.inputTitle}>Harga Modal</Text>
          <TextInput
            value={moneyFormat(product.modal)}
            placeholder="Masukan modal produk"
            onChangeText={onChange('modal')}
            type="default"
            isNumber
          />
          <Text style={styles.inputTitle}>Harga Jual</Text>
          <TextInput
            value={moneyFormat(product.price)}
            placeholder="Masukan harga produk"
            onChangeText={onChange('price')}
            type="default"
            isNumber
          />
          <Text style={styles.inputTitle}>SKU</Text>
          <TextInput
            value={product.sku}
            placeholder="Masukan SKU produk"
            onChangeText={onChange('sku')}
            type="default"
          />
          <Text style={styles.inputTitle}>Barcode</Text>
          <TextInput
            value={product.barcode}
            placeholder="Masukan Keterangan barcode"
            onChangeText={onChange('barcode')}
            type="default"
          />
          <Text style={styles.inputTitle}>Foto Produk</Text>
          <View style={styles.photoWrapper}>
            {product.imageUri ? (
              <Image source={{ uri: product.imageUri }} style={styles.photo} />
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
                  tintColors={{ true: theme.colors.primary }}
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
          {/* </>} */}
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
                setProduct({ ...product, category_id: e.id, categoryName: e.name })
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
  Title1: {
    fontSize: 18,
    paddingLeft: 5,
    paddingVertical: 15,
    fontWeight: 'bold'
  },
  inputTitle: {
    fontSize: 14,
    paddingLeft: 5,
  },
  inputTitle2: {
    color: 'grey',
    fontSize: 12,
    paddingLeft: 5,
  },
  switchView: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginRight: 15 },
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
