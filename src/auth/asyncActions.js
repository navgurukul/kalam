import axios from 'axios';

import { authSuccess } from './index';

export const googleAuthSuccess = (googleResponse) => async (dispatch) => {
  const json = await axios.post('http://join.navgurukul.org/api/users/login/google', { idToken: googleResponse.tokenObj.id_token });
  const { userToken, user } = json.data;
  dispatch(authSuccess({ token: userToken, user }));
};
