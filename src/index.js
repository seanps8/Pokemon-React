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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ? (
        this.props.fallback
      ) : (
        <div>Something went wrong</div>
      );
    }

    return this.props.children;
  }
}

// 5. pull your resource-reading UI into a component
function PokemonList({ renderItem }) {
  return (
    <ul>
      {/* 6. read resource data into and from the cache */}
      {PokemonCollectionResource.read().results.map(pokemon =>
        renderItem({id:pokemon.url.split("/")[6], ...pokemon})
      )}
    </ul>
  );
}

let PokemonResource = createResource((id) =>
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`).then(res => res.json())
);

function PokemonDetail({ pokemonId: id }) {
  let pokemon = PokemonResource.read(id);
  
  return <article>{pokemon.name}</article>
}

function App() {
  let [selectedPokemonId, setSelectedPokemonId] = React.useState(1);

  return (
    <div>
      <h1>
        <span role="img" aria-label="React Holiday">
          ⚛️🎄✌️
        </span>
        : Day 11
      </h1>
      {/* <strong>selected pokemon id: {selectedPokemonId}</strong> */}
      
      <ErrorBoundary fallback={<div>OOps! Pokemon got away</div>}>
        {/* 7. wrap your resource-reading component in the Suspense component */}
        {/*    ...and provide a fallback */}
        <React.Suspense fallback={<div>...loading</div>}>
          <PokemonDetail pokemonId={selectedPokemonId}/>
          <PokemonList
            renderItem={pokemon => (
              <PokemonListItem
                onClick={() => setSelectedPokemonId(pokemon.id)}
                key={pokemon.id}
              >
                {pokemon.name}
              </PokemonListItem>
            )}
          />

        </React.Suspense>
      </ErrorBoundary>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
