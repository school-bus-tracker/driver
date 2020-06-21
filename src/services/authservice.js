import {authDriverEndpointURL} from '../config/endpointconfig';
import axios from 'react-native-axios';
const loginPOSTRequest = async (userName, password) => {
  try {
    const response = {
      token: null,
      error: null,
    };
    const Data = {
      EmailID: userName,
      Password: password,
      isDriver: true,
    };
    const configPOST = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    const res = await axios.post(
      authDriverEndpointURL,
      JSON.stringify(Data),
      configPOST,
    );

    if (res.status !== 200) {
      if (res.status >= 400) {
        response.error = 'Invalid EmailId or Password';
        return response;
      }
      if (res.status >= 500) {
        response.error = 'Something Failed';
        return response;
      }
    }
    response.token = res.data;
    return response;
  } catch (ex) {
    console.log(ex);
  }
};

export default loginPOSTRequest;
