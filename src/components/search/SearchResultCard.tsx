import React from "react";
import { TouchableOpacity,Image,Text,View,StyleSheet} from "react-native";
import UseTheme from "../../globals/UseTheme";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { chatStackParams } from "../../navigation/ChatStackNavigation";
import { UserResult } from "../../types/UserTypes";

export type SearchResultPropType =
{
    result: UserResult
}

const SearchResultCard = (props:SearchResultPropType) =>
{
    const {result} = props
    const { theme } = UseTheme()
    const navigation = useNavigation<NavigationProp<chatStackParams,"FindChat">>()
    return(
        <TouchableOpacity 
        testID={"btn_navigateTochat"}
        onPress={()=>navigation.navigate("Chat",result)}
        style={[styles.btnNavigate,{
            backgroundColor: theme.seconarybackground_color
        }]}>
            <Image
            style={styles.imageUser}
            source={{uri:result.picture}}
            />
            <View style={{
                marginLeft:20,
            }}>
                <Text style={[styles.textName,{
                    color: theme.text_color
                }]}>
                    {result.name}
                </Text>
                <Text style={[styles.textUserName,{
                    color: theme.text_color
                }]}>
                    {result.user_name}
                </Text>
            </View>
        </TouchableOpacity>
    )

}
export default SearchResultCard
const styles = StyleSheet.create({
    btnNavigate:
    {
        margin:20,
        padding:10,
        flexDirection:"row",
        borderRadius:20,
        alignItems:"center"
    },
    imageUser:
    {
        height:50,
        width:50,
        borderRadius:50
    },
    textName:
    {
        fontSize:18,
        fontWeight:"bold"
    },
    textUserName:
    {
        fontSize:15,
        fontWeight:"400"
    }
})