require('dotenv').config();
const mongoose = require('mongoose');
const College = require('../models/College');

/* ------------------ DATA POOLS ------------------ */

// City → State mapping (FIXED)
const cityStateMap = {
  Mumbai: "Maharashtra",
  Pune: "Maharashtra",
  Nagpur: "Maharashtra",
  Bangalore: "Karnataka",
  Mysore: "Karnataka",
  Delhi: "Delhi NCR",
  Noida: "Delhi NCR",
  Chennai: "Tamil Nadu",
  Coimbatore: "Tamil Nadu",
  Ahmedabad: "Gujarat",
  Surat: "Gujarat",
  Hyderabad: "Telangana"
};

const types = ["Engineering", "Management", "IT", "Science"];

const typeCoursesMap = {
  Engineering: ["B.Tech CSE", "Mechanical", "Civil", "Electrical", "AI & ML"],
  Management: ["MBA", "BBA", "Finance", "Marketing"],
  IT: ["MCA", "BCA", "Cyber Security", "Data Science"],
  Science: ["Biotech", "Physics", "Chemistry", "Mathematics"]
};

const naacGrades = ["A++", "A+", "A", "B++", "B+"];

const prefixes = [
  "National", "Indian", "Global", "Modern",
  "Saraswati", "St. Xavier's", "Vidya", "Apex", "Pioneer"
];

const baseNames = [
  "Institute of Technology",
  "College of Engineering",
  "School of Management",
  "University of Science",
  "Institute of Advanced Studies"
];

const affiliations = [
  "Autonomous",
  "Deemed University",
  "State University",
  "Private University"
];

const abouts = [
  "Known for strong placement records and industry tie-ups.",
  "Focuses on research and innovation in emerging technologies.",
  "Offers a vibrant campus life with modern infrastructure.",
  "Recognized for academic excellence and experienced faculty.",
  "Provides excellent internship and global exposure opportunities."
];

const themes = [
  { color: "#2A5BD7", bg: "#E8F0FF" },
  { color: "#1A6B3C", bg: "#E8FFF0" },
  { color: "#C47F0A", bg: "#FFF5E0" },
  { color: "#7B3FA0", bg: "#F5E8FF" },
  { color: "#A50034", bg: "#FFE8EC" },
  { color: "#006B8B", bg: "#E0F5FF" }
];

/* ------------------ HELPERS ------------------ */

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomPhone() {
  return `+91-${Math.floor(9000000000 + Math.random() * 1000000000)}`;
}

function getRandomFees(type) {
  switch (type) {
    case "Engineering":
      return Math.floor(Math.random() * 300000) + 150000;
    case "Management":
      return Math.floor(Math.random() * 400000) + 200000;
    case "IT":
      return Math.floor(Math.random() * 200000) + 100000;
    case "Science":
      return Math.floor(Math.random() * 150000) + 80000;
    default:
      return 100000;
  }
}

/* ------------------ GENERATOR ------------------ */

function generateColleges(count = 120) {
  const colleges = [];

  const cities = Object.keys(cityStateMap);

  for (let i = 1; i <= count; i++) {
    const city = randomItem(cities);
    const state = cityStateMap[city];
    const type = randomItem(types);
    const theme = randomItem(themes);

    const name = `${randomItem(prefixes)} ${randomItem(baseNames)}`;

    colleges.push({
      collegeId: i,
      name,
      short: `CLG${1000 + i}`,
      location: `${city}, ${state}`,
      city,
      state,
      type,
      rating: parseFloat((Math.random() * 3 + 2).toFixed(1)), // 2.0–5.0
      naac: randomItem(naacGrades),
      fees: getRandomFees(type),
      established: Math.floor(Math.random() * 40) + 1980,
      affiliation: randomItem(affiliations),
      courses: typeCoursesMap[type],
      about: randomItem(abouts),
      phone: getRandomPhone(),
      email: `info${i}@${city.toLowerCase().replace(/\s/g, '')}college.edu`,
      website: `https://www.${city.toLowerCase()}college${i}.edu`,
      placementPercentage: Math.floor(Math.random() * 40) + 60, // 60–100%
      averagePackage: (Math.random() * 10 + 3).toFixed(1), // 3–13 LPA
      nirfRanking: Math.floor(Math.random() * 200) + 1,
      reviewsCount: Math.floor(Math.random() * 500) + 20,
      color: theme.color,
      bg: theme.bg
    });
  }

  return colleges;
}

/* ------------------ SEED FUNCTION ------------------ */

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('✅ Connected to MongoDB');
    console.log("DB Name:", mongoose.connection.name);

    await College.deleteMany({});
    console.log('🧹 Old data cleared');

    const data = generateColleges(120);

    await College.insertMany(data);
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