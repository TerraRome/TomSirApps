import React, {useState, useEffect, useCallback} from 'react'
import {View, StyleSheet, TextInput, TouchableOpacity, FlatList, RefreshControl, Image} from 'react-native'
import {useIsFocused} from '@react-navigation/native'
import {useNavigation} from '@react-navigation/native'
import {useSelector, useDispatch} from 'react-redux'
import {getProducts} from 'services/products'
import {setProducts} from 'store/actions/products'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {setIngredientItem} from 'store/actions/ingredient'
import {theme} from '@utils/theme'
import Text from '@components/Text'
import CustomButton from '@components/Button'
import {convertToRupiah} from '@utils/convertRupiah'

interface Product {
  id: string
  name: string
  description: string
  image: string
  price: number
  disc: number
  is_disc_percentage: number
  exp_date: string
  category_id: string
  createdAt: Date
  updatedAt: Date
}

let searchDebounce: any = null
const ManageProductList: React.FC = () => {
  const isFocused = useIsFocused()
  const dispatch = useDispatch()
  const [isLoading, setLoading] = useState(false)
  const navigation = useNavigation()
  const {user} = useSelector((state: any) => state.auth)
  const {rows, page_size, current_page} = useSelector((state: any) => state.products)

  const [queryParams, setParams] = useState({
    page: 1,
    limit: 10,
    sortBy: 'name',
    order: 'ASC',
    merchant_id: user.merchant.id,
    category_id: undefined,
    search: undefined,
  })

  useEffect(() => {
    refreshData()
  }, [isFocused])

  const refreshData = (param?: any) => {
    getData({page: 1, ...param})
  }

  const getData = useCallback(
    async (params?: any) => {
      setLoading(true)
      try {
        if (!queryParams?.search) {
          delete queryParams.search
        }
        const {
          data: {data},
        } = await getProducts({...queryParams, ...params})
        dispatch(setProducts(data))
      } catch (error) {
      } finally {
        setLoading(false)
      }
    },
    [queryParams.search],
  )

  const getNextPage = () => {
    const hasNextPage = Boolean(page_size === queryParams.limit)
    const nextPage = current_page + 1
    if (isLoading || !hasNextPage) {
      return
    }
    getData({page: nextPage})
  }

  const handleSearch = (search: any) => {
    clearTimeout(searchDebounce)
    searchDebounce = setTimeout(() => {
      refreshData({search})
    }, 400)
    setParams({...queryParams, search})
  }

  const onPressProduct = (item: any) => () => {
    const ingredient = item?.ingredient?.map(({id, name, tbl_product_ingredient: {qty}, unit}: any) => {
      return {id, name, unit, qty}
    })
    dispatch(setIngredientItem(ingredient))

    return navigation.navigate('AddProduct', {
      id: item?.id,
      name: item?.name,
      description: item?.description,
      stock: item?.stock,
      price: item?.price,
      category_id: item?.category_id,
      image: item?.image,
      is_disc_percentage: item?.is_disc_percentage,
      disc: item?.disc,
      categoryName: item?.category?.name,
      isEdit: true,
      addonCategory: item?.addon_category,
    })
  }

  const renderItem = ({item}: {item: Product}) => {
    return (
      <TouchableOpacity style={styles.productList} onPress={onPressProduct(item)}>
        <Text>{item?.name}</Text>
        <Text>Rp {convertToRupiah(item?.price)}</Text>
      </TouchableOpacity>
    )
  }

  const renderEmptyList = () => (
    <View style={styles.center}>
      <Image source={require('@assets/images/undraw_empty.png')} style={styles.emptyImage} />
      <Text style={styles.center} type="semibold">
        Tidak ada produk tersedia
      </Text>
    </View>
  )

  const renderDivider = () => <View style={styles.divider} />

  const renderListProduct = () => {
    return (
      <FlatList
        data={rows}
        keyExtractor={(_, index: number) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.flatlist}
        onEndReached={getNextPage}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          queryParams.page === 1 ? (
            <RefreshControl colors={[theme.colors.primary]} refreshing={Boolean(isLoading)} onRefresh={refreshData} />
          ) : undefined
        }
        ItemSeparatorComponent={renderDivider}
      />
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.input}>
          <TextInput
            value={queryParams.search}
            placeholder="Cari nama produk..."
            onChangeText={handleSearch}
            style={styles.searchBar}
          />
          <View style={styles.closeSearch}>
            <AntDesign name="search1" color="darkgrey" size={18} />
          </View>
        </View>
        {renderListProduct()}
      </View>
      <View style={styles.buttonWrapper}>
        <CustomButton
          mode="default"
          onPress={() => {
            dispatch(setIngredientItem([]))
            navigation.navigate('AddProduct')
          }}
          style={styles.buttonAdd}>
          <Text style={styles.buttonText}>TAMBAH BARU</Text>
        </CustomButton>
      </View>
    </View>
  )
}

export default ManageProductList

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  content: {
    paddingBottom: 130,
    paddingTop: 16,
  },
  input: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  searchBar: {
    borderColor: theme.colors.defaultBorderColor,
    backgroundColor: theme.colors.white,
    fontFamily: 'Jost-Regular',
    color: theme.colors.black,
    paddingHorizontal: 16,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 50,
    borderWidth: 1,
    fontSize: 13,
    flex: 1,
  },
  closeSearch: {
    position: 'absolute',
    right: 10,
    top: 11,
  },
  flatlist: {},
  productList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.grey2,
  },
  buttonAdd: {
    backgroundColor: theme.colors.primary,
  },
  buttonText: {
    color: theme.colors.white,
    fontFamily: 'Jost-SemiBold',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
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
})
