import dotenv from "dotenv";
import mongoose from "mongoose";
import { Pokemon } from "./models/Pokemon.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const LIMIT = process.env.SEED_LIMIT;


async function fetchJson(url) {
  const r = await fetch(url);
  if (!r.ok) {
    const text = await r.text();
    throw new Error("HTTP " + r.status + " en " + url + " -> " + text);
  }
  return await r.json();
}

function getEnglishFlavorText(species) {
  const entries = species.flavor_text_entries;
  if (!Array.isArray(entries)) return null;

  const en = entries.find((x) => x.language && x.language.name === "en");
  if (!en || !en.flavor_text) return null;

  return en.flavor_text.replace(/\s+/g, " ").trim();
}

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Mongo conectado:", mongoose.connection.name);

  const list = await fetchJson(
    "https://pokeapi.co/api/v2/pokemon?limit=" + LIMIT + "&offset=0"
  );

  const docs = list.results.map((p) => {
    const parts = p.url.split("/").filter(Boolean);
    const id = Number(parts[parts.length - 1]);
    return { id, name: p.name };
  });

  // Cache simple de habilidades para no pedir la misma mil veces
  const abilityCache = new Map();

  async function getAbilityDescriptionEn(url) {
    if (abilityCache.has(url)) return abilityCache.get(url);

    const data = await fetchJson(url);
    const effectEn = Array.isArray(data.effect_entries)
      ? data.effect_entries.find((e) => e.language && e.language.name === "en")
      : null;

    const desc = effectEn && effectEn.effect ? effectEn.effect : null;
    abilityCache.set(url, desc);
    return desc;
  }

  const result = [];

  for (const p of docs) {
    const maind = await fetchJson("https://pokeapi.co/api/v2/pokemon/" + p.id + "/");
    const species = await fetchJson("https://pokeapi.co/api/v2/pokemon-species/" + p.id + "/");

    const abilities = [];
    for (const ab of maind.abilities) {
      const desc = await getAbilityDescriptionEn(ab.ability.url);
      abilities.push({
        name: ab.ability.name,
        is_hidden: ab.is_hidden,
        description: desc
      });
    }

    result.push({
      id: p.id,
      name: p.name,
      description: getEnglishFlavorText(species),
      height: maind.height / 10,
      weight: maind.weight / 10,
      types: maind.types.map((t) => t.type.name),
      abilities: abilities,
      sprites: maind.sprites.versions['generation-v']['black-white'].animated.front_default
    });
  }

  // Si es 1 sola vez, lo más seguro es limpiar y luego insertar
  await Pokemon.deleteMany({});
  await Pokemon.insertMany(result);

  await mongoose.disconnect();
  process.exit(0);
}
main().catch(async (e) => {
  console.error("Seed error:", e);
  try { await mongoose.disconnect(); } catch (err) {}
  process.exit(1);
});