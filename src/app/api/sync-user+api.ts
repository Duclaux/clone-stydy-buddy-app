import * as Sentry from "@sentry/react-native";
import { StreamChat } from "stream-chat";

const API_KEY = process.env.EXPO_PUBLIC_STREAM_API_KEY as string
const SECRET_KEY = process.env.STREAM_SECRET_KEY as string

export async function POST(request: Request) {
    const client = StreamChat.getInstance(API_KEY, SECRET_KEY);

    const body = await request.json();

    const {userId, userName, userImage} = body;

    if(!userId){
        return Response.json({ error: "userId is required" }, { status: 400 });
    }

    try {
        await client.upsertUser({
            id: userId,
            name: userName || "Guest",
            image: userImage
        })
        return Response.json({ Success: true, userId })
    } catch (error) {
        console.log("Error syncing user to Stream:", error)
        Sentry.captureException(error, {
            extra: {userId, userName, userImage},
        })
        return Response.json({ error: "Failed to sync user to Stream" }, { status: 500})
    }
}