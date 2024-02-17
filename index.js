const express = require('express');
require('./db/dbConfig')
const app = express();
const PORT = 5000;
const instructorLog = require('./db/model')
app.use(express.json());

app.post('/api/checkin', async (req, res) => {
  const instructorId = req.body.instructorId, timestamp = req.body.timestamp;
  if (!instructorId || !timestamp) {
    res.status(400).send('Please provide correct instructorId and timestamp');
    return;
  }
  const validateTiming = await instructorLog.findOne({
    instructorId,
    $and: [
      { $or: [{ active: true }, { checkIn: { $lte: timestamp }, checkOut: { $gte: timestamp } }] }
    ]
  });

  if (validateTiming) {
    res.status(400).send('Already checked In');
  }
  else {
    const checkIn = new instructorLog({ instructorId, checkIn: timestamp, active: true });
    const result = await checkIn.save();
    if (!result) {
      res.status(500);
      res.send('Error storing details in database. Please try again.');
    } else {
      res.status(200);
      res.send('check-in successful');
    }
  }
});

app.post('/api/checkout', async (req, res) => {
  const instructorId = req.body.instructorId, timestamp = req.body.timestamp;
  if (!instructorId || !timestamp) {
    res.status(400).send('Please provide correct instructorId and timestamp');
    return;
  }
  const checkedOut = await instructorLog.findOneAndUpdate({
    instructorId,
    $and: [
      { $and: [{ active: true }, { checkIn: { $lte: timestamp } }] }
    ]
  }, { active: false, checkOut: timestamp });
  if (!checkedOut) {
    res.status(400);
    res.send('Error checking out. Please ensure you have checked in.');
  } else {
    res.status(200);
    res.send('Check-out successful');
  }
});

app.get('/api/monthly-report/:month/:year', async (req, res) => {
  const { month, year } = req.params;
  if (!month || !year || month < 1 || month > 12) {
    res.status(400).send('Please provide correct month and year for the report');
    return;
  }
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);

  function convertMsToHrsMin(ms) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours} hours, ${minutes} minutes`;
  }

  const result = await instructorLog.aggregate([
    {
      $match: {
        checkIn: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: '$instructorId',
        totalCheckedInTime: { $sum: { $subtract: ['$checkOut', '$checkIn'] } },
      },
    },
  ]);
  result.forEach((item) => {
    item.totalCheckedInTime = convertMsToHrsMin(item.totalCheckedInTime);
  })
  if (!result || result.length===0) {
    res.status(404).send('No data found');
  } else {
    res.status(200).json(result);
  }
})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

