import { Model, DataTypes, Sequelize } from 'sequelize';
import User from './user.model.js';

class Session extends Model {
  public id!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

const initModel = (sequelize: Sequelize) => {
  Session.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      tableName: 'sessions',
    }
  );

  return Session;
};

export { initModel };
export default Session;
