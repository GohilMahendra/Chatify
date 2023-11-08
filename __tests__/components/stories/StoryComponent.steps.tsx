import { fireEvent, render, screen } from "@testing-library/react-native"
import StoryComponent from "../../../src/components/stories/StoryComponent";

const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'), 
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: jest.fn(),
    }),
  }));

describe("story user component for not viewed story",()=>{
    beforeEach(()=>{
        render(
            <StoryComponent
            story={{
                count:0,
                id:"firebase_id",
                isViewed: false,
                name:"mahendra gohil",
                picture:"mock_image_url",
                user_name:"user_name"
            }}
            />
        )
    })

    it("i can navigate to story viewer after pressing on component",()=>{
        const btn_navigate = screen.getByTestId("btn_goToStoryViewer")
        fireEvent(btn_navigate,"press")
        expect(mockNavigate).toHaveBeenCalledWith("StoryViewer",{user_id:"firebase_id"})
    })

})

describe("story user component for viewed story",()=>{
    beforeEach(()=>{
        render(
            <StoryComponent
            story={{
                count:0,
                id:"firebase_id",
                isViewed: true,
                name:"mahendra gohil",
                picture:"mock_image_url",
                user_name:"user_name"
            }}
            />
        )
    })

    it("it will have round border invisible as story viewed",()=>{
        const story_view_btn = screen.getByTestId("btn_goToStoryViewer")
        expect(story_view_btn.props.style.borderWidth).toBe(0)
    })
   
    it("i can navigate to story viewer after pressing on component",()=>{
        const btn_navigate = screen.getByTestId("btn_goToStoryViewer")
        fireEvent(btn_navigate,"press")
        expect(mockNavigate).toHaveBeenCalledWith("StoryViewer",{user_id:"firebase_id"})
    })

})