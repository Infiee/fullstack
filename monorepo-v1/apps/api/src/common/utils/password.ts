import bcrypt from 'bcrypt';

export const hashPassword = async (password: string, saltRounds = 10) => {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(`${password}`, salt);
};

export const comparePassword = (password: string, hashPassword: string) => {
  return bcrypt.compare(`${password}`, hashPassword);
};
