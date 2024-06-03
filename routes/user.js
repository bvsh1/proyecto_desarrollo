import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import jwtAuthenticated from "../helpers/jwtAuthenticated.js";
import getCurrentUser from "../helpers/getCurrentUser.js";

const router = express.Router();

router.get("/login", (req, resp) => {
  resp.render("user/login");
});

router.post("/login", async (req, resp) => {
  const userReq = req.body;
  const user = await User.findOne({ email: userReq.email });

  if (user === null || userReq.password !== user.password) {
    resp.redirect("login");
    return;
  }

  const payload = {
    id: user.id,
    name: user.name,
    lastName: user.lastName,
    email: user.email,
  };

  const signedJWT = jwt.sign(payload, process.env.JWT_SIGNATURE, {
    expiresIn: "1h",
  });

  resp.cookie("jwt", signedJWT).redirect("list_all");
});

router.get("/register", (req, resp) => {
  resp.render("user/register");
});

router.post("/create", (req, resp) => {
  const userReq = req.body;
  User.create(userReq);
  resp.render("user/login");
});

router.get("/list_all", jwtAuthenticated, async (req, resp) => {
  const users = await User.find({});
  resp.render("user/list_all", {
    users: users.map((current) => {
      return {
        id: current.id,
        name: current.name,
        lastName: current.lastName,
        email: current.email,
        age: current.age,
        address: current.address,
      };
    }),
  });
});

router.get("/info", jwtAuthenticated, async (req, resp) => {
  const user = await getCurrentUser(req);
  const users = await User.find({ _id: user.id });
  resp.render("user/list_all", {
    users: users.map((current) => {
      return {
        id: current.id,
        name: current.name,
        lastName: current.lastName,
        email: current.email,
        age: current.age,
        address: current.address,
      };
    }),
  });
});

export default router;