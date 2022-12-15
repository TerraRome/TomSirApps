import React, { useState, useCallback, useEffect } from 'react'
import { View, TouchableOpacity, FlatList, ActivityIndicator, Image, RefreshControl } from 'react-native'
import TextInput from '@components/TextInput'
import Text from '@components/Text'
import { StyleSheet } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { theme } from 'utils/theme'
import { convertToRupiah } from 'utils/convertRupiah'
import { showErrorToast } from '@components/Toast'
import { getReportSummaryProduct } from 'services/report'
import { useIsFocused, useRoute } from '@react-navigation/native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import CalendarPicker from '@components/CalendarPicker'

let searchDebounce: any = null
export default function ReportSummaryProduct() {
  const isFocused = useIsFocused()
  const route: any = useRoute()
  const item = route.params?.item
  const [rows, setRows] = useState([])

  const [isLoading, setLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const [queryParams, setParams] = useState({
    start_date: item.start_date,
    end_date: item.end_date,
    search: '',
  })

  const getData = useCallback(
    async (params?: any) => {
      setLoading(true)
      try {
        const {
          data: { data },
        } = await getReportSummaryProduct({ ...queryParams, ...params })
        setRows(data)
      } catch (error) {
        showErrorToast(error.message)
      } finally {
        setLoading(false)
      }
    },
    [queryParams],
  )

  const handleSearch = (search: any) => {
    clearTimeout(searchDebounce)
    searchDebounce = setTimeout(() => {
      getData({ search })
    }, 400)
    setParams({ ...queryParams, search })
  }

  useEffect(() => {
    getData()
  }, [isFocused])

  return (
    <View style={styles.container}>
      <View style={[styles.content, { marginBottom: 16 }]}>
        {isSearching || queryParams.search ? (
          <View style={styles.rowCenter}>
            <TextInput
              style={{ flex: 1, marginVertical: 0 }}
              value={queryParams.search}
              placeholder="Cari nama produk..."
              onChangeText={handleSearch}
            />
            <TouchableOpacity
              style={styles.closeSearch}
              onPress={() => {
                handleSearch(undefined)
                setIsSearching(false)
              }}>
              <AntDesign name="closecircle" color={theme.colors.blackSemiTransparent} size={18} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.rowCenter}>
            <View style={{ flex: 0.9 }}>
              <CalendarPicker
                selectedStartDate={queryParams.start_date}
                selectedEndDate={queryParams.end_date}
                onChange={props => {
                  const params = { ...queryParams, start_date: props.selectedStartDate, end_date: props.selectedEndDate }
                  getData(params)
                  setParams(params)
                }}
              />
            </View>
            <TouchableOpacity activeOpacity={0.5} onPress={() => setIsSearching(true)} style={styles.searchToggle}>
              <FontAwesome name="search" size={18} color={theme.colors.greyBlack} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <FlatList
        data={rows}
        contentContainerStyle={{ paddingBottom: 150 }}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item: e }: any) => {
          return (
            <TouchableOpacity activeOpacity={0.6} style={[styles.historyCard]}>
              <View style={styles.wrapInfo}>
                <Text style={styles.textInfo} type="semibold" size={8} color={theme.colors.textSemiBold}>
                  {e.name} <Text type="regular">x{e.qty}</Text>
                </Text>
                <Text style={styles.textInfo} size={7} color={theme.colors.label}>
                  Total Harga Bahan : {convertToRupiah(e?.total_capital || '0')}
                </Text>
                <Text style={styles.textInfo} size={7} color={theme.colors.label}>
                  Total Harga Jual : {convertToRupiah(e?.gross_income || '0')}
                </Text>
                <Text style={styles.textInfo} size={7} color={theme.colors.label}>
                  Total Laba : {convertToRupiah(e?.net_income || '0') || ' - '}
                </Text>
              </View>
            </TouchableOpacity>
          )
        }}
        ListFooterComponent={() => <Footer loading={Boolean(rows?.length > 10 && isLoading)} />}
        ListEmptyComponent={EmptyList}
        refreshControl={
          <RefreshControl colors={[theme.colors.primary]} refreshing={Boolean(isLoading)} onRefresh={getData} />
        }
      />
    </View>
  )
}

const EmptyList = () => (
  <View style={styles.center}>
    <Image source={require('@assets/images/undraw_empty.png')} style={styles.emptyImage} />
    <Text style={styles.center} type="semibold">
      No Data
    </Text>
  </View>
)

const Footer = ({ loading }: { loading: boolean }) => (
  <View style={styles.footer}>
    <ActivityIndicator size="large" color={theme.colors.primary} animating={loading} />
  </View>
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  headerMenu: {
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  textMenu: {
    fontSize: 18,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: theme.colors.defaultBorderColor,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    marginHorizontal: 16,
  },
  wrapInfo: {
    flex: 0.95,
  },
  textInfo: {
    lineHeight: 22,
  },
  wrapBadge: {
    flexDirection: 'row',
    marginTop: 7,
  },
  center: { alignSelf: 'center' },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  emptyImage: { width: wp(60), height: wp(50), marginTop: 32, resizeMode: 'contain' },
  closeSearch: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  searchToggle: {
    marginLeft: 8,
    flex: 0.15,
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.defaultBorderColor,
  },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  downloadButton: { marginRight: 20, flexDirection: 'row', alignItems: 'center' },
})
