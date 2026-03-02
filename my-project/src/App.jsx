import { useEffect, useState } from "react";
import { useFetchPokemon } from "./Hooks/fetchpokemon";
import { usePokemonDetails } from "./Hooks/fetchpokemonDetails";

function App() {
  const typeStyles = {
    normal: "bg-gray-500 text-white",
    fire: "bg-orange-500 text-white",
    water: "bg-blue-500 text-white",
    electric: "bg-yellow-400 text-white",
    grass: "bg-green-500 text-white",
    ice: "bg-cyan-300 text-white",
    fighting: "bg-red-700 text-white",
    poison: "bg-purple-600 text-white",
    ground: "bg-amber-600 text-white",
    flying: "bg-indigo-300 text-white",
    psychic: "bg-pink-500 text-white",
    bug: "bg-lime-600 text-white",
    rock: "bg-stone-500 text-white",
    ghost: "bg-violet-700 text-white",
    dragon: "bg-indigo-700 text-white",
    dark: "bg-gray-800 text-white",
    steel: "bg-slate-400 text-white",
    fairy: "bg-pink-300 text-white",
  };

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { pokemonList, loading, error, fetchPokemon } = useFetchPokemon();

  // Ahora details solo setea selected (ya no trae description aparte)
  const {
    selected,
    loading: loadingDetails,
    error: errorDetails,
    fetchPokemonDetails,
  } = usePokemonDetails();

  const filteredList = pokemonList.filter((p) =>
    p.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const pageSize = 20;
  const lastPage = Math.max(1, Math.ceil(filteredList.length / pageSize));

  const start = (page - 1) * pageSize;
  const end = page * pageSize;
  const pageItems = filteredList.slice(start, end);

  useEffect(() => {
    fetchPokemon();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleSelect = (pokemon) => {
    // Antes: fetchPokemonDetails(pokemon.name);
    // Ahora: le pasamos el OBJETO completo (ya viene con todos los campos)
    fetchPokemonDetails(pokemon);
  };

  const reload = () => {
    window.location.reload();
  };
  

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(lastPage, p + 1));

  return (
    <div className="bg-[#B91C1C] min-h-screen">
      <header className="bg-[#111827] px-4 py-2 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between ml-20 ">
          <button onClick={reload}>
            <img alt="PokéAPI" className="h-10" src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png"></img>
          </button>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-center px-3 py-2 rounded border-2 border-white text-white w-full sm:w-64 mt-2 mb-2"
            type="text"
            placeholder="Search By Name"
          />
        </div>
      </header>

      <main className="flex flex-col md:flex-row min-h-screen border border-[#B91C1C]">
        {/* 70% */}
        <div className="w-full md:basis-[70%] bg-#B91C1C px-32 py-10">
          <div className="border-3 border-[] flex flex-col items-center bg-[#1F2937] max-w-5xl mr-2 py-8 px-6 rounded-xl">
            {loading && <p className="text-white">Loading Pokémon...</p>}
            {error && <p className="text-white">Error: {error}</p>}



            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full justify-center">
              {!loading && filteredList.length === 0 && (
                <p className="text-white mt-4">No Pokémon found</p>
              )}

              {pageItems.map((pokemon) => (
                <button
                  key={pokemon.name}
                  onClick={() => handleSelect(pokemon)}
                  className="text-white mt-6 bg-[#2563EB] border-2 border-black rounded-lg hover:bg-[#1D4ED8] transition duration-200 shadow-md h-24 w-full flex flex-col items-center justify-center"
                >
                  <img
                    src={`${pokemon.sprite}`}
                    alt={pokemon.name}
                    className="w-12 h-12"
                  />
                  <span className="text-white capitalize">{pokemon.name}</span>
                </button>
              ))}
            </ul>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                onClick={goPrev}
                disabled={page === 1}
                className="text-white bg-gray-900 mt-8 rounded-lg px-3 py-2 disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`rounded-lg px-3 py-2 border-2 mt-8 border-black font-semibold ${
                    p === page
                      ? "bg-[#FACC15] text-black"
                      : "bg-white text-black hover:bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={goNext}
                disabled={page === lastPage}
                className="text-white mt-8 bg-gray-900 rounded-lg px-3 py-2 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* 30% */}
        <div className="h-full w-full md:basis-[30%] bg-[#B91C1C] px-4 sm:px-6 py-10 flex flex-col items-center border-l-4 mr-18 border-[#B91C1C] ">  
          {loadingDetails && <p className="text-white mt-1">Loading details...</p>}
          {errorDetails && <p className="text-white">Error: {errorDetails}</p>}

          {selected && (
            <div className="border-3 border-black flex flex-col items-center bg-[#374151] max-w-5xl mr-2 px-6 rounded-xl">
              <h1 className="text-xl mt-10 font-semibold text-center text-white mb-4">
                Details
              </h1>

              <div className="border-black border-2">
                <div className="rounded border-[12px] border-white bg-[#272525] relative overflow-hidden
                                w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
                  <img
                    alt={selected.name}
                    src={selected.sprite}
                    className="w-28 h-28 sm:w-36 sm:h-36 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selected.id}.png`;
                    }}
                  />
                </div>
              </div>
              <div className="my-10 border-8 text-white bg-gray-600 p-4 rounded-full">
                <h1 className="text-xl font-bold text-center">
                  {"#" +
                    selected.id +
                    " " +
                    selected.name.charAt(0).toUpperCase() +
                    selected.name.slice(1)}
                </h1>
              </div>

              <table className="w-full bg-gray-700 rounded-lg p-2">
                <tbody className="[&>tr]:block [&>tr]:mb-3 last:[&>tr]:mb-0">
                  <tr>
                    <td className="block">
                      <div className="flex justify-between items-start bg-white rounded-lg shadow px-4 py-3 mx-6 mt-2 mb-5">
                        <span className="font-semibold text-gray-600">Type</span>

                        <span className="text-right flex gap-2 justify-end flex-wrap">
                          {(selected.types || []).map((typeName) => (
                            <span
                              key={typeName}
                              className={`tracking-widest uppercase px-2 py-1 rounded-full font-semibold ${
                                typeStyles[typeName] || "bg-gray-300 text-gray-900"
                              }`}
                            >
                              {typeName}
                            </span>
                          ))}
                        </span>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="block">
                      <div className="flex justify-between items-start bg-white rounded-lg shadow px-4 py-3 mx-6 mt-2 mb-5">
                        <span className="font-semibold text-gray-600">Height</span>
                        <span className="text-right">{selected.height} m</span>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="block">
                      <div className="flex justify-between items-start bg-white rounded-lg shadow px-4 py-3 mx-6 mt-2 mb-5">
                        <span className="font-semibold text-gray-600">Weight</span>
                        <span className="text-right">{selected.weight} kg</span>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="block">
                      <div className="flex justify-between items-start bg-white rounded-lg shadow px-4 py-3 mx-6 mt-2 mb-10">
                        <span className="font-semibold text-gray-600">Description</span>
                        <div className="text-right max-w-1/2">
                          {selected.description || "Descripción no disponible."}
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="block">
                      <div className="flex justify-between items-start bg-white rounded-lg shadow px-4 py-3 mx-6 mt-2 mb-10">
                        <span className="font-semibold text-gray-600">Abilities</span>

                        <div className="text-right max-w-1/2 flex-nowrap gap-2">
                          {(selected.abilities || []).map((a) => (
                            <div
                              key={a.name}
                              className="flex flex-grid gap-2 items-center leading-tight"
                            >
                              <span className="font-semibold text-gray-900">
                                {a.name
                                  .replaceAll("-", " ")
                                  .replace(/\b\w/g, (c) => c.toUpperCase())}
                              </span>

                              {a.is_hidden && (
                                <span className="text-[11px] text-gray-600">
                                  Hidden Ability
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;