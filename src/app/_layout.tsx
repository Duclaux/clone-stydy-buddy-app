import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { Stack } from "expo-router";
import "../../global.css";

export default function RootLayout() {

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

  if (!publishableKey) {
    throw new Error('Add your Clerk Publishable Key to the .env file')
  }

  return (
    <ClerkProvider 
      publishableKey={publishableKey}
      tokenCache={tokenCache}
    >
      <Stack
        screenOptions={{headerShown: false}}
      >
        <Stack.Screen /> 
      </Stack>
    </ClerkProvider>
  );
}
