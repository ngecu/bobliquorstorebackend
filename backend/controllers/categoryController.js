import asyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});

// @desc    Fetch single category
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    console.log(category);

    // Assuming you have a foreign key/reference field named "category" in the Product model
    const products = await Product.find({ category: req.params.id });

    // Send both category and associated products as a JSON response to the client
    res.json({ category, products });
  } catch (error) {
    // Handle errors here (e.g., log the error, send an error response, etc.)
    // In a real application, you might have a centralized error handling mechanism
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
});

// The asyncHandler function remains the same as mentioned in the previous response
// Please make sure you have the necessary imports and model definitions for Category and Product


// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin


const createCategory = asyncHandler(async (req, res) => {
 
  const category = new Category({
    name:"sample name category",
    description:"sample description",
    image:"https://www.barschool.net/sites/default/files/styles/image_gallery_xl/public/2022-05/Cuba%20Libre.jpg?h=2d7bcac0&itok=pEsF8LVB",
    brandings:['branding1']
  });

  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { name, description,image,brandings } = req.body;
  console.log(req.body)

  const category = await Category.findById(req.params.id);

  if (category) {
    category.name = name || category.name;
    category.description = description || category.description;
    category.image = image || category.image;
    category.brandings = brandings || category.brandings

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await category.remove();
    res.json({ message: 'Category removed' });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
