import { fireEvent, render,screen } from "@testing-library/react-native";
import ChatCard from "../../../src/components/chat/ChatCard";
import { ThemeProvider } from "../../../src/globals/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
const navigate  = jest.fn();
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'), 
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
  }));
describe("test UI update of Card",()=>{
    const { getByTestId,findByTestId } = render(
        <ThemeProvider>
            <ChatCard
             chat={{
                id:"chat_Id",
                lastMessage:{
                    fileType:"image/png",
                    fileUrl:"fake_url_image",
                    id:"test_messag_id",
                    isRead: false,
                    text: "test tesx",
                    thumbnail:null,
                    timestamp:"2023-11-03T15:20:16.056Z",
                    user_id:"test_userd_id",
                    user_image:"test_image_url",
                    user_name:"test user_name"
                },
                no_of_unread:0,
                User:{
                    bio:"bio test",
                    email:"test@gmail.com",
                    id:"test_user_id",
                    name:"test_user",
                    picture:"picture_url",
                    user_name:"test User Name"
                }
             }}
            />
        </ThemeProvider>
    )

    test("i can go to chat by pressing on it",async()=>{
        const btn_Navigate = getByTestId("btn_goToChat")
        fireEvent(btn_Navigate,"press")
        const navigate = useNavigation().navigate
        expect(navigate).toHaveBeenCalled()
    })
})
