const express= require("express");
const app = express();
const morgan = require("morgan");
const favicon = require("serve-favicon");
const bodyParser = require('body-parser');
const sequelize = require('./Src/Data/SequelizeData');
const port = process.env.PORT || 3000; //port 3000
const pokemonRoutes= require('./Src/Routes/PokemonRoutes');
const userRoutes = require('./Src/Routes/UserRoutes')
app
    .use(favicon(__dirname + "/favicon.ico"))
    .use(morgan('dev'))
    .use(bodyParser.json())
;
sequelize.getConnexion();

app.get("/", (req , res) => {

    res.json("Hello Heroku")

})
//ici il ya les endpoints :
pokemonRoutes.forEach(method => {
    method(app);
})

userRoutes.forEach(method => {
    method(app);
})


//gestion des erreurs
app.use(({res}) => {
    const message = "Impossible de trouver la ressource demandé! Vous pouvez essayer une autre URl";
    res.status(404).json({message});
})


app.listen(port , () => {
    console.log(`Notre application Node a démarée sur : https://localhost:${port}`)
});