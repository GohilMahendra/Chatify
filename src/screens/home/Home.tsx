import  React, { useState } from 'react';
import { Text,View,SafeAreaView, Image , FlatList, TouchableOpacity} from "react-native";
import UseTheme from '../../globals/UseTheme';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { placeholder_image } from '../../globals/Data';
import { white } from '../../globals/Colors';


export type StoryType =
{
    id:string,
    user_image: string,
    user_name: string,
    no_of_stories: number
}

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

    const [stories,setStories] = useState<StoryType[]>([
        {
            id:"random_id1",
            user_name:"Tanjiro Kamado",
            user_image:"https://picfiles.alphacoders.com/631/631729.png",
            no_of_stories:1
        },
        {
            id:"random_id2",
            user_name:"Hashirama Senju",
            user_image:"https://miro.medium.com/v2/resize:fit:1200/1*X2g32XQF5boSEUyc9h5ATg.jpeg",
            no_of_stories:4
        },
        {
            id:"random_id3",
            user_name:"Tobirama Senu",
            user_image:"https://staticg.sportskeeda.com/editor/2022/06/c0225-16563323160357.png?w=840",
            no_of_stories:1
        },
        {
            id:"random_id4",
            user_name:"Master Jiraiya",
            user_image:"https://w0.peakpx.com/wallpaper/152/193/HD-wallpaper-jiraiya-sensei-aesthetic-anime-legend-manga-naruto-sky-uzumaki.jpg",
            no_of_stories:1
        },
        {
            id:"random_id5",
            user_name:"Gojo sotaru",
            user_image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3hEz0ncYpygzG2c8nQHMTFN_igIxzfh2WQA&usqp=CAU",
            no_of_stories:1
        },
        {
            id:"random_id6",
            user_name:"kakashi Hatake",
            user_image:"https://i.pinimg.com/736x/bc/27/6f/bc276ff73e30a5f50c493aeb685edb90.jpg",
            no_of_stories:1
        }
])
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
               {/* story section starts */}
               <View style={{
                
               }}>
                <FlatList
                horizontal
                data={stories}
                showsHorizontalScrollIndicator={false}
                ListHeaderComponent={()=>{
                    return(
                        <TouchableOpacity style={{
                            height:70,
                            width:70,
                            justifyContent:"center",
                            alignItems:"center",
                            borderRadius:70,
                            borderColor:theme.placeholder_color,
                            borderWidth:1,
                            margin:10
                        }}>
                            <Text style={{
                                color: theme.placeholder_color,
                                fontWeight:"bold",
                                fontSize:18
                            }}>+</Text>
                        </TouchableOpacity>
                    )

                }}
                renderItem={({item,index})=>{
                    return(
                        <TouchableOpacity
                        
                        >
                            <Image
                            source={{uri:item.user_image}}
                            style={{
                                height:70,
                                width:70,
                                borderRadius:70,
                                margin:10
                            }}
                            />

                        </TouchableOpacity>
                    )
                }}
                >

                </FlatList>

               </View>
               {/* story section ends */}
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

            <TouchableOpacity style={{
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