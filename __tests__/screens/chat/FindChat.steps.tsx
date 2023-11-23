import { fireEvent, render, screen } from "@testing-library/react-native"
import { Provider } from "react-redux"
import store from "../../../src/redux/store"
import FindChat from "../../../src/screens/chat/FindChat"
import { User } from "../../../src/types/UserTypes";
import { act } from "react-test-renderer";
import { quarySnapType } from "../../../src/types/Firebase.types";
const mockNavigate =jest.fn()
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'), 
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: jest.fn(),
    }),
  }));
const mockedResponse:quarySnapType<User> = {
    exists:true,
    docs:[{
        data() {
            return{
                bio:"fake_bio",
                email:"fakeemail@gmail.com",
                name:"fake name",
                picture:"fake_image",
                user_name:"fake_username"
            }
        },
        exists:true,
        id:"fake_firebase_uid_1"
    },
    {
        data() {
            return{
                bio:"fake_bio",
                email:"fakeemail@gmail.com",
                name:"fake name",
                picture:"fake_image",
                user_name:"fake_username"
            }
        },
        exists:true,
        id:"fake_firebase_uid_2"
    }
]
}


const mockGet = jest.fn();
const mockCollection = jest.fn(() => ({
  where: jest.fn(()=>({
    where: jest.fn(()=>({
        get: mockGet
    }))
  }))
}));

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    collection: mockCollection,
  })),
}));

jest.mock("../../../src/globals/utilities",()=>({
    getImageUrl: jest.fn().mockReturnValue("fake_image_url_from_google_storage")
  }))
describe("Find Chat screen",()=>{
    beforeEach(()=>{
        render(
            <Provider store={store}>
                <FindChat/>
            </Provider>
        )
    })

    it("given I have empty list because of no serach term",()=>{
        const flatlist = screen.getByTestId("list_search")
        expect(flatlist.props.data.length).toBe(0)
        mockGet.mockResolvedValue(mockedResponse)
    })
    it("When I am trying to search user in list",async()=>{
        const text_search = screen.getByTestId("input_search")
        await act(()=>{
            fireEvent(text_search,"changeText","fak")
        })
    })
    it("Then I will have the user shown in list",()=>{
        const flatlist = screen.getByTestId("list_search")
        expect(flatlist.props.data.length).toBe(2)
    })
})

describe("Find Chat negative scenario",()=>{
    beforeEach(()=>{
        render(
            <Provider store={store}>
                <FindChat/>
            </Provider>
        )
    })
    it("when I try to search term",async()=>{
        mockGet.mockRejectedValue("Error")
        const text_search = screen.getByTestId("input_search")
        await act(()=>{
            fireEvent(text_search,"changeText","mah")
        })
    })
    it("Then for error condition will handeled gracefully",async()=>{
        const flatlist = screen.getByTestId("list_search")
        expect(flatlist.props.data.length).toBe(2)
    })
})