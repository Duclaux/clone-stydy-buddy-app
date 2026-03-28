import * as Sentry from "@sentry/react-native"
import React from 'react'
import { Button, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const ChatScreen = () => {
  return (
    <SafeAreaView>
      <Text>ChatScreen</Text>
      <Button title='Try!' onPress={ () => { Sentry.captureException(new Error('First error')) }}/>
    </SafeAreaView>
  )
}

export default ChatScreen