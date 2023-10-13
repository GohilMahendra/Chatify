import  React,{useState,useRef,useEffect} from 'react';
import { View,Text,Image,SafeAreaView,FlatList,Dimensions} from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import UseTheme from '../../globals/UseTheme';
import { placeholder_image } from '../../globals/Data';
const {height,width} = Dimensions.get("window")
export type Chat = 
{
    id: string,
    channel_id: string,
    user_id: string,
    text: string,
    user_name: string,
    user_image: string,
    image?:string,
}
const Chat  = () =>
{
    const {theme} = UseTheme()
    const current_user_id = "tanjiro_kamado"
    const [chats,setChats] = useState<Chat[]>([
        {
            channel_id:"inosuke_tanjiro_combined",
            id:'random_mesage_1',
            text:"hi !! kamado munjiro very ong message sending you peas ",
            user_id:"inosuke_hunter",
            user_image:placeholder_image,
            user_name:"Inosuke Hunter"
        },
        {
            channel_id:"inosuke_tanjiro_combined",
            id:'random_mesage_2',
            text:"hi !! inosuke",
            user_id:"tanjiro_kamado",
            user_image:"https://picfiles.alphacoders.com/631/631729.png",
            user_name:"Kamado Tanjiro"
        },
        {
            channel_id:"inosuke_tanjiro_combined",
            id:'random_mesage_3',
            text:"what is the problem with you it's tanjiro",
            user_id:"tanjiro_kamado",
            user_image:"https://picfiles.alphacoders.com/631/631729.png",
            user_name:"Kamado Tanjiro"
        },
        {
            channel_id:"inosuke_tanjiro_combined",
            id:'random_mesage_4',
            text:"hi !! kamado munjiro , I have very sad news for you as anime fan !!",
            user_id:"inosuke_hunter",
            user_image:placeholder_image,
            user_name:"Inosuke Hunter"
        },
        {
            channel_id:"inosuke_tanjiro_combined",
            id:'random_mesage_5',
            text:"gojjo got killed bro here is the image",
            user_id:"inosuke_hunter",
            user_image:placeholder_image,
            user_name:"Inosuke Hunter",
            image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3hEz0ncYpygzG2c8nQHMTFN_igIxzfh2WQA&usqp=CAU"
        },
        {
            channel_id:"inosuke_tanjiro_combined",
            id:'random_mesage_6',
            text:"His death was more painfull",
            user_id:"tanjiro_kamado",
            user_image:placeholder_image,
            user_name:"Tanjiro Kamado",
            image:"https://w0.peakpx.com/wallpaper/152/193/HD-wallpaper-jiraiya-sensei-aesthetic-anime-legend-manga-naruto-sky-uzumaki.jpg"
        },
       
    ])
    const flatListRef = useRef<FlatList<Chat> | null>(null)
    const renderMessage = ({item,index}:{item:Chat,index:number}) =>
    {
        return(
            item.user_id != current_user_id
            ?
            <View style={{
                margin:20,
                flexDirection:"row",
                alignItems:"center",
                maxWidth: width * .7
            }}>
                    <Image
                    source={{uri:item.user_image}}
                    style={{
                        height:30,
                        width:30,
                        borderRadius:30
                    }}
                    />
                    <View style={{
                        padding:10,
                        backgroundColor: theme.primary_color,
                        maxWidth: width * 0.6,
                        borderRadius:20
                    }}>
                        <Text style={{
                            color: theme.text_color
                        }}>{item.text}</Text>
                        {item.image && 
                        <Image
                        source={{uri:item.image}}
                        style={{
                           height:width * 0.6 - 10,
                           width: width* 0.6 - 10,
                           borderRadius:20,
                           alignSelf:'center',
                           marginVertical:10
                        }}
                        />
                        }
                    </View>
            </View>
            :
            <View style={{
                padding:10,
                margin:10,
                backgroundColor: theme.primary_color,
                maxWidth: width * 0.6,
                borderRadius:20,
                alignSelf:"flex-end"
            }}>
                <Text style={{
                    color: theme.text_color
                }}>{item.text}</Text>
                {item.image && 
                <Image
                //resizeMode='contain'
                source={{uri:item.image}}
                style={{
                    height:width * 0.6 - 10,
                    width: width* 0.6 - 10,
                    borderRadius:20,
                    alignSelf:'center',
                    marginVertical:10
                }}
                />
                }
            </View>

        )

    }
    useEffect(()=>{
      
    },[])
    return(
        <SafeAreaView style={{
            flex:1,
            backgroundColor:theme.background_color
        }}>
        {/* navigation header starts */}
        <View style={{
            flexDirection:"row",
          //  justifyContent:"space-between",
            paddingHorizontal:20,
            alignItems:"center",
            paddingVertical:10,
            borderBottomColor:theme.text_color,
            borderBottomWidth:1
        }}>
            <FontAwesome5
            name='chevron-left'
            size={25}
            color={theme.text_color}
            />
            <View style={{
                flexDirection:"row",
                marginLeft:20
            }}>
                <Image
                source={{uri:placeholder_image}}
                style={{
                    height:40,
                    width:40,
                    borderRadius:40
                }}
                />
                <Text style={{
                    color: theme.text_color,
                    fontSize:20,
                    fontWeight:"bold",
                    alignSelf:"center",
                    marginLeft:10
                }}>
                    Inosuke Hashibira !!
                </Text>
            </View>

        </View>
        {/* navigation header ends */}
        {/* chat section starts */}
        <FlatList
        ref={ref=>{flatListRef.current = ref}}
        data={chats}
        renderItem={({item,index})=>renderMessage({item,index})}
        keyExtractor={(item)=>item.id}
        />
        {/* chat section ends */}
        </SafeAreaView>
    )
}
export default Chat