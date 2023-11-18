import { render } from "@testing-library/react-native"
import ChatStackNavigator from "../../src/navigation/ChatStackNavigation"
import {  } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

jest.mock("@react-navigation/native-stack",()=>{
    return{
        createNativeStackNavigator: jest.fn(),
    }
})
describe("Testing Chat Stack Navigation",()=>{
    beforeAll(()=>{
        render (
        <NavigationContainer>
            <ChatStackNavigator/>
        </NavigationContainer>
        )
    })
    it("should render correctly",()=>{

    })
})