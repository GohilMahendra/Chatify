import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native"
import { Provider } from "react-redux"
import store from "../../../src/redux/store"
import Stories from "../../../src/screens/stories/Stories"

const mockNavigate =jest.fn()
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'), 
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: jest.fn(),
      addListener: jest.fn((event, callback) => {
        if (event === 'focus') {
          // Simulate the 'focus' event
          callback();
        }
      }),
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

mockCollection.mockReturnValueOnce({
  get: jest.fn().mockResolvedValue({
    docs:[{
      data:()=>({count: 1}),
      id:"fake_firestore_user_id",
      exists:true
    }]
  })
}).mockReturnValueOnce({
  doc: jest.fn().mockReturnValueOnce({
    get: jest.fn().mockResolvedValue({
      id:"fake_firestore_user_id",
      exists:true,
      data:()=>({
        bio:"bio",
        email:"fake@gmail.com",
        picture:"picture_url",
        user_name:"user_name",
        name:"fake name"
      })
    })
  })
}).mockReturnValueOnce({
  doc: jest.fn().mockReturnValueOnce({
    collection: jest.fn().mockReturnValue({
      doc: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({
          exists: true
        })
      })
    })
  })
}).mockReturnValueOnce({
  doc: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({
         docs:[{
          id:"fake_story_id",
          exists: true,
          data:()=>({
            mediaUrl: "fake_url",
            caption: "fake_caption",
            mime: "video/mp4",
            timestamp: "fake_timeStamp",
          })
         }]
        })
    })
  })
})

// mockReactNativeFirestore({
//   database:{
//     users:[{
//       id:"fake_user_id",
//       bio:"bio",
//       name:"mahendra gohil",
//       picture:"fake_image_url",
//       user_name:"user_name",
//       email:"fake@gmail.com"
//     }],
//     stories:[{
//       id:"fake_user_id",
//       count:2,
//       _collections:{
//         userStories:[{
//           id:"story_id",
//           mediaUrl:"media_path",
//           timestamp:"",
//           mime:"image/jpeg",
//           caption:"caption"
//         }]
//       }
//     }]
//   }
// })
jest.mock("@react-native-firebase/auth", () => {
    return () => ({
      currentUser:{
        uid:"fake_current_uid"
      }
    });
  });


describe("story tab screen",()=>{
  beforeAll(()=>{
    jest.useFakeTimers()
  })
  beforeEach(async () => {
    await waitFor(async()=>{
      render(
        <Provider store={store}>
          <Stories />
        </Provider>
      );
    })
  });
    it("It will show stories from api",async()=>{
      const flatList = screen.getByTestId("list_stories")
      expect(flatList.props.data.length).toBe(1)
    })

    it("I can open The image picker for create New story",()=>{
      const picker_button = screen.getByTestId("btn_openPicker")
      fireEvent(picker_button,"press")
    })
})