module.exports = (sequelize , DataTypes) => {
    return sequelize.define('Pokemon' , {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate : {
                //is : { args : /^[a-zA-Z0-9]+$/i , msg: "nom de pokémon non valide et conforme , pas de charactère spéciaux"},
                len : {args : [2, 25] , msg: "le nom doit avoir minimum 2 caractères et un maximum de 25 caractères"},
                notEmpty : { msg: "le nom ne peut être vide"},
                notNull : { msg: "le nom ne peut être null"},
            },
            unique : {
                msg : "le nom est déjà pris"
            },
        },
        hp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate : {
                min : {args: [0] , msg: "les points de vie sont compris entre 1 à 999"},
                max : {args: [999] , msg: "les points de vie sont compris entre 1 à 999"},
                isInt : {msg : 'Utilisez uniquement que des nombres entier positif pour les points de vie.'},
                notNull :{msg: 'Le nombre de point de vie ne peut être null'},
            }
        },

        pictures:{
            type: DataTypes.STRING,
            allowNull: false,
            validate : {
                notNull : {msg : 'le lien vers l\'image ne peut être null'},
                len : {args: [2 , 255] , msg: "le path doit avoir minimum 2 caractères et un maximum de 255 caractères"},
                notEmpty: {msg : "le lien de l'image ne peut être null"}
            }

        },
        types:{
            type: DataTypes.JSON,
            allowNull: false,
            get(){
              return this.getDataValue('types')
            },
            set(types){
                this.setDataValue('types' , types);
            },
            validate : {
                notNull : {msg : "le types ne peut être null , on doit renvoyer un type JSON => ['insecte']"},
                isTypesValid(value){
                    const types = ["Acier" , "Combat" , "Dragon" , "Eau" , "Électrik" , "Fée" , "Feu" , "Glace" , "Insecte" , "Normal" , "Plante" , "Poison" , "Psy" , "Roche" , "Sol", "Spectre" , "Ténèbres" , "Vol"];
                    if(!value) throw new Error("Un pokémon doit avoir au moins un type.");
                    if(value.length > 3) throw  new Error("Un pokémon ne peut avoir plus 3 types.");
                    value.forEach(type => {
                        if(!types.includes(type)) throw  new Error("Le type n'appartient  pas à la table des types de pokémon");
                    })
                }
            }
        },
        location : {
            type: DataTypes.JSON,
            allowNull:false,
            validate : {
                notNull : {msg: "La location ne peut être null"},
                isLocationValid(value){
                    const regions = ["Kanto" , "Johto" , "Hoenn" , "Sinnoh" , "Unys" , "Kalos" , "Alola" , "Galar" , "Paldea"]
                    //if(!Number.isInteger(value.region)) throw new Error("La région est une chaîne de caractère.");
                    if(value.region === null) throw new Error("La région ne peut être vide.")
                    if(!regions.includes(value.region)) throw new Error("La région n'existe pas")
                }
            }
        },
        stats: {
            type:  DataTypes.JSON,
            allowNull : false,
            validate : {
                notNull : {msg: "Les statistiques ne peuvent être null"},
                isStatsValid(value){
                    const stats = [value.hp , value.attack , value.defense, value.spe_attack , value.spe_defense , value.speed];
                    const labels = ["hp", "attack" , "defense" , "spe_attack" , "spe_defense" , "speed"];
                    stats.forEach(stat => {
                        //if(!stat.isInteger()) throw new Error("La statistique ne peut être négatif.");
                        if(stat > 300) throw new Error("La statistique ne peut être supérieur à 300.");
                        if(stat < 0) throw  new Error("La statistique ne peut être négatif.")
                    })
                    const labelStats = Object.getOwnPropertyNames(value);
                    labelStats.forEach(label => {
                           if(! labels.includes(label) ) throw new Error("Cette statistique n'existe pas.")
                    })
                }
            }

        },
        talent : {
            type : DataTypes.JSON,
            allowNull:false,
            validate : {
                notNull : {msg : "Le talent ne peut être null."},
                isTalentsValid(value){
                    value.forEach(talent => {
                        //if(!Number.isInteger(talent)) throw  new Error("le talent ne peut être un nombre , c'est un nombre entier!");
                    })
                }
            }

        },
        evolution : {
            type : DataTypes.JSON,
            allowNull:true,
        }
    }, {
        timestamps: true,
        createdAt: 'created',
        updatedAt: false
    });
}

