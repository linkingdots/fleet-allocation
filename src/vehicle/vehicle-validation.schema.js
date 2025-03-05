import Joi from "joi";

export const getVehicleValidationSchema = Joi.object({
  fleet: Joi.string().optional(),
  brand: Joi.string().optional(),
  model: Joi.string().optional(),
  year: Joi.number()
    .integer()
    .min(1960)
    .max(new Date().getFullYear())
    .optional(),
  offset: Joi.number().integer().min(0).default(0).optional(),
  limit: Joi.number().integer().min(1).default(10).optional(),
  sort: Joi.string()
    .valid("asc", "desc")
    .insensitive()
    .default("desc")
    .optional(),
});

export const postVehicleValidationSchema = Joi.object({
  brand: Joi.string().required(),
  model: Joi.string().required(),
  year: Joi.number()
    .integer()
    .min(1960)
    .max(new Date().getFullYear())
    .required(),
});
