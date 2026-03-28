import { studyBuddyTheme } from '@/lib/theme';
import { useUser } from '@clerk/expo';
import React, { useEffect, useRef } from 'react';
import { Chat, OverlayProvider, useCreateChatClient } from 'stream-chat-expo';
import FullScreenLoader from './FullScreenLoader';

const STREAM_API_KEY = process.env.EXPO_PUBLIC_STREAM_API_KEY!

const syncUserToStream = async(user: any) => {
    try{
      await fetch("/api/sync-user", {
        method:"POST",
        headers: {"Content-Type": "application/json"},
        body:JSON.stringify({
          userId: user.id,
          userName: user.fullName ?? user.username ?? user.emailAddresses[0].emailAddresses.split("@")[0],
          userImage: user.imageUrl
        })
      })
    } catch (error) {
      console.error("Failed to sync user to stream", error);
    }
}

const ChatClient = ({children, user}: {children:React.ReactNode, user: any}) => {
  const syncedRef = useRef(false);
  useEffect(() => {
    if(!syncedRef.current){
      syncedRef.current = true;
      syncUserToStream(user);
    }
  }, [user])

  const tokenProvider = async () => {
    const response = await fetch("/api/token", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body:JSON.stringify({ userId: user.id })
    });
    const data = await response.json();
    return data.token;
  }

  const chatClient = useCreateChatClient({
    apiKey: STREAM_API_KEY,
    userData: {
      id: user.id,
      name: user.fullName ?? user.username ?? user.emailAddresses[0].emailAddresses.split("@")[0],
      image: user.imageUrl,
    },
    tokenOrProvider: tokenProvider
  });

  if(!chatClient) return <FullScreenLoader message='Loading chat...' />

  return (
    <OverlayProvider value={{style:studyBuddyTheme}}>
      <Chat client={chatClient} style={studyBuddyTheme}>
        {children}
      </Chat>
    </OverlayProvider>
  );
}

const ChatWrapper = ({children}:{children:React.ReactNode}) => {
  const { user, isLoaded } = useUser();

  if(!isLoaded) return <FullScreenLoader message="Loading chat..."/>

  if(!user) return <>{children}</>
  return (
    <ChatClient user={user}>{children}</ChatClient>
  )
}

export default ChatWrapper