import express from 'express';
import dotenv from 'dotenv';
import { AwilixContainer } from 'awilix';
import initAuthModule from './modules/auth/module';
import configureDI from './config/di';

dotenv.config();

const app = express();
const { PORT } = process.env;

app.use(express.json);
app.use(express.urlencoded({ extended: true }));

const container: AwilixContainer = configureDI();

initAuthModule(app, container);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
