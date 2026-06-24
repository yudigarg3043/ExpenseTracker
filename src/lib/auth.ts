import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';

export async function getUserFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as { id: string; email: string };
  } catch (error) {
    return null;
  }
}
