import Button from '@components/Button'
import Text from '@components/Text'
import TextInput from '@components/TextInput'
import { theme } from '@utils/theme'
import Logo from 'components/Logo'
import { showErrorToast, showSuccessToast } from 'components/Toast'
import React, { useState } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useDispatch } from 'react-redux'
import { regisMerchant } from 'services/merchant'
import { regisUser } from 'services/user'
import { emailValidator } from 'utils/validators'

function Register({ navigation }: any) {
  const dispatch = useDispatch()
  const randPassword = Math.random().toString(36).substr(2, 8);
  const [emailError, setEmailError] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [user, setUser] = useState({
    fullname: '',
    email: '',
    password: randPassword,
    role: 'admin',
  })
  const [merchant, setMerchant] = useState({
    name: '',
    address: '',
    phone_number: '',
  })

  const onChangeUser = (type: string) => (value: any) => {
    setUser({
      ...user,
      [type]: value,
    })
  }

  const onChangeMerchant = (type: string) => (value: any) => {
    setMerchant({
      ...merchant,
      [type]: value,
    })
  }

  const validationInput = () => {
    if (!user.email || !merchant.name || !merchant.address || !merchant.phone_number) {
      return true
    }
    return false
  }

  const registerMerchant = async (): Promise<void> => {
    setLoading(true)
    const emailError = emailValidator(user.email)
    if (emailError) {
      setEmailError(emailError)
      return
    }
    const formData: any = new FormData()
    formData.append('name', merchant.name)
    formData.append('address', merchant.address)
    formData.append('phone_number', merchant.phone_number)

    try {
      const {
        data: { data },
      } = await regisMerchant(formData)
      if (data.id) {
        await registerUser(data.id)
      }
    } catch (error: any) {
      showErrorToast(error.message)
    } finally {
      setLoading(true)
    }
  }

  const registerUser = async (merchant_id: any) => {
    const formData: any = new FormData()
    formData.append('fullname', user.fullname)
    formData.append('email', user.email)
    formData.append('password', user.password)
    formData.append('role', user.role)
    formData.append('merchant_id', merchant_id)


    try {
      const data = await regisUser(formData)
      if (data.status === 200) {
        showSuccessToast('Berhasil register, silahkan login!')
        navigation.navigate('Login')
      }
    } catch (error: any) {
      showErrorToast(error.message)
    }
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Logo source={require('@assets/images/logo2.png')} style={styles.logo} />
        <Text style={styles.title} type="bold" size={10}>
          Register
        </Text>

        <TextInput
          value={user.email}
          // errorText={user.error}
          placeholder="Type your email"
          onChangeText={onChangeUser('email')}
        />
        <TextInput
          value={user.fullname}
          // errorText={email.error}
          placeholder="Type your fullname"
          onChangeText={onChangeUser('fullname')}
        />
        <TextInput
          value={merchant.name}
          // errorText={email.error}
          placeholder="Type your merchant name"
          onChangeText={onChangeMerchant('name')}
        />
        <TextInput
          value={merchant.phone_number}
          // errorText={email.error}
          isNumber={true}
          placeholder="Type your phone number"
          onChangeText={onChangeMerchant('phone_number')}
        />
        <TextInput
          value={merchant.address}
          // errorText={email.error}
          placeholder="Type your address"
          onChangeText={onChangeMerchant('address')}
        />
        <TextInput
          value={user.password}
          // errorText={password.error}
          placeholder="Type your password"
          // onChangeText={value => setPassword({ value, error: '' })}
          isPassword
        />

        <Button loading={validationInput() || isLoading} onPress={registerMerchant}>
          {isLoading ?

            <ActivityIndicator
              color={theme.colors.white}
            />
            :
            <Text color="white" type="semibold">
              Sign up
            </Text>
          }
        </Button>

        <View style={[styles.row, { alignSelf: 'center' }]}>
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
  logo: { alignSelf: 'center', height: wp(35), top: 10 },
})

export default Register
