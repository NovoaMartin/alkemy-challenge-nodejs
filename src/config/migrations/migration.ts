import { QueryInterface, Sequelize as T } from 'sequelize';
import UserModel from '../../modules/auth/model/UserModel';
import FilmModel from '../../modules/film/model/FilmModel';
import GenreModel from '../../modules/genre/model/GenreModel';
import CharacterModel from '../../modules/character/model/CharacterModel';

export default {
  async up(queryInterface: QueryInterface, Sequelize: T) {
    await UserModel.setup(queryInterface.sequelize);
    await GenreModel.setup(queryInterface.sequelize);
    await CharacterModel.setup(queryInterface.sequelize);
    await FilmModel.setup(queryInterface.sequelize).setupAssociations();
    await queryInterface.sequelize.sync({ force: true });
  },

  async down(queryInterface: QueryInterface, Sequelize: T) {
    await queryInterface.dropAllTables();
  },
};
