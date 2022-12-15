import React, {useState} from 'react'
import {Platform, StyleSheet, KeyboardAvoidingView, View, TouchableOpacity} from 'react-native'
import Text from '@components/Text'
import Button from '@components/Button'
import {showErrorToast} from '@components/Toast'
import {useDispatch} from 'react-redux'
import {theme} from '@utils/theme'
import {setAuth} from '@store/actions/auth'
import TextInput from '@components/TextInput'
import {emailValidator, passwordValidator} from '@utils/validators'

function Register({navigation}: any) {
  const dispatch = useDispatch()
  const [email, setEmail] = useState({value: '', error: ''})
  const [password, setPassword] = useState({value: '', error: ''})
  const [isLoading, setLoading] = useState(false)

  const createUserWithEmailAndPassword = (): void => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({...email, error: emailError})
      setPassword({...password, error: passwordError})
      return
    }
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text style={styles.title} type="bold" size={10}>
          Register
        </Text>

        <TextInput
          value={email.value}
          errorText={email.error}
          placeholder="Type your email"
          onChangeText={value => setEmail({value, error: ''})}
        />
        <TextInput
          value={password.value}
          errorText={password.error}
          placeholder="Type your password"
          onChangeText={value => setPassword({value, error: ''})}
          isPassword
        />

        <Button loading={isLoading} onPress={createUserWithEmailAndPassword}>
          <Text color="white" type="semibold">
            {isLoading ? 'Loading...' : 'Sign up'}
          </Text>
        </Button>

        <View style={[styles.row, {alignSelf: 'center'}]}>
          <Text style={styles.label}>Already have account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
  },
  divider: {
    borderBottomWidth: 2,
    borderColor: theme.colors.defaultBorderColor,
    width: '100%',
    position: 'absolute',
    zIndex: 1,
    top: 10,
  },
  title: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  wrapTextOR: {
    zIndex: 2,
    position: 'absolute',
    backgroundColor: 'white',
    paddingHorizontal: 8,
  },
  wrapOR: {
    alignItems: 'center',
    height: 70,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: theme.colors.grey,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})

export default Register
