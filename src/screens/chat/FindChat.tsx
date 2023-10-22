import  React,{useState,useEffect} from 'react';
import { View,Text,SafeAreaView,Image,TextInput,Dimensions,TouchableOpacity,FlatList} from 'react-native';
import UseTheme from '../../globals/UseTheme';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { User, UserResult } from '../../types/UserTypes';
const {height,width} = Dimensions.get("window")
const FindChat = () =>
{
    const {theme} = UseTheme()
    const [search,setSearch] = useState<string>("")
    const [results,setResults] = useState<UserResult[]>([])

    const getImageUrl = async(imagePath:string) =>
    {
        try
        {
            const ref = storage().ref(imagePath)
            const imageUrl = await ref.getDownloadURL()
            return imageUrl
        }
        catch(err)
        {
            console.log(err)
        }
    }

    const getUserByName = async(searchString: string)=>
    {
        try
        {
            const usersCollection = firestore().collection("users")
            const queryByUsername = usersCollection
            .where('user_name', '>=', searchString)
            .where('user_name', '<=', searchString + '\uf8ff')
            .get();
      
          // Create a query to search for names matching the query
          const queryByName = usersCollection
            .where('name', '>=', searchString)
            .where('name', '<=', searchString + '\uf8ff')
            .get();
      
          // Execute both queries and retrieve the results
          const [queryByUsernameSnapshot, queryByNameSnapshot] = await Promise.all([
            queryByUsername,
            queryByName,
          ]);
      
          const users:UserResult[]= [];
      
          for (const doc of queryByUsernameSnapshot.docs) {
            const userData = doc.data() as Omit<UserResult, "id">;
            const imageUrl = await getImageUrl(userData.picture) || "";
            users.push({
              ...userData,
              picture: imageUrl,
              id: doc.id,
            });
          }
          for (const doc of queryByNameSnapshot.docs) {
            const userData = doc.data() as Omit<UserResult, "id">;
            const imageUrl = await getImageUrl(userData.picture) || "";
            users.push({
              ...userData,
              picture: imageUrl,
              id: doc.id,
            });
          }

        
      
          // Filter unique users (in case some users matched both queries)
          let uniqueUsers:UserResult[] = []
          const userlist = Array.from(new Set(users.map((user:UserResult) => user.id))).map((id) => {
            return users.find((user:UserResult) => user.id === id);
          }) 
          console.log(userlist,"found this list of users")
          uniqueUsers = userlist!=undefined ? userlist : []
          setResults(uniqueUsers)
        }
        catch(err)
        {
            console.log(err)
        }

    } 
    const renderResults = (item:UserResult,index:number)=>
    {
        return(
            <TouchableOpacity style={{
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