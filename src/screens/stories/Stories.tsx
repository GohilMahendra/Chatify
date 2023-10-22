import  React,{useState} from 'react';
import { Text,View,FlatList,TouchableOpacity,Image } from 'react-native';
import UseTheme from '../../globals/UseTheme';
export type StoryType =
{
    id:string,
    user_image: string,
    user_name: string,
    no_of_stories: number
}
const Stories = () =>
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
    return(
        <View style={{
            flex:1,
            backgroundColor: theme.background_color
        }}>
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
        </View>
    )

}
export default Stories
