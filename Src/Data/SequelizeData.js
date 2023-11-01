const {Sequelize , DataTypes} = require('sequelize');
const PokemonModel = require('../Models/Pokemon');
const UserModel = require('../Models/User');
let sequelize;
if(process.env.NODE_ENV === 'production'){
     sequelize = new Sequelize("r7khs7sv7y6ykadq" ,'xeqiymltht8j9kw0' , 'cuj86xtmr08ng9d9' , {
        host : 'cxmgkzhk95kfgbq4.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        dialect : 'mysql',
        dialectOptions: {
            timezone: '+02:00'
        },
        logging: true
    } );
}
else{
    sequelize = new Sequelize('apipokemonbdd' ,'root' , '' , {
        host : '127.0.0.1',
        dialect : 'mysql',
        dialectOptions: {
            timezone: '+02:00'
        },
        logging: true
    } );
}

const Pokemon = PokemonModel(sequelize , DataTypes);
const User = UserModel(sequelize , DataTypes)
const getConnexion = () => {
    return sequelize.sync({force:false}).then(_=>{
        console.log("La base de donnée a été initialisée !");
    });
}

module.exports = {
    getConnexion ,
    Pokemon,
    User,
    sequelize
}