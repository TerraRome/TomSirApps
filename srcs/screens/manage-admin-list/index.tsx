import CustomButton from '@components/Button'
import Text from '@components/Text'
import { useIsFocused } from '@react-navigation/native'
import { getUsers } from '@services/user'
import { setUsers } from '@store/actions/user'
import { theme } from '@utils/theme'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useDispatch, useSelector } from 'react-redux'

let searchDebounce: any = null
const ManageAdminList = ({ navigation }: any) => {
  const isFocused = useIsFocused()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const { rows, page_size, current_page } = useSelector((state: any) => state.users)
  const { user } = useSelector((state: any) => state.auth)

  const [queryParams, setParams] = useState({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    order: 'ASC',
    merchant_id: user.merchant.id,
    search: undefined,
  })

  useEffect(() => {
    refreshData()
  }, [queryParams])

  const refreshData = (params?: any) => {
    getData({ page: 1, ...params })
  }

  const getData = useCallback(
    async (params?: any) => {
      setIsLoading(true)
      try {
        if (!queryParams?.search) {
          delete queryParams.search
        }
        const {
          data: { data },
        } = await getUsers({ ...queryParams, ...params })
        dispatch(setUsers(data))
      } catch (error: any) {
        // console.log(error.response)
      } finally {
        setIsLoading(false)
      }
    },
    [queryParams.search],
  )

  const handleSearch = (search: any) => {
    clearTimeout(searchDebounce)
    searchDebounce = setTimeout(() => {
      refreshData({ search })
    }, 400)
    setParams({ ...queryParams, search })
  }

  const onPressUser = (item: any) => () => {
    return navigation.navigate('ManageAdmin', {
      id: item?.id,
      fullname: item?.fullname,
      email: item?.email,
      password: item?.password,
      role: item?.role,
      merchant_id: item?.merchant_id,
      isEdit: true,
    })
  }

  const renderItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity style={styles.productList} onPress={onPressUser(item)}>
        <Text size={9} type="regular">
          {item?.fullname}
        </Text>
        <AntDesign name="right" size={18} color={theme.colors.blackSemiTransparent} />
      </TouchableOpacity>
    )
  }

  const renderDivider = () => <View style={styles.divider} />

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.input}>
          <TextInput
            value={queryParams.search}
            placeholder="Cari nama pengguna..."
            onChangeText={handleSearch}
            style={styles.searchBar}
          />
          <View style={styles.closeSearch}>
            <AntDesign name="search1" color="darkgrey" size={18} />
          </View>
        </View>
        <FlatList
          data={rows}
          keyExtractor={(_, index: number) => index.toString()}
          renderItem={renderItem}
          ItemSeparatorComponent={renderDivider}
          ListFooterComponent={renderDivider}
          refreshControl={
            <RefreshControl
              colors={[theme.colors.primary]}
              refreshing={Boolean(isLoading && current_page === 1)}
              onRefresh={refreshData}
            />
          }
        />
      </View>
      <View style={styles.buttonWrapper}>
        <CustomButton mode="default" onPress={() => navigation.navigate('ManageAdmin')} style={styles.buttonAdd}>
          <Text style={styles.buttonText}>TAMBAH USER</Text>
        </CustomButton>
      </View>
    </SafeAreaView>
  )
}

export default ManageAdminList

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  content: {
    paddingBottom: 120,
  },
  buttonAdd: {
    backgroundColor: theme.colors.primary,
    borderRadius: 0,
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
    paddingVertical: 10,
    borderWidth: 1,
    fontSize: 13,
    flex: 1,
    borderRadius: 10,
  },
  closeSearch: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
})
