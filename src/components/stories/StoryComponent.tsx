import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import {TouchableOpacity,Image} from "react-native";
import { chatStackParams } from "../../navigation/ChatStackNavigation";
import { storyStackParams } from "../../navigation/StoryStackNavigation";
import { StoryUser } from "../../types/StoryTypes";
import UseTheme from "../../globals/UseTheme";

type StoryUserProps=
{
    story: StoryUser
}

const StoryComponent = (props:StoryUserProps) =>
{
    const {story} = props
    const {theme} = UseTheme()
    const navigation = useNavigation<NavigationProp<storyStackParams,"StoryViewer">>()
    return(
        <TouchableOpacity
        onPress={()=>navigation.navigate("StoryViewer",{user_id:story.id})}
        style={{
           padding:3,
           borderRadius:70,
           borderColor: theme.primary_color,
           borderWidth:2,
          // flexDirection:"row",
           marginHorizontal:10
        }}
        >
            <Image
            resizeMode='contain'
            source={{uri:story.picture}}
            style={{
                height:70,
                width:70,
                borderRadius:70,
            }}
            />
        </TouchableOpacity>
    )
}
export default StoryComponent