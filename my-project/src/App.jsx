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
  const {selected, description, loading: loadingDetails,error: errorDetails,fetchPokemonDetails,} = usePokemonDetails();

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
    fetchPokemonDetails(pokemon.name);
    
  };

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(lastPage, p + 1));

  return (
    <div className="bg-[#DC0028] min-h-screen">
      <div className="bg-gray-700 px-4 py-2 text-white">
        <h1 className="text-4xl font-[font-pokemon] text-center">Pokémon API</h1>

        <div className="flex items-center gap-2 justify-center mt-2 mb-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-center px-3 py-2 rounded border-2 border-white"
            type="text"
            placeholder="Search By Name"
          />
        </div>
      </div>

      <main className="flex flex-col md:flex-row min-h-screen border border-black">
        {/* 70% */}
        <div className="w-full md:basis-[70%] bg-[#DC0028] px-6 py-10">
          <div className="border-3 border-black flex flex-col items-center bg-gray-700 max-w-5xl mr-2 py-8 px-6 rounded-xl">
            {loading && <p className="text-white">Loading Pokémon...</p>}
            {error && <p className="text-white">Error: {error}</p>}

            <h1 className="text-xl font-bold text-center text-white mb-6">
              Pokémon List
            </h1>

            <ul className="grid grid-flow-col grid-rows-5 gap-x-20 gap-y-30 mt-1">
              {!loading && filteredList.length === 0 && (
                <p className="text-white mt-4">No Pokémon found</p>
              )}

              {pageItems.map((pokemon) => (
              <button key={pokemon.name} onClick={() => handleSelect(pokemon)} className="text-white bg-blue-500 border-2 border-black rounded-lg  hover:bg-blue-600 transition duration-200 shadow-md h-24 w-32 flex flex-col items-center justify-center ">
                <img
                  src={pokemon.sprite} alt={pokemon.name}className="w-16 h-16"/>
                <span className="text-white capitalize">{pokemon.name}</span>
              </button>
              ))}
            </ul>

            <div className="flex items-center gap-2 mt-6 flex-wrap justify-center">
              <button
                onClick={goPrev} disabled={page === 1} className="text-white bg-gray-900 rounded-lg px-3 py-2 disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
                <button
                  key={p} onClick={() => setPage(p)} className={`rounded-lg px-3 py-2 border-2 border-black font-semibold ${p === page ? "bg-yellow-400 text-black" : "bg-white text-black hover:bg-gray-200"}`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={goNext} disabled={page === lastPage} className="text-white bg-gray-900 rounded-lg px-3 py-2 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* 30% */}
        <div className="w-full md:basis-[30%] bg-[#DC0028] px-30 py-10 flex flex-col items-center border-l-4 border-[#DC0028]">
          {loadingDetails && (
            <p className="text-white mt-1">Loading details...</p>
          )}
          {errorDetails && <p className="text-white">Error: {errorDetails}</p>}

          {selected && (
            <div className="border-3 border-black flex flex-col items-center bg-gray-700 max-w-5xl mr-2 px-6 rounded-xl">
              <h1 className="text-xl mt-10 font-semibold text-center text-white mb-4">
                Details
              </h1>

              <div className="border-black border-2">
                <div className="rounded border-28 border-white bg-[#272525] p-50 relative overflow-hidden h-50 w-50">
                  <img
                    alt={selected.name}
                    src={
                      selected.sprites.versions["generation-v"]["black-white"]
                        .animated.front_default
                    }
                    className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 scale-400"
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
                          {selected.types.map((typeInfo) => (
                            <span
                              key={typeInfo.type.name}
                              className={`tracking-widest uppercase px-2 py-1 rounded-full font-semibold ${
                                typeStyles[typeInfo.type.name] ||
                                "bg-gray-300 text-gray-900"
                              }`}
                            >
                              {typeInfo.type.name}
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
                        <span className="text-right">{selected.height}</span>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="block">
                      <div className="flex justify-between items-start bg-white rounded-lg shadow px-4 py-3 mx-6 mt-2 mb-5">
                        <span className="font-semibold text-gray-600">Weight</span>
                        <span className="text-right">{selected.weight}</span>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="block">
                      <div className="flex justify-between items-start bg-white rounded-lg shadow px-4 py-3 mx-6 mt-2 mb-10">
                        <span className="font-semibold text-gray-600">
                          Description
                        </span>
                        <div className="text-right max-w-1/2">{description}</div>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="block">
                      <div className="flex justify-between items-start bg-white rounded-lg shadow px-4 py-3 mx-6 mt-2 mb-10" >
                        <span className="font-semibold text-gray-600">
                          Abilities
                        </span>
                        <div className="text-right max-w-1/2 flex-nowrap gap-2">  {selected.abilities.map((a) => (
                          <div key={a.ability.name} className="flex flex-grid gap-2 items-center leading-tight">
                            <span className="font-semibold text-gray-900">
                              {a.ability.name.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
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
