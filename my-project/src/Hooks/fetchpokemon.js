import { useState } from "react";

export const useFetchPokemon = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getIdFromUrl = (url) => {
    const parts = url.split("/").filter(Boolean);
    return parts[parts.length - 1];
  };

  const fetchPokemon = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      const mapped = data.results.map((p) => {
        const id = getIdFromUrl(p.url);
        return {...p,id: Number(id),sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,};});

      setPokemonList(mapped);
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return { pokemonList, loading, error, fetchPokemon };
};