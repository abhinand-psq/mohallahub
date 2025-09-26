import {body, header,param} from 'express-validator'

export const validatebody = () =>{
return[
     body('email')
     .isEmail() // Checks for a valid email format
  .withMessage('Invalid email address')
  .normalizeEmail(),
     body('fullName')
     .isLength({ min: 4, max: 20 })
  .matches(/^[a-zA-Z0-9_-]+$/)
  .withMessage('Username must be between 4 and 20 characters and contain only letters, numbers, hyphens, or underscores'),

     body('password')
      .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .matches(/[a-z]/)
  .withMessage('Password must contain at least one lowercase letter')
  .matches(/[0-9]/)
  .withMessage('Password must contain at least one number')
,

     body('username')
     .trim() // Sanitizer: removes leading/trailing whitespace
  .notEmpty()
  .withMessage('Username is required')
  .isLength({ min: 4, max: 20 })
  .withMessage('Username must be between 4 and 20 characters long')
  .isAlphanumeric()
  .withMessage('Username can only contain alphanumeric characters')
]
}

export const validatebodylogin = () =>{
return[
     body('email')
     .isEmail() // Checks for a valid email format
  .withMessage('Invalid email address')
  .normalizeEmail(),
   
     body('password')
      .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .matches(/[a-z]/)
  .withMessage('Password must contain at least one lowercase letter')
  .matches(/[0-9]/)
  .withMessage('Password must contain at least one number')

]
}

