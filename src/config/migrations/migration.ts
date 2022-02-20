import { config } from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import { UserModel } from '../../modules/auth/module';
import CharacterModel from '../../models/CharacterModel';
import FilmModel from '../../models/FilmModel';
import GenreModel from '../../models/GenreModel';
import  CharacterFilm  from '../../models/CharacterFilm';

config();

(async () => {
  const sequelize = new Sequelize(process.env.DB_URI!, {
    dialect: 'postgres',
    models: [UserModel, CharacterModel, FilmModel, GenreModel, CharacterFilm],
  });
  await sequelize.sync({ force: true });
})();
