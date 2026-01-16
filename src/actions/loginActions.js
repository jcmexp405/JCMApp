import { resetPassWord, userLogin } from '../services/loginService';
import { types } from '../types/types';

export const userAuth = (USER, PASSWORD) => {
  return async (dispatch) => {
    const response = await userLogin(USER, PASSWORD);

    if (response.code) {
      dispatch(
        getDataFailure({
          code: response.code,
          message: response.message
        })
      );
    }
    if (response.uid) {
      dispatch(getDataSuccess(response));
    }
  };
};
export const getDataSuccess = (user) => ({
  type: types.GET_DATA_SUCCESS,
  payload: user
});

export const getDataFailure = (error) => ({
  type: types.GET_DATA_FAILURE,
  payload: error
});

export const userResetPassword = (USER) => {
  return (dispatch) => {
    resetPassWord(USER)
      .then(() => {
        dispatch(updatePasswordSuccess());
      })
      .catch(() => {
        dispatch(updatePasswordFailure());
      });
  };
};

const updatePasswordSuccess = () => ({
  type: types.UPDATE_PASSWORD_SUCCESS
});

const updatePasswordFailure = () => ({
  type: types.UPDATE_PASSWORD_FAILURE
});

export const setCurrentPath = (path) => ({
  type: types.SET_CURRENT_PATH,
  payload: path
});

export const logout = () => ({
  type: types.LOGOUT
});
