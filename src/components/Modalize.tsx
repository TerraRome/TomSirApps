import React, {useEffect, forwardRef, useImperativeHandle, useState} from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Modal,
  View,
  PanResponder,
  Animated,
  Dimensions,
  StyleProp,
  ViewStyle,
} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
interface IProps {
  hideCancel?: boolean
  hideHeader?: boolean
  hideHandleBar?: boolean
  children?: any
  showReset?: boolean
  onCancel?: () => void
  handleReset?: () => void
  title?: string
  style?: StyleProp<ViewStyle>
}

const {height: SCREEN_HEIGHT} = Dimensions.get('window')

const Modalize = forwardRef((props: IProps, ref?: any) => {
  const insets = useSafeAreaInsets()

  const [state, setState] = useState({
    show: false,
  })
  const [panY] = useState(new Animated.Value(SCREEN_HEIGHT))

  const resetPositionAnim = Animated.timing(panY, {
    toValue: 0,
    duration: 200,
    useNativeDriver: false,
  })

  const closeAnim = Animated.timing(panY, {
    toValue: SCREEN_HEIGHT,
    duration: 80,
    useNativeDriver: false,
  })

  const closeModal = () => {
    closeAnim.start(() => {
      setState({...state, show: false})
      props.onCancel && props.onCancel()
    })
  }

  const panResponders = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => false,
    onPanResponderMove: Animated.event([null, {dy: panY}], {useNativeDriver: false}),
    onPanResponderRelease: (e, gs) => {
      if (gs.dy > 0 && gs.vy >= 0.25) {
        return closeModal()
      }
      return resetPositionAnim.start()
    },
  })

  const top = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  })

  useEffect(() => {
    if (state.show) {
      resetPositionAnim.start()
    } else {
      closeModal()
    }
  }, [state.show])

  useImperativeHandle(ref, () => ({
    open: () => setState({...state, show: true}),
    close: () => setState({...state, show: false}),
  }))

  return (
    <Modal animationType={'fade'} visible={state.show} transparent statusBarTranslucent onRequestClose={closeModal}>
      <TouchableOpacity onPress={closeModal} activeOpacity={1} style={styles.overlay}>
        <Animated.View
          style={[
            {
              paddingBottom: insets.bottom || 9,
            },
            styles.container,
            props.style,
            {top},
          ]}
          {...panResponders.panHandlers}>
          {!props.hideHandleBar && <View style={styles.handleBar} />}
          {props.children}
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  )
})

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  handleBar: {
    borderRadius: 4,
    backgroundColor: '#EBEBEB',
    height: 4,
    width: 36,
    alignSelf: 'center',
    marginTop: 9,
  },
})

export default Modalize
