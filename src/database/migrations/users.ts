import { DataTypes, QueryInterface, Sequelize } from 'sequelize';
import type { Migration } from './umzug.js';

export const up: Migration = async ({ context: sequelize }: { context: QueryInterface }) => {
	await sequelize.createTable('users', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
};

export const down: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
	await sequelize.getQueryInterface().dropTable('users');
};