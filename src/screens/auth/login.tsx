import Button from '@components/Button'
import Text from '@components/Text'
import TextInput from '@components/TextInput'
import { showErrorToast } from '@components/Toast'
import { setAuth } from '@store/actions/auth'
import { theme } from '@utils/theme'
import { emailValidator, passwordValidator } from '@utils/validators'
import Logo from 'components/Logo'
import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useDispatch } from 'react-redux'
import { signin } from 'services/auth'

export default function Login({ navigation }: any) {
  const dispatch = useDispatch()
  const [email, setEmail] = useState({
    value: '',
    error: '',
  })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [isLoading, setLoading] = useState(false)

  const signInWithEmailAndPassword = async () => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    setLoading(true)
    try {
      const {
        data: { data },
      } = await signin({ email: email.value, password: password.value })
      if (data?.token) {
        dispatch(setAuth(data))
      }
    } catch (error: any) {
      showErrorToast(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.contentContainerStyle}>
        <KeyboardAvoidingView
          style={{ marginBottom: wp(20) }}
          keyboardVerticalOffset={20}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Logo source={require('@assets/images/logo2.png')} style={styles.logo} />
          <Text style={[styles.title, { marginBottom: 32 }]}>Silahkan masuk</Text>
          <TextInput
            value={email.value}
            errorText={email.error}
            placeholder="Ketik email anda"
            onChangeText={(value: any) => setEmail({ value, error: '' })}
          />
          <TextInput
            value={password.value}
            errorText={password.error}
            placeholder="Ketik password anda"
            onChangeText={(value: any) => setPassword({ value, error: '' })}
            isPassword
          />
          <Button loading={isLoading} onPress={signInWithEmailAndPassword}>
            <Text color="white" type="semibold">
              {isLoading ? 'Memuat...' : 'Log In'}
            </Text>
          </Button>
          <View style={[styles.row, { alignSelf: 'center' }]}>
            <Text style={styles.label}>Tidak punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>Register</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
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
  contentContainerStyle: {
    flex: 1,
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
    marginTop: -10,
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
  logo: { alignSelf: 'center', height: wp(35), top: 10 },
})
