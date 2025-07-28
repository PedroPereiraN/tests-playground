import bcrypt from 'bcryptjs';

export const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  const isValid = await bcrypt.compare(password, hash);

  return isValid;
};
