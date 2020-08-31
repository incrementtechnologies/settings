import CONFIG from 'src/config.js'
import AUTH from 'src/services/auth'
export default {
  id: 'createSubAccountModal',
  size: 'modal-md',
  title: 'Add Account',
  background: null,
  inputs: [{
    row: 'full',
    label: 'Username',
    variable: 'username',
    placeholder: 'Enter username',
    disabled: false,
    value: null,
    required: true,
    id: 'username',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 5,
      type: 'text'
    }
  }, {
    row: 'full',
    label: 'Email Address',
    variable: 'email',
    placeholder: 'Enter email',
    disabled: false,
    value: null,
    required: true,
    id: 'email',
    type: 'input',
    inputType: 'email',
    validation: {
      flag: true,
      type: 'email'
    }
  }, {
    row: 'full',
    label: 'Password',
    variable: 'password',
    placeholder: 'Enter password',
    disabled: false,
    value: null,
    required: true,
    id: 'password',
    type: 'input',
    inputType: 'password',
    validation: {
      size: 8,
      type: 'text'
    }
  }, {
    row: 'full',
    label: 'Status',
    variable: 'status',
    placeholder: '',
    disabled: false,
    value: 'Normal',
    required: true,
    id: 'status',
    type: 'select_specified',
    options: [
      {value: 'SUB_ADMIN', label: 'Sub Admin'},
      {value: 'Normal', label: 'Normal'}
    ]
  }],
  route: 'accounts/create',
  button: {
    left: 'Cancel',
    right: 'Create'
  },
  sort: {
    column: 'created_at',
    value: 'desc'
  },
  params: []
}
