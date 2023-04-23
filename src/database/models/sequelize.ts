/* eslint-disable no-console */
import { Sequelize } from 'sequelize';
import {SequelizeStorage, Umzug} from 'umzug';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import umzug from '../migrations/umzug.js'
import * as config from './config.js';

const production = process.env.NODE_ENV === 'production';
const url = production ? config.production.url : config.development.url;
const sequelize = new Sequelize(url || '');

const connect = () => {
    try {
        sequelize.authenticate().then(() => {
            console.log('db connection successful');
        });
    } catch (error) {
        console.error('Unable to connect to db:', error);
    }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const associate = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const models: { [key: string]: any } = {};
    fs
      .readdirSync(__dirname)
      .filter((fileName: string) => /model.[t|j]s/.test(fileName))
      .forEach(async (fileName) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const model = await import(path.resolve(__dirname, fileName));
        model.initModel(sequelize);
        models[model.default.name] = model.default;
      });
    Object.keys(models).forEach((modelName: string) => {
      if ('associate' in models[modelName]) {
        models[modelName].associate();
      }
    });
  };

const migrate = umzug(sequelize);

export { sequelize, connect, associate, migrate };