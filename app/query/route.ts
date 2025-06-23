import { listInvoices } from '@/app/lib/listInvoices';

export async function GET() {
  const invoices = await listInvoices();
  return new Response(JSON.stringify(invoices), {
    headers: { 'Content-Type': 'application/json' },
  });
}
