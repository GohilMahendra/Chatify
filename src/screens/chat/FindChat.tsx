import  React,{useState,useEffect} from 'react';
import { View,Text,SafeAreaView,Image,TextInput,Dimensions,TouchableOpacity,FlatList} from 'react-native';
import UseTheme from '../../globals/UseTheme';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { User, UserResult } from '../../types/UserTypes';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../redux/store';
import { fetchUsers } from '../../redux/slices/SearchSlice';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { chatStackParams } from '../../navigation/ChatStackNavigation';
import { launchImageLibrary } from 'react-native-image-picker';
const {height,width} = Dimensions.get("window")
const FindChat = () =>
{
    const {theme} = UseTheme()
    const [search,setSearch] = useState<string>("")
    const results = useSelector((state:RootState)=>state.search.users)
    console.log(results,"change in results")
    const loading = useSelector((state:RootState)=>state.search.loading)
    const navigation = useNavigation<NavigationProp<chatStackParams,"FindChat">>()
    const [selectedUrl,setSelectedUrl] = useState<{url:string,type:string} | null>(null)
    const dispatch = useAppDispatch()
    const getUserByName = async(searchString: string)=>
    {
      dispatch(fetchUsers(searchString))
    } 
    const renderResults = (item:UserResult,index:number)=>
    {
        return(
            <TouchableOpacity 
            onPress={()=>navigation.navigate("Chat",item)}
            style={{
                margin:20,
                backgroundColor: theme.seconarybackground_color,
                padding:10,
                flexDirection:"row",
                borderRadius:20,
                alignItems:"center"
            }}>
                <Image
                style={{
                    height:50,
                    width:50,
                    borderRadius:50
                }}
                source={{uri:item.picture}}
                />
                <View style={{
                    marginLeft:20,
                }}>
                    <Text style={{
                        fontSize:18,
                        fontWeight:"bold",
                        color: theme.text_color
                    }}>{item.name}</Text>
                    <Text style={{
                        fontSize:15,
                        fontWeight:"400",
                        color: theme.text_color
                    }}>{item.user_name}</Text>
                </View>
            </TouchableOpacity>
        )

    }
    useEffect(()=>{
        if(search=="")
        return
        
        getUserByName(search)
    },[search])
    return(
        <SafeAreaView style={{
            flex:1,
            backgroundColor: theme.background_color
        }}>
        {/* Header starts for chat */}
        <View style={{
            flexDirection:"row",
            padding:5
        }}>
            <FontAwesome5
            name='angle-left'
            size={30}
            color={theme.text_color}
            />
            <TextInput
            value={search}
            onChangeText={(text:string)=>setSearch(text)}
            placeholder={"search ..."}
            placeholderTextColor={theme.placeholder_color}
            style={{
                padding:10,
                backgroundColor:theme.seconarybackground_color,
                color:theme.text_color,
                width: width * 80/100,
                marginLeft: width * 5/100,
                borderRadius:10
            }}
            />
        </View>
        {/* Header ends for  chat */}
        <FlatList
        data={results}
        keyExtractor={(item)=>item.id}
        renderItem={({item,index})=>renderResults(item,index)}
        />
        </SafeAreaView>
    )


}
export default FindChat