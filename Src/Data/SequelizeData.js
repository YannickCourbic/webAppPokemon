const {Sequelize , DataTypes} = require('sequelize');
const PokemonModel = require('../Models/Pokemon');
const UserModel = require('../Models/User');
const sequelize = new Sequelize('apipokemonbdd' ,'root' , '' , {
    host : '127.0.0.1',
    dialect : 'mysql',
    dialectOptions: {
        timezone: '+02:00'
    },
    logging: true
} );

const Pokemon = PokemonModel(sequelize , DataTypes);
const User = UserModel(sequelize , DataTypes)
const getConnexion = () => {
    return sequelize.sync({force: false }).then(_=>{
        console.log("La base de donnée a été initialisée !");
    });
}

module.exports = {
    getConnexion ,
    Pokemon,
    User,
    sequelize
}