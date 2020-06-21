import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from '../components/AuthContext';
import loginPOSTRequest from '../services/authservice';
import * as Animatable from 'react-native-animatable';
var reactNativeJoi = require('react-native-joi');

const emailSchema = reactNativeJoi.object().keys({
  email: reactNativeJoi
    .string()
    .email()
    .required(),
});
const passwordSchema = reactNativeJoi.object().keys({
  password: reactNativeJoi
    .string()
    .min(8)
    .alphanum()
    .required(),
});

const LoginScreen = ({navigation}) => {
  const [data, setData] = React.useState({
    email: '',
    password: '',
    secureTextEntry: true,
    error: null,
    isLoading: false,
    isEmailValid: false,
    emailError: null,
    isPasswordValid: false,
    passwordError: null,
    submitError: null,
  });

  const handleTextChange = val => {
    setData({...data, email: val});
  };

  const handlePasswordChange = val => {
    setData({...data, password: val});
  };

  const handleSecureTextEntry = () => {
    setData({...data, secureTextEntry: !data.secureTextEntry});
  };

  const handleEmailValidation = e => {
    const {error} = reactNativeJoi.validate({email: e}, emailSchema);
    if (error !== null) {
      setData({
        ...data,
        isEmailValid: false,
        emailError: 'Invalid Email',
      });
    } else {
      setData({...data, isEmailValid: true, emailError: null});
    }
  };
  const handlePasswordValidation = e => {
    const {error} = reactNativeJoi.validate({password: e}, passwordSchema);
    if (error !== null) {
      setData({
        ...data,
        isPasswordValid: false,
        passwordError: 'Password should be atleast 8 characters',
      });
    } else {
      setData({...data, isPasswordValid: true, passwordError: null});
    }
  };
  const {signIn} = React.useContext(AuthContext);

  const handleSignIn = async () => {
    setData({...data, isLoading: true});
    const res = await loginPOSTRequest(data.email, data.password);
    if (res.error !== null) {
      new Alert.alert(res.error);
      setData({...data, isLoading: false});
    } else {
      signIn(res.token, data.email);
      setData({...data, isLoading: false});
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Welcome !</Text>
      </View>
      <Animatable.View style={styles.footer} animation="fadeInUpBig">
        <Text style={styles.text_footer}>Email</Text>
        <View style={styles.action}>
          <MaterialCommunityIcons name="account" color="#000000" size={20} />
          <TextInput
            placeholder="Your Email"
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={val => handleTextChange(val)}
            onEndEditing={e => handleEmailValidation(e.nativeEvent.text)}
          />
          {data.isEmailValid ? (
            <Animatable.View animation="bounceIn">
              <MaterialCommunityIcons
                name="checkbox-marked-circle-outline"
                color="#000000"
                size={20}
              />
            </Animatable.View>
          ) : null}
        </View>
        <View>
          {data.isEmailValid ? null : (
            <Text style={styles.errorMsg}>{data.emailError}</Text>
          )}
        </View>
        <Text style={[styles.text_footer, {marginTop: 28}]}>Password</Text>
        <View style={styles.action}>
          <MaterialCommunityIcons name="lock" color="#000000" size={20} />
          <TextInput
            placeholder="Your Password"
            secureTextEntry={data.secureTextEntry}
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={val => handlePasswordChange(val)}
            onEndEditing={e => handlePasswordValidation(e.nativeEvent.text)}
          />
          <Animatable.View animation="bounceIn">
            <MaterialCommunityIcons
              name={data.secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
              color="#000000"
              size={20}
              onPress={handleSecureTextEntry}
            />
          </Animatable.View>
        </View>
        <View>
          {data.isPasswordValid ? null : (
            <Text style={styles.errorMsg}>{data.passwordError}</Text>
          )}
        </View>
        <View style={styles.button}>
          <TouchableOpacity
            style={
              data.isEmailValid && data.isPasswordValid
                ? styles.signIn
                : styles.signInDisabled
            }
            disabled={!(data.isEmailValid && data.isPasswordValid)}
            onPress={() => handleSignIn()}>
            {data.isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.textSign}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 2,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#000000',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: -12,
    paddingLeft: 10,
    color: '#000000',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#000000',
    flexDirection: 'row',
  },
  signInDisabled: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'gray',
    flexDirection: 'row',
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default LoginScreen;
