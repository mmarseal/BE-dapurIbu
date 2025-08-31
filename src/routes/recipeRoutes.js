import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Recipe from "../models/Recipe.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();
// nanti sesuaikan untuk api dan db nya dri yang sudah diberi tanda komentar
router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;
    // const { title, image, ingredients, steps } = req.body;

    if (!image || !title || !caption || !rating) {
      // (!image || !title || !ingredients || !steps)
      return res.status(400).json({ message: "Silakan isi semua kolom" });
    }

    // upload the image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    // save to the database
    const newRecipe = new Recipe({
      title,
      caption,
      rating,
      //   ingredients, steps,
      image: imageUrl,
      user: req.user._id,
    });

    await newRecipe.save();

    res.status(201).json(newRecipe);
  } catch (error) {
    console.log("Error creating Recipe", error);
    res.status(500).json({ message: error.message });
  }
});

// pagination => infinite loading
router.get("/", protectRoute, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;

    const Recipes = await Recipe.find()
      .sort({ createdAt: -1 }) // desc
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");

    const totalRecipes = await Recipe.countDocuments();

    res.send({
      Recipes,
      currentPage: page,
      totalRecipes,
      totalPages: Math.ceil(totalRecipes / limit),
    });
  } catch (error) {
    console.log("Error in get all Recipes route", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get recommended Recipes by the logged in user
router.get("/user", protectRoute, async (req, res) => {
  try {
    const Recipes = await Recipe.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(Recipes);
  } catch (error) {
    console.error("Get user Recipes error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const Recipe = await Recipe.findById(req.params.id);
    if (!Recipe)
      return res.status(404).json({ message: "Resep tidak ditemukan" });

    // check if user is the creator of the Recipe
    if (Recipe.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Unauthorized" });

    // https://res.cloudinary.com/de1rm4uto/image/upload/v1741568358/qyup61vejflxxw8igvi0.png
    // delete image from cloduinary as well
    if (Recipe.image && Recipe.image.includes("cloudinary")) {
      try {
        const publicId = Recipe.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.log(
          "Kesalahan saat menghapus gambar dari Cloudinary",
          deleteError
        );
      }
    }

    await Recipe.deleteOne();

    res.json({ message: "Resep berhasil dihapus" });
  } catch (error) {
    console.log("gagal menghapus resep", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
