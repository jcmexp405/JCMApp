import * as yup from 'yup';

export const newCategoryValidationSchema = yup.object({
  ICON: yup.string().min(4).max(50).required('Icono es obligatorio'),
  TITLE: yup.string().min(4).max(50).required('Nombre es obligatorio')
});
