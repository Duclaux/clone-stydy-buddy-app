import { useAppContext } from "@/contexts/AppProvider"
import { COLORS } from "@/lib/theme"
import { getGreetinfForHour } from "@/lib/utils"
import { useUser } from "@clerk/expo"
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from "expo-router"
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { TextInput } from "react-native-gesture-handler"
import { SafeAreaView } from 'react-native-safe-area-context'
import type { Channel } from "stream-chat"
import { ChannelList } from "stream-chat-expo"

const ChatScreen = () => {
  const router = useRouter()
  const {setChannel} = useAppContext()
  const { user } = useUser();
  const [ search, setSearch ] = useState("");

  const channelRenderFilterFn = (channels: Channel[]) => {
    if(!search.trim()) return channels;

    const q = search.toLowerCase();
    return channels.filter((channel) => {
      const name = (channel.data?.name as string | undefined)?.toLowerCase() ?? "";
      const cid = channel.cid.toLowerCase();
      return name.includes(q) || cid.includes(q);
    });
  }

  const filter = { 
    members: {$in:[user?.id!]},
    type: "messaging"
  };

  const firstName = user?.firstName || "there"
  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-5 pt-5 pb-2">
        <Text className="text-sm text-foreground-muted mb-0.5">
          {getGreetinfForHour()}, {firstName}
        </Text>
      </View>

      {/* Search bar */}
      <View className="flex-row items-center bg-surface mx-5 px-3.5 py-3 rounded-[14px] gap-2.5 border border-border">
        <Ionicons name="search" size={18} color={COLORS.textMuted}/>
        <TextInput
          className="flex-1 text-[15px] text-foreground"
          placeholder="Search study rooms..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Section label */}
      <View className="flex-row items-center px-5 my-1.5 gap-2">
        <Ionicons name="chatbubbles" size={16} color={COLORS.primaryLight}/>
        <Text className="text-[15px] font-semibold text-primary-light">your Study Sessions</Text>
      </View>

      {/* Channel list */}
      <ChannelList 
        filters={filter}
        options={{state: true, watch: true}}
        sort={{ last_updated: -1 }}
        channelRenderFilterFn={channelRenderFilterFn}
        onSelect={(channel) => {
          setChannel(channel)
          //router.push(`/channel/${channel.id}`)
        }}
        additionalFlatListProps={{
          contentContainerStyle: { flexGrow: 1 }
        }}
        // EmptyStateIndicator={() => <Text className="flex-1 text-white">Hey start chatting</Text>}
      />
    </SafeAreaView>
  )
}

export default ChatScreen