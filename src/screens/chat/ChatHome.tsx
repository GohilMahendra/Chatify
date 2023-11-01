import  React, { useState ,useEffect} from 'react';
import { StyleSheet,View,SafeAreaView, Image , FlatList, TouchableOpacity} from "react-native";
import UseTheme from '../../globals/UseTheme';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { white } from '../../globals/Colors';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { chatStackParams } from '../../navigation/ChatStackNavigation';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../redux/store';
import ChatCard from '../../components/chat/ChatCard';
import Greetings from '../../components/chat/Greetings';
import { fetchChatUsers } from '../../redux/slices/MessagesSlice';

const Home = () =>
{
    const {theme} = UseTheme()
    const navigation = useNavigation<NavigationProp<chatStackParams,"ChatHome">>()
    const user = useSelector((state:RootState)=>state.user.user)
    const messages = useSelector((state:RootState)=>state.messages.chatUsers)
    const loading = useSelector((state:RootState)=>state.messages.chatUsersLoading)
    const error = useSelector((state:RootState)=>state.messages.chatUsersErr)
    const dispatch = useAppDispatch()
    const getMessages = async() =>
    {
       dispatch(fetchChatUsers(""))
    }

    useEffect(()=>{
       const subscription =  navigation.addListener("focus",async()=>{
            getMessages()
        })
    },[])

    return(
        <SafeAreaView
        style={styles.container}
        >
            <View style={{
                flex:1,
                backgroundColor: theme.background_color
            }}>
                {/* user greetings starts*/}
                <Greetings
                user={user}
                />
                {/* user greetings end */}
               {/* unread message section starts */}
               <View style={styles.listContainer}>
                <FlatList
                data={messages}
                renderItem={({item,index})=>{
                    return(
                      <ChatCard
                      chat={item}
                      />
                    )
                }}
                />
               </View>
               {/* unread messafe section ends */}
            </View>
            <TouchableOpacity 
            onPress={()=>navigation.navigate("FindChat")}
            style={[styles.btnFindChat,{
                backgroundColor:theme.primary_color,
            }]}>
                <FontAwesome5
                name='feather'
                size={30}
                style={styles.iconFindChat}
                color={white}
                />
            </TouchableOpacity>
        </SafeAreaView>
    )

}
export default Home
const styles = StyleSheet.create({
    container:
    {
        flex:1,
    },
    listContainer:
    {
        padding:20
    },
    btnFindChat:
    {
        position:"absolute",
        right:10,
        bottom:50,
        borderRadius:70,
        height:70,
        justifyContent:"center",
        alignItems:"center",
        width:70
    },
    iconFindChat:
    {
        elevation:5
    }

})