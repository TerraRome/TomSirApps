import React from 'react'
import {View, StyleSheet} from 'react-native'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {theme} from '@utils/theme'
import Logo from 'components/Logo'
import {useDispatch} from 'react-redux'
import {setSplash} from '@store/actions/apps'

function SpashScreen() {
  const dispatch = useDispatch()

  React.useEffect(() => {
    setTimeout(() => {
      dispatch(setSplash())
    }, 2000)
  }, [])

  return (
    <View style={styles.container}>
      <Logo source={require('@assets/images/logo2.png')} style={styles.logo} />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  logo: {
    width: wp(40),
    height: wp(40),
  },
})

export default SpashScreen
