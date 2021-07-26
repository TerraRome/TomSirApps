import React, {memo} from 'react'
import {Image, StyleSheet, ImageStyle, StyleProp, ImageSourcePropType} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

interface Props {
  style?: StyleProp<ImageStyle>
  source: ImageSourcePropType
}

const Logo = ({source, style}: Props) => <Image source={source} style={[styles.image, style]} />

const styles = StyleSheet.create({
  image: {
    width: wp(50),
    height: hp(7),
    marginBottom: 12,
    resizeMode: 'contain',
  },
})

export default memo(Logo)
