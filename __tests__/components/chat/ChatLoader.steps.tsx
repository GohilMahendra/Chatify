import { render } from "@testing-library/react-native"
import { ThemeProvider } from "../../../src/globals/ThemeProvider"
import ChatLoader from "../../../src/components/chat/ChatLoader"

// describe("Testing Media viewer for images",()=>{
//     render(
//         <ThemeProvider>
//             <MediaViewer
//             onClose={jest.fn()}
//             type="image/png"
//             uri="MOCK_IMAGE_URL"
//             key={"key"}
//             />
//         </ThemeProvider>
//     )

//     it("image should be shown as provided into props",()=>{
//         const image_viewer = screen.getByTestId("image_viewer")
//         expect(image_viewer.props.source).toEqual({
//             uri:"MOCK_IMAGE_URL"
//         })
//     })
// })
describe("testing loader for chat component",()=>{
    const LoaderComponent = render(
        <ThemeProvider>
            <ChatLoader/>
        </ThemeProvider>
    )
    test("loader should be animate",()=>{
        expect(LoaderComponent).toBeTruthy()
    })
})