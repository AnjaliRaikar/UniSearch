require('dotenv').config();
const mongoose = require('mongoose');
const College = require('../models/College');

const states = ["Maharashtra", "Karnataka", "Delhi NCR", "Tamil Nadu", "Gujarat"];
const types = ["IT", "Engineering", "Management", "Science"];
const naacGrades = ["A++", "A+", "A", "B++"];

const baseNames = [
  "Institute of Technology",
  "College of Engineering",
  "School of Management",
  "University of Science",
  "Institute of Advanced Studies"
];

const cities = [
  "Mumbai", "Pune", "Bangalore", "Delhi", "Chennai",
  "Ahmedabad", "Hyderabad", "Nagpur", "Surat", "Noida"
];

const coursesList = [
  ["B.Tech CSE", "AI & ML", "Data Science"],
  ["MBA", "BBA", "Finance"],
  ["MCA", "BCA", "Cyber Security"],
  ["Mechanical", "Civil", "Electrical"],
  ["Biotech", "Physics", "Chemistry"]
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateColleges(count = 120) {
  const colleges = [];

  const themes = [
    { color: "#2A5BD7", bg: "#E8F0FF" }, // blue
    { color: "#1A6B3C", bg: "#E8FFF0" }, // green
    { color: "#C47F0A", bg: "#FFF5E0" }, // orange
    { color: "#7B3FA0", bg: "#F5E8FF" }, // purple
    { color: "#A50034", bg: "#FFE8EC" }, // red
    { color: "#006B8B", bg: "#E0F5FF" }  // teal
  ];

  for (let i = 1; i <= count; i++) {
    const state = randomItem(states);
    const city = randomItem(cities);
    const theme = randomItem(themes);

    colleges.push({
      collegeId: i,
      name: `${city} ${randomItem(baseNames)} ${i}`,
      short: `CLG${i}`,
      location: `${city}, ${state}`,
      state,
      type: [randomItem(types), randomItem(types)].filter((v, i, a) => a.indexOf(v) === i),
      rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
      naac: randomItem(naacGrades),
      fees: Math.floor(Math.random() * 400000) + 80000,
      established: Math.floor(Math.random() * 50) + 1970,
      affiliation: "Deemed / Autonomous",
      courses: [...randomItem(coursesList), ...randomItem(coursesList)].slice(0, 4),
      about: "A reputed institution offering quality education and strong placements.",
      phone: "+91-9999999999",
      email: `contact${i}@${city.toLowerCase()}college.edu`,
      website: "https://www.college.edu",
      color: theme.color,
      bg: theme.bg
    });
  }

  return colleges;
}

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('✅ Connected to MongoDB');

    console.log("DB Name:", mongoose.connection.name);

    await College.deleteMany({});
    console.log('🧹 Old data cleared');

    const generated = generateColleges(120);
    await College.collection.dropIndexes().catch(() => {});
    await College.insertMany(generated);
    console.log('📦 Data inserted');

    const count = await College.countDocuments();
    console.log("Total after insert:", count);

    console.log('🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();