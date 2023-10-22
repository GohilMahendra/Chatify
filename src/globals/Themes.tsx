import { black, purple, silver, slate_grey, white } from "./Colors"

export type ThemeType =
{
    primary_color: string,
    secondary_color: string
    background_color:string,
    seconarybackground_color: string,
    button_color:string,
    text_color:string,
    placeholder_color:string,
    mode:string

}

export const light:ThemeType = 
{
    primary_color:purple,
    secondary_color:white,
    background_color:silver,
    seconarybackground_color: white,
    button_color:purple,
    text_color:black,
    placeholder_color:silver,
    mode:"light"
}

export const dark:ThemeType=
{
    primary_color:purple,
    secondary_color:purple,
    seconarybackground_color: slate_grey,
    background_color:black,
    button_color:purple,
    text_color:white,
    placeholder_color:silver,
    mode:"dark"
}