import EmptyState from '@/components/EmptyState';
import FullScreenLoader from '@/components/FullScreenLoader';
import { useAppContext } from '@/contexts/AppProvider';
import { COLORS } from '@/lib/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useHeaderHeight } from '@react-navigation/elements';
import { Image } from 'expo-image';
import { useNavigation, useRouter } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Channel, MessageInput, MessageList, useChatContext } from 'stream-chat-expo';

const ChannelScreen = () => {
  const { channel, setThread } = useAppContext();
  const { client } = useChatContext();

  const router = useRouter();
  const navigation = useNavigation();

  const headerHeight = useHeaderHeight();

  let displayName = "";
  let avatarUrl = "";

  if(channel){
    const members = Object.values(channel.state.members);
    const otherMember = members.find(member => member.user_id !== client.userID);
    displayName = otherMember?.user?.name!;
    avatarUrl = otherMember?.user?.image || "";
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: COLORS.surface,
      },
      headerTintColor: COLORS.text,
      headerLeft: () => (
        <TouchableOpacity 
          className='ml-2 flex-row items-center'
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text}/>
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <View className='flex-row items-center'>
          {avatarUrl ? (
            <Image source={avatarUrl} style={{width: 32, height: 32, borderRadius: 16, marginRight: 10}}/>
          ) : (
            <View 
              className='mr-2.5 h-8 w-8 items-center justify-center text-foreground'
              style={{ backgroundColor: COLORS.primary }}
            >
              <Text className='text-base font-semibold text-foreground'>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text className='font-semibold text-foreground'>{displayName}</Text>
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity
          //onPress={() => {
            //router.push({
              //pathname: "/call/[callId]",
              //params: { callId: channel?.id!},
            //})
          //}}
        >
          <Ionicons name='videocam-outline' size={24} color={COLORS.primary} />
        </TouchableOpacity>
      )
    })
  }, [navigation, displayName, avatarUrl, router, channel?.cid, channel?.id])

  if(!channel) return <FullScreenLoader message='Loading study room...'/>

  return (
    <SafeAreaView className='flex-1 bg-border'>
      <Channel
        channel={channel}
        keyboardVerticalOffset={headerHeight}
        EmptyStateIndicator={() => <EmptyState icon='book-outline' title='Not messages yet' subtitle='Start a study conversation'/>}
      >
        <MessageList
          onThreadSelect={(thread) => {
            setThread(thread);
            router.push(`/channel/${channel.id}/thread/${thread?.id}`);
          }}
        />

        <View className='pb-5 bg-surface'>
          <MessageInput />
        </View>
      </Channel>
    </SafeAreaView>
  )
}

export default ChannelScreen