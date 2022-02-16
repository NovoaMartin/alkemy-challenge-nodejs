import { DataTypes, Model, Sequelize } from 'sequelize';

export default class UserModel extends Model {
  static setup(sequelizeInstance: Sequelize) {
    UserModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          unique: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
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
        modelName: 'user',
        tableName: 'users',
      },
    );
    return UserModel;
  }
}
