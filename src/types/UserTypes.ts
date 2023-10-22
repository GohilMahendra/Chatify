export type User = 
{
    name: string,
    email: string,
    picture: string,
    user_name: string,
    bio:string
}

export type UserResult = User & {
    id: string
}