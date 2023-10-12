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
function App(): JSX.Element {
 

  return (
    <ThemeProvider>
     <RootNavigation/>
    </ThemeProvider>
  );
}

export default App;
