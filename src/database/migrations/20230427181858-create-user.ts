import { DataTypes, QueryInterface, Sequelize } from 'sequelize';
import type { Migration } from './umzug.js';

export const up: Migration = async ({ context: sequelize }: { context: QueryInterface }) => {
	await sequelize.createTable('users', {
		id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
		},
		username: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
		},
		bio: {
			type: DataTypes.TEXT({ length: 'medium' }),
			allowNull: true,
		},
		avatarUrl: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE
		},
		updatedAt: {
			allowNull: true,
			type: DataTypes.DATE
		},
		deletedAt: {
			allowNull: true,
			type: DataTypes.DATE
		}
	});
};

export const down: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
	await sequelize.getQueryInterface().dropTable('users');
};