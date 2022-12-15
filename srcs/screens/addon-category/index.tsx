import React, {useEffect, useState, useCallback} from 'react'
import {View, StyleSheet, TouchableOpacity, FlatList, Image} from 'react-native'
import {useIsFocused} from '@react-navigation/native'
import {useSelector, useDispatch} from 'react-redux'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {getAddonCategory} from '@services/addon'
import {setAddons} from '@store/actions/addon'
import {theme} from '@utils/theme'
import Text from '@components/Text'
import CustomButton from '@components/Button'

const AddonCategory = ({navigation}: any) => {
  const dispatch = useDispatch()
  const [isLoading, setLoading] = useState(false)
  const isFocused = useIsFocused()
  const {rows} = useSelector((state: any) => state.addons)

  useEffect(() => {
    getData()
  }, [isFocused])

  const getData = useCallback(async () => {
    setLoading(true)
    try {
      const {
        data: {data},
      } = await getAddonCategory({page: 1, limit: 100})
      dispatch(setAddons(data))
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }, [])

  const onPressDetail = (item: any) => () => {
    navigation.navigate('AddonMenu', {
      id: item?.id,
      name: item?.name,
    })
  }

  const onPressEdit = (item: any) => () => {
    navigation.navigate('AddAddonCategory', {
      id: item?.id,
      name: item?.name,
      isRequired: item?.is_required,
      maxLimit: item?.max_limit,
      isEdit: true,
    })
  }

  const renderItem = ({item}: {item: any}) => {
    return (
      <View style={styles.productList}>
        <Text size={9} type="regular">
          {item?.name}
        </Text>
        <View style={styles.row}>
          <TouchableOpacity onPress={onPressDetail(item)}>
            <AntDesign name="select1" size={20} color={theme.colors.greyBlack} />
          </TouchableOpacity>
          <View style={styles.gap} />
          <TouchableOpacity onPress={onPressEdit(item)}>
            <Feather name="edit" size={20} color={theme.colors.greyBlack} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const renderDivider = () => <View style={styles.divider} />

  const renderEmptyList = () => (
    <View style={styles.center}>
      <Image source={require('@assets/images/undraw_empty.png')} style={styles.emptyImage} />
      <Text style={styles.center} type="semibold">
        Tidak ada varian kategori tersedia
      </Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FlatList
          data={rows}
          keyExtractor={(_, index: number) => index.toString()}
          renderItem={renderItem}
          refreshing={isLoading}
          onRefresh={getData}
          ItemSeparatorComponent={renderDivider}
          ListFooterComponent={rows.length ? renderDivider : null}
          ListEmptyComponent={renderEmptyList}
        />
      </View>
      <View style={styles.buttonWrapper}>
        <CustomButton mode="default" onPress={() => navigation.navigate('AddAddonCategory')} style={styles.buttonAdd}>
          <Text style={styles.buttonText}>Tambah Varian Kategori</Text>
        </CustomButton>
      </View>
    </View>
  )
}

export default AddonCategory

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
  },
  row: {
    flexDirection: 'row',
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
  gap: {
    width: 20,
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
