import { fireEvent, render, screen } from "@testing-library/react-native"
import SearchResultCard, { SearchResultPropType } from "../../../src/components/search/SearchResultCard"
import {  } from "@react-navigation/native";

const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'), 
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: jest.fn(),
    }),
  }));

describe("search user result component",()=>{
    beforeEach(()=>{
        render(
            <SearchResultCard
            result={{
                bio:"bio string",
                email:"mock@email.com",
                id:"firebase_id",
                name:"mock name",
                picture:"mock_image_url",
                user_name:"mock_user_name"
            }}
            />
        )
    })

    it("i can navigate to chat screen after pressing on component",()=>{
        const btn_navigate = screen.getByTestId("btn_navigateTochat")
        fireEvent(btn_navigate,"press")
        expect(mockNavigate).toHaveBeenCalled()
    })

})