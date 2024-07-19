import bcrypt from '@node-rs/bcrypt';

/**
 * @param password 密码
 * @param saltRounds 值越小执行的越快，但是最小为4，最大为19
 * @returns hashPassword
 */
export const hashPassword = async (password: string, saltRounds = 10) => {
  // const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(`${password}`, saltRounds);
};

export const comparePassword = async (
  password: string,
  hashPassword: string,
) => {
  return bcrypt.compare(`${password}`, hashPassword);
};
