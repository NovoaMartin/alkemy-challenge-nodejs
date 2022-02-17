import { DataTypes, Model, Sequelize } from 'sequelize';

export default class GenreModel extends Model {
  static setup(sequelizeInstance : Sequelize) {
    GenreModel.init({
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      sequelize: sequelizeInstance,
      tableName: 'genres',
      modelName: 'genre',
    });
    return GenreModel;
  }
}
