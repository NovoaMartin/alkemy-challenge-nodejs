import { DataTypes, Model, Sequelize } from 'sequelize';
import CharacterModel from '../../character/model/CharacterModel';
import GenreModel from '../../genre/model/GenreModel';

export default class FilmModel extends Model {
  static setup(sequelizeInstance:Sequelize) {
    FilmModel.init({
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      image: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      releaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    }, {
      sequelize: sequelizeInstance,
      tableName: 'films',
      modelName: 'film',
    });
    return FilmModel;
  }

  static setupAssociations() {
    FilmModel.belongsToMany(CharacterModel, { through: 'FilmCharacter' });
    CharacterModel.belongsToMany(FilmModel, { through: 'FilmCharacter' });

    GenreModel.hasMany(FilmModel, { foreignKey: 'genreId' });
    FilmModel.belongsTo(GenreModel, { foreignKey: 'genreId' });
    return FilmModel;
  }
}
