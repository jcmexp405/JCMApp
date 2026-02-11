import { types } from '../../types/types';

const initialState = {
  document: {
    url: ''
  },
  userDocuments: [],
  selectedUser: {}
};
export const documentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_DOCUMENTS:
      return {
        ...state,
        document: action.payload
      };
    case types.GET_DOCUMENT_SUCCESS:
      return {
        ...state,
        userDocuments: action.payload
      };
    case types.UPDATE_DOCUMENT_SUCCESS:
      return {
        ...state,
        userDocuments: state.userDocuments.map((e) =>
          e.id === action.payload.id ? action.payload : e
        )
      };
    case types.GET_SELECTED_USER:
      return {
        ...state,
        selectedUser: action.payload
      };
    default:
      return state;
  }
};
