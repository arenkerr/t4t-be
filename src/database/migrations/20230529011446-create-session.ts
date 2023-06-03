import { DataTypes, QueryInterface, Sequelize } from 'sequelize';
import type { Migration } from './umzug.js';

export const up: Migration = async ({
  context: sequelize,
}: {
  context: QueryInterface;
}) => {
  await sequelize.createTable('sessions', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    refreshToken: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  });
};

export const down: Migration = async ({
  context: sequelize,
}: {
  context: Sequelize;
}) => {
  await sequelize.getQueryInterface().dropTable('sessions');
};
