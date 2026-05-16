'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['Plumbing', 'Electrical', 'Painting', 'Joinery', 'Other'];

type Form = {
  title: string;
  description: string;
  category: string;
  location: string;
  contactName: string;
  contactEmail: string;
};

type Errors = Partial<Record<keyof Form, string>>;

export default function NewJob() {
  const router = useRouter();
  const [form, setForm] = useState<Form>({
    title:'',
    description:'',
    category:'Plumbing',
    location:'',
    contactName:'',
    contactEmail:''
  });
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState<Errors>({});


  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (form.contactEmail && !/^\S+@\S+\.\S+$/.test(form.contactEmail))
      e.contactEmail = 'Invalid email address';
    return e;
  };

  const handleSubmit = async (): Promise<void> => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);

    setSubmitting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
      const url = `${baseUrl}/api/jobs`;
      console.log('[NewJob] POST', url, { form });

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      console.log('[NewJob] POST status', res.status);

      if (res.ok) {
        router.push('/');
      } else {
        const text = await res.text().catch(() => '');
        console.error('[NewJob] POST failed', { status: res.status, body: text });
        setSubmitting(false);
      }
    } catch (err) {
      console.error('[NewJob] POST error', err);
      setSubmitting(false);
    }
  };

  const field = (label: string, key: keyof Form, type: string='text', required=false) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}{required && ' *'}</label>
      <input type={type} value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})}
        className={`border rounded-lg px-3 py-2 ${errors[key] ? 'border-red-500' : ''}`}/>
      {errors[key] && <span className="text-red-500 text-xs">{errors[key]}</span>}
    </div>
  );

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Post a Service Request</h1>
      <div className="flex flex-col gap-4">
        {/* debug */}
        {field('Title', 'title', 'text', true)}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Description *</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
            rows={4} className={`border rounded-lg px-3 py-2 ${errors.description ? 'border-red-500':''}`}/>
          {errors.description && <span className="text-red-500 text-xs">{errors.description}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Category</label>
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
            className="border rounded-lg px-3 py-2">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        {field('Location', 'location')}
        {field('Your name', 'contactName')}
        {field('Your email', 'contactEmail', 'email')}
        <button onClick={handleSubmit} disabled={submitting}
          className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 mt-2">
          {submitting ? 'Posting...' : 'Submit Request'}
        </button>
      </div>
    </main>
  );
}