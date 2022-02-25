import express from 'express';
import dotenv from 'dotenv';
import { AwilixContainer } from 'awilix';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import initAuthModule from './modules/auth/module';
import configureDI from './config/di';
import swaggerDocument from '../swagger.json';
import initCharacterModule from './modules/character/module';

dotenv.config();

const app = express();
const { PORT } = process.env;
console.log((path.join(__dirname, '../', 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, '../', 'uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const container: AwilixContainer = configureDI();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
initAuthModule(app, container);
initCharacterModule(app, container);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
