import AsyncStorage from '@react-native-community/async-storage';

export const storeToken = async (tokenName, userToken) => {
  try {
    await AsyncStorage.setItem(tokenName, userToken);
  } catch (ex) {
    console.log(ex);
  }
};

export const removeToken = async tokenName => {
  try {
    await AsyncStorage.removeItem(tokenName);
  } catch (ex) {
    console.log(ex);
  }
};

export const getToken = async tokenName => {
  try {
    const userToken = await AsyncStorage.getItem(tokenName);
    return userToken;
  } catch (ex) {
    console.log(ex);
  }
};
