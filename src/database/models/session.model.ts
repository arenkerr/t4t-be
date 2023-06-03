import { Model, DataTypes, Sequelize } from 'sequelize';

class Session extends Model {
  public id!: string;
  public refreshToken!: string;
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
      refreshToken: {
        type: DataTypes.STRING,
        allowNull: false,
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
