import express from "express";
import User from "../models/user.js";
import Bill from "../models/bill.js";
import jwt from "jsonwebtoken";
import jwtAuthenticated from "../helpers/jwtAuthenticated.js";
import getCurrentUser from "../helpers/getCurrentUser.js";
import bcrypt from "bcrypt";
import { app } from "../app.js";
const router = express.Router();
const adminOnly = (req, resp, next) => {
  if (!req.user || !req.user.isAdmin) {
    return resp.status(403).json({ message: "Access denied" });
  }
  next();
};
// login (listo)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Correo electrónico y contraseña son obligatorios');
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        jwt: null,
        success: false,
        message: "bad credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({
        jwt: null,
        success: false,
        message: "bad credentials",
      });
    }

    const payload = {
      id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
    };

    const signedJWT = jwt.sign(payload, process.env.JWT_SIGNATURE, {
      expiresIn: "1h",
    });
    res.cookie('jwt',signedJWT,{httpOnly: true});

    res.json({
      jwt: signedJWT,
      success: true,
      message: "ok",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

// Crea un usuario (listo)
router.post('/users', async (req, res) => {
  const { name, lastName, password, email, address, birthday } = req.body;

  if (!name || !lastName || !password || !email || !address || !birthday) {
    return res.status(400).send('Todos los campos son obligatorios');
  }
   // Convertir el string de fecha a un objeto Date
   const birthdayDate = new Date(birthday);

   // Validar que la fecha es válida
   if (isNaN(birthdayDate)) {
     return res.status(400).send('Fecha de cumpleaños no válida');
   }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      lastName,
      password: hashedPassword,
      email,
      address,
      birthday: birthdayDate,
      amount: 0
    });

    await newUser.save();
    res.status(201).send('Usuario creado exitosamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

export default router;