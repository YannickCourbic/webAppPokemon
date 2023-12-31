const {Pokemon , sequelize} = require('../Data/SequelizeData');
const {Op, fn , col ,QueryTypes, Sequelize } = require('sequelize');
const {ValidationError, UniqueConstraintError} = require("sequelize");
const auth = require('../Auth/Auth');
findAllPokemon =  (app) => {
    app.get('/api/pokemon/all' , (req , res) => {
        if(req.query.name){
            const name = req.query.name;
            return Pokemon.findAndCountAll({where : {name : {[Op.like]: `%${name}%` }} , limit : 5 , order: ['name'] })
                .then(({count , rows}) => {
                if(!rows.length > 0) {
                    return res.status(404).json({message: "le nom ne correspond pas à un pokémon ! Veuillez réessayer avec un autre nom", status: 404})
                }
                res.json({message: `Il y a ${count} pokemons qui correspondent au terme de votre recherche` , data : rows , status : 200})
            })
                .catch(error => {
                    const message = "Le pokémon n'a pas pu être trouver. Réessayez dans quelques instants.";
                    res.status(500).json({message , data: error});
                })
        }
        else if(req.query.type){
            console.log(req.query.type)
         return Pokemon.findAll({where : {
                 [Op.or]: [sequelize.fn('JSON_CONTAINS', sequelize.col('types'), `["${req.query.type}"]`)]
             }})
            .then(
                pokemons => {
                    if(!pokemons.length > 0) return res.status(404).json({message: "le types cherché n'existe pas ou n'a pas encore ajouté !"})
                    // console.log(pokemons)
                    res.json({message: `des pokémons de type ${req.query.type} on été trouvé avec succès` , data : pokemons})
                }
            ).catch(error => {
                const message = "Le pokémon n'a pas pu être trouver par le type. Réessayez dans quelques instants.";
                res.status(500).json({message , data: error});
            })
        }
        else if(req.query.limit){
          return Pokemon.findAll({limit : parseInt(req.query.limit)} )
                .then(pokemons => {
                    if(!pokemons.length > 0) return res.status(404).json({message: `liste de pokémon hors-limite`})
                    // console.log(pokemons)
                    res.json({message: `liste de pokémon avec une limite de ${req.query.limit} on été récupérée avec succès` , data : pokemons})
                })
                .catch(error => {
                    const message = "La liste de pokémon n'a pas été récupéré. Réessayez dans quelques instants.";
                    res.status(500).json({message , data: error});
                })
        }
        else if(req.query.evolution){
            if(req.query.evolution === "null"){
                return Pokemon.findAll({
                    where : {
                       evolution : null
                    }
                })
                    .then(pokemons => {
                        if(!pokemons.length > 0) return res.status(404).json({message: `liste de pokémon sans évolution non récupèrè`});
                        res.json({message: `liste de pokémon sans évolution ont été récupérée avec succès` , data : pokemons , status:200})
                    })
                    .catch(error => {
                        const message = "La liste de pokémon n'a pas été récupéré. Réessayez dans quelques instants.";
                        res.status(500).json({message , data: error});
                    })

            }
            if(req.query.evolution === "base"){
                return Pokemon.findAll({
                    where : {
                        evolution : {pre : "null"}
                    }
                })
                .then(pokemons => {
                    if(!pokemons.length > 0) return res.status(404).json({message: "liste de pokémon de base non existant ou pas encore ajouté", status:404});
                    res.json({message:`La liste de pokémon de base a été récupéré avec succès` , data: pokemons , status:200})
                }).catch(error => {
                        const message = "La liste de pokémon n'a pas été récupéré. Réessayez dans quelques instants.";
                        res.status(500).json({message , data: error});
                })
            }
            if(req.query.evolution === "stade_2"){
               return Pokemon.findAll({
                   where : {
                       evolution : {
                           pre : {
                               [Op.not] : "null"
                           },
                           next:{
                               [Op.not] : "null"
                           }
                       }
                   }
               })
                    .then(pokemons => {
                        if(!pokemons.length > 0) return res.status(404).json({message : "Liste de pokémon stade 2 non existant ou pas encore ajouté", status: 404});
                        res.json({message:`La liste de pokémon de stade 2 a été récupéré avec succès` , data: pokemons , status:200})
                    }).catch(error => {
                        const message = "La liste de pokémon n'a pas été récupéré. Réessayez dans quelques instants.";
                        res.status(500).json({message , data: error});
                    })
            }
            if(req.query.evolution === "stade_3"){
                return Pokemon.findAll({
                    where : {
                        evolution : {
                            pre : {
                                [Op.not] : "null",
                            },
                            next:{
                                [Op.not] : "null",
                            }
                        }
                    },

                })
                    .then(pokemons => {
                        if(!pokemons.length > 0) return res.status(404).json({message : "Liste de pokémon stade 3 non existant ou pas encore ajouté", status: 404});
                        res.json({message:`La liste de pokémon de stade 3 a été récupéré avec succès` , data: pokemons , status:200})
                    }).catch(error => {
                        const message = "La liste de pokémon n'a pas été récupéré. Réessayez dans quelques instants.";
                        res.status(500).json({message , data: error});
                    })
            }
            if(req.query.evolution === "evo_2"){
                return sequelize.query(`SELECT * FROM pokemons where evolution - > "$.pre" != 'null' and evolution->"$.next" = 'null' and JSON_LENGTH(evolution->"$.pre") = 1`)
                    .then(pokemons => {
                        if(!pokemons.length > 0) return res.status(404).json({message : "Liste de pokémon qui n'ont que 2 évolutions non existant ou pas encore ajouté", status: 404});
                        res.json({message:`La liste de pokémon de stade 3 a été récupéré avec succès` , data: pokemons , status:200})
                    }).catch(error => {
                        const message = "La liste de pokémon n'a pas été récupéré. Réessayez dans quelques instants.";
                        res.status(500).json({message , data: error});
                    })
            }
        }

        else{
            Pokemon.findAll({order: ['id']})
                .then(pokemons => {
                    console.log(pokemons)
                    res.json({message: "La liste des pokémon a bien été récupérée.", data: pokemons});
                })
                .catch(error => {
                    const message = "Le pokémon n'a pas pu être récupéré ou l' URL contient une erreur. Réessayez dans quelques instants , si l'erreur persiste alors l'URL contient une erreur.";
                    res.status(500).json({message , data: error})
                })
        }


    })}

findPokemon = (app) => {
    app.get('/api/pokemon/:id' ,(req , res ) => {
        Pokemon.findByPk(parseInt(req.params.id))
            .then(pokemon => {
                console.log(pokemon)
                const message = "Le pokémon demandé n'existe pas. Reéssayez avec un autre identifiant";
                if(!pokemon) return res.status(404).json({message})
                res.json({ message :`Vous avez récupérer avec succès le pokémon ${pokemon.name}` , data : pokemon , status : 200});
            })
            .catch(error => {
                const message = "Le pokémon n'a pas pu être récupéré ou l' URL contient une erreur. Réessayez dans quelques instants , si l'erreur persiste alors l'URL contient une erreur.";
                res.status(500).json({message , data: error});

            })
        ;
    })
}

createPokemon = (app) => {
    app.post('/api/pokemon/create', auth,  (req , res) => {
        //je récupère un req.body

        Pokemon.create({
            name : req.body.name,
            hp : req.body.hp,
            cp : req.body.cp,
            pictures : req.body.pictures,
            types : req.body.types,
            location: req.body.location,
            stats : req.body.stats,
            talent : req.body.talent,
            evolution: req.body.evolution
        })
            .then( pokemon => {
                console.log(pokemon);
                res.json({message: `Vous avez crée avec succès le pokémon ${pokemon.name}` , data : pokemon , status : 200})
            })
            .catch(error => {
                if(error instanceof ValidationError ) return res.status(400).json({message : error.message , data: error })
                if(error instanceof  UniqueConstraintError) return res.status(400).json({message : "le nom est déjà pris" , data : error })
                const message = "Le pokémon n'a pas pu être ajouté. Réessayez dans quelques instants.";
                res.status(500).json({message , data: error});

            })
    })

}

updatePokemon = (app) => {
    app.put('/api/pokemon/update/:id', auth , (req, res) => {
        const id = parseInt(req.params.id);
        Pokemon.update(req.body , {where : {id : id}})
            .then(_ => {
                Pokemon.findByPk(id).then(
                    pokemon => {
                        if(!pokemon) return res.status(404).json({message:"le pokemon à modifier n'existe pas , veuillez réessayer avec un autre identifiant"})
                        res.json({message: `le pokemon ${pokemon.name} a bien été modifée avec succès !` , data: pokemon , status : 200} )
                    }
                ).catch(error => {
                    if(error instanceof ValidationError ) return res.status(400).json({message : error.message , data: error })
                    if(error instanceof  UniqueConstraintError) return res.status(400).json({message : error.message , data : error })
                    const message = "Le pokémon n'a pas pu être trouvé. Réessayez dans quelques instants.";
                    res.status(500).json({message , data: error});

                })
            })
            .catch(error => {
                const message = "Le pokémon n'a pas pu être modifier. Réessayez dans quelques instants.";
                res.status(500).json({message , data: error});

            })
    })
}

deletePokemon = (app) => {
     app.delete('/api/pokemon/delete/:id' , auth , (req,res) => {
         const id = parseInt(req.params.id);
        Pokemon.findByPk(parseInt(req.params.id)).then(pokemon => {
            if(pokemon === null) return res.status(404).json({message: "Le pokémon demandé n'existe pas.Réessayez avec un autre identifiant"});
            const pokemonDelete = pokemon;
            return Pokemon.destroy({
                where: {id : id}
            }).then(_=> {
                res.json({message: `Le pokémon ${pokemonDelete.name} a été supprimée avec succès` , data: pokemonDelete});
            }).catch(error => {
                    const message = "Le pokémon n'a pas pu être supprimer. Réessayez dans quelques instants.";
                    res.status(500).json({message , data: error});

                })
        }).catch(error => {
                const message = "Le pokémon n'a pas pu être trouvé pour être supprimer. Réessayez dans quelques instants.";
                res.status(500).json({message , data: error});

            })
     })
}

searchPokemon = (app) => {
    app.get('/api/pokemon/search/:name', (req , res) => {
        Pokemon.findAll({
            where : {
                name :{
                    [Op.like] : `%${req.params.name}%`
                }
            }
        })
            .then((pokemonsSearch) => {
                if(!pokemonsSearch.length > 0) {
                    return res.status(404).json({message: "le nom ne correspond pas à un pokémon ! Veuillez réessayer avec un autre nom", status: 404})
                }
                console.log(pokemonsSearch);
                res.json({message: "Vous avez trouvé un ou plusieurs pokémons" , data : pokemonsSearch , status : 200})
            })
            .catch(error => {
                const message = "Le pokémon n'a pas pu être trouver. Réessayez dans quelques instants.";
                res.status(500).json({message , data: error});
            })
    })
}

limitPokemon = (app) => {
    app.get("/api/pokemon/limit/:num" , (req , res) => {
        sequelize.query(`select * from pokemons limit ${req.params.num}` , {
            type:sequelize.QueryTypes.SELECT
        })
            .then(pokemons => {
                if(!pokemons.length > 0) return res.status(404).json({message: `liste de pokémon hors-limite`})
                // console.log(pokemons)
                res.json({message: `liste de pokémon avec une limite de ${req.params.num} on été récupérée avec succès` , data : pokemons})
            })
    })
}

searchPokemonByTypes = (app) => {
    app.get("/api/pokemon/types/:type" , auth,   (req , res) => {
       sequelize.query(`SELECT * FROM pokemons WHERE types = "["${req.params.type}"]"`, {type:sequelize.QueryTypes.SELECT}).then(
           pokemons => {
               if(!pokemons.length > 0) return res.status(404).json({message: "le types cherché n'existe pas ou n'a pas encore ajouté !"})
               // console.log(pokemons)
               res.json({message: `des pokémons de type ${req.params.type} on été trouvé avec succès` , data : pokemons})
           }
       ).catch(error => {
               const message = "Le pokémon n'a pas pu être trouver par le type. Réessayez dans quelques instants.";
               res.status(500).json({message , data: error});
       })
    })
}

orderByPokemon = (app) => {
    app.get("/api/pokemon/order/:name", (req , res) => {
        Pokemon.findAll({
            order : [req.params.name]
        })
            .then(pokemons => {
                if(!pokemons.length > 1) return res.status(404).json({message: "Vous n'avez pas récupérée la liste de pokémon avec succès , la colonne n'existe pas" , data : pokemons})
                res.json({message: "vous avez récupérer avec succès les pokémon" , data: pokemons , status: 200})
            })
            .catch(error => {
                const message = "Le pokémon n'a pas pu être récupéréer. Réessayez dans quelques instants.";
                res.status(500).json({message , data: error});
            })
    })

}

searchByPagination = (app) => {
    app.get("/api/pokemon/paginated/by" , (req, res) => {
        //if(!Number.isInteger(req.query.page) || !Number.isInteger(req.query.limit)) return res.status(404).json({message : "Les paramétres limit et page doivent être des nombres entier."})
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        if(limit <= 0 || page <= 0) return res.status(404).json({ message: "Les paramètres limit et page doivent être supérieurs à zéro." });
        const offset = (page - 1) * limit;
        Pokemon.findAndCountAll({
            limit, offset
        }).then(({count , rows}) => {
            if(page > (count/limit)) return res.status(404).json({message : "la page supérieur au nombre total de pokémon."})
            res.json({message: "Vous avez les pokémons avec succès." , data : {count : count , rows : rows} , status: 200})
        }) .catch((error) => {
            res.status(500).json({ error: "Erreur lors de la récupération des éléments.", data: error });
        });

    })
}

module.exports =[
    findAllPokemon,
    findPokemon,
    createPokemon,
    updatePokemon,
    deletePokemon,
    searchPokemon,
    searchPokemonByTypes,
    limitPokemon,
    orderByPokemon,
    searchByPagination
]

/**
 *
 *  les status http :
 *  1/ l'information => métadonnée
 *  2/ le succès => 200 , 201
 *  3/ La redirection => 301,302
 *  4/ Erreur du Client => 400 , 404 => introuvable
 *  5/ Erreur de Serveur => 500 , 501
 * */