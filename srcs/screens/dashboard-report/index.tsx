import CalendarPicker from '@components/CalendarPicker'
import Loader from '@components/Loader'
import Text from '@components/Text'
import TextInput from '@components/TextInput'
import { showErrorToast } from '@components/Toast'
import { useNavigation } from '@react-navigation/core'
import { useIsFocused } from '@react-navigation/native'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, PermissionsAndroid, RefreshControl, Share, StyleSheet, TouchableOpacity, View } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useDispatch, useSelector } from 'react-redux'
import { getReportExcel, getReportList, getReportSummary } from 'services/report'
import { setReportHistory, setReportSummary } from 'store/actions/report'
import { convertToRupiah } from 'utils/convertRupiah'
import { downloadFile } from 'utils/fetch-blob'
import { theme } from 'utils/theme'

let searchDebounce: any = null
export default function DashboardReport() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const report = useSelector((state: any) => state.report)
  const merchant = useSelector((state: any) => state.auth?.merchant)
  const { rows, page_size, current_page } = report.history

  const [isLoading, setLoading] = useState(false)
  const [isLoading2, setLoading2] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const [queryParams, setParams] = useState({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    search: '',
    order: 'DESC',
    status: 'paid',
    start_date: moment().subtract(7, 'days').format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
  })

  const getData = useCallback(
    async (params?: any) => {
      setLoading(true)
      try {
        const {
          data: { data: dataHistory },
        } = await getReportList({ ...queryParams, ...params })
        const {
          data: { data: dataSummary },
        } = await getReportSummary({
          start_date: queryParams.start_date,
          end_date: queryParams.end_date,
        })
        dispatch(setReportHistory(dataHistory))
        dispatch(setReportSummary(dataSummary))
      } catch (error: any) {
        showErrorToast(error.message)
      } finally {
        setLoading(false)
      }
    },
    [queryParams],
  )

  const getNextPage = () => {
    const hasNextPage = Boolean(page_size === queryParams.limit)
    const nextPage = current_page + 1
    if (isLoading || !hasNextPage) {
      return
    }
    getData({ page: nextPage })
  }

  const refreshData = (param?: any) => {
    getData({ page: 1, ...param })
  }

  const onShare = async () => {
    setLoading2(true)
    try {
      const {
        data: { data: url },
      } = await getReportExcel({
        start_date: queryParams.start_date,
        end_date: queryParams.end_date,
      })
      console.log(url);

      const message = `Laporan penjualan ${merchant?.name} dari ${queryParams.start_date} sampai ${queryParams.end_date} `
      const filename = message + url

      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Permission Needed',
          message: 'For download purpose',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      );

      if (permission === 'denied') return;
      if (permission === 'granted') {
        // YOUR WRITE FUNCTION HERE
        await downloadFile(url, message)
        Share.share({ url, message: filename, title: filename })
      }
    } catch (error: any) {
      showErrorToast(error.message)
    } finally {
      setLoading2(false)
    }
  }

  const handleSearch = (search: any) => {
    clearTimeout(searchDebounce)
    searchDebounce = setTimeout(() => {
      refreshData({ search })
    }, 400)
    setParams({ ...queryParams, search })
  }

  useEffect(() => {
    refreshData()
  }, [isFocused, queryParams.start_date])

  const Summary = () => (
    <View style={{ paddingHorizontal: 16 }}>
      <View style={{ marginBottom: 16 }}>
        <Text size={10} type="semibold">
          Ringkasan
        </Text>
      </View>
      <View style={styles.wrapSummaryCard}>
        <View style={[styles.summaryCard, styles.shadow, { backgroundColor: '#1FB0B0' }]}>
          <Text color={theme.colors.white} type="bold" size={10}>
            {convertToRupiah(report?.summary?.gross_income || '0')}
          </Text>
          <Text color={theme.colors.white} size={7}>
            Pendapatan Kotor
          </Text>
        </View>
        <View style={[styles.summaryCard, styles.shadow, { backgroundColor: '#FF7544' }]}>
          <Text color={theme.colors.white} type="bold" size={10}>
            {convertToRupiah(report?.summary?.net_income || '0')}
          </Text>
          <Text color={theme.colors.white} size={7}>
            Pendapatan Bersih
          </Text>
        </View>
      </View>
      <View style={styles.wrapSummaryCard}>
        <View style={[styles.summaryCard, styles.shadow, { backgroundColor: '#FC5B7D' }]}>
          <Text color={theme.colors.white} type="bold" size={10}>
            {convertToRupiah(report?.summary?.total_order || '0')}
          </Text>
          <Text color={theme.colors.white} size={7}>
            Jumlah Transaksi
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ReportSummaryProduct', {
              item: {
                start_date: queryParams.start_date,
                end_date: queryParams.end_date,
              },
            })
          }
          activeOpacity={0.8}
          style={[styles.summaryCard, styles.shadow, { backgroundColor: '#8577FE' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 0.9 }}>
              <Text color={theme.colors.white} type="bold" size={10}>
                {convertToRupiah(report?.summary?.total_qty || '0')}
              </Text>
              <Text color={theme.colors.white} size={7}>
                Total Item Terjual
              </Text>
            </View>
            <View style={{ alignSelf: 'flex-end' }}>
              <Feather name="chevron-right" size={18} color={theme.colors.white} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ marginVertical: 16 }}>
        <Text size={10} type="semibold">
          Riwayat
        </Text>
      </View>
    </View>
  )

  const HistoryCard = ({ item }: any) => (
    <TouchableOpacity
      key={item.id}
      activeOpacity={0.6}
      onPress={() => navigation.navigate('DetailHistory', { item })}
      style={[styles.historyCard]}>
      <View style={styles.wrapInfo}>
        <Text style={styles.textInfo} type="semibold" size={8} color={theme.colors.textSemiBold}>
          {item.code}
        </Text>
        <Text style={styles.textInfo} size={7} color={theme.colors.label}>
          Tanggal : {moment(item?.createdAt).format('DD MMM YYYY HH:mm')}
        </Text>
        <Text style={styles.textInfo} size={7} color={theme.colors.label}>
          Tipe Pesanan : {item?.type === 'dine_in' ? 'Dine In' : 'Take Away'}
        </Text>
        <Text style={styles.textInfo} size={7} color={theme.colors.label}>
          Harga Jual : {convertToRupiah(item?.total_price)}
        </Text>
        <Text style={styles.textInfo} size={7} color={theme.colors.label}>
          Catatan : {item?.note || ' - '}
        </Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Loader loading={isLoading2} />
      <View style={[styles.headerContainer]}>
        <View style={styles.rowCenter}>
          <TouchableOpacity
            style={styles.headerMenu}
            onPress={() => {
              //@ts-ignore
              navigation.openDrawer()
            }}>
            <Feather name="menu" size={20} />
          </TouchableOpacity>
          <Text type="semibold" style={styles.textMenu}>
            Laporan
          </Text>
        </View>
        <TouchableOpacity onPress={onShare} style={styles.downloadButton}>
          <Feather name="download" size={18} />
        </TouchableOpacity>
      </View>
      <View style={[styles.content, { marginBottom: 16 }]}>
        {isSearching || queryParams.search ? (
          <View style={styles.rowCenter}>
            <TextInput
              style={{ flex: 1, marginVertical: 0 }}
              value={queryParams.search}
              placeholder="Cari id pesanan..."
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
        ListHeaderComponent={Summary}
        renderItem={HistoryCard}
        keyExtractor={item => item.id}
        onEndReached={getNextPage}
        onEndReachedThreshold={1}
        ListFooterComponent={() => <Footer loading={Boolean(rows?.length > 10 && isLoading)} />}
        ListEmptyComponent={EmptyList}
        refreshControl={
          <RefreshControl
            colors={[theme.colors.primary]}
            refreshing={Boolean(isLoading && current_page === 1)}
            onRefresh={refreshData}
          />
        }
      />
    </SafeAreaView>
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
    justifyContent: 'space-between',
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
  },
  summaryCard: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'red',
    borderRadius: 10,
    marginHorizontal: 4,
  },
  wrapSummaryCard: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginBottom: 8,
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
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
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
