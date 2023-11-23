import { render } from "@testing-library/react-native"
import { Provider } from "react-redux"
import store from "../../../src/redux/store"
import Stories from "../../../src/screens/stories/Stories"
import { quarySnapType } from "../../../src/types/Firebase.types"
import { StoryUser } from "../../../src/types/StoryTypes"

const storyResponse:quarySnapType<Omit<StoryUser,"id","isViewed">>={
    exists: true,
    docs:[{
        data() {
            return{
                user_name:"fake_user_name",
                count:0,
                name:"fake_name",
                

            }
        },
    }]
}
const mockNavigate =jest.fn()
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'), 
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: jest.fn(),
    }),
  }));
jest.mock("react-native-image-picker",()=>({
    launchImageLibrary: jest.fn().mockResolvedValue({
        didCancel: false,
        assets:[{
            type:"image/jpg",
            uri:"fake_local_uri"
        }]
    })
}))
const mockGet = jest.fn();
const mockCollection = jest.fn();

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    collection: mockCollection,
  })),
}));

jest.mock("@react-native-firebase/auth", () => {
    return () => ({
      currentUser:{
        uid:"fake_current_uid"
      }
    });
  });

describe("story tab screen",()=>{
    beforeAll(()=>{
        mockCollection.mockImplementationOnce(() => ({
              get: mockGet,

          }))
    })
    beforeEach(()=>{
        render(
            <Provider store={store}>
                <Stories/>
            </Provider>
        )
    })    


})