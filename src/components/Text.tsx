import React, {ReactNode} from 'react'
import {Text, Dimensions, StyleSheet, StyleProp, TextStyle} from 'react-native'
import {RFValue as fs} from 'react-native-responsive-fontsize'
const {width} = Dimensions.get('window')

interface Props {
  type?: 'default' | 'thin' | 'regular' | 'semibold' | 'bold'
  color?: string
  size?: number
  children: string | ReactNode | null
  style?: StyleProp<TextStyle>
  maxLines?: number
}

const Typography: React.FC<Props> = props => {
  const TextStyles = styles[props.type || 'default']
  const colors = {
    color: props.color || '#333333',
  }
  const sizeText = {
    fontSize: props.size ? fs(props.size, width) : fs(8, width),
  }
  return (
    <Text numberOfLines={props.maxLines} style={[TextStyles, colors, sizeText, props.style]}>
      {props.children}
    </Text>
  )
}

const styles = StyleSheet.create({
  default: {
    fontSize: fs(7, width),
    fontFamily: 'Jost-Regular',
  },
  thin: {
    fontSize: fs(9, width),
    fontFamily: 'Jost-Thin',
  },
  regular: {
    fontSize: fs(9, width),
    fontFamily: 'Jost-Regular',
  },
  semibold: {
    fontSize: fs(9, width),
    fontFamily: 'Jost-SemiBold',
  },
  bold: {
    fontSize: fs(9, width),
    fontFamily: 'Jost-Bold',
  },
})

export default Typography
