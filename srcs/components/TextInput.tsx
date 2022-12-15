import React from 'react'
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  Image,
  TextStyle,
  StyleProp,
  ImageStyle,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import {theme} from '@utils/theme'

interface Props {
  type?: 'round' | 'default'
  isPassword?: boolean
  isNumber?: boolean
  uppercase?: boolean
  errorText?: string
  icon?: any
  disabled?: boolean
  multiline?: boolean
  textAlignVertical?: 'auto' | 'bottom' | 'center' | 'top'
  numberOfLines?: number
  iconStyle?: StyleProp<ImageStyle>
  style?: StyleProp<TextStyle>
  value: string
  placeholder?: string
  autoFocus?: boolean
  onChangeText?: (text: string) => void
}

const CustomTextInput = React.forwardRef<TextInput, Props>((props, ref) => {
  const [state, setState] = React.useState({
    hide: true,
    focus: false,
  })

  const dynamicStyle = {
    paddingLeft: props.icon ? 60 : 25,
    borderColor: props.errorText ? theme.colors.error : theme.colors.defaultBorderColor,
  }

  const borderColor = state.focus && !props.errorText ? {borderColor: theme.colors.primary} : {}

  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.wrapInput}>
        {props.icon && <InputIcon source={props.icon} style={props.iconStyle} />}
        <TextInput
          ref={ref}
          value={props.value}
          editable={props.disabled}
          multiline={props.multiline}
          numberOfLines={props.numberOfLines}
          placeholder={props.placeholder}
          autoFocus={props.autoFocus}
          textAlignVertical={props.textAlignVertical}
          onChangeText={props.onChangeText}
          style={[styles.input, dynamicStyle, borderColor, styles[props.type || 'default'], props.style]}
          onFocus={() => setState({...state, focus: true})}
          onBlur={() => setState({...state, focus: false})}
          keyboardType={props.isNumber ? 'phone-pad' : 'default'}
          autoCapitalize={props.uppercase ? 'characters' : 'none'}
          secureTextEntry={props.isPassword ? state.hide : false}
        />
        {props.isPassword && (
          <TouchableOpacity onPress={() => setState({...state, hide: !state.hide})} style={styles.hideButton}>
            <Feather color={theme.colors.grey} name={state.hide ? 'eye-off' : 'eye'} size={20} />
          </TouchableOpacity>
        )}
      </View>
      {props.errorText ? <Text style={styles.error}>{props.errorText}</Text> : null}
    </View>
  )
})

const InputIcon: React.FC<{
  source: ImageSourcePropType
  style: StyleProp<ImageStyle>
}> = React.memo(({source, style}) => (
  <View style={styles.wrapIcon}>
    <Image source={source} style={[styles.icon, style]} />
  </View>
))

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  input: {
    borderColor: theme.colors.defaultBorderColor,
    backgroundColor: theme.colors.white,
    fontFamily: 'Jost-Regular',
    color: theme.colors.black,
    paddingHorizontal: 25,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 13,
    height: 50,
    flex: 1,
  },
  wrapInput: {flexDirection: 'row'},
  error: {
    color: theme.colors.error,
    paddingHorizontal: 4,
    fontSize: 14,
    paddingTop: 4,
  },
  wrapIcon: {
    zIndex: 5,
    elevation: 5,
  },
  icon: {
    zIndex: 5,
    position: 'absolute',
    resizeMode: 'contain',
    width: 35,
    height: 26,
    left: 17,
    top: 15,
    bottom: 8,
  },
  round: {
    borderRadius: 25,
  },
  default: {
    borderRadius: 10,
  },
  hideButton: {position: 'absolute', right: 18, top: 14},
})

export default React.memo(CustomTextInput)
