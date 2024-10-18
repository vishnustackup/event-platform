const Yup = require('yup')

const userValidator = Yup.object().shape({
    name: Yup.string().min(3).max(40).required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phoneno: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').required('Phone number is required'),
    password: Yup.string().min(5).max(30).required('Password is required'),
    state: Yup.string().required('State is required'),
    role: Yup.string().oneOf(['admin', 'user'], 'Role must be either admin or user').default('user'),
    bookedEvents: Yup.array().of(
        Yup.string().matches(/^[0-9a-fA-F]{24}$/, 'Must be a valid 24-character hex string')
    ),
    createdOn: Yup.date().default(() => new Date()),
    isBlocked: Yup.boolean().default(false),
});
module.exports = userValidator 