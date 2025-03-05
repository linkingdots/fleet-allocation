import {
  getVehicleValidationSchema,
  postVehicleValidationSchema,
} from "./vehicle-validation.schema.js";

const schemaMap = {
  GET: { schema: getVehicleValidationSchema, location: "query" },
  POST: { schema: postVehicleValidationSchema, location: "body" },
};

export const vehicleValidation = (req, res, next) => {
  const { schema, location } = schemaMap[req.method] || {};
  if (!schema) {
    return res.status(405).json({ error: "Invalid method" });
  }

  const { error, value } = schema.validate(req[location]);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  req[location] = value;
  next();
};
