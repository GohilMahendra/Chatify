import { render,act,screen,waitFor, fireEvent } from "@testing-library/react-native";

import React, { ReactNode, ReactPortal } from 'react'
import { ThemeProvider } from "../../../src/globals/ThemeProvider";
import SignIn from "../../../src/screens/auth/SignIn";
import { UserType } from "../../../src/redux/slices/UserSlice";
import { Provider } from "react-redux";
import store,{ useAppDispatch } from "../../../src/redux/store";
import { signInUser } from "../../../src/redux/actions/UserActions";
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'), // Use the actual module for non-mocked functions
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      // Add other functions or properties you need for your test cases
    }),
  }));

  // const initialState: UserType= 
  // {
  //     loading: false,
  //     error: null,
  //     user:
  //     {
  //         bio:"",
  //         email:"",
  //         id:"",
  //         name:"",
  //         picture:"",
  //         user_name:""
  //     },
  //     forgotLinkError:null,
  //     forgotLinkLoading: false,
  //     forgotLinkSuccess: false,
  //     signUpError: null,
  //     signUpLoading: false,
  //     signUpSuccess: false
  // }
  // const store = configureStore({
  //   reducer: (state) => state,
  //   preloadedState: initialState,
  // });


  const mockAuthUser = {
    "user": {
      "uid": "user-uid",
      "email": "user@example.com",
      "displayName": "John Doe",
      "photoURL": "https://example.com/profile.jpg",
      "emailVerified": false,
    },
    "credential": {
      "providerId": "password",
      "signInMethod": "password",
    },
    "operationType": "signIn",
    "additionalUserInfo": {
      "providerId": "password",
      "isNewUser": true,
      "username": "johndoe",
      "profile": {
        "name": "John Doe",
        "email": "user@example.com"
      },
      // ...other additional user info
    }
  }
  
  const mockFulfilledAction = {
    type: signInUser.fulfilled.type,
    payload: {
      // Mock the payload as needed for your test
      user: {
        uid: 'user-uid',
        email: 'user@example.com',
        displayName: 'John Doe',
      },
    },
  };
  const mockLodervalue = {
    type: signInUser.pending.type,
  };
  const mockRejectedValue = {
    type: signInUser.rejected.type,
    payload:"error string"
  };

  jest.mock("../../../src/redux/actions/UserActions",()=>{
    const allMethods = jest.requireActual("../../../src/redux/actions/UserActions")
    return{
      ...allMethods,
      signInUser: jest.fn().mockReturnValue(mockLodervalue),
    }
  })

  jest.mock('@react-native-firebase/auth', () => {
    const signInWithEmailAndPassword = jest.fn().mockResolvedValue(mockAuthUser);
  
    return {
      auth: jest.fn(() => ({
        signInWithEmailAndPassword,
      })),
    };
  });




describe("Sign Up flow test",()=>{
  let SignInComponent:any;

  beforeEach(() => {
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

    await act(async()=>{
      fireEvent.press(btn_signIn)
    })

    
  })

})