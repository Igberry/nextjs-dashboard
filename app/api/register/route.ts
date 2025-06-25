import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function POST(request: Request) {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
        return NextResponse.json({ message: 'Missing credentials' }, { status: 400 });
    }

    try {
        // Check if user already exists
        const existing = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (existing.length > 0) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
    `;

        return NextResponse.json({ message: 'User registered' }, { status: 200 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
