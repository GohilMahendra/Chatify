import storage from "@react-native-firebase/storage";

export const getImageUrl = async(imageRef:string) =>
{
    if(imageRef=="")
    return ""

    const storageRef = storage().ref(imageRef)
    const imageUrl = await storageRef.getDownloadURL()
    return imageUrl
}

export const uploadImage = async(uri:string , path:string)=>
{
    try
    {
    const ref = storage().ref(path)
    await ref.putFile(uri)
    }
    catch(err)
    {
        console.log(err)
    }
}

export const formatTimestamp=(timestamp: number): string =>{
    const now = new Date();
    const messageDate = new Date(timestamp);
  
    const timeDifference = now.getTime() - messageDate.getTime();
    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);
  
    if (secondsDifference < 60) {
      return `${secondsDifference}s ago`;
    } else if (minutesDifference < 60) {
      return `${minutesDifference}m ago`;
    } else if (hoursDifference < 24) {
      return `${hoursDifference}h ago`;
    } else if (daysDifference < 7) {
      return `${daysDifference}d ago`;
    } else {
      const dd = String(messageDate.getDate()).padStart(2, '0');
      const mm = String(messageDate.getMonth() + 1).padStart(2, '0'); // January is 0!
      const yy = messageDate.getFullYear().toString().substr(-2);
      return `${dd}/${mm}/${yy}`;
    }
}

export const checkEmail = ( email: string) =>
{
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
}

export const checkEmptyField = (field:string) =>
{
    return field.trim().length == 0
}

export const checkPassword = ( password: string) =>
{
    if(password == "")
    return false
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()-_+=]).{8,}$/;
    return passwordRegex.test(password);
}