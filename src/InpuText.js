import { StyleSheet, Text, View ,TextInput} from 'react-native'
import React from 'react'

const InpuText = ({value,onChangeText,placeHolder}) => {
  return (
    <View >
 <TextInput style={{borderBottomWidth:1,width:150}} value={value} onChangeText={onChangeText} placeholder={placeHolder}/>
    </View>
  )
}

export default InpuText

