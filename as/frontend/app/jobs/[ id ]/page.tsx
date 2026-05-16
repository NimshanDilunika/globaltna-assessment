'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const STATUSES = ['Open', 'In Progress', 'Closed'];
const STATUS_COLORS = { Open: 'text-green-700', 'In Progress': 'text-yellow-700', Closed: 'text-gray-600' };

export default function JobDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);

  useEffect(() => {
      .then(r => r.json()).then(setJob);
  }, [id]);

  const updateStatus = async (status) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    setJob(j => ({ ...j, status }));
  };

  const deleteJob = async () => {
    if (!confirm('Delete this job?')) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${id}`, { method: 'DELETE' });
    router.push('/');
  };

  if (!job) return <p className="p-6 text-gray-500">Loading...</p>;

  return (
    <main className="max-w-2xl mx-auto p-6">
      <button onClick={() => router.back()} className="text-blue-600 text-sm mb-4">← Back</button>
      <div className="border rounded-xl p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-semibold">{job.title}</h1>
          <span className={`font-medium ${STATUS_COLORS[job.status]}`}>{job.status}</span>
        </div>
        <p className="text-gray-700 mb-6">{job.description}</p>

        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-6">
          {job.category && <div><span className="font-medium">Category:</span> {job.category}</div>}
          {job.location && <div><span className="font-medium">Location:</span> {job.location}</div>}
          {job.contactName && <div><span className="font-medium">Contact:</span> {job.contactName}</div>}
          {job.contactEmail && <div><span className="font-medium">Email:</span> {job.contactEmail}</div>}
          <div><span className="font-medium">Posted:</span> {new Date(job.createdAt).toLocaleDateString()}</div>
        </div>

        <div className="flex gap-3 items-center pt-4 border-t">
          <label className="text-sm font-medium">Change status:</label>
          <select value={job.status} onChange={e => updateStatus(e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-sm">
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <div className="ml-auto">
            <button onClick={deleteJob}
              className="bg-red-50 text-red-600 border border-red-200 px-4 py-1.5 rounded-lg text-sm hover:bg-red-100">
              Delete
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}