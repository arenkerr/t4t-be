/* eslint-disable no-console */
import { Sequelize } from 'sequelize';
import * as config from '../database/config/config.js';

const production = process.env.NODE_ENV === 'production';
const url = production ? config.production.url : config.development.url;
const sequelize = new Sequelize(url);

const connect = () => {
    try {
        sequelize.authenticate().then(() => {
            console.log('db connection successful');
        });
    } catch (error) {
        console.error('Unable to connect to db:', error);
    }
};

export { sequelize, connect };