import Product from "../models/productModel.mjs";
import Brand from "../models/brandModel.mjs";
import Category from "../models/categoryModel.mjs";

// CREATE PRODUCT (with Cloudinary)
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, category, brand, isActive } = req.body;

    // VALIDATION
    if (!title || !description || !price || !stock) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // --- THUMBNAIL UPLOAD ---
    let thumbnailUrl = "";
    if (req.files?.thumbnail?.length > 0) {
      thumbnailUrl = req.files.thumbnail[0].path;
    }

    if (!thumbnailUrl) {
      return res.status(400).json({ message: "Thumbnail is required" });
    }

    // --- MULTIPLE IMAGES UPLOAD ---
    let imageUrls = [];
    if (req.files?.images?.length > 0) {
      imageUrls = req.files.images.map(file => file.path);
    }

    // Create product
    const product = await Product.create({
      title,
      description,
      price,
      stock,
      category_id: category,
      brand_id: brand,
      thumbnail: thumbnailUrl,
      images: imageUrls,
      isActive: isActive ?? true
    });

    res.status(201).json({
      message: "Product created successfully",
      product
    });

  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("brand_id", "name")
      .populate("category_id", "name");

    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// GET ALL Active PRODUCTS
export const getActiveProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate("brand_id", "name")
      .populate("category_id", "name");

    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// GET ALL InActive PRODUCTS
export const getInActiveProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: false })
      .populate("brand_id", "name")
      .populate("category_id", "name");

    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};
// GET SINGLE PRODUCT
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("brand_id", "name")
      .populate("category_id", "name");

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updates = {};

    // NORMAL FIELDS
    if (req.body.title) updates.title = req.body.title;
    if (req.body.description) updates.description = req.body.description;
    if (req.body.price) updates.price = req.body.price;
    if (req.body.stock) updates.stock = req.body.stock;
    if (req.body.category) updates.category_id = req.body.category;
    if (req.body.brand) updates.brand_id = req.body.brand;
    if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;

    // --- THUMBNAIL UPDATE ---
    let thumbnailUrl = product.thumbnail;

    if (req.files?.thumbnail?.length > 0) {
      thumbnailUrl = req.files.thumbnail[0].path;
    }

    updates.thumbnail = thumbnailUrl;

    // --- IMAGES UPDATE ---
    let existingImages = product.images || [];

    // Deleted Images From Frontend (optional)
    if (req.body.deletedImages) {
      const deleteList = JSON.parse(req.body.deletedImages);
      existingImages = existingImages.filter(img => !deleteList.includes(img));
    }

    // Add Newly Uploaded Images
    let newImages = [];
    if (req.files?.images?.length > 0) {
      newImages = req.files.images.map(file => file.path);
    }

    updates.images = [...existingImages, ...newImages];

    // UPDATE PRODUCT
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};
