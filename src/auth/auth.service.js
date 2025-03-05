import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "node:process";
import { UserRepositoryI } from "./user.repository.interface.js";

export class AuthService extends UserRepositoryI {
  constructor(userRepository) {
    super();
    if (!(userRepository instanceof UserRepositoryI)) {
      throw new Error("AuthService requires a UserRepositoryI instance");
    }

    this.userRepository = userRepository;

    this.tokenTypeMap = {
      access: { secret: env.JWT_ACCESS_SECRET, expiresIn: "1h" },
      refresh: { secret: env.JWT_REFRESH_SECRET, expiresIn: "30d" },
    };
  }

  async signUp(email, password) {
    const existingUser = await this.userRepository.findBy(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
    });

    const accessToken = this.generateTokenByUser(user, "access");
    const refreshToken = this.generateTokenByUser(user, "refresh");

    return { accessToken, refreshToken };
  }

  async signIn(email, password) {
    const user = await this.userRepository.findBy(email);
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const accessToken = this.generateTokenByUser(user, "access");
    const refreshToken = this.generateTokenByUser(user, "refresh");

    return { accessToken, refreshToken };
  }

  generateTokenByUser(user, tokenType) {
    const payload = { id: user._id, email: user.email };
    return jwt.sign(payload, this.tokenTypeMap[tokenType].secret, {
      expiresIn: this.tokenTypeMap[tokenType].expiresIn,
    });
  }

  generateNewAccessToken(refreshToken) {
    const payload = this.verifyToken(refreshToken, "refresh");
    const user = { id: payload.id, email: payload.email };
    return this.generateTokenByUser(user, "access");
  }

  verifyToken(token, tokenType) {
    return jwt.verify(token, this.tokenTypeMap[tokenType].secret);
  }
}
