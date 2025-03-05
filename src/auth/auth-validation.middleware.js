import {
  credentialsValidationSchema,
  refreshTokenValidationSchema,
} from "./auth-validation.schema.js";

const authValidation = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const credentialsValidation = authValidation(
  credentialsValidationSchema
);
export const refreshTokenValidation = authValidation(
  refreshTokenValidationSchema
);
