import { fireEvent, render, screen } from "@testing-library/react-native"
import ChatComponent from "../../../src/components/chat/ChatComponent"

jest.mock('@react-native-firebase/auth', () => {
    return () => ({
      currentUser: {
        uid: 'test_userd_id',
      },
    });
  });
describe("chat component for Current user chat with image",()=>{

    beforeEach(()=>{
        render(
            <ChatComponent
            message={{
                fileType:"image/png",
                fileUrl:"fake_url_image",
                id:"test_messag_id",
                isRead: false,
                text: "test text",
                thumbnail:null,
                timestamp:"2023-11-03T15:20:16.056Z",
                user_id:"test_userd_id",
                user_image:"test_image_url",
                user_name:"test user_name"
            }}
            onMediaPress={jest.fn()}
            />
        ) 
    })
    
    it("text should be rendered as per given in props",()=>{
        const text_messageText = screen.getByTestId("text_messageText")
        expect(text_messageText.children[0]).toBe("test text")
    })

    it("I can press on media for preview",()=>{
        const btn_imageMedia = screen.getByTestId("btn_imageMedia")
        fireEvent(btn_imageMedia,"press")
    })
})
describe("chat component for Current user chat with video",()=>{

    beforeEach(()=>{
        render(
            <ChatComponent
            message={{
                fileType:"video/mp4",
                fileUrl:"fake_url_video",
                id:"test_messag_id",
                isRead: false,
                text: "test text",
                thumbnail:"fake_thumbnail_url",
                timestamp:"2023-11-03T15:20:16.056Z",
                user_id:"test_userd_id",
                user_image:"test_image_url",
                user_name:"test user_name"
            }}
            onMediaPress={jest.fn()}
            />
        ) 
    })
    
    it("text should be rendered as per given in props",()=>{
        const text_messageText = screen.getByTestId("text_messageText")
        expect(text_messageText.children[0]).toBe("test text")
    })

    it("I can press on media for preview of video",()=>{
        const btn_videoMedia = screen.getByTestId("btn_videoMedia")
        fireEvent(btn_videoMedia,"press")
    })
})
describe("chat component for sender user chat with image",()=>{

    beforeEach(()=>{
        render(
            <ChatComponent
            message={{
                fileType:"image/png",
                fileUrl:"fake_url_image",
                id:"test_messag_id",
                isRead: false,
                text: "test text",
                thumbnail:null,
                timestamp:"2023-11-03T15:20:16.056Z",
                user_id:"sender_user_id",
                user_image:"test_image_url",
                user_name:"test user_name"
            }}
            onMediaPress={jest.fn()}
            />
        ) 
    })
    
    it("text should be rendered as per given in props",()=>{
        const text_senderMessage = screen.getByTestId("text_senderMessage")
        expect(text_senderMessage.children[0]).toBe("test text")
    })

    it("I can press on media for preview",()=>{
        const btn_senderMediaPress = screen.getByTestId("btn_senderMediaPress")
        fireEvent(btn_senderMediaPress,"press")
    })
})
describe("chat component for sender user chat with video",()=>{
    beforeEach(()=>{
        render(
            <ChatComponent
            message={{
                fileType:"video/mp4",
                fileUrl:"fake_url_video",
                id:"sender_message_id",
                isRead: false,
                text: "test text",
                thumbnail:"fake_thumbnail_url",
                timestamp:"2023-11-03T15:20:16.056Z",
                user_id:"sender_user_id",
                user_image:"test_image_url",
                user_name:"test user_name"
            }}
            onMediaPress={jest.fn()}
            />
        ) 
    })
    
    it("text should be rendered as per given in props",()=>{
        const text_senderMessage = screen.getByTestId("text_senderMessage")
        expect(text_senderMessage.children[0]).toBe("test text")
    })

    it("I can press on media for preview of video",()=>{
        const btn_senderMediaVideo = screen.getByTestId("btn_senderMediaVideo")
        fireEvent(btn_senderMediaVideo,"press")
    })
})
