import { render, screen } from "@testing-library/react-native"
import { ThemeProvider } from "../../../src/globals/ThemeProvider"
import ImageChat from "../../../src/components/chat/ImageChat"

describe("testing preview image component for chat image",()=>{
     render(
        <ThemeProvider>
            <ImageChat
            type="image/png"
            uri="MOCK_IMAGE_URL"
            />
        </ThemeProvider>
    )

    test("image preview should have source as props provided",()=>
    {
        const image = screen.getByTestId("image_preview")
        expect(image.props.source).toEqual({
            uri:"MOCK_IMAGE_URL"
        })
    })
})
describe("testing preview image component for chat video",()=>{
    render(
        <ThemeProvider>
            <ImageChat
            type="video/mp4"
            uri="MOCK_VIDEO_URL"
            />
        </ThemeProvider>
    )

    test("image should have uri from props",()=>
    {
        const image =screen.getByTestId("image_preview")
        expect(image.props.source).toEqual({
            uri:"MOCK_VIDEO_URL"
        })
    })
    test("play icon should be there for case of video thumbnail",()=>
    {
        const icon_there =screen.getByTestId("icon_play")
        expect(icon_there).toBeTruthy()
    })
})