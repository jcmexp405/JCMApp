import * as yup from 'yup';

export const requestAccountValidationSchema = yup.object({
  USER: yup.string().required('El nombre es un campo obligatorio'),
  EMAIL: yup.string().email().required('El email es un campo obligatorio')
});
