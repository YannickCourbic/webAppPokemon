const {Sequelize , DataTypes} = require('sequelize');
const PokemonModel = require('../Models/Pokemon');
const UserModel = require('../Models/User');
const sequelize = new Sequelize('apipokemonbdd' ,'root' , '' , {
    host : 'localhost',
    dialect : 'mysql',
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