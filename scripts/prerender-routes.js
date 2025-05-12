const TOTAL_POKEMONS = 10;
const TOTAL_PAGES = 5;

(async () => {
  const fs = require('fs');

  // Por pokemon id
  const pokemonIds = Array.from({ length: TOTAL_POKEMONS }, (_, i) => i + 1);
  let fileContent = pokemonIds.map(id => `/pokemons/${id}`).join('\n');
  fileContent += '\n';

  // Por paginación
  const pokemonPages = Array.from({ length: TOTAL_PAGES }, (_, i) => i +1);
  fileContent += pokemonPages.map(page => `/pokemons/page/${page}`).join('\n');

  // Por nombres de pokemons
  const pokemonNameList = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMONS}`).then(res => res.json());
  fileContent += '\n';
  fileContent += pokemonNameList.results.map(pokemon => `/pokemons/${pokemon.name}`).join('\n');


  fs.writeFileSync('routes.txt', fileContent);
  console.log('routes.txt generated');
})();
