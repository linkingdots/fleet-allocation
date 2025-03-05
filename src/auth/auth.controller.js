export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  async signUp(req, res) {
    try {
      const { email, password } = req.body;
      const tokens = await this.authService.signUp(email, password);
      res.status(201).json(tokens);
    } catch (e) {
      console.error(e);
      res.status(403).json({ error: "Forbidden" });
    }
  }

  async signIn(req, res) {
    try {
      const { email, password } = req.body;
      const tokens = await this.authService.signIn(email, password);
      res.status(200).json(tokens);
    } catch (e) {
      console.error(e);
      res.status(403).json({ error: "Forbidden" });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      const accessToken = this.authService.generateNewAccessToken(refreshToken);
      res.status(200).json({ accessToken });
    } catch (e) {
      console.error(e);
      res.status(403).json({ error: "Forbidden" });
    }
  }
}
