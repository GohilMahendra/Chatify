import { fireEvent, render, screen} from "@testing-library/react-native"
import { ThemeProvider } from "../../../src/globals/ThemeProvider"
import MediaViewer from "../../../src/components/chat/MediaViewer"

describe("Testing Media viewer for images",()=>{
    render(
        <ThemeProvider>
            <MediaViewer
            onClose={jest.fn()}
            type="image/png"
            uri="MOCK_IMAGE_URL"
            key={"key"}
            />
        </ThemeProvider>
    )

    it("image should be shown as provided into props",()=>{
        const image_viewer = screen.getByTestId("image_viewer")
        expect(image_viewer.props.source).toEqual({
            uri:"MOCK_IMAGE_URL"
        })
    })
})
describe("Testing Media viewer for Video",async()=>{
    render(
        <ThemeProvider>
            <MediaViewer
            onClose={jest.fn()}
            type="video/mp4"
            uri="MOCK_VIDEO_URL"
            key={"key"}
            />
        </ThemeProvider>
    )

    it("image should be shown as provided into props",()=>{
        const video_viewer = screen.getByTestId("video_viewer")
        fireEvent(video_viewer,"onLoad",{
            duration:60
        })
        fireEvent(video_viewer,"onProgress",{
            currentTime: 2
        })
        fireEvent(video_viewer,"onEnd")
    })
})