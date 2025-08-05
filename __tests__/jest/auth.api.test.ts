import { hashPassword } from '../../src/utils/hash-password';
import { verifyPassword } from '../../src/utils/verify-password';

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('user api authentication', () => {
  it('can generate a salt and hash the password', async () => {
    const password = 'password';

    const { hash, salt } = await hashPassword(password);

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    expect(typeof salt).toBe('string');
    expect(typeof hash).toBe('string');
    expect(salt.length).toBeGreaterThan(0);
    expect(hash.length).toBeGreaterThan(0);
  });

  it('should generate diferent hashes for the same password', async () => {
    const password = 'password';

    const result1 = await hashPassword(password);
    const result2 = await hashPassword(password);

    expect(result1.hash).not.toBe(result2.hash);
  });

  it('should verify if the hash has the password', async () => {
    const password = 'password';

    const { hash } = await hashPassword(password);

    const isValid = await verifyPassword(password, hash);

    expect(isValid).toBe(true);
  });
});
