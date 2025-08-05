import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { hashPassword } from '../../src/utils/hash-password';
import { verifyPassword } from '../../src/utils/verify-password';
import Auth from '../../src/app/auth/page';

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('user authentication', () => {
  it('can get the username and password', () => {
    const mockSubmit = jest.fn();

    mockSubmit({
      username: 'username',
      password: 'password',
    });

    expect(mockSubmit).toHaveBeenCalledWith({
      username: 'username',
      password: 'password',
    });
  });

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

  it('should show error when fields are empty', async () => {
    const user = userEvent.setup();

    render(<Auth />);

    await user.click(screen.getByRole('button', { name: /Submit/i }));

    expect(screen.getByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('should show error when the password is wrong', async () => {
    const user = userEvent.setup();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Wrong password' }),
      }),
    ) as jest.Mock;

    render(<Auth />);

    await user.type(screen.getByLabelText(/username/i), 'username');
    await user.type(screen.getByLabelText(/password/i), 'wrongPassword');

    await user.click(screen.getByRole('button', { name: /Submit/i }));

    expect(screen.getByText('Wrong password')).toBeInTheDocument();
  });

  it('should show error when the username is wrong', async () => {
    const user = userEvent.setup();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        json: () =>
          Promise.resolve({
            error: 'User not found with username: wrongUsername',
          }),
      }),
    ) as jest.Mock;

    render(<Auth />);

    await user.type(screen.getByLabelText(/username/i), 'wrongUsername');
    await user.type(screen.getByLabelText(/password/i), 'wrongPassword');

    await user.click(screen.getByRole('button', { name: /Submit/i }));

    expect(
      screen.getByText('User not found with username: wrongUsername'),
    ).toBeInTheDocument();
  });
});
