import { UserRepository } from "../../db/repositories/user.repository.js";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";

export const createAuthController = () => {
  const userRepository = new UserRepository();
  const authService = new AuthService(userRepository);
  return new AuthController(authService);
};
