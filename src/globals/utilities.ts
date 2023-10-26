import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

export const getImageUrl = async(imageRef:string) =>
{
    const storageRef = storage().ref(imageRef)
    const imageUrl = await storageRef.getDownloadURL()
    return imageUrl
}