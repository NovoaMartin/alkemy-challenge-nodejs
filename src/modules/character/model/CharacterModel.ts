import { DataTypes, Model, Sequelize } from 'sequelize';

export default class CharacterModel extends Model {
  static setup(sequelizeInstance: Sequelize) {
    CharacterModel.init({
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      image: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      story: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      weigth: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    }, {
      sequelize: sequelizeInstance,
      tableName: 'characters',
      modelName: 'character',
    });
    return CharacterModel;
  }
}
