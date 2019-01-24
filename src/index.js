import React from "react";
import ReactDOM from "react-dom";
// 1. add `react-cache` as a project dependency
// 2. import cache and resource creators from react-cache
import { unstable_createResource as createResource } from "react-cache";


// 4. create a pokemon resource that fetches data
let PokemonCollectionResource = createResource(() =>
  fetch("https://pokeapi.co/api/v2/pokemon/").then(res => res.json())
);

function PokemonListItem({ className, component: Component = "li", ...props }) {
  return (
    <Component
      className={["pokemon-list-item", className].join(" ")}
      {...props}
    />
  );
}

// 5. pull your resource-reading UI into a component
function PokemonList() {
  return (
    <ul>
      {/* 6. read resource data into and from the cache */}
      {PokemonCollectionResource.read().results.map(pokemon => (
        <PokemonListItem key={pokemon.name}>{pokemon.name}</PokemonListItem>
      ))}
    </ul>
  );
}

function App() {
  return (
    <div>
      <h1>
        <span role="img" aria-label="React Holiday">
          ⚛️🎄✌️
        </span>
        : Day 3
      </h1>
      {/* 7. wrap your resource-reading component in the Suspense component */}
      {/*    ...and provide a fallback */}
      <React.Suspense fallback={<div>...loading</div>}>
        <PokemonList />
      </React.Suspense>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);