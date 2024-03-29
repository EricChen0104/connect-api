const Joi = require("joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(6).max(100).required().email(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(100).required().email(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(data);
};

const postValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    description: Joi.string().min(0).max(500).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.postValidation = postValidation;
