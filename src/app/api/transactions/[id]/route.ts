import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { getUserFromToken } from '@/lib/auth';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromToken();
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    
    // Ensure the transaction belongs to the user
    const deleted = await Transaction.findOneAndDelete({ _id: params.id, user: user.id });
    
    if (!deleted) {
      return NextResponse.json({ message: 'Transaction not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Transaction deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
