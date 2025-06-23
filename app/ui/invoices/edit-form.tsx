'use client';

import { updateInvoice, State } from '@/app/lib/actions';
import { useActionState } from 'react';

import { CustomerField, InvoiceForm } from '@/app/lib/definitions';

export default function EditInvoiceForm({
  invoice,
}: {
  invoice: InvoiceForm;
  customers: CustomerField[];
}) {
  const initialState: State = { message: null, errors: {} };
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);
  const [, formAction] = useActionState(updateInvoiceWithId, initialState);

  return <form action={formAction}>{/* ... */}</form>;
}
