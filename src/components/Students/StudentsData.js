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
  name: 'mobile',
  type: 'text',
  validation: yup.string().required('Required').max(10, 'Must be 10 characters or less'),
  customProps: {
    variant: 'outlined', id: '', defaultValue: '', placeholder: 'kumar', label: 'mobile', type: '',
  },
},
{
  name: 'id',
  type: 'text',
  validation: yup.string().required('Required').max(10, 'Must be 10 characters or less'),
  customProps: {
    variant: 'outlined', id: '', defaultValue: '', placeholder: 'kumar', label: 'id', type: '',
  },
},
{
  name: 'stage',
  type: 'select',
  validation: yup.string().oneOf(['pendingEnglishInterview', 'algebraInterviewFail', 'tuitionGroup', 'other'], 'please select one').required('Required'),
  options: [
    'pendingEnglishInterview',
    'algebraInterviewFail',
    'tuitionGroup',
    'other',
  ],
  customProps: { variant: 'outlined', id: '', label: 'Stage' },
},
];
export default data;
