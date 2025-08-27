import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// const recipeSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     image: { type: String, required: true },
//     ingredients: { type: [String], required: true },
//     steps: { type: [String], required: true },
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//   },
// );

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
