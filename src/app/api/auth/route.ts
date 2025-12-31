import { hashPassword } from '@/utils/hash-password';
import { verifyPassword } from '@/utils/verify-password';
import { NextRequest, NextResponse } from 'next/server';

const correctValues = {
  username: 'username',
  password: 'Password@123',
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password } = body;

  if (username.toLowerCase() !== correctValues.username) {
    return NextResponse.json(
      { error: `User not found with username: ${username}.` },
      { status: 404 },
    );
  }

  const hashResult = await hashPassword(password).catch(error => error);

  if (!hashResult || !hashResult.hash) {
    return NextResponse.json({ error: hashResult.error }, { status: 500 });
  }

  const isValid = await verifyPassword(
    correctValues.password,
    hashResult.hash,
  ).catch(() => false);

  if (!isValid) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }

  return NextResponse.json({ token: 'super-secret-token' });
}
