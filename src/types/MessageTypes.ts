import { UserResult } from "./UserTypes"

export type Message=
{
    id: string,
    text: string,
    fileUrl: string | null,
    thumbnail: string | null,
    fileType: string | null,
    user_id: string,
    user_name: string,
    user_image: string,
    isRead: boolean,
    timestamp:string
}

export type UserMessageType = Omit<Message,"id" | "user_name" | "user_image">

export type MessagePreview=
{
    id: string,
    User: UserResult,
    lastMessage: Message,
    no_of_unread: number
}

