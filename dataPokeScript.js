const axios = require('axios');

async function fetchAndPostPokemons() {
    try {
        const response = await axios.get("https://api-pokemon-fr.vercel.app/api/v1/gen/9");
        const pokemons = response.data;
        const tabPre = [];
        const tabNext = [];
        for (const pokemon of pokemons) {
            console.log(pokemon.stats.hp);

            const talentArr = [];
            const typeArr = [];


            for (const talent of pokemon.talents) {
                console.log(talent.name);
                talentArr.push(talent.name);
            }

            for (const type of pokemon.types) {
                typeArr.push(type.name);
            }

            const postData = {
                name: pokemon.name.fr,
                hp: pokemon.stats.hp,
                cp: 4,
                pictures: pokemon.sprites.regular,
                location: { region: "Kanto" },
                stats: {
                    hp: pokemon.stats.hp,
                    attack: pokemon.stats.atk,
                    defense: pokemon.stats.def,
                    spe_attack: pokemon.stats.spe_atk,
                    spe_defense: pokemon.stats.spe_def,
                    speed: pokemon.stats.vit
                },
                types: typeArr,
                talent: talentArr,
                evolution: {
                    pre : (pokemon.evolution.pre !== null) ? pokemon.evolution.pre : "null",
                    next : (pokemon.evolution.next !== null) ? pokemon.evolution.next : "null",
                    mega : (pokemon.evolution.mega !== null) ? pokemon.evolution.mega : "null",
                }


            };

            console.log(JSON.stringify(postData));

            const postResponse = await axios.post("https://macabre-goblin-07789-458b56e3f2a6.herokuapp.com/api/pokemon/create", postData);
            console.log('Réponse de l\'API :', postResponse.data);
        }
    } catch (error) {
        console.error('Erreur lors de l\'appel API :', error);
    }
}

fetchAndPostPokemons();
