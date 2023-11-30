import { Provider } from "react-redux"
import store from "../../../src/redux/store"
import CreateStory from "../../../src/screens/stories/CreateStory"
import { act, fireEvent, render, screen } from "@testing-library/react-native"
import firestore from "@react-native-firebase/firestore";

jest.mock("react-native-video",()=>"video")
const mockNavigate =jest.fn()
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'), 
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: jest.fn(),
    }),
    useRoute:()=>({
        params:{
            uri:"fake_media_uri",
            type:"video/mp4"
        }
    })
  }));
  const mockDoc = {
    exists: false,
  };

  const mockSet = jest.fn().mockResolvedValueOnce({});
  const mockAdd = jest.fn().mockResolvedValueOnce({});

  const mockCollection = jest.fn()
  mockCollection.mockReturnValueOnce({
    doc: jest.fn().mockReturnValueOnce({
      get: jest.fn().mockResolvedValueOnce(mockDoc),
      set: mockSet,
      collection: jest.fn().mockReturnValueOnce({
        add: jest.fn()
      })
    }),
    add: mockAdd,
  });


  jest.mock('@react-native-firebase/firestore', () => {
  return {
    __esModule: true,
    default:jest.fn().mockImplementation(() => ({
      collection: mockCollection,
    })),
    FieldValue:{
      increment: jest.fn()
    }
  };
  });


  jest.mock("@react-native-firebase/auth", () => {
    return () => ({
      currentUser:{
        uid:"fake_current_uid"
      }
    });
  });
describe("create story",()=>{
    beforeEach(()=>
    {
       render(
        <Provider store={store}>
         <CreateStory/>
        </Provider>
       )
    }
    )
    it("I can preview the media selected",()=>{
        const video_preview = screen.getByTestId("video_preview")
        expect(video_preview).toBeDefined()
    })
    it("I can add caption to current story",()=>{
        const caption_input = screen.getByTestId("input_caption")
        fireEvent(caption_input,"changeText","story caption ...")
        expect(caption_input.props.value).toBe("story caption ...")
    })
    it("I can upload story to firebase",async()=>{
        const btn_upload = screen.getByTestId("btn_upload")
        await act(async()=>{
            fireEvent(btn_upload,"press")
        }) 

    })
})