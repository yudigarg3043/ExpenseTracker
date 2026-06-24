import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { getUserFromToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getUserFromToken();
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month'); // e.g., '2023-10'
    const category = searchParams.get('category');

    await dbConnect();
    
    let query: any = { user: user.id };
    
    if (month) {
      const startDate = new Date(`${month}-01T00:00:00.000Z`);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });
    return NextResponse.json(transactions);
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
    
    const transaction = await Transaction.create({
      ...data,
      user: user.id
    });
    
    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
