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
    isRead: boolean
}

export type UserMessageType = Omit<Message,"id" | "user_name" | "user_image">

