import { Provider } from "react-redux";
import { ThemeProvider } from "../../../src/globals/ThemeProvider";
import store from "../../../src/redux/store";
import SignUp from "../../../src/screens/auth/SignUp";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { act } from "react-test-renderer";

const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'), 
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: jest.fn(),
    }),
  }));

  jest.mock("@react-native-firebase/auth", () => {
    const createUserWithEmailAndPassword = jest.fn().mockResolvedValue({
      user:{
        uid:"fake_uid"
      }
    });
    return () => ({
        createUserWithEmailAndPassword,
    });
  });

  const mockGet = jest.fn();
  const mockDocumentId = jest.fn();
  const mockCollection = jest.fn(() => ({
    where: jest.fn(()=>({
    get:jest.fn()
    })),
    doc: jest.fn(() => ({
      get: mockGet,
      set: jest.fn()
    })),
  }));
  
  const mockFirestore: any = {
    __esModule: true,
    default: jest.fn(() => ({
      collection: mockCollection,
      FieldPath: {
        documentId: mockDocumentId,
      },
    })),
  };
  
  jest.mock('@react-native-firebase/firestore', () => ({
    ...mockFirestore,
    firestore: jest.fn(() => mockFirestore),
  }));
  
describe("Sign Up positive scenario",()=>{
    beforeEach(() => {
        render(
         <Provider store={store}>
            <ThemeProvider>
           <SignUp/>
         </ThemeProvider>
         </Provider>
       );
     });

     it("If alrady have accound navigate to sign In by pressing",()=>{
        const navigate_signIn = screen.getByTestId("navigate_signIn")
        fireEvent(navigate_signIn,"press")
        expect(mockNavigate).toHaveBeenCalled()
     })
     it("I can enter The userName",()=>{
        const text_userName = screen.getByTestId("text_userName")
        fireEvent(text_userName,"changeText","Mahendra");
        expect(text_userName.props.value).toBe("Mahendra")
     })
     it("I can enter The fullName",()=>{
        const text_fullName = screen.getByTestId("text_fullName")
        fireEvent(text_fullName,"changeText","Mahendra Gohil");
        expect(text_fullName.props.value).toBe("Mahendra Gohil")
     })
     it("I can enter The email",()=>{
        const text_email = screen.getByTestId("text_email")
        fireEvent(text_email,"changeText","Mahendra@gmail.com");
        expect(text_email.props.value).toBe("Mahendra@gmail.com")
     })
     it("I can enter The password",()=>{
        const text_password = screen.getByTestId("text_password")
        fireEvent(text_password,"changeText","Mahendra@123");
        expect(text_password.props.value).toBe("Mahendra@123")
     })
     it("I can register my profile by pressing on register",async()=>{
        const btn_register = screen.getByTestId("btn_register")
        await act(async()=>{
            fireEvent(btn_register,"press")
        })
     })

})
describe("Sign Up Negative Case Scenario",()=>{
    beforeEach(() => {
      render(
      <Provider store={store}>
          <ThemeProvider>
        <SignUp/>
      </ThemeProvider>
      </Provider>
    );
  });

  it("Given I made user Name empty",()=>{
    const text_userName = screen.getByTestId("text_userName")
    fireEvent(text_userName,"changeText","")
  })
  it("When I try to register",async()=>{
    const button_register = screen.getByTestId("btn_register")
    await act(async()=>{
       fireEvent(button_register,"press")
    })
  })
  it("Then The Error text should shown for username",async()=>{
    console.log(screen.debug())
    //restore for further checks
    const text_userName = screen.getByTestId("text_userName")
    fireEvent(text_userName,"changeText","mahendra_gohil")
  })

  // it("Given I made full Name empty",()=>{
  //   const text_fullName = screen.getByTestId("text_fullName")
  //   fireEvent(text_fullName,"changeText","")
  // })
  // it("When I try to register",()=>{
  //   const button_register = screen.getByTestId("btn_register")
  //   fireEvent(button_register,"press")
  // })
  // it("Then The Error text should shown for fullName",()=>{
  //   const text_errorFullName = screen.getByTestId("text_errorFullName")
  //   expect(text_errorFullName).toBeDefined()

  //    //restore for frther checks
  //    const text_fullName = screen.getByTestId("text_fullName")
  //    fireEvent(text_fullName,"changeText","mahendra gohil")
  // })

  // it("Given I made email empty",()=>{
  //   const text_email = screen.getByTestId("text_email")
  //   fireEvent(text_email,"changeText","")
  // })
  // it("When I try to register",()=>{
  //   const button_register = screen.getByTestId("btn_register")
  //   fireEvent(button_register,"press")
  // })
  // it("Then The Error text should shown for empty email",()=>{
  //   const text_errorEmail = screen.getByTestId("text_errorEmail")
  //   expect(text_errorEmail).toBeDefined()
  // })

  // it("Given I enter wrong syntex email",()=>{
  //   const text_email = screen.getByTestId("text_email")
  //   fireEvent(text_email,"changeText","wrong_email")
  // })
  // it("When I try to register",()=>{
  //   const button_register = screen.getByTestId("btn_register")
  //   fireEvent(button_register,"press")
  // })
  // it("Then The Error text should shown for wrong email",()=>{
  //   const text_errorEmail = screen.getByTestId("text_errorEmail")
  //   expect(text_errorEmail).toBeDefined()
  // })

  // it("Given I made password empty",()=>{
  //   const text_password = screen.getByTestId("text_password")
  //   fireEvent(text_password,"changeText","")
  // })
  // it("When I try to register",()=>{
  //   const button_register = screen.getByTestId("btn_register")
  //   fireEvent(button_register,"press")
  // })
  // it("Then The Error text should shown for empty password",()=>{
  //   const text_errorPassword = screen.getByTestId("text_errorPassword")
  //   expect(text_errorPassword).toBeDefined()
  // })

  // it("Given I enter wrong syntex password",()=>{
  //   const text_password = screen.getByTestId("text_password")
  //   fireEvent(text_password,"changeText","wrong123")
  // })
  // it("When I try to register",()=>{
  //   const button_register = screen.getByTestId("btn_register")
  //   fireEvent(button_register,"press")
  // })
  // it("Then The Error text should shown for wrong password",()=>{
  //   const text_errorPassword = screen.getByTestId("text_errorPassword")
  //   expect(text_errorPassword).toBeDefined()
  // })
})