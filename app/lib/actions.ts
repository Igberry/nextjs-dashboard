'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// === PostgreSQL client ===
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// === Utilities ===
function getTodayISODate(): string {
    return new Date().toISOString().split('T')[0];
}

function parseInvoiceFormData(formData: FormData) {
    return {
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    };
}

// === Zod Schemas ===
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
});

const CreateOrUpdateInvoice = FormSchema.omit({ id: true, date: true });

// === Types ===
export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

// === Actions ===

export async function createInvoice(prevState: State, formData: FormData) {
    const validatedFields = CreateOrUpdateInvoice.safeParse(parseInvoiceFormData(formData));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = getTodayISODate();

    try {
        await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
    } catch (error: unknown) {
        console.error('Create Invoice Error:', error);
        return {
            message:
                process.env.NODE_ENV === 'production'
                    ? 'Database Error: Failed to Create Invoice.'
                    : `Database Error: ${(error as Error).message}`,
        };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
    const validatedFields = CreateOrUpdateInvoice.safeParse(parseInvoiceFormData(formData));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
    } catch (error: unknown) {
        console.error('Update Invoice Error:', error);
        return {
            message:
                process.env.NODE_ENV === 'production'
                    ? 'Database Error: Failed to Update Invoice.'
                    : `Database Error: ${(error as Error).message}`,
        };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string): Promise<void> {
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
    } catch (error: unknown) {
        console.error('Delete Invoice Error:', error);
        // Log only; no return — let the error fall through
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        console.error('Auth Error:', error);
        throw error;
    }
}
