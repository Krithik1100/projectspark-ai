export interface ProjectPreferences {
  domain: string;
  teamSize: number;
  duration: number;
  technology: string;
}

export interface GitHubRepoMatch {
  name: string;
  fullName: string;
  url: string;
  stars: number;
  description: string;
  similarity: number;
}

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  problemSolved?: string;
  uniquenessFactor?: string;
  uniqueness: number;
  risk: 'Low' | 'Medium' | 'High';
  effort: number;
  sdlc: 'Agile' | 'Waterfall' | 'Iterative';
  githubMatches?: string[];
  detailedMatches?: GitHubRepoMatch[];
}

export interface GitHubRepo {
  name: string;
  description: string;
  topics: string[];
  url: string;
  stars: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface TokenSettings {
  githubToken?: string;
}

export const DEMO_PROJECTS: ProjectIdea[] = [
  {
    id: '1',
    title: 'Smart Campus Navigation System',
    description: 'A mobile-first web app that helps students navigate large university campuses using indoor mapping and AR waypoints. Includes real-time room availability and event scheduling.',
    problemSolved: 'Students and visitors constantly struggle to find classrooms and facilities across complex multistory university campuses, leading to lost time and missed lectures.',
    uniquenessFactor: 'Combines indoor Bluetooth/WiFi triangulation with augmented reality (AR) camera overlays and live timetable integrations, unlike standard static map apps.',
    uniqueness: 84,
    risk: 'Medium',
    effort: 8,
    sdlc: 'Agile',
    githubMatches: ['campus-map-navigator', 'university-indoor-locator'],
    detailedMatches: [
      {
        name: 'campus-map',
        fullName: 'university-dev/campus-map',
        url: 'https://github.com',
        stars: 142,
        description: 'Static 2D map viewer for university grounds.',
        similarity: 38,
      }
    ]
  },
  {
    id: '2',
    title: 'AI-Powered Study Group Matcher',
    description: 'Platform that uses machine learning to match students with compatible study partners based on learning styles, schedules, and course performance metrics.',
    problemSolved: 'Students in large or hybrid classes often fail to find peer study groups that match their specific pace, schedule availability, and learning objectives.',
    uniquenessFactor: 'Uses preference-clustering algorithms and syllabus milestone tracking rather than simple static forum posts.',
    uniqueness: 88,
    risk: 'Medium',
    effort: 10,
    sdlc: 'Agile',
    githubMatches: ['study-buddy-finder', 'peer-learning-matcher'],
    detailedMatches: [
      {
        name: 'study-buddy',
        fullName: 'edu-hacks/study-buddy',
        url: 'https://github.com',
        stars: 95,
        description: 'Basic student forum for finding homework partners.',
        similarity: 32,
      }
    ]
  },
  {
    id: '3',
    title: 'Collaborative Code Review Platform',
    description: 'A peer code review system designed for academic programming courses with inline commenting, rubric-based grading, and automated style linting.',
    problemSolved: 'Instructors spend excessive manual hours grading repetitive student code, while students miss out on early constructive peer feedback before submission deadlines.',
    uniquenessFactor: 'Integrates automated student-to-student double-blind review workflows with real-time test case verification.',
    uniqueness: 76,
    risk: 'Low',
    effort: 6,
    sdlc: 'Iterative',
    githubMatches: ['code-review-tool', 'academic-peer-grading'],
    detailedMatches: [
      {
        name: 'peer-review-system',
        fullName: 'cs-education/peer-review-system',
        url: 'https://github.com',
        stars: 210,
        description: 'General essay and code grading portal for universities.',
        similarity: 42,
      }
    ]
  },
  {
    id: '4',
    title: 'Lab Equipment Booking & IoT Safety Monitor',
    description: 'Web application for managing and booking specialized engineering laboratory equipment with calendar reservation, usage telemetry, and automatic timeout cutoffs.',
    problemSolved: 'Frequent scheduling conflicts and unmonitored equipment wear in shared university research labs cause safety issues and maintenance backlogs.',
    uniquenessFactor: 'Direct IoT relay integration that only powers equipment during confirmed student booking slots.',
    uniqueness: 91,
    risk: 'Medium',
    effort: 7,
    sdlc: 'Agile',
    githubMatches: ['lab-booking-scheduler'],
    detailedMatches: [
      {
        name: 'lab-booking',
        fullName: 'lab-tools/lab-booking',
        url: 'https://github.com',
        stars: 64,
        description: 'Standard calendar reservation system for lab spaces.',
        similarity: 28,
      }
    ]
  },
  {
    id: '5',
    title: 'Real-time Project Milestone Tracker with Burn-Down Analytics',
    description: 'Dashboard for student capstone teams tracking sprint deliverables with automated GitHub repository commit activity sync and email deadline alerts.',
    problemSolved: 'Student project teams suffer from last-minute crunches and uneven contribution distributions due to lack of visibility into progress.',
    uniquenessFactor: 'Correlates git commit activity and PR reviews directly with assigned course rubrics to highlight at-risk milestones early.',
    uniqueness: 72,
    risk: 'Low',
    effort: 7,
    sdlc: 'Agile',
    githubMatches: ['project-tracker', 'milestone-tracker'],
    detailedMatches: [
      {
        name: 'student-progress-tracker',
        fullName: 'capstone-tools/student-progress-tracker',
        url: 'https://github.com',
        stars: 128,
        description: 'Milestone tracking dashboard with manual checkbox updates.',
        similarity: 45,
      }
    ]
  }
];
