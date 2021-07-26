import React from 'react'
import {StyleSheet, View, StyleProp, ViewStyle} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {theme} from '@utils/theme'
import {Platform} from 'react-native'

interface IPFooterButton {
  children: any
  style?: StyleProp<ViewStyle>
}

const FooterButton: React.FC<IPFooterButton> = props => {
  const insets = useSafeAreaInsets()
  return <View style={[styles.wrapButton, {paddingBottom: insets.bottom || 8}]}>{props.children}</View>
}

export default FooterButton

const styles = StyleSheet.create({
  wrapButton: {
    padding: 18,
    paddingTop: 9,
    backgroundColor: theme.colors.background,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    ...(Platform.OS === 'ios' && {
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    }),
  },
})
