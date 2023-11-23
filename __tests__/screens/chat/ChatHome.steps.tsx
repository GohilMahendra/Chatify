import { render } from "@testing-library/react-native"
import { Provider } from "react-redux"
import store, { useAppDispatch } from "../../../src/redux/store"
import ChatHome from "../../../src/screens/chat/ChatHome"
import { fetchUserData } from "../../../src/redux/actions/UserActions";
import { docSnapType, docType } from "../../../src/types/Firebase.types";
import { User } from "../../../src/types/UserTypes";
import { Message } from "../../../src/types/MessageTypes";

const userResponse:docType<User>=
{
    data() {
        return{
            bio:"fake_bio",
            email:"fake_email@gmail.com",
            name:"fake name",
            picture:"fake_image_url",
            user_name:"fake_user_name"
        }
    },
    exists:true,
    id:"fake_firebase_id"
}


const mockGet = jest.fn();
const mockCollection = jest.fn(() => ({
  doc:jest.fn(()=>({
    get: mockGet
  }))
}));

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    collection: mockCollection,
  })),
}));

describe("Home Screen for Chats",()=>{
    // setting up user for persistence 
    beforeAll(()=>{
        mockGet.mockResolvedValue(userResponse)
        const dispatch = useAppDispatch()
        dispatch(fetchUserData("fake_user_id"))
    })
    beforeEach(()=>{
        render(
            <Provider store={store}>
                <ChatHome/>
            </Provider>
        )   
    })
})