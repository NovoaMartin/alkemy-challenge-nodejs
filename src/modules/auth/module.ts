import { AwilixContainer } from 'awilix';
import { Application } from 'express';
import UserController from './controller/UserController';
import UserModel from '../../models/UserModel';
import UserRepository from './repository/UserRepository';
import UserService from './service/UserService';

/* istanbul ignore next */
export default function initAuthModule(app : Application, container :AwilixContainer) {
  container.resolve('userController').configureRoutes(app);
}

export {
  UserController, UserService, UserRepository, UserModel,
};
