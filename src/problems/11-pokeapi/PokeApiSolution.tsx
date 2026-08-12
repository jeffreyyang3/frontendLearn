import { useEffect, useState } from "react";
import { EmptySolution } from "../EmptySolution";

const POKEMON_API = "https://pokeapi.co/api/v2/pokemon";

// Example: GET https://pokeapi.co/api/v2/pokemon/pikachu
type Pokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
  };
  types: Array<{
    type: { name: string };
  }>;
  stats: Array<{
    base_stat: number;
    stat: { name: string };
  }>;
};

const fetchPoke = async ({
  offset,
  limit,
  signal,
}: {
  offset: number;
  limit: number;
  signal: AbortSignal;
}) => {
  console.log({ offset, limit });
  const pokemonList = await (
    await fetch(POKEMON_API + `?limit=${limit}&offset=${offset}`, { signal })
  ).json();
  console.log(pokemonList);
  return pokemonList;
};
const PAGE_SIZE = 20;

export default function PokeApiSolution() {
  const [currList, setCurrList] = useState<Pokemon[]>([]);
  const [currPage, setCurrPage] = useState(0);
  useEffect(() => {
    const abortController = new AbortController();
    fetchPoke({
      offset: currPage * PAGE_SIZE,
      limit: PAGE_SIZE,
      signal: abortController.signal,
    }).then(setCurrList);

    return () => abortController.abort();
  }, [currPage]);

  return (
    <div>
      <h1>cool</h1>

      <button onClick={() => setCurrPage((currPage) => currPage + 1)}>
        next page
      </button>
      {JSON.stringify(currList)}
    </div>
  );
}
