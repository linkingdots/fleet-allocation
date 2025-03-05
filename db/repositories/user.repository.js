import { UserModel } from "../models/user.model.js";
import { UserRepositoryI } from "../../src/auth/user.repository.interface.js";

export class UserRepository extends UserRepositoryI {
  async findBy(email) {
    return await UserModel.findOne({ email });
  }

  async create(newUser) {
    const user = new UserModel(newUser);
    await user.save();
    return user;
  }
}
