import React, {useEffect} from 'react'
import {BackHandler} from 'react-native'

export function useBackButton(handler: any) {
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handler)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handler)
    }
  }, [handler])
}
