'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const STATUSES = ['Open', 'In Progress', 'Closed'];
const STATUS_COLORS: Record<string, string> = {
  Open: 'bg-green-100 text-green-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  Closed: 'bg-gray-100 text-gray-700'
};

interface Job {
  _id: string;
  title: string;
  description: string;
  category?: string;
  location?: string;
  contactName?: string;
  contactEmail?: string;
  status: string;
  createdAt: string;
}

export default function JobDetail() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const url = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'}/api/jobs/${id}`;
    console.log('[JobDetail] fetching', url);
    fetch(url)
      .then(r => r.json())
      .then(data => { setJob(data); setLoading(false); })
      .catch(err => { console.error('[JobDetail] error', err); setLoading(false); });
  }, [id]);

  const updateStatus = async (status: string) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'}/api/jobs/${id}`;
    await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    setJob(j => j ? { ...j, status } : j);
  };

  const deleteJob = async () => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    setDeleting(true);
    const url = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'}/api/jobs/${id}`;
    await fetch(url, { method: 'DELETE' });
    router.push('/');
  };

  if (loading) return (
    <main className="max-w-2xl mx-auto p-6">
      <p className="text-gray-500">Loading...</p>
    </main>
  );

  if (!job) return (
    <main className="max-w-2xl mx-auto p-6">
      <p className="text-red-500">Job not found.</p>
      <button onClick={() => router.push('/')}
        className="text-blue-600 text-sm mt-2 hover:underline">
        ← Back to all jobs
      </button>
    </main>
  );

  return (
    <main className="max-w-2xl mx-auto p-6">

      <button onClick={() => router.push('/')}
        className="text-blue-600 text-sm mb-4 hover:underline block">
        ← Back to all jobs
      </button>

      <div className="border rounded-xl p-6">

        {/* Title + status */}
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-semibold">{job.title}</h1>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[job.status]}`}>
            {job.status}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-6">{job.description}</p>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-6">
          {job.category && (
            <div><span className="font-medium">Category:</span> {job.category}</div>
          )}
          {job.location && (
            <div><span className="font-medium">Location:</span> {job.location}</div>
          )}
          {job.contactName && (
            <div><span className="font-medium">Contact:</span> {job.contactName}</div>
          )}
          {job.contactEmail && (
            <div><span className="font-medium">Email:</span> {job.contactEmail}</div>
          )}
          <div>
            <span className="font-medium">Posted:</span>{' '}
            {new Date(job.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 items-center pt-4 border-t">
          <label className="text-sm font-medium">Change status:</label>
          <select
            value={job.status}
            onChange={e => updateStatus(e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-sm">
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <div className="ml-auto">
            <button
              onClick={deleteJob}
              disabled={deleting}
              className="bg-red-50 text-red-600 border border-red-200 px-4 py-1.5 rounded-lg text-sm hover:bg-red-100 disabled:opacity-50">
              {deleting ? 'Deleting...' : '🗑 Delete Job'}
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}