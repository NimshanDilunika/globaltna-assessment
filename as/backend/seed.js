require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('./models/JobRequest');

const seeds = [
  { title: 'Leaking kitchen tap', description: 'Dripping tap in kitchen, needs washer replaced', category: 'Plumbing', location: 'Glasgow', contactName: 'Alice', contactEmail: 'alice@example.com' },
  { title: 'Faulty light switch', description: 'Switch in hallway sparks occasionally', category: 'Electrical', location: 'Edinburgh', contactName: 'Bob', contactEmail: 'bob@example.com' },
  { title: 'Bedroom repaint', description: 'Two bedroom walls need painting white', category: 'Painting', location: 'Manchester', contactName: 'Carol', contactEmail: 'carol@example.com' },
  { title: 'Broken door frame', description: 'Back door frame cracked, needs joinery repair', category: 'Joinery', location: 'London', contactName: 'Dave', contactEmail: 'dave@example.com' },
  { title: 'Boiler service', description: 'Annual boiler check and service needed urgently', category: 'Plumbing', location: 'Leeds', contactName: 'Eve', contactEmail: 'eve@example.com' },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Job.deleteMany({});
  await Job.insertMany(seeds);
  console.log('Seeded 5 jobs');
  process.exit(0);
});