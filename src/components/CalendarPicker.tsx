import React, {useState} from 'react'
import {TouchableOpacity, StyleSheet, Modal, View} from 'react-native'
import {theme} from '@utils/theme'
import Text from '@components/Text'
import Feather from 'react-native-vector-icons/Feather'

//@ts-ignore
import CalendarPicker from 'react-native-calendar-picker'
import moment from 'moment'

interface Props {
  onChange: (date: any) => void
  selectedStartDate: string
  selectedEndDate: string
  disabled?: boolean
}

const CustomCalendarPicker: React.FC<Props> = props => {
  const [state, setState] = useState({
    selectedStartDate: props.selectedStartDate,
    selectedEndDate: props.selectedEndDate,
    show: false,
  })

  const disabledSave = Boolean(!state.selectedEndDate || !state.selectedStartDate)

  const onDateChange = (date: any, type: any) => {
    let newState
    const newDate = moment(date).format('YYYY-MM-DD')
    if (type === 'END_DATE') {
      newState = {
        ...state,
        selectedEndDate: newDate,
      }
    } else {
      newState = {
        ...state,
        selectedStartDate: newDate,
        selectedEndDate: newDate,
      }
    }
    setState(newState)
  }

  const onSave = () => {
    setState({...state, show: false})
    props.onChange(state)
  }

  return (
    <React.Fragment>
      <TouchableOpacity
        disabled={props.disabled}
        onPress={() => setState({...state, show: true})}
        activeOpacity={0.6}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: theme.colors.defaultBorderColor,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text type="semibold" color={theme.colors.greyBlack}>
          {moment(state.selectedStartDate).format('DD MMM YYYY')} -{' '}
          {moment(state.selectedEndDate).format('DD MMM YYYY')}
        </Text>
        <Feather name="calendar" size={18} color={theme.colors.greyBlack} />
      </TouchableOpacity>
      <Modal
        animationType={'slide'}
        visible={state.show}
        onRequestClose={() => setState({...state, show: false})}
        style={{justifyContent: 'center'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 14}}>
          <TouchableOpacity onPress={() => setState({...state, show: false})}>
            <Text size={9}>Tutup</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSave} disabled={disabledSave}>
            <Text size={9} color={disabledSave ? theme.colors.grey : theme.colors.black}>
              Simpan
            </Text>
          </TouchableOpacity>
        </View>
        <CalendarPicker
          allowRangeSelection={true}
          todayBackgroundColor={theme.colors.blackSemiTransparent}
          selectedDayColor={theme.colors.primary}
          selectedDayTextColor="#FFFFFF"
          onDateChange={onDateChange}
        />
      </Modal>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({})

export default CustomCalendarPicker
