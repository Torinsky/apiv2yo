// src/hooks/usePokemonDetails.js
import { useState } from "react";

export const usePokemonDetails = () => {
  const [selected, setSelected] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPokemonDetails = async (pokemonId) => {
    setLoading(true);
    setError(null);

    try {
      // Datos principales
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`
      );
      const jsonData = await response.json();
      setSelected(jsonData);

      // Descripción
      const speciesResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`
      );
      const speciesData = await speciesResponse.json();

      const flavor = speciesData.flavor_text_entries.find(
        (entry) => entry.language.name === "en"
      );

      setDescription(
        flavor
          ? flavor.flavor_text.replace(/\f|\n|\r/g, " ")
          : "Descripción no disponible."
      );
    } catch (err) {
      console.error("Error fetching pokemon:", err);
      setError("Error al obtener datos");
      setSelected(null);
      setDescription("Descripción no disponible.");
    } finally {
      setLoading(false);
    }
  };

  return {
    selected,
    description,
    loading,
    error,
    fetchPokemonDetails,
  };
};