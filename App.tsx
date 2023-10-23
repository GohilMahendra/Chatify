/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
View,Text,SafeAreaView
} from 'react-native';
import { ThemeProvider  } from "./src/globals/ThemeProvider";
import RootNavigation from './src/navigation/RootNavigation';
import { Provider } from "react-redux";
import store from './src/redux/store';
function App(): JSX.Element {
 

  return (
    <Provider store={store}>
    <ThemeProvider>
     <RootNavigation/>
    </ThemeProvider>
    </Provider>
  );
}

export default App;
