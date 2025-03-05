import Joi from "joi";

export const credentialsValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const refreshTokenValidationSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
