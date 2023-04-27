import { Model, DataTypes, Sequelize } from 'sequelize';

class User extends Model {
    public id!: string;
    public username!: string;
    public password!: string;
    public email!: string;
    public bio!: string;
    public avatarUrl!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
    public deletedAt!: Date;  
}

const initModel = (sequelize: Sequelize) => {
    User.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        username: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        bio: {
			type: DataTypes.TEXT({ length: 'medium' }),
			allowNull: true,
		},
		avatarUrl: {
			type: DataTypes.STRING,
			allowNull: true,
		},
    },
    {
        sequelize,
        tableName: 'user',
        paranoid: true
    }
    );
    return User;
};

export { initModel };
export default User;