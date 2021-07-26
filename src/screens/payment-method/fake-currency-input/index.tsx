import React, {useState, useRef, useEffect} from 'react'
import {StyleSheet, View, TextInput, TouchableOpacity, Dimensions} from 'react-native'
import Text from '@components/Text'
import {theme} from '@utils/theme'
import {RFValue as fs} from 'react-native-responsive-fontsize'
import {convertToRupiah} from 'utils/convertRupiah'
const {width} = Dimensions.get('window')

interface Props {
  value: string
  onChangeText: (text: string) => void
}

export default function FakeCurrencyInput(props: Props) {
  const inputRef: any = useRef()
  const [value, setValue] = useState(props.value)
  const [blink, setBlink] = useState(false)
  let blinkInv: any = null

  useEffect(() => {
    blinkInv = setInterval(() => {
      setBlink(n => !n)
    }, 500)
    return () => clearInterval(blinkInv)
  }, [])

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        inputRef?.current?.focus()
      }}
      style={{flexDirection: 'row'}}>
      <View style={[styles.value, {borderRightWidth: blink ? 2 : 0}]}>
        <Text type="bold" size={14} color={value.length > 0 ? undefined : 'rgba(51,51,51,0.5)'}>
          Rp {convertToRupiah(value || '0')}
        </Text>
      </View>
      <TextInput
        ref={inputRef}
        style={[styles.input]}
        selectionColor={theme.colors.white}
        placeholderTextColor={theme.colors.white}
        caretHidden
        autoFocus
        keyboardType="numeric"
        value={value}
        placeholder="0"
        onChangeText={async text => {
          let newText = text ? parseInt(text.replace(/[^0-9]/g, ''), 0).toString() : ''
          await setValue(newText)
          props.onChangeText(newText)
        }}
      />
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  contentContainer: {
    padding: 16,
  },
  input: {
    flex: 1,
    fontFamily: 'Jost-Bold',
    fontSize: fs(14, width),
    paddingVertical: 0,
    color: theme.colors.white,
    // width: 0,
    // height: 0,
  },
  value: {borderRightColor: theme.colors.primary, paddingRight: 2},
})
