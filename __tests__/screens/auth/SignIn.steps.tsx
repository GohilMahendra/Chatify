import { render,act,screen,waitFor, fireEvent } from "@testing-library/react-native";

import React, { ReactNode, ReactPortal } from 'react'
import { ThemeProvider } from "../../../src/globals/ThemeProvider";
import SignIn from "../../../src/screens/auth/SignIn";
import { Provider } from "react-redux";
import store,{ useAppDispatch } from "../../../src/redux/store";
import firestore from "@react-native-firebase/firestore";
const mockNavigate =jest.fn()
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'), 
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: jest.fn(),
    }),
  }));

jest.mock("../../../src/globals/utilities",()=>({
  getImageUrl: jest.fn().mockReturnValue("fake_image_url_from_google_storage")
}))
 
  jest.mock("@react-native-firebase/auth", () => {
    const signInWithEmailAndPassword = jest.fn().mockResolvedValue({
      user:{
        uid:"fake_uid"
      }
    });
    return () => ({
      signInWithEmailAndPassword,
    });
  });


describe("Sign Up flow test",()=>{
  beforeAll(()=>{
    jest.mock('@react-native-firebase/firestore', () => {
      const mFirestore = {
        collection: jest.fn(() => ({
          doc: jest.fn(() => ({
            get: jest.fn(async () => {
              return {
                data: () => ({
                  bio:"fake bio",
                  email:"fake_email",
                  user_name: "fake_user_name",
                  name:"full name",
                  picture:"fake_picture_url"
                }),
                id:"fake_id",
                exists: true
              };
            }),
          })),
        })),
      };
      return () => mFirestore;
    });  
  })

  beforeEach(() => {
     render(
      <Provider store={store}>
         <ThemeProvider>
        <SignIn/>
      </ThemeProvider>
      </Provider>
    );
  });
  it('I can add userName into this', async () =>{
    const userName = screen.getByTestId("input_email")
    fireEvent.changeText(userName,"mahendra_gohil")
    expect(userName.props.value).toBe("mahendra_gohil")
  })
 
  it('I can add password into this', async () =>{
    const password = screen.getByTestId("input_password")
    fireEvent.changeText(password,"King@123")
    expect(password.props.value).toBe("King@123")
  })
  it("I can submit the details and sign In will succeed",async()=>
  {
    const btn_signIn = screen.getByTestId("btn_signIn")
   
    await act(async()=>{
      fireEvent.press(btn_signIn)
    })

    await waitFor(()=>{
      expect(mockNavigate).toHaveBeenCalled()
    })
  })

  it("I can go to forgot Password screen",()=>{
    const forgot_btn = screen.getByTestId("btn_navigateForgotPassword")
    mockNavigate.mockClear()
    fireEvent(forgot_btn,"press")
    expect(mockNavigate).toHaveBeenCalledWith("ForgotPassword")
  })

  it("I can go to Sign Up screen If new Account",()=>{
    const Signup_btn = screen.getByTestId("btn_navigateSignUp")
    mockNavigate.mockClear()
    fireEvent(Signup_btn,"press")
    expect(mockNavigate).toHaveBeenCalledWith("SignUp")
  })

})

describe("Sign Up flow Negative Scenario",()=>{
  beforeEach(()=>{
    render(
      <Provider store={store}>
         <ThemeProvider>
        <SignIn/>
      </ThemeProvider>
      </Provider>
    )
  })
  beforeAll(()=>{
    jest.mock('@react-native-firebase/firestore', () => {
      const mFirestore = {
        collection: jest.fn(() => ({
          doc: jest.fn(() => ({
            get: jest.fn(async()=>{
              throw new Error('Firestore get operation failed');
            })
          })),
        })),
      };
      return () => mFirestore;
    });  
  })
  afterAll(()=>{
    jest.unmock("@react-native-firebase/firestore")
  })

  it("If case of Inavalid creantial Api will throw error",()=>{

  })


})
