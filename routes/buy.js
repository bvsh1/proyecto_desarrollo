import express from 'express';
import Bill from '../models/bill.js';
import Product from '../models/product.js';
import jwtAuthenticated from "../helpers/jwtAuthenticated.js";
import getCurrentUser from "../helpers/getCurrentUser.js";
import User from '../models/user.js';

const router = express.Router();

// Ruta para realizar una compra
router.post('/buy', jwtAuthenticated, async (req, res) => {
  const { id, quantityProducts } = req.body;

  if (!id || !quantityProducts || isNaN(quantityProducts) || quantityProducts <= 0) {
    return res.status(400).send('Datos de la solicitud inválidos');
  }

  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
      return res.status(401).send('Usuario no autenticado');
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send(`Producto con id ${id} no encontrado`);
    }

    if (product.stock < quantityProducts) {
      return res.status(400).send(`Stock insuficiente para el producto ${product.name}`);
    }

    const totalAmount = product.price * quantityProducts;

    if (user.amount < totalAmount) {
      return res.status(400).send('Saldo insuficiente en el wallet');
    }

    product.stock -= quantityProducts;
    await product.save();

    user.amount -= totalAmount;
    await user.save();

    const newBill = new Bill({
      userId: user._id,
      products: [{ productId: product._id, quantity: quantityProducts }],
      totalAmount: totalAmount,
      date: new Date()
    });

    await newBill.save();

    res.status(201).send('Compra realizada exitosamente y factura generada');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

export default router;
