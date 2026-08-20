import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

const demoCompanies = [
  { name: 'TCS', minCgpa: 6, branches: ['CSE', 'IT', 'ECE'], maxBacklogs: 1, package: '3.6 LPA' },
  { name: 'Infosys', minCgpa: 6.5, branches: ['CSE', 'IT', 'ECE'], maxBacklogs: 0, package: '4.2 LPA' },
  { name: 'Amazon', minCgpa: 7.5, branches: ['CSE', 'IT'], maxBacklogs: 0, package: '18 LPA' },
  { name: 'Microsoft', minCgpa: 8, branches: ['CSE'], maxBacklogs: 0, package: '24 LPA' },
  { name: 'Google', minCgpa: 8.5, branches: ['CSE'], maxBacklogs: 0, package: '28 LPA' }
];

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
}

function protect(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'CampusConnect AI' }));

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, branch = 'CSE', cgpa = 0, backlogs = 0 } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = { id: Date.now().toString(), name, email, role: 'student', branch, cgpa, backlogs, hashedPassword };
  res.status(201).json({ user, token: signToken(user) });
});

app.post('/api/auth/login', async (req, res) => {
  const user = { id: 'demo-user', name: 'Anshuman Sharma', email: req.body.email, role: 'student', branch: 'CSE', cgpa: 8.4, backlogs: 0 };
  res.json({ user, token: signToken(user) });
});

app.get('/api/companies', protect, (req, res) => res.json(demoCompanies));

app.get('/api/companies/eligibility', protect, (req, res) => {
  const cgpa = Number(req.query.cgpa || 0);
  const branch = String(req.query.branch || '').toUpperCase();
  const backlogs = Number(req.query.backlogs || 0);
  const results = demoCompanies.map(company => {
    const reasons = [];
    if (cgpa < company.minCgpa) reasons.push(`Minimum CGPA is ${company.minCgpa}`);
    if (!company.branches.includes(branch)) reasons.push(`Eligible branches: ${company.branches.join(', ')}`);
    if (backlogs > company.maxBacklogs) reasons.push(`Backlogs allowed: ${company.maxBacklogs}`);
    return { company, eligible: reasons.length === 0, reasons };
  });
  res.json(results);
});

app.get('/api/applications', protect, (req, res) => res.json([
  { company: 'TCS', role: 'Ninja Engineer', status: 'Applied' },
  { company: 'Amazon', role: 'SDE Intern', status: 'OA Scheduled' },
  { company: 'Microsoft', role: 'Software Engineer Intern', status: 'Selected' }
]));

app.post('/api/applications', protect, (req, res) => res.status(201).json({ id: Date.now().toString(), ...req.body }));

app.get('/api/dsa', protect, (req, res) => res.json({ easy: 128, medium: 142, hard: 44, dailyStreak: 21 }));
app.put('/api/dsa', protect, (req, res) => res.json(req.body));

app.get('/api/quizzes', protect, (req, res) => res.json([
  { title: 'Quantitative Aptitude', questions: 25, timeLimit: 30 },
  { title: 'Logical Reasoning', questions: 20, timeLimit: 25 },
  { title: 'Verbal Ability', questions: 18, timeLimit: 20 }
]));

app.get('/api/interview-questions', protect, (req, res) => res.json([
  { company: 'TCS', type: 'HR', question: 'Tell me about your best project.' },
  { company: 'Amazon', type: 'Technical', question: 'How would you optimize a slow API endpoint?' },
  { company: 'Google', type: 'System Design', question: 'Design a placement notification service.' }
]));

app.post('/api/resumes', protect, upload.single('resume'), (req, res) => {
  res.status(201).json({ fileName: req.file?.originalname, url: 'cloudinary-url-placeholder', message: 'Resume uploaded' });
});

app.post('/api/ai/resume-review', protect, (req, res) => res.json({
  atsScore: 86,
  missingKeywords: ['REST APIs', 'MongoDB', 'JWT authentication', 'deployment'],
  suggestions: ['Add measurable project impact', 'Add deployed links', 'Mention testing and validation']
}));

app.post('/api/ai/interview-feedback', protect, (req, res) => res.json({
  feedback: 'Good structure. Add a measurable result and one technical trade-off.',
  followUps: ['How did you secure the API?', 'How would you scale this project?']
}));

export default app;
