import Form from '@/app/ui/desks/recommendation-form';
import Breadcrumbs from '@/app/ui/preferences/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Set Preferences',
};
 
export default async function Page() { 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Desks', href: '/dashboard/desks' },
          {
            label: 'Select desk',
            href: '/dashboard/desks/recommendation',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}