import { render } from "@testing-library/react-native"
import Greetings from "../../../src/components/chat/Greetings"
import { ThemeProvider } from "../../../src/globals/ThemeProvider"


describe("Greeting component ...",()=>{
    const {getByTestId} = render(
        <ThemeProvider>
             <Greetings
                user={{
                    bio:"test bio",
                    email:"test@gmail.com",
                    id:"firebase_id",
                    name:"Mahendra Gohil",
                    picture:"picture_test_url",
                    user_name:"mahendra_gohil"
                }}
        />
        </ThemeProvider>  
    )

    test("text name should have value from props",()=>{
        const text_name = getByTestId("text_name")
        expect(text_name.children[0]).toBe("Mahendra Gohil")
    })
})