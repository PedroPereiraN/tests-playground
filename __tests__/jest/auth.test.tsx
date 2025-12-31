import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Auth from '../../src/app/page';

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('user authentication', () => {
  it('should send username and password correctly', async () => {
    const user = userEvent.setup();

    const mockFetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'fake-token' }),
      }),
    );

    global.fetch = mockFetch as jest.Mock;

    render(<Auth />);

    await user.type(screen.getByLabelText(/username/i), 'username');
    await user.type(screen.getByLabelText(/password/i), 'Password@123');

    await user.click(screen.getByRole('button', { name: /Submit/i }));

    expect(mockFetch).toHaveBeenCalledWith('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'username',
        password: 'Password@123',
      }),
    });
  });

  it('should show error when fields are empty', async () => {
    const user = userEvent.setup();

    render(<Auth />);

    await user.click(screen.getByRole('button', { name: /Submit/i }));

    expect(screen.getAllByText(/Username is required/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Password is required/i)[0]).toBeInTheDocument();
  });

  it(`It should display an error when the password is not entered correctly..`, async () => {
    const user = userEvent.setup();

    render(<Auth />);

    await user.type(screen.getByLabelText(/username/i), 'username');

    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');

    await user.click(screen.getByRole('button', { name: /Submit/i }));

    expect(screen.getAllByText(/Password needs to contain/i)[0]).toBeInTheDocument();
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
    await user.type(screen.getByLabelText(/password/i), 'wrongPassword@123');

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
    await user.type(screen.getByLabelText(/password/i), 'wrongPassword@123');

    await user.click(screen.getByRole('button', { name: /Submit/i }));

    expect(
      screen.getByText('User not found with username: wrongUsername'),
    ).toBeInTheDocument();
  });
});
