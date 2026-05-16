const express = require('express');
const router = express.Router();
const Job = require('../models/JobRequest');

// GET /api/jobs  
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status)   filter.status   = req.query.status;
   
    if (req.query.search) {
      filter.$or = [
        { title:       { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) { next(err); }
});

// GET /api/jobs/:id
router.get('/:id', async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) { next(err); }
});

// POST /api/jobs
router.post('/', async (req, res, next) => {
  try {
    const { title, description, category, location, contactName, contactEmail } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'title and description are required' });
    }
    const job = await Job.create({ title, description, category, location, contactName, contactEmail });
    res.status(201).json(job);
  } catch (err) { next(err); }
});

// PATCH /api/jobs/:id  
router.patch('/:id', async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['Open', 'In Progress', 'Closed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    const job = await Job.findByIdAndUpdate(
      req.params.id, { status }, { new: true, runValidators: true }
    );
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) { next(err); }
});

// DELETE /api/jobs/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (err) { next(err); }
});

module.exports = router;