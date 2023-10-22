import  React, { useState } from 'react';
import { Text,View,SafeAreaView, Image , FlatList, TouchableOpacity} from "react-native";
import UseTheme from '../../globals/UseTheme';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { placeholder_image } from '../../globals/Data';
import { white } from '../../globals/Colors';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { chatStackParams } from '../../navigation/ChatStackNavigation';

export type Message = 
{
    id: string,
    user_image: string,
    user_name: string,
    last_message: string,
    unread_messages: number,
    date: string
}

const Home = () =>
{
    const {theme} = UseTheme()
    const navigation = useNavigation<NavigationProp<chatStackParams,"ChatHome">>()

    const [messages,setMessages] = useState<Message[]>([
        {
            id:"random_id1",
            date:"1 day",
            last_message:"let's go",
            unread_messages:4,
            user_image:"https://i.pinimg.com/736x/bc/27/6f/bc276ff73e30a5f50c493aeb685edb90.jpg",
            user_name:"Kakshi Hatake"
        },
        {
            id:"random_id2",
            date:"1 min",
            last_message:"let's go",
            unread_messages:1,
            user_image:"https://i.pinimg.com/736x/bc/27/6f/bc276ff73e30a5f50c493aeb685edb90.jpg",
            user_name:"Kakshi Hatake"
        },
        {
            id:"random_id3",
            date:"20 sec",
            last_message:"let's go here nis  asdb usdbsab hbb",
            unread_messages:2,
            user_image:"https://i.pinimg.com/736x/bc/27/6f/bc276ff73e30a5f50c493aeb685edb90.jpg",
            user_name:"Kakshi Hatake"
        }

    ])
    return(
        <SafeAreaView
        style={{
            flex:1,

        }}
        >
            <View style={{
                flex:1,
                backgroundColor: theme.background_color
            }}>
               <View style={{
                flexDirection:"row",
                padding:20,
                paddingVertical:10,
                justifyContent:"space-between",
                alignItems:"center"
               }}>
                <View>
                    <Text style={{
                        fontSize:20,
                        color: theme.text_color,
                        fontWeight:"bold"
                    }}>Good Morning</Text>
                    <Text style={{
                        fontSize:20,
                        color: theme.text_color,
                    }}>Inosuke !!</Text>
                </View>
                <Image
                source={{uri:placeholder_image}}
                style={{
                    height:50,
                    width:50,
                    borderRadius:50
                }}
                
                />
                

               </View> 
               {/* unread message section starts */}
               <View style={{
                padding:20
               }}>
                <FlatList
                data={messages}
                renderItem={({item,index})=>{
                    return(
                        <TouchableOpacity style={{
                            marginTop:10,
                            padding:10,
                            justifyContent:"center",
                            backgroundColor: theme.background_color,
                          //  elevation:5,
                            borderBottomColor:theme.placeholder_color,
                            borderBottomWidth:1,
                            borderRadius:15,
                            shadowColor:white,
                            shadowOffset:{
                                height:4,
                                width:2
                            }
                        }}>
                            <View style={{
                                flexDirection:"row",
                                justifyContent:"space-between"
                            }}>
                                <View style={{flexDirection:"row"}}>
                                    <Image
                                    source={{uri:item.user_image}}
                                    style={{
                                        height:40,
                                        width:40,
                                        borderRadius:40
                                    }}
                                    />
                                    <View>
                                    <Text style={{
                                        fontSize:18,
                                        color: theme.text_color,
                                        marginLeft:20,
                                        fontWeight:"bold"
                                    }}>{item.user_name}</Text>
                                    <Text style={{
                                        fontSize:15,
                                        color: theme.text_color,
                                        marginLeft:20,
                                    }}>{item.last_message.substring(0,30)}</Text>
                                    </View>
                                </View>
                                <View style={{
                                    justifyContent:"space-between"
                                }}>
                                <Text style={{
                                    fontSize:15,
                                    color:theme.placeholder_color
                                }}>{item.date}</Text>
                               
                                    <Text style={{
                                        color:white,
                                        backgroundColor:theme.primary_color,
                                       // padding:2,
                                        borderRadius:20,
                                        height:20,
                                        width:20,
                                        overflow:"hidden",
                                        textAlign:"center",
                                        textAlignVertical:"center"
                                    }}>{item.unread_messages}</Text>
                                
                                </View>
                            </View>


                        </TouchableOpacity>
                    )
                }}
                />
               </View>
               {/* unread messafe section ends */}
            </View>

            <TouchableOpacity 
            onPress={()=>navigation.navigate("FindChat")}
            style={{
                position:"absolute",
                right:10,
                bottom:50,
                backgroundColor:theme.primary_color,
                borderRadius:70,
                height:70,
                justifyContent:"center",
                alignItems:"center",
                width:70
            }}>
                <FontAwesome5
                name='feather'
                size={30}
                style={{
                    elevation:5
                }}
                color={white}
                />
            </TouchableOpacity>
        </SafeAreaView>
    )

}
export default Home