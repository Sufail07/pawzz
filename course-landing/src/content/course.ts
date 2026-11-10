export const tracks = [
  {
    id: "foundations",
    name: "AI Foundations",
    audience: "Students",
    duration: "6 weeks",
    format: "Live online, twice a week",
    heroSubhead:
      "For students who want a portfolio that stands out. Live cohorts, real projects, no coding background needed.",
    outcomes: [
      {
        title: "Use AI tools with confidence",
        detail:
          "Pick the right tool for a task and get reliable answers instead of vague ones.",
      },
      {
        title: "Research faster, cite honestly",
        detail:
          "Build a study and research workflow that keeps sources, notes and drafts in one place.",
      },
      {
        title: "Ship a first portfolio project",
        detail:
          "Take one real problem from your campus or community to a finished, presentable build.",
      },
      {
        title: "Explain your work in an interview",
        detail:
          "Practise describing what you built, the decisions you made and what you would change.",
      },
      {
        title: "Set up an AI habit that lasts",
        detail:
          "A weekly routine for prompts, reviews and notes that survives after the cohort ends.",
      },
    ],
    projects: ["Campus study assistant", "Research digest", "Portfolio case study"],
  },
  {
    id: "at-work",
    name: "AI at Work",
    audience: "Young professionals",
    duration: "6 weeks",
    format: "Live online, weekend workshops",
    heroSubhead:
      "For working professionals who want AI to make them faster at the job they already do. Live cohorts, real projects, no coding background needed.",
    outcomes: [
      {
        title: "Automate the repeat work",
        detail:
          "Find the tasks you repeat every week and turn the boring parts into a reliable routine.",
      },
      {
        title: "Draft better, edit faster",
        detail:
          "Use AI for first drafts, summaries and reviews without losing your own voice.",
      },
      {
        title: "Work with messy spreadsheets",
        detail:
          "Clean, combine and question data using plain-language instructions and simple formulas.",
      },
      {
        title: "Bring one automation to your job",
        detail:
          "Build a working automation for your own role and measure the time it gives back.",
      },
      {
        title: "Make the case to your team",
        detail:
          "Present the before-and-after with numbers your manager can actually act on.",
      },
    ],
    projects: ["Weekly-report automation", "Meeting-notes pipeline", "Team knowledge base"],
  },
  {
    id: "studio",
    name: "Digital Skills Studio",
    audience: "Students and professionals",
    duration: "8 weeks",
    format: "Live online, project clinics",
    heroSubhead:
      "For anyone who wants to build a simple website, create content and automate the boring parts. Live cohorts, real projects, no coding background needed.",
    outcomes: [
      {
        title: "Build a simple website",
        detail:
          "Plan, write and publish a clean one-page site for yourself, a club or a small business.",
      },
      {
        title: "Create content that fits a purpose",
        detail:
          "Write posts, pages and emails that match the audience instead of sounding generic.",
      },
      {
        title: "Run basic automations",
        detail:
          "Connect forms, sheets and messages so routine admin happens without you.",
      },
      {
        title: "Make it look intentional",
        detail:
          "Apply type, spacing and colour rules so your work looks consistent and trustworthy.",
      },
      {
        title: "Show the whole process",
        detail:
          "Document the brief, the build and the result as a project others can review.",
      },
    ],
    projects: ["One-page portfolio site", "Content calendar engine", "Enquiry-to-sheet automation"],
  },
] as const;

export type Track = (typeof tracks)[number];
export type TrackId = Track["id"];

export const trackIds: TrackId[] = tracks.map((track) => track.id);

export function isTrackId(value: unknown): value is TrackId {
  return typeof value === "string" && trackIds.includes(value as TrackId);
}

export function getTrack(id: TrackId): Track {
  return tracks.find((track) => track.id === id) ?? tracks[0];
}

export const outcomes = tracks;

export const steps = [
  {
    title: "Book a free intro session",
    detail:
      "A short call to understand where you are and which track fits. No payment and no pressure.",
  },
  {
    title: "Join a small cohort",
    detail:
      "You start with a group of 12–16 learners on the same track, with a fixed weekly rhythm.",
  },
  {
    title: "Build real projects",
    detail:
      "Every week you make something and get feedback from a mentor, not just watch a video.",
  },
  {
    title: "Showcase what you built",
    detail:
      "Finish with a presented project and a write-up you can put in a portfolio or bring to work.",
  },
] as const;

export const projects = [
  {
    title: "Campus study assistant",
    track: "AI Foundations",
    summary:
      "A simple assistant that turns lecture notes into revision questions and a weekly study plan.",
    tools: ["Claude", "Notion", "Google Sheets"],
    practice: ["Prompting", "Structuring notes", "Micro-automation"],
  },
  {
    title: "Weekly-report automation",
    track: "AI at Work",
    summary:
      "Collect task updates, draft the summary and send the report before the Monday meeting.",
    tools: ["ChatGPT", "Google Sheets", "Apps Script"],
    practice: ["Data cleaning", "Templating", "Process design"],
  },
  {
    title: "One-page site and content engine",
    track: "Digital Skills Studio",
    summary:
      "Publish a one-page site and plan a month of posts from a single content calendar.",
    tools: ["Framer", "Canva", "Make"],
    practice: ["Layout", "Copywriting", "Automation"],
  },
] as const;

export const mentors = [
  {
    name: "Founder name (placeholder)",
    role: "Founder and lead mentor",
    bio: "A placeholder bio for the founder: background, the reason the academy exists, and how students are taught. Real details to be supplied before launch.",
    focus: "Programme design and intro calls",
    initials: "FN",
  },
  {
    name: "Mentor name (placeholder)",
    role: "Project mentor",
    bio: "A placeholder bio for a mentor: field experience, the kind of projects they review, and the feedback style learners can expect.",
    focus: "Project reviews and portfolio feedback",
    initials: "MN",
  },
] as const;

export const testimonials = [
  {
    quote:
      "Placeholder testimonial. A real quote from a student will replace this card after the first cohort finishes.",
    name: "Student, cohort 1 (placeholder)",
    track: "AI Foundations",
  },
  {
    quote:
      "Placeholder testimonial. A real quote from a working professional will replace this card after the first cohort finishes.",
    name: "Professional, cohort 1 (placeholder)",
    track: "AI at Work",
  },
  {
    quote:
      "Placeholder testimonial. A real quote from a studio learner will replace this card after the first cohort finishes.",
    name: "Studio learner, cohort 1 (placeholder)",
    track: "Digital Skills Studio",
  },
] as const;

export const faqs = [
  {
    question: "Do I need a coding background?",
    answer:
      "No. The tracks are built for people who have never written code. You will use tools and plain-language instructions, and mentors show you every step.",
  },
  {
    question: "How much time does it take each week?",
    answer:
      "Plan for about four to five hours a week: two live sessions plus project work at your own pace. The projects are designed to fit around a college timetable or a job.",
  },
  {
    question: "Are the sessions live or recorded?",
    answer:
      "Sessions are live and small. Recordings are shared after each session so you can catch up, but the value comes from attending and asking questions.",
  },
  {
    question: "What do I get at the end?",
    answer:
      "A finished project, a written case study and a certificate of completion. Programme names, durations and certificates are illustrative and need confirmation by the founder.",
  },
  {
    question: "What does it cost?",
    answer:
      "Pricing is a placeholder in this prototype and will be confirmed by the founder. You always start with a free intro session before any payment is discussed.",
  },
  {
    question: "How do payments work?",
    answer:
      "Payment options are not part of this prototype. The founder will share cohort and payment details after the intro call.",
  },
  {
    question: "What is the refund policy?",
    answer:
      "A refund policy has not been finalised. Ask for the current policy on your intro call — do not assume the one shown here is final.",
  },
  {
    question: "Do I need my own laptop?",
    answer:
      "Yes, a laptop with a modern browser and a stable connection. You should also be able to install free tools; no paid software is required.",
  },
  {
    question: "How big is a cohort?",
    answer:
      "The plan is 12 to 16 learners per cohort so mentors can review work personally. Cohort dates and sizes are placeholders until the founder confirms them.",
  },
  {
    question: "What happens after I submit the form?",
    answer:
      "You will see a confirmation on screen. The team then messages you on WhatsApp within a few hours during working hours to agree on a call time.",
  },
] as const;
