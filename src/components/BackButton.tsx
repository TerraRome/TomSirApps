import React, {memo} from 'react'
import {TouchableOpacity, StyleSheet} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import {theme} from '@utils/theme'
import {RFValue as fs} from 'react-native-responsive-fontsize'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
interface IProps {
  goBack?: () => void
}
const BackButton = ({goBack}: IProps) => {
  const insets = useSafeAreaInsets()
  return (
    <TouchableOpacity onPress={goBack} style={[styles.container, {top: insets.top + 10}]}>
      <Feather name="arrow-left" size={22} color={theme.colors.white} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 99,
    elevation: 99,
    backgroundColor: 'rgba(124,124,124,0.8)',
    padding: 6,
    borderRadius: 50,
  },
  image: {
    tintColor: '#ffff',
    width: 24,
    height: 24,
  },
})

export default memo(BackButton)
