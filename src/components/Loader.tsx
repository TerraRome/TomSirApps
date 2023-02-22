import { useNavigation } from '@react-navigation/native'
import { theme } from '@utils/theme'
import React from 'react'
import { ActivityIndicator, Modal, Platform, StyleSheet, View } from 'react-native'

interface IProps {
  loading?: boolean
}

const Loader = (props: IProps) => {
  const nav = useNavigation()
  return (
    <Modal statusBarTranslucent onRequestClose={nav.goBack} visible={Boolean(props?.loading)} transparent>
      <View style={styles.centeredView}>
        <ActivityIndicator
          animating={Boolean(props?.loading)}
          size="large"
          style={styles.loader}
          color={theme.colors.white}
        />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0, 0.4)',
  },
  loader: {
    transform: [{ scale: Platform.OS === 'ios' ? 1 : 1.8 }],
  },
})

export default Loader
