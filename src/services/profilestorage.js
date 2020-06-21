import AsyncStorage from '@react-native-community/async-storage';

export const storeUserProfile = async (userProfile, data) => {
  try {
    await AsyncStorage.setItem(userProfile, JSON.stringify(data));
  } catch (ex) {
    console.log(ex);
  }
};

export const getUserProfile = async userProfile => {
  try {
    const user = await AsyncStorage.getItem(userProfile);
    return user;
  } catch (ex) {
    console.log(ex);
  }
};

export const removeUserProfile = async userProfile => {
  try {
    await AsyncStorage.removeItem(userProfile);
  } catch (ex) {
    console.log(ex);
  }
};
