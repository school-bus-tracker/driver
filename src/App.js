import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {MainTabScreen} from './screens/maintabscreen';
import React, {useEffect} from 'react';
import {AuthContext} from './components/AuthContext';
import SplashScreen from './screens/SplashScreen';
import {uiConfig} from './config/uiconfig';
import {storeToken, removeToken, getToken} from './services/tokenstorage';
import {storeUserProfile, removeUserProfile} from './services/profilestorage';
import {driverGETRequest} from './services/crudservice';
import {StatusBar} from 'react-native';

import RootStackScreen from './screens/rootstackscreen';

function App() {
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.userToken,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userToken: action.userToken,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState,
  );

  const signIn = async (token, userName) => {
    try {
      await storeToken('userToken', token);
      const res = await driverGETRequest(userName);
      await storeUserProfile('userProfile', res.data);
      dispatch({type: 'LOGIN', token});
    } catch (ex) {
      console.log(ex);
    }
  };
  const signOut = async () => {
    try {
      await removeToken('userToken');
      await removeUserProfile('userProfile');
      dispatch({type: 'LOGOUT'});
    } catch (ex) {
      console.log(ex);
    }
  };
  const authContext = React.useMemo(
    () => ({
      signIn,
      signOut,
    }),
    [signIn, signOut],
  );

  useEffect(() => {
    setTimeout(async () => {
      try {
        const userToken = await getToken('userToken');
        dispatch({type: 'RETRIEVE_TOKEN', userToken});
      } catch (ex) {
        console.log(ex);
      }
    }, uiConfig.splashScreenTimeout);
  }, []);

  if (loginState.isLoading) {
    return (
      <React.Fragment>
        <SplashScreen />
        <StatusBar backgroundColor="#000000" barStyle="light-content" />
      </React.Fragment>
    );
  }
  return (
    <AuthContext.Provider value={authContext}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      <NavigationContainer>
        {loginState.userToken !== null ? (
          <MainTabScreen />
        ) : (
          <RootStackScreen />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App;
