import { Model, DataTypes, Sequelize } from 'sequelize';

class Session extends Model {
  public id!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date;
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
      paranoid: true,
    }
  );
  return Session;
};

export { initModel };
export default Session;
