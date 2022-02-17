import express from 'express';
import dotenv from 'dotenv';
import { AwilixContainer } from 'awilix';
import swaggerUi from 'swagger-ui-express';
import initAuthModule from './modules/auth/module';
import configureDI from './config/di';
import swaggerDocument from '../swagger.json';

dotenv.config();

const app = express();
const { PORT } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const container: AwilixContainer = configureDI();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
initAuthModule(app, container);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
