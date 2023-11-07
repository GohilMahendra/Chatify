import { render, screen } from "@testing-library/react-native"
import PreviewImage from "../../../src/components/chat/PreviewImage"

describe("preview Image component..",()=>{
    const mock_image_url = "mock_image_url"
    render(
        <PreviewImage
        uri={mock_image_url}
        />
    )
    it("should render image with url give in props",()=>{
        const image = screen.getByTestId("image_preview")
        expect(image.props.source).toEqual({
            uri:mock_image_url
        })
    })
})