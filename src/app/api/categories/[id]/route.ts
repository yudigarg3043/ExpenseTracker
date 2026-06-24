import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import { getUserFromToken } from '@/lib/auth';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromToken();
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await dbConnect();
    
    const deleted = await Category.findOneAndDelete({ _id: id, user: user.id });
    
    if (!deleted) {
      return NextResponse.json({ message: 'Category not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
