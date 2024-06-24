import User from '../models/user.js';

const isAdmin = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user.isAdmin;
  } catch (error) {
    console.error('Error al verificar si el usuario es administrador:', error);
    return false; 
  }
};

export default isAdmin;
