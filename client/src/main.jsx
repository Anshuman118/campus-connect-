import React from 'react';
import ReactDOM from 'react-dom/client';
import { Bar, Doughnut } from 'react-chartjs-2';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';
import { Briefcase, Building2, CheckCircle2, Code2, FileText, GraduationCap, Moon, Sparkles, Trophy, Upload } from 'lucide-react';
import './styles.css';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const companies = [
  { name: 'TCS', minCgpa: 6, branches: ['CSE', 'IT', 'ECE'], package: '3.6 LPA' },
  { name: 'Infosys', minCgpa: 6.5, branches: ['CSE', 'IT', 'ECE'], package: '4.2 LPA' },
  { name: 'Amazon', minCgpa: 7.5, branches: ['CSE', 'IT'], package: '18 LPA' },
  { name: 'Microsoft', minCgpa: 8, branches: ['CSE'], package: '24 LPA' },
  { name: 'Google', minCgpa: 8.5, branches: ['CSE'], package: '28 LPA' }
];

const applications = ['Applied', 'OA Scheduled', 'Interview', 'Selected', 'Rejected'];

function Stat({ icon: Icon, label, value, note }) {
  return <article className="card stat"><Icon /><div><span>{label}</span><strong>{value}</strong><p>{note}</p></div></article>;
}

function App() {
  const profile = { name: 'Anshuman Sharma', branch: 'CSE', cgpa: 8.4, backlogs: 0 };
  const eligible = companies.map(company => ({
    ...company,
    ok: profile.cgpa >= company.minCgpa && company.branches.includes(profile.branch)
  }));

  const dsaData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ data: [18, 24, 20, 34, 31, 42, 47], backgroundColor: '#14b8a6', borderRadius: 6 }]
  };
  const appData = {
    labels: ['Applied', 'OA', 'Interview', 'Selected'],
    datasets: [{ data: [6, 3, 2, 1], backgroundColor: ['#14b8a6', '#f97316', '#7c3aed', '#22c55e'] }]
  };

  return <main>
    <aside>
      <div className="brand"><GraduationCap /><div><h1>CampusConnect AI</h1><p>Placement preparation portal</p></div></div>
      {['Dashboard', 'Eligibility', 'Resume', 'Jobs', 'DSA', 'Quiz', 'Interviews', 'Admin'].map(item => <a key={item}>{item}</a>)}
    </aside>

    <section className="workspace">
      <header><div><p>Welcome back</p><h2>{profile.name}</h2></div><button><Moon size={18} /></button></header>

      <div className="stats">
        <Stat icon={Trophy} label="Placement Progress" value="72%" note="12 of 17 goals complete" />
        <Stat icon={CheckCircle2} label="Eligible Companies" value="4" note="Based on CGPA and branch" />
        <Stat icon={Code2} label="DSA Solved" value="314" note="47 solved this week" />
        <Stat icon={FileText} label="ATS Score" value="86" note="AI resume review" />
      </div>

      <div className="grid two">
        <article className="card"><h3>Weekly DSA Progress</h3><Bar data={dsaData} options={{ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} /></article>
        <article className="card"><h3>Application Stages</h3><Doughnut data={appData} options={{ cutout: '62%' }} /></article>
      </div>

      <div className="grid three">
        <article className="card"><h3>Company Eligibility</h3>{eligible.map(company => <div className={company.ok ? 'row ok' : 'row bad'} key={company.name}><b>{company.name}</b><span>{company.ok ? 'Eligible' : `Needs ${company.minCgpa} CGPA`}</span></div>)}</article>
        <article className="card"><h3>Resume Manager</h3><div className="upload"><Upload /><b>Upload resume PDF</b><span>Preview, replace, download, and AI review</span></div><button className="primary"><Sparkles size={16} /> Review Resume</button></article>
        <article className="card"><h3>Job Tracker</h3>{applications.map((status, i) => <div className="row" key={status}><b>{status}</b><span>{[6,3,2,1,1][i]} companies</span></div>)}</article>
      </div>

      <div className="grid two">
        <article className="card"><h3>Aptitude Practice</h3>{['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Computer Fundamentals'].map((q, i) => <div className="row" key={q}><b>{q}</b><span>{[82,76,88,91][i]}%</span></div>)}</article>
        <article className="card"><h3>Admin Panel</h3><div className="stats mini"><Stat icon={Building2} label="Companies" value="32" note="11 active" /><Stat icon={Briefcase} label="Quiz Attempts" value="2,416" note="78% average" /></div></article>
      </div>
    </section>
  </main>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
