import mongoose from "mongoose";

const abilitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    is_hidden: { type: Boolean, required: true },
    description: { type: String, default: null }
  },
  { _id: false }
);


const pokemonSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    height: {type: Number, required: false},
    weight: {type: Number, required: false},
    description: {type: String, required: false},
    abilities: [abilitySchema],
    types: [{type: String, required:false}],
    sprites: {type: String, required:true}
  },
  { collection: "pokemon", timestamps: true } // fuerza colección "pokemon"
);

export const Pokemon = mongoose.model("Pokemon", pokemonSchema);