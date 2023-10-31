
module.exports =(sequelize , DataTypes) => {
    return sequelize.define('User' , {
        id: {
            type: DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement: true
        },
        username : {
            type: DataTypes.STRING,
            allowNull : false,
            unique : {
                msg : "Le nom est déjà pris."
            }
        },
        password : {
            type : DataTypes.STRING,
            allowNull: false
        },
        roles : {
            type : DataTypes.JSON,
            allowNull : false
        },

    })
}