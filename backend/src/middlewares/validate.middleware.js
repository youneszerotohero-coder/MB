const validateRequest = (schema) => (req, res, next) => {
  // placeholder: use a validation library like Joi or Yup
  // schema.validate(req.body)
  next();
};

module.exports = {
  validateRequest
};
