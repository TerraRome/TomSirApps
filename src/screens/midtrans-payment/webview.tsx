import { useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
// import { WebView } from 'react-native-webview';

// const midtransClient = require('midtrans-client');

const { width } = Dimensions.get('window')

export default function MidtransPayment() {
  const route: any = useRoute()
  // const { urlMidtrans } = route?.params;

  useEffect(() => {
  }, [])

  return (
    <></>
    // <WebView source={{ uri: urlMidtrans }} />
  )
}
