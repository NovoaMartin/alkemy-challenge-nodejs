import { Sequelize } from 'sequelize-typescript';
import { config } from 'dotenv';
import {
  createContainer, AwilixContainer, asClass, asValue,
} from 'awilix';
import bcrypt from 'bcrypt';

import sendgrid from '@sendgrid/mail';
import multer from 'multer';
import path from 'path';
import {
  UserController, UserModel, UserRepository, UserService,
} from '../modules/auth/module';
import FilmModel from '../models/FilmModel';
import CharacterModel from '../models/CharacterModel';
import GenreModel from '../models/GenreModel';
import CharacterFilm from '../models/CharacterFilm';
import { CharacterController, CharacterRepository, CharacterService } from '../modules/character/module';

config();

function configureSequelize() {
  const sequelize = new Sequelize(process.env.DB_URI || '', {
    dialect: 'postgres',
  });
  sequelize.addModels([UserModel, FilmModel, CharacterModel, GenreModel, CharacterFilm]);
  return sequelize;
}
function configureMulter() {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  return multer({ storage });
}

function addCommonDefinitions(container: AwilixContainer) {
  sendgrid.setApiKey(process.env.EMAIL_API_KEY!);
  container.register({
    container: asValue(container),
    uploadMiddleware: asValue(configureMulter()),
    sequelize: asValue(configureSequelize()),
    emailService: asValue(sendgrid),
    encryption: asValue(bcrypt),
  });
}

function addUserModuleDefinitions(container: AwilixContainer) {
  container.register({
    userController: asClass(UserController),
    userService: asClass(UserService),
    userRepository: asClass(UserRepository),
    userModel: asValue(UserModel),
  });
}
function addCharacterModuleDefinitions(container : AwilixContainer) {
  container.register({
    characterController: asClass(CharacterController),
    characterService: asClass(CharacterService),
    characterRepository: asClass(CharacterRepository),
    characterModel: asValue(CharacterModel),
  });
}

function addFilmModelDefinition(container:AwilixContainer) {
  container.register({
    filmModel: asValue(FilmModel),
  });
}
function addGenreModelDefinition(container:AwilixContainer) {
  container.register({
    genreModel: asValue(GenreModel),
  });
}

export default function configureDI() {
  const container = createContainer({ injectionMode: 'CLASSIC' });
  addCommonDefinitions(container);
  addUserModuleDefinitions(container);
  addCharacterModuleDefinitions(container);
  addFilmModelDefinition(container);
  addGenreModelDefinition(container);
  return container;
}
