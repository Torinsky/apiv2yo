import { useState } from "react";

export const useFetchPokemon = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPokemon = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/pokemon?limit=151");
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      console.log(Array.isArray(data), data[0], data.results);

      const mapped = data.map((p) => ({
        id: p.id,
        name: p.name,
        sprite: p.sprites,
        types: p.types,
        height: p.height,
        weight: p.weight,
        description: p.description,
        abilities: p.abilities,
      }));

      setPokemonList(mapped);
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return { pokemonList, loading, error, fetchPokemon };
};