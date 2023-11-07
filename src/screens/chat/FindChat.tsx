import  React,{useState,useEffect} from 'react';
import { View,Text,SafeAreaView,
Image,TextInput,Dimensions,
TouchableOpacity,FlatList,StyleSheet} from 'react-native';
import UseTheme from '../../globals/UseTheme';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { User, UserResult } from '../../types/UserTypes';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../redux/store';
import { fetchUsers } from '../../redux/actions/SearchActions';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { chatStackParams } from '../../navigation/ChatStackNavigation';
import SearchResultCard from '../../components/search/SearchResultCard';
const {height,width} = Dimensions.get("window")
const FindChat = () =>
{
    const {theme} = UseTheme()
    const [search,setSearch] = useState<string>("")
    const results = useSelector((state:RootState)=>state.search.users)
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
          <SearchResultCard
          result={item}
          />
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
        <View style={styles.header}>
            <FontAwesome5
            onPress={()=>navigation.goBack()}
            name='angle-left'
            size={25}
            color={theme.text_color}
            />
            <TextInput
            value={search}
            onChangeText={(text:string)=>setSearch(text)}
            placeholder={"search ..."}
            placeholderTextColor={theme.placeholder_color}
            style={[styles.inputSearch,{
                backgroundColor:theme.seconarybackground_color,
                color:theme.text_color
            }]}
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
const styles = StyleSheet.create({
    header:
    {
        flexDirection:"row",
        padding:5,
        alignItems:"center"
    },
    inputSearch:
    {
        padding:10,
        width: width * 80/100,
        marginLeft: width * 5/100,
        borderRadius:10
    }

})