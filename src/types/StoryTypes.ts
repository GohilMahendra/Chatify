export type Story = 
{
    user_name: string,
    name: string,
    user_picture: string,
    user_id: string,
    content: string,
    caption: string,
    mediaType: MediaType,
    timestamp: number,

}

export type StoryUpload = Omit<Story,"user_name" | "name" | "user_picture">
export type MediaType = "image" | "video"