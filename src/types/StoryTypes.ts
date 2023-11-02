export type UserStory = 
{
    id:string
    user_name: string,
    name: string,
    picture: string,
    stories:Story[],
    count: number,
    isViewed: boolean
}

export type StoryUser = Omit<UserStory,"stories">
export type Story = 
{
    id:string
    mediaUrl: string,
    caption: string,
    mime: MediaType,
    timestamp: number,
}
export type StoryUpload = Omit<UserStory,"user_name" | "name" | "user_picture">
export type MediaType = "image" | "video"