import { render,act,screen,waitFor, fireEvent } from "@testing-library/react-native";
import React from 'react'
import { ThemeProvider } from "../../../src/globals/ThemeProvider";
import SignIn from "../../../src/screens/auth/SignIn";
import { Provider } from "react-redux";
import store from "../../../src/redux/store";

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

const mockGet = jest.fn();
const mockCollection = jest.fn(() => ({
  doc: jest.fn(() => ({
    get: mockGet,
  })),
}));

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    collection: mockCollection,
  })),
}));
describe("Sign Up flow test",()=>{
 

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
    mockGet.mockResolvedValueOnce({
      data: () => ({
        bio: 'fake bio',
        email: 'fake_email',
        user_name: 'fake_user_name',
        name: 'full name',
        picture: 'fake_picture_url',
      }),
      id: 'fake_id',
      exists: true,
    });
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
  it("I can submit the details and sign In will Fail",async()=>
  {
    //assess
    const btn_signIn = screen.getByTestId("btn_signIn")
    mockGet.mockRejectedValue("Error Username Alraedy Exist !!")
    // act
    await act(async()=>{
      fireEvent.press(btn_signIn)
    })
    // error text should show
    const text_error = screen.getByTestId("txt_error")
    expect(text_error).toBeDefined()
  })


})
