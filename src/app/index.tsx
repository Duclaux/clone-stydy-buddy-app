import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Index() {
  const { isSignedIn, isLoaded, signOut } = useAuth();

  if(!isLoaded) return;

  if(!isSignedIn){
    return <Redirect href={"/(auth)"} />
  }
  
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-2xl">Edit src/app/index.tsx to edit this screen.</Text>

      <Pressable
        onPress={() => signOut()}
      >
        <Text>Sign out</Text>
      </Pressable>
    </View>
  );
}
