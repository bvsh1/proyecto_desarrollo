import jwt from "jsonwebtoken";

const jwtAuthenticated = (req, resp, next) => {
  const jwtCookie = req.cookies["jwt"];

  if (!jwtCookie) {
    resp.redirect("/user/login");
    return;
  }

  try {
    jwt.verify(jwtCookie, process.env.JWT_SIGNATURE);
    next();
  } catch (error) {
    console.error("error", error);
    resp.redirect("/user/login");
  }
};

export default jwtAuthenticated;