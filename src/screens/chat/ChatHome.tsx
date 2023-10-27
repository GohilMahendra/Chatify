import  React, { useState ,useEffect} from 'react';
import { Text,View,SafeAreaView, Image , FlatList, TouchableOpacity} from "react-native";
import UseTheme from '../../globals/UseTheme';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { placeholder_image } from '../../globals/Data';
import { white } from '../../globals/Colors';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { chatStackParams } from '../../navigation/ChatStackNavigation';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Message, MessagePreview } from '../../types/MessageTypes';
import Auth, { firebase } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { UserResult } from '../../types/UserTypes';


const Home = () =>
{
    const {theme} = UseTheme()
    const navigation = useNavigation<NavigationProp<chatStackParams,"ChatHome">>()
    const user = useSelector((state:RootState)=>state.user.user)
    const [messages,setMessages] = useState<MessagePreview[]>([])

    const getMessages = async() =>
    {
        const current_user_id = Auth().currentUser?.uid
        console.log(current_user_id)
        const messageRef =await firestore().collection("messages").get()
        console.log(messageRef)
           const snapshotdocs:any = []
            console.log(snapshotdocs)
            for(const doc of snapshotdocs)
            {
                const id = doc.id
                const userResponse = await firestore().collection("messages").doc(current_user_id).collection("groups").doc(id).get()
                const user_id = userResponse.id
                const user_data = userResponse.data() as Omit<UserResult,"id">
                const user = {id:user_id,...user_data} as UserResult
                console.log(user)
                const lastMessageResponse = await firestore().collection("messages").doc(current_user_id).collection("groups").doc(id).collection("groupMessages").limit(1).get()
                const lastresponseid = lastMessageResponse.docs[0].id
                const lastresponseData = lastMessageResponse.docs[0].data() 
                const lastMessage = {id:lastresponseid,...lastresponseData} as Message
                console.log(lastMessage)
                const messagePreview:MessagePreview = 
                {
                    id: id,
                    lastMessage: lastMessage,
                    no_of_unread:0,
                    User: user
                }
                console.log(messagePreview)
            }
        
    }

    useEffect(()=>{
        getMessages()
    },[])

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
                    }}>{user.name}</Text>
                </View>
                <Image
                source={{uri:user.picture || placeholder_image}}
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
                                    source={{uri:item.User.picture}}
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
                                    }}>{item.User.name}</Text>
                                    <Text style={{
                                        fontSize:15,
                                        color: theme.text_color,
                                        marginLeft:20,
                                    }}>{item.lastMessage.text}</Text>
                                    </View>
                                </View>
                                <View style={{
                                    justifyContent:"space-between"
                                }}>
                                <Text style={{
                                    fontSize:15,
                                    color:theme.placeholder_color
                                }}>{item.lastMessage.timestamp}</Text>
                               
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
                                    }}>{item.no_of_unread}</Text>
                                
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