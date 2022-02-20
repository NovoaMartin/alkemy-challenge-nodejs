import { Sequelize } from 'sequelize-typescript';
import { config } from 'dotenv';
import {
  createContainer, AwilixContainer, asFunction, asClass, asValue,
} from 'awilix';
import bcrypt from 'bcrypt';

import sendgrid from '@sendgrid/mail';
import {
  UserController, UserModel, UserRepository, UserService,
} from '../modules/auth/module';
import FilmModel from '../models/FilmModel';
import CharacterModel from '../models/CharacterModel';
import GenreModel from '../models/GenreModel';

config();

function configureSequelize() {
  const sequelize = new Sequelize(process.env.DB_URI || '', {
    dialect: 'postgres',
  });
  sequelize.addModels([UserModel, FilmModel, CharacterModel, GenreModel]);
}

function addCommonDefinitions(container: AwilixContainer) {
  sendgrid.setApiKey(process.env.EMAIL_API_KEY!);
  container.register({
    container: asValue(container),
    sequelize: asFunction(configureSequelize),
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

export default function configureDI() {
  const container = createContainer({ injectionMode: 'CLASSIC' });
  addCommonDefinitions(container);
  addUserModuleDefinitions(container);
  return container;
}
