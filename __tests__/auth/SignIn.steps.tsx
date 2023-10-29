import { render , screen,waitFor, fireEvent } from "@testing-library/react-native";

import React, { ReactNode, ReactPortal } from 'react'
import { ThemeProvider } from "../../src/globals/ThemeProvider";
import SignIn from "../../src/screens/auth/SignIn";
import { configureStore } from "@reduxjs/toolkit";
import { RootState } from "../../src/redux/store";
import { UserType } from "../../src/redux/slices/UserSlice";
import { Provider } from "react-redux";
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'), // Use the actual module for non-mocked functions
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      // Add other functions or properties you need for your test cases
    }),
  }));

  const initialState: UserType= 
  {
      loading: false,
      error: null,
      user:
      {
          bio:"",
          email:"",
          id:"",
          name:"",
          picture:"",
          user_name:""
      }
  }
  const store = configureStore({
    reducer: (state) => state,
    preloadedState: initialState,
  });
describe("Sign Up flow test",()=>{
  let SignInComponent:any;


  beforeEach(() => {
    // Render the SignUp component before each test
    SignInComponent = render(
      <Provider store={store}>
         <ThemeProvider>
        <SignIn/>
      </ThemeProvider>
      </Provider>
    );
  });

  it('I can add userName into this', async () =>{
    const userName = SignInComponent.getByTestId("input_email")
    fireEvent.changeText(userName,"mahendra_gohil")
    expect(userName.props.value).toBe("mahendra_gohil")
  })
 
  it('I can add password into this', async () =>{
    const password = SignInComponent.getByTestId("input_password")
    fireEvent.changeText(password,"King@123")
    expect(password.props.value).toBe("King@123")
  })
  it("I can submit the details",async()=>
  {
    const btn_signIn = SignInComponent.getByTestId("btn_signIn")
    fireEvent.press(btn_signIn)
  })

})