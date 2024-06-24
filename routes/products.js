import express from "express";
import jwtAuthenticated from "../helpers/jwtAuthenticated.js";
import Product  from "../models/product.js";
import getCurrentUser from "../helpers/getCurrentUser.js";
import { app } from "../app.js";
import isAdmin from "../helpers/isAdmin.js";
import User from '../models/user.js';
const router = express.Router();

//mostrar todos los productos (listo)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para crear un nuevo producto (requiere autenticación de administrador)
router.post("/products", jwtAuthenticated, async (req, res) => {
  console.log("Request Body:", req.body);
  const { name, price, description, stock } = req.body;

  try {
    const userId = req.user.id;
    const admin = await isAdmin(userId);
    if (!admin) {
      return res.status(403).send('Acceso denegado. Usuario no es administrador.');
    }
    const newProduct = new Product({ name, price, description, stock });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating product.' });
  }
});

// Edita un producto
router.put('/products/:id', jwtAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { name, price, description, stock } = req.body;

  try {
    const userId = req.user.id;
    const admin = await isAdmin(userId);
    if (!admin) {
      return res.status(403).send('Acceso denegado. Usuario no es administrador.');
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, description, stock },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).send('Producto no encontrado');
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});
export default router