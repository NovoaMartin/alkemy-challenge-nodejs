import { DataTypes, Model, Sequelize } from 'sequelize';

export default class UserModel extends Model {
  static setup(sequelizeInstance: Sequelize) {
    UserModel.init(
      {
        id: {
          type: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize: sequelizeInstance,
      },
    );
    return UserModel;
  }
}
