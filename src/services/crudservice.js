import {driverEndpointURL} from '../config/endpointconfig';
import axios from 'react-native-axios';
import {getToken} from './tokenstorage';

export const driverGETRequest = async userName => {
  try {
    const token = await getToken('userToken');

    axios.defaults.headers.common['x-auth-token'] = token;
    const response = {
      data: {},
      error: null,
    };
    const configGET = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    const res = await axios.get(
      `${driverEndpointURL}me/${userName}`,
      configGET,
    );
    if (res.status !== 200) {
      if (res.status === 404) {
        response.error = 'Not Found';
        return response;
      }
      if (res.status === 401) {
        response.error = 'Forbidden Access';
        return response;
      }
      if (res.status === 400) {
        response.error = 'Invalid Token';
        return response;
      }
      if (res.status >= 500) {
        response.error = 'Something Failed';
        return response;
      }
    }
    response.data = res.data;
    return response;
  } catch (ex) {
    console.log(ex);
  }
};
