// Mock data. Dates are relative to today so the Today/Week/Month filters always have results.
const at = (days, hour = 10) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

export const CATEGORIES = ["Hackathons", "Workshops", "Cultural Programs", "Tech Meetups"];
export const MODES = ["Online", "Offline", "Hybrid"];

export const EVENTS = [
  { id: 1, title: "Build for Bharat 24h Hackathon", club: "IEDC Chengannur", category: "Hackathons", mode: "Offline",
    location: "Main Seminar Hall, CEC", start: at(0, 18), hours: 24, featured: true,
    desc: "Ship a working product in 24 hours. Themes: campus life, civic tech, and open data. Food, mentors, and prizes included.",
    prereq: ["Team of 2-4", "Laptop and charger", "Any language or stack"],
    speakers: [{ name: "Anjali Menon", role: "Product Lead, Zoho" }, { name: "Rahul Das", role: "Open-source maintainer" }] },
  { id: 2, title: "Intro to Rust for Web Developers", club: "TinkerHub CEC", category: "Workshops", mode: "Hybrid",
    location: "Lab 3 / Google Meet", start: at(2, 14), hours: 3, featured: true,
    desc: "Learn ownership, borrowing, and WebAssembly by compiling a small image filter that runs in the browser.",
    prereq: ["Basic JavaScript", "Rust toolchain installed"],
    speakers: [{ name: "Vishnu Prasad", role: "Systems engineer" }] },
  { id: 3, title: "Onam Cultural Fest: Tech Edition", club: "Arts Club", category: "Cultural Programs", mode: "Offline",
    location: "Open Air Auditorium", start: at(5, 16), hours: 5, featured: true,
    desc: "Pookalam contests, thiruvathira, and a live generative-art showcase made by students.",
    prereq: ["Open to all departments"], speakers: [{ name: "Meera Nair", role: "Festival coordinator" }] },
  { id: 4, title: "React Kerala Meetup", club: "GDG Palakkad", category: "Tech Meetups", mode: "Online",
    location: "meet.google.com/abc-defg-hij", start: at(1, 19), hours: 2,
    desc: "Lightning talks on server components, state management, and shipping side projects.",
    prereq: ["None"], speakers: [{ name: "Arjun K", role: "Frontend engineer" }] },
  { id: 5, title: "Git and GitHub Bootcamp", club: "FOSS Cell", category: "Workshops", mode: "Offline",
    location: "CS Seminar Room", start: at(9, 10), hours: 4,
    desc: "Branching, pull requests, and making your first open-source contribution before you leave the room.",
    prereq: ["GitHub account"], speakers: [{ name: "Sneha Raj", role: "FOSS mentor" }] },
  { id: 6, title: "AI Product Jam", club: "Campus AI Guild", category: "Hackathons", mode: "Hybrid",
    location: "Innovation Lab / Discord", start: at(16, 9), hours: 12,
    desc: "Prototype an AI-powered tool for students. Judged on usefulness, polish, and a live demo.",
    prereq: ["Team of 1-3", "API keys provided"], speakers: [{ name: "Dr. Thomas Eapen", role: "AI researcher" }] },
  { id: 7, title: "Open Mic and Jam Night", club: "Music Club", category: "Cultural Programs", mode: "Offline",
    location: "Amphitheatre", start: at(12, 18), hours: 3,
    desc: "Sing, play, or recite. Sign up at the door or bring your own band.",
    prereq: ["Open to all"], speakers: [{ name: "Kiran Joseph", role: "Host" }] },
  { id: 8, title: "Cloud Study Jam", club: "GDG Palakkad", category: "Tech Meetups", mode: "Online",
    location: "YouTube Live", start: at(22, 17), hours: 2,
    desc: "Follow guided labs and earn cloud skill badges with your peers.",
    prereq: ["Free cloud account"], speakers: [{ name: "Fathima S", role: "Cloud engineer" }] },
];

export const CHAPTERS = [
  { name: "TinkerHub CEC", points: 1840, members: 212, streak: "12 weeks" },
  { name: "GDG Palakkad", points: 1625, members: 188, streak: "9 weeks" },
  { name: "FOSS Cell", points: 1410, members: 96, streak: "7 weeks" },
  { name: "Campus AI Guild", points: 1180, members: 74, streak: "5 weeks" },
];

export const PATHS = [
  { name: "Web Fundamentals", steps: 12, learners: 340, progress: 70 },
  { name: "Intro to Machine Learning", steps: 10, learners: 215, progress: 45 },
  { name: "Open Source Contributor", steps: 8, learners: 128, progress: 30 },
];

export const CONTRIBUTORS = [
  { name: "Ananya P", score: 960, badge: "Mentor" },
  { name: "Midhun V", score: 870, badge: "Speaker" },
  { name: "Devika R", score: 790, badge: "Organizer" },
];
