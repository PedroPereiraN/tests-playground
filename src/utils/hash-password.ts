import bcrypt from 'bcryptjs';

export const hashPassword = async (
  password: string,
): Promise<{ hash: string; salt: string }> => {
  const saltRounds = 5;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);

  return {
    hash,
    salt,
  };
};
