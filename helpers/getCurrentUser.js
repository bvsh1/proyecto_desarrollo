import jwt from "jsonwebtoken";

const getCurrentUser = async (req) => {
  const jwtCookie = req.headers.authorization;

  if (!jwtCookie) return null;

  try {
    const payload = await jwt.verify(jwtCookie, process.env.JWT_SIGNATURE);
    return payload;
  } catch (error) {
    console.error("error", error);
    return null;
  }
};

export default getCurrentUser;