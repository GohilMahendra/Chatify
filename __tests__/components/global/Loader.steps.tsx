import { render, screen } from "@testing-library/react-native"
import Loader from "../../../src/components/global/Loader"

describe("loader component",()=>{
    beforeEach(()=>{
        render(
            <Loader/>
        )
    })

    it("should render loader component correctly",()=>{
        const modal_loader = screen.getByTestId("modal_loader")
        expect(modal_loader).toBeTruthy()
    })
})