import { postNewAlert } from '../services/alertsService';

export const postUserAlert = (alert) => {
  return async (dispatch, getState) => {
    const { selectedUser } = getState().documents;
    try {
      await postNewAlert(selectedUser, alert);
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};
