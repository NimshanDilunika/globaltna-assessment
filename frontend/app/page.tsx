'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const CATEGORIES = ['All', 'Plumbing', 'Electrical', 'Painting', 'Joinery', 'Other'];
const STATUS_COLORS = { Open: 'bg-green-100 text-green-800', 'In Progress': 'bg-yellow-100 text-yellow-800', Closed: 'bg-gray-100 text-gray-700' };

export default function Home() {
  type Job = {
    _id: string;
    title: string;
    description: string;
    category?: string;
    location?: string;
    status: 'Open' | 'In Progress' | 'Closed';
    createdAt: string;
  };

  const [jobs, setJobs] = useState<Job[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== 'All') params.set('category', category);
    if (search) params.set('search', search);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
    const url = `${baseUrl}/api/jobs?${params}`;
    console.log('[Home] GET', url);

    fetch(url)
      .then(async (r) => {
        console.log('[Home] GET status', r.status);
        return r.json();
      })
      .then(setJobs)
      .catch((err) => console.error('[Home] GET error', err));
  }, [category, search]);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Service Requests</h1>
        <Link href="/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Post Request
        </Link>
      </div>

      <div className="flex gap-3 mb-6">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search jobs..." className="border rounded-lg px-3 py-2 flex-1" />
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="border rounded-lg px-3 py-2">
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid gap-4">
        {jobs.map(job => (
          <Link key={job._id} href={`/jobs/${job._id}`}
            className="border rounded-xl p-4 hover:shadow-md transition block">
            <div className="flex justify-between items-start">
              <h2 className="font-medium text-lg">{job.title}</h2>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[job.status]}`}>
                {job.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{job.description}</p>
            <div className="flex gap-4 mt-2 text-xs text-gray-500">
              {job.category && <span>📂 {job.category}</span>}
              {job.location && <span>📍 {job.location}</span>}
              <span>🕐 {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </Link>
        ))}
        {jobs.length === 0 && <p className="text-gray-500 text-center py-12">No jobs found.</p>}
      </div>
    </main>
  );
}