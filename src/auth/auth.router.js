import express from "express";
import { createAuthController } from "./auth.factory.js";
import {
  credentialsValidation,
  refreshTokenValidation,
} from "./auth-validation.middleware.js";

export const authRouter = () => {
  const router = express.Router();
  const authController = createAuthController();

  /**
   * @swagger
   * /signup:
   *   post:
   *     summary: Sign up a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       201:
   *         description: User signed up successfully
   *       400:
   *         description: Bad request
   *       403:
   *         description: Forbidden
   *       500:
   *         description: Internal Server Error
   */
  router.post("/signup", credentialsValidation, (req, res) =>
    authController.signUp(req, res)
  );

  /**
   * @swagger
   * /signin:
   *   post:
   *     summary: Sign in a user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: User signed in successfully
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       500:
   *         description: Internal Server Error
   */
  router.post("/signin", credentialsValidation, (req, res) =>
    authController.signIn(req, res)
  );

  /**
   * @swagger
   * /refresh:
   *   post:
   *     summary: Refresh access token
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               refreshToken:
   *                 type: string
   *     responses:
   *       200:
   *         description: Access token refreshed successfully
   *       400:
   *         description: Bad request
   *       403:
   *         description: Forbidden
   *       500:
   *         description: Internal Server Error
   */
  router.post("/refresh", refreshTokenValidation, (req, res) =>
    authController.refreshToken(req, res)
  );

  return router;
};
