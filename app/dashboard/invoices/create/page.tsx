import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers, type Customer } from '@/app/lib/data';
import { safeFetch } from '@/app/lib/safeFetch';

export default async function Page() {
  // Tell TypeScript that the generic type T is Customer[]
  const customers = await safeFetch<Customer[]>(() => fetchCustomers(), []);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          { label: 'Create Invoice', href: '/dashboard/invoices/create', active: true },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}
