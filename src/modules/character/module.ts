import { AwilixContainer } from 'awilix';
import { Application } from 'express';
import CharacterController from './controller/CharacterController';
import CharacterRepository from './repository/CharacterRepository';
import CharacterService from './service/CharacterService';

/* istanbul ignore next */
export default function init(app: Application, container:AwilixContainer) {
  container.resolve('characterController').configureRoutes(app);
}

export {
  CharacterController,
  CharacterService,
  CharacterRepository,
};
