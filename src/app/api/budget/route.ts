import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getUserFromToken } from '@/lib/auth';

export async function GET() {
  try {
    const userToken = await getUserFromToken();
    if (!userToken) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const user = await User.findById(userToken.id);
    
    return NextResponse.json({ monthlyBudget: user?.monthlyBudget || 0 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const userToken = await getUserFromToken();
    if (!userToken) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { monthlyBudget } = await req.json();
    await dbConnect();
    
    const user = await User.findByIdAndUpdate(
      userToken.id, 
      { monthlyBudget }, 
      { new: true }
    );
    
    return NextResponse.json({ monthlyBudget: user?.monthlyBudget || 0 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
