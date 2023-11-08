import { render, screen } from "@testing-library/react-native"
import VideoPreview from "../../../src/components/stories/VideoPreview"

jest.mock("react-native-video",()=>"video")

describe("video preview component",()=>{
    beforeEach(()=>{
        render(
            <VideoPreview
            uri={"mock_video_url"}
            />
        ) 
    })

    it("should render video correctly",()=>{
        const video = screen.getByTestId("video_preview")
        expect(video.props.source).toEqual({
            uri:"mock_video_url"
        })
    })
})