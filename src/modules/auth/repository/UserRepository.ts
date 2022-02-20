import { v4 } from 'uuid';
import User from '../entity/User';
import UserModel from '../../../models/UserModel';
import UserNotFoundException from '../exception/UserNotFoundException';

export default class UserRepository {
  constructor(private userModel:typeof UserModel) {}

  async getByName(username : string) : Promise<User> {
    const user = await this.userModel.findOne({
      where: {
        username,
      },
    });
    if (user == null) throw new UserNotFoundException();
    return user.toJSON();
  }

  async save(user : Partial<User>) {
    const isNewRecord = !user.id;
    if (isNewRecord) {
      user.id = v4();
    }
    const instance = this.userModel.build(user, { isNewRecord });
    return (await instance.save()).toJSON();
  }
}
