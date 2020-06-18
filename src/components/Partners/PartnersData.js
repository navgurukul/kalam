import * as yup from 'yup';

const data = [{
  name: 'name',
  type: 'text',
  validation: yup.string().required('Required').max(20, 'Must be 20 characters or less'),
  customProps: {
    variant: 'outlined', id: '', defaultValue: '', placeholder: 'kumar', label: 'name', type: '',
  },
},
{
  name: 'notes',
  type: 'text',
  validation: yup.string().required('Required').max(10, 'Must be 10 characters or less'),
  customProps: {
    variant: 'outlined', id: '', defaultValue: '', placeholder: 'kumar', label: 'notes', type: '',
  },
},
{
  name: 'slug',
  type: 'text',
  validation: yup.string().required('Required').max(10, 'Must be 10 characters or less'),
  customProps: {
    variant: 'outlined', id: '', defaultValue: '', placeholder: 'kumar', label: 'slug', type: '',
  },
}];
export default data;
