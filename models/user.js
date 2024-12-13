const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        username: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        disabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    },
    {
        sequelize,
        underscored: true,
        modelName: 'user',
        scopes: {
            withoutPassword: {
              attributes: { exclude: ['passwordHash'] },
            },
          },
    })

module.exports = User