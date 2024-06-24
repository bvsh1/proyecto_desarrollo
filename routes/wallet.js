import express from 'express';
import User from '../models/user.js';
import jwtAuthenticated from "../helpers/jwtAuthenticated.js";
import getCurrentUser from "../helpers/getCurrentUser.js";

const router = express.Router();

// Ruta para ver el balance del wallet (listo)
router.get('/wallet', jwtAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
    
        const user = await User.findById(userId);
    
        if (!user) {
          return res.status(404).send('Usuario no encontrado');
        }
    
        // Renderizar la vista con el balance del wallet
        res.json({ balance: user.amount });
    
      } catch (error) {
      console.error(error);
      res.status(500).send('Error en el servidor');
    }
  });

// Ruta para agregar dinero al wallet (listo)
router.put('/wallet/charge', jwtAuthenticated, async (req, res) => {
    const { amount } = req.body;
  
    if (!amount || isNaN(amount) || amount < 0) {
      return res.status(400).json({ error: 'Cantidad inválida' });
    }
  
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      user.amount += parseFloat(amount);
      await user.save();
  
      res.redirect('/wallet');
    } catch (error) {
      console.error('Error al agregar dinero al wallet:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  });

export default router;
