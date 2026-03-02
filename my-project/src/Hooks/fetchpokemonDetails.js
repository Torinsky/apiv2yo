import { useState } from "react";

export const usePokemonDetails = () => {
  const [selected, setSelected] = useState(null);

  const fetchPokemonDetails = (pokemonObj) => {
    setSelected(pokemonObj);
  };

  return { selected, fetchPokemonDetails };
};