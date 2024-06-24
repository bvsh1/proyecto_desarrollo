import express from 'express';
import Bill from '../models/bill.js';
import jwtAuthenticated from "../helpers/jwtAuthenticated.js";
import getCurrentUser from "../helpers/getCurrentUser.js";

const router = express.Router();

// Ruta para obtener todas las facturas del usuario autenticado (listo)
router.get('/bill', jwtAuthenticated, async (req, res) => {
  const userId = req.user.id;

  try {
    const bills = await Bill.find({ userId }).populate('products.productId');
    res.json(bills);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});
// Ruta para obtener una factura específica por ID
router.get('/bill/:id', jwtAuthenticated, async (req, res) => {
  const billId = req.params.id;
  const userId = req.user.id;

  try {
    const bill = await Bill.findOne({ _id: billId, userId }).populate('products.productId');
    if (!bill) {
      return res.status(404).send('Factura no encontrada');
    }
    res.json(bill);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

export default router;

