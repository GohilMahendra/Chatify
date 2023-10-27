import { render , screen,waitFor, fireEvent } from "@testing-library/react-native";

import React, { ReactNode, ReactPortal } from 'react'
import { ThemeProvider } from "../../src/globals/ThemeProvider";
import SignIn from "../../src/screens/auth/SignIn";
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'), // Use the actual module for non-mocked functions
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      // Add other functions or properties you need for your test cases
    }),
  }));

describe("Sign Up flow test",()=>{
  let SignInComponent:any;


  beforeEach(() => {
    // Render the SignUp component before each test
    SignInComponent = render(
      <ThemeProvider>
        <SignIn/>
      </ThemeProvider>
    );
  });

  afterEach(() => {
    // Clean up the component after each test
    SignInComponent.unmount();
  });
  it('I can add userName into this', async () =>{
    const userName = SignInComponent.getByTestId("input_userName")
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