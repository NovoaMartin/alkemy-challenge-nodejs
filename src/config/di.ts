import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
import {
  createContainer, AwilixContainer, asFunction, asClass, asValue,
} from 'awilix';
import bcrypt from 'bcrypt';

import sendgrid from '@sendgrid/mail';
import {
  UserController, UserModel, UserRepository, UserService,
} from '../modules/auth/module';

config();

function configureSequelize() {
  return new Sequelize(process.env.DB_URI || '', {
    dialect: 'postgres',
  });
}

function setupUserModel(container: AwilixContainer) {
  return UserModel.setup(container.resolve('sequelize'));
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
    userModel: asFunction(setupUserModel),
  });
}

export default function configureDI() {
  const container = createContainer({ injectionMode: 'CLASSIC' });
  addCommonDefinitions(container);
  addUserModuleDefinitions(container);
  return container;
}
