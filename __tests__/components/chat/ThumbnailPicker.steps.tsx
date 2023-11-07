import { act, fireEvent, render, screen } from "@testing-library/react-native"
import ThumbnailPicker from "../../../src/components/chat/ThumbnailPicker"
import { Slider } from "react-native-elements";
jest.mock("react-native-video",()=>"video")
jest.mock('react-native-view-shot', () => ({
    __esModule: true,
    captureRef: jest.fn(() => Promise.resolve('base64-encoded-image')),
  }));
  
describe("thumbnail picker component",()=>{
    const mock_video_url = "mock_video_url"
    const onSelectMock = jest.fn()
    const onCloseMock = jest.fn()
    const onThubnailMock = jest.fn()
    beforeEach(()=>{
        render(
            <ThumbnailPicker
            onClose={onCloseMock}
            onSelect={onSelectMock}
            onThubnail={onThubnailMock}
            videoUri={mock_video_url}
            />
        )
    })

    it("I can see the video in screen",async()=>{
        const video = screen.getByTestId("video")
        
        await act(()=>{
             fireEvent(video,"onLoad",{
                    duration:40
            })
        })
        await act(()=>{
            fireEvent(video,"onProgress",{
                currentTime:10
            })
        })
        await act(()=>{
            fireEvent(video,"onEnd")
        })
        expect(onThubnailMock).toHaveBeenCalled()
    })
    it("I can move slider to seek video time",()=>{
        const slider  = screen.UNSAFE_getByType(Slider)
        act(()=>{
            fireEvent(slider,"onSlidingComplete",10)
        })
       
    })

    it("I can send the selected video",()=>{
        const slider  = screen.getByTestId("btn_send")
        fireEvent(slider,"press")
        expect(onSelectMock).toHaveBeenCalled()
    })

    it("I can close the modal by pressing on close button",()=>{
        const close_button = screen.getByTestId("btn_close")
        fireEvent(close_button,"press")
        expect(onCloseMock).toHaveBeenCalled()
    })
})