import React, {useState, useEffect, useCallback} from 'react'
import {View, StyleSheet, TouchableOpacity} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import CheckBox from '@react-native-community/checkbox'
import CustomButton from '@components/Button'
import {getAddonCategory} from '@services/addon'
import {setAddons} from '@store/actions/addon'
import {theme} from '@utils/theme'
import Text from '@components/Text'

const SelectAddon = ({navigation, route}: any) => {
  const dispatch = useDispatch()
  const [isLoading, setLoading] = useState(false)
  const {rows} = useSelector((state: any) => state.addons)
  const [selectedAddons, setSelectedAddons] = useState(route?.params?.addonCategory || [])
  const [checked, setChecked] = useState<any>(route?.params?.checked || {})

  useEffect(() => {
    getData()
  }, [])

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

  const handleSelectMenu = (isSelected: boolean, item: any) => {
    let addons = selectedAddons || []
    if (isSelected) {
      addons = addons.filter((menu: any) => menu?.id !== item.id)
    } else {
      addons.push(item)
    }
    setSelectedAddons(addons)
  }

  const onNavigate = () => {
    const addonCategory = selectedAddons.map(({id, name}: any) => ({id, name}))

    navigation.navigate('AddProduct', {addonCategory, checked})
  }

  return (
    <View style={styles.container}>
      <Text size={9} type="semibold">
        Pilih Varian Kategori
      </Text>
      {rows.map((e: any, i: number) => {
        const isChecked = checked[e.id]
        const selected = !!selectedAddons?.find((m: any) => m.id === e.id)
        return (
          <>
            <TouchableOpacity
              style={styles.addonData}
              key={i}
              onPress={() => {
                handleSelectMenu(selected, e)
                setChecked({...checked, [e.id]: !isChecked})
              }}>
              <View style={styles.row}>
                <CheckBox
                  disabled={false}
                  tintColors={{true: theme.colors.primary}}
                  onTintColor={theme.colors.grey2}
                  onFillColor={theme.colors.grey2}
                  onCheckColor={theme.colors.white}
                  animationDuration={0.2}
                  lineWidth={1.5}
                  boxType={'square'}
                  value={isChecked === true}
                  onValueChange={(s: boolean) => {
                    handleSelectMenu(!s, e)
                    setChecked({...checked, [e.id]: !isChecked})
                  }}
                />
                <Text style={styles.inputTitle}>{e.name}</Text>
              </View>
              <AntDesign name="right" size={18} color={theme.colors.blackSemiTransparent} />
            </TouchableOpacity>
            <View style={styles.divider} />
          </>
        )
      })}
      <View style={styles.buttonWrapper}>
        <CustomButton mode="default" onPress={onNavigate} style={styles.buttonAdd}>
          <Text style={styles.buttonText}>TAMBAH</Text>
        </CustomButton>
      </View>
    </View>
  )
}

export default SelectAddon

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addonData: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  inputTitle: {
    fontSize: 16,
    paddingLeft: 5,
  },
  divider: {
    height: 1,
    marginTop: 10,
    width: '100%',
    backgroundColor: theme.colors.defaultBorderColor,
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
})
