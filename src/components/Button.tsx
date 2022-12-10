import { theme } from '@utils/theme'
import React, { ReactNode } from 'react'
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

interface Props {
  mode?: 'outlined' | 'default' | 'link'
  onPress?: ((event: any) => void) | undefined
  children?: ReactNode | null
  style?: StyleProp<ViewStyle>
  loading?: boolean
}

const CustomButton: React.FC<Props> = props => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={props.onPress}
      disabled={props.loading}
      style={[
        styles.button,
        {
          backgroundColor: props.loading ? theme.colors.disabled : theme.colors.primary,
        },
        props?.mode && styles[props.mode],
        props.style,
      ]}>
      {props.children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
    paddingVertical: 12,
    paddingHorizontal: wp(8),
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: theme.colors.defaultBorderColor,
  },
  default: {},
  link: {
    borderWidth: 0,
    backgroundColor: theme.colors.white,
  },
  outlined: {
    borderWidth: 1,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.primary,
  },
})

export default CustomButton
