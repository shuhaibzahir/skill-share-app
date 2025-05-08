const { providerSchema } = require('../validators/providerValidator');
const { validationResult } = require('express-validator');
const validateProvider = (req, res, next) => {
  const { error } = providerSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.details.map(detail => detail.message)
    });
  }

  next();
};


const validateRequest = (req, res, next) => {
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ success: false, errors: errors.array() });
}
next();

}
module.exports = {
    validateProvider,
    validateRequest
};
