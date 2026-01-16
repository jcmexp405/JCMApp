import { types } from '../../types/types';

const initialState = {
  user: {
    uid: '',
    type: '',
    name: ''
  },
  error: {
    code: '',
    message: ''
  },
  resetPass: {
    error: false,
    message: ''
  },
  currentPath: {
    path: 'documentos'
  }
};
export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_DATA_SUCCESS:
      return {
        user: action.payload,
        error: initialState.error,
        resetPass: initialState.resetPass
      };
    case types.GET_DATA_FAILURE:
      return {
        ...state,
        error: {
          code: action.payload.code,
          message: action.payload.message
        }
      };
    case types.UPDATE_PASSWORD_SUCCESS:
      return {
        ...state,
        resetPass: {
          error: false,
          message: 'Se ha enviado el correo con éxito'
        }
      };
    case types.UPDATE_PASSWORD_FAILURE:
      return {
        ...state,
        resetPass: {
          error: true,
          message: 'Ocurrió un error al enviar el correo'
        }
      };
    case types.SET_CURRENT_PATH:
      return {
        ...state,
        currentPath: {
          path: action.payload
        }
      };
    case types.LOGOUT:
      return initialState;
    default:
      return state;
  }
};
