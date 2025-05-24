import postgres from 'postgres';

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

const sql = postgres(process.env.POSTGRES_URL, {
  ssl: { rejectUnauthorized: false },
});

export async function listInvoices() {
  const data = await sql`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = 666;
  `;
  return data;
}

export const GET = async () => {
  const invoices = await listInvoices();
  return new Response(JSON.stringify(invoices), {
    headers: { 'Content-Type': 'application/json' },
  });
};
