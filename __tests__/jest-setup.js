
jest.mock("@react-native-firebase/auth",()=>{})
//jest.mock("@react-native-firebase/firestore",()=>{})
jest.mock("@react-native-firebase/storage",()=>{})
jest.mock("../src/globals/utilities",()=>({
    getImageUrl: jest.fn().mockReturnValue("fake_image_url_from_google_storage")
  }))
