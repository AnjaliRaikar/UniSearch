const express = require('express');
const College = require('../models/College');

const router = express.Router();

// GET /api/colleges - Get all colleges with filtering, search, sorting, pagination
router.get('/', async (req, res) => {
  try {
    let query = {};
    
    // 🔍 Search
    if (req.query.q) {
      const q = req.query.q.trim();
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
        { state: { $regex: q, $options: 'i' } },
        { courses: { $elemMatch: { $regex: q, $options: 'i' } } }
      ];
    }

    // 🎯 Filters
    if (req.query.type) {
      query.type = { $in: req.query.type.split(',') };
    }

    if (req.query.state) {
      query.state = { $in: req.query.state.split(',') };
    }

    if (req.query.naac) {
      query.naac = { $in: req.query.naac.split(',') };
    }

    // 💰 Fee range
    if (req.query.feeMin || req.query.feeMax) {
      query.fees = {};
      const feeMin = parseInt(req.query.feeMin);
      const feeMax = parseInt(req.query.feeMax);

      if (!isNaN(feeMin)) query.fees.$gte = feeMin;
      if (!isNaN(feeMax)) query.fees.$lte = feeMax;
    }

    // 🔃 Sorting
    let sort = {};
    if (req.query.sort === 'rating') sort.rating = -1;
    else if (req.query.sort === 'name') sort.name = 1;
    else if (req.query.sort === 'fees') sort.fees = 1;

    const finalSort = Object.keys(sort).length ? sort : { createdAt: -1 };

    // 📄 Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const colleges = await College.find(query)
      .sort(finalSort)
      .skip(skip)
      .limit(limit);

    const total = await College.countDocuments(query);

    res.json({
      total,
      page,
      limit,
      data: colleges
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/counts', async (req, res) => {
  try {
    const typeCounts = await College.aggregate([
      { $unwind: "$type" },
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);

    const stateCounts = await College.aggregate([
      { $group: { _id: "$state", count: { $sum: 1 } } }
    ]);

    const naacCounts = await College.aggregate([
      { $group: { _id: "$naac", count: { $sum: 1 } } }
    ]);

    console.log("Counts:", { typeCounts, stateCounts, naacCounts }); // ✅ debug

    res.json({
      typeCounts: typeCounts || [],
      stateCounts: stateCounts || [],
      naacCounts: naacCounts || []
    });

  } catch (err) {
    console.error("COUNT ERROR:", err); // 🔥 IMPORTANT
    res.status(500).json({
      error: err.message
    });
  }
});


// GET /api/colleges/:id - Get single college by MongoDB _id
router.get('/:id', async (req, res) => {
  try {
    const college = await College.findOne({
      collegeId: parseInt(req.params.id)
    });

    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    res.json(college);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;