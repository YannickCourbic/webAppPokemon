const jwt = require('jsonwebtoken');
const privateKey = require('./private_key');


module.exports = (req , res , next ) => {
    const authorizationHeader = req.headers.authorization;
    // si l'entête est vide , rempli par le fait d'avoir éffectuer la requête login , qui permet de mettre en session le token
    if(!authorizationHeader) return res.status(401).json({message : "Erreur d'authentification , vous n'avez pas fourni de jeton d'authentification. Ajoutez en un dans l'en-tête de la requête."});
    const token = authorizationHeader.split(" ")[1];
    const decodedToken = jwt.verify(token , privateKey , (error , decodeToken) => {
            if(error) return res.status(401).json({message: "L'utilisateur n'est pas autorisé à accéder à cette ressource.", data: error , status:401});

            const userId = decodeToken.userId;
            if(req.body.userId && req.body.userId !== userId) {
                res.status(401).json({message: "L'identifiant de l'utilisateur est invalide" , status:401});
            }
            else{
                next();
            }
        }
    )}