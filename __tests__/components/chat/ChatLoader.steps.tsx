import { render } from "@testing-library/react-native"
import { ThemeProvider } from "../../../src/globals/ThemeProvider"
import ChatLoader from "../../../src/components/chat/ChatLoader"


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