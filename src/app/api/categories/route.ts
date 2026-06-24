import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import { getUserFromToken } from '@/lib/auth';

const DEFAULT_CATEGORIES = [
  { name: 'Food', type: 'expense', color: '#EF4444' }, // Red
  { name: 'Travel', type: 'expense', color: '#F59E0B' }, // Amber
  { name: 'Rent', type: 'expense', color: '#8B5CF6' }, // Purple
  { name: 'Utilities', type: 'expense', color: '#06B6D4' }, // Cyan
  { name: 'Entertainment', type: 'expense', color: '#EC4899' }, // Pink
  { name: 'Salary', type: 'income', color: '#10B981' }, // Green
  { name: 'Freelance', type: 'income', color: '#3B82F6' }, // Blue
];

export async function GET() {
  try {
    const user = await getUserFromToken();
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const categories = await Category.find({ user: user.id });

    // Combine user-created categories with default categories
    return NextResponse.json({
      defaults: DEFAULT_CATEGORIES,
      custom: categories
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromToken();
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const data = await req.json();
    await dbConnect();

    const category = await Category.create({
      ...data,
      user: user.id
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
