import { config } from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import { UserModel } from '../../modules/auth/module';
import CharacterModel, { CharacterFilm } from '../../modules/character/model/CharacterModel';
import FilmModel from '../../modules/film/model/FilmModel';
import GenreModel from '../../modules/genre/model/GenreModel';

config();

(async () => {
  const sequelize = new Sequelize(process.env.DB_URI!, {
    dialect: 'postgres',
    models: [UserModel, CharacterModel, FilmModel, GenreModel, CharacterFilm],
  });
  await sequelize.sync({ force: true });
})();
