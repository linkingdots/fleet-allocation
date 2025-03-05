import jwt from "jsonwebtoken";
import { env } from "node:process";
import { promisify } from "util";

const verifyToken = promisify(jwt.verify);

export const authValidation = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await verifyToken(token, env.JWT_ACCESS_SECRET);
    req.user = user;
    next();
  } catch (e) {
    return res.status(403).json({ error: "Forbidden" });
  }
};
