const {User , sequelize} = require('../Data/SequelizeData');
const {ValidationError, UniqueConstraintError} = require("sequelize");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const privateKey = require('../Auth/private_key');

const createUser = (app) => {
    app.post('/api/user/create' , async (req , res ) => {
        User.create({
            username : req.body.username,
            password: await bcrypt.hash(req.body.password , 10 )
            ,
            roles: req.body.roles
        })
            .then( user => {
                console.log(user);
                res.json({message: `Vous avez crée avec succès le user ${user.username}` , data : user , status : 200})
            })
            .catch(error => {
                if(error instanceof ValidationError ) return res.status(400).json({message : error.message , data: error })
                if(error instanceof  UniqueConstraintError) return res.status(400).json({message : "le nom est déjà pris" , data : error })
                const message = "Le user n'a pas pu être ajouté. Réessayez dans quelques instants.";
                res.status(500).json({message , data: error});

            })
    })
}

const login = (app) => {
    app.post("/api/user/login" , (req , res) => {
        User.findOne({where : { username : req.body.username}})
            .then(
            async (user) => {
                if(user === null) return res.status(401).json({message: "Username ou Mot de Passe non valide!" , status : 401});
                if(!await bcrypt.compare(req.body.password , user.password)) return res.status(401).json({message : "Username ou Mot de Passe non valide!" , status: 401});
                //Générer le token
                const token = jwt.sign({userId : user.id} , privateKey , {expiresIn: '24h'} )
                res.json({message: `L'utilisateur ${user.username} a été connecté avec succès` , data: user , token ,  status: 200});
            }
        )  .catch(error => {
            res.status(500).json({message : "L'utilisateur n'a pas pu être connecté , veuillez réessayez plus tard!" , data: error});
        })
    })
}

module.exports = [
    createUser,
    login
]


