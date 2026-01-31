export interface ProjectPreferences {
  domain: string;
  teamSize: number;
  duration: number;
  technology: string;
}

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  uniqueness: number;
  risk: 'Low' | 'Medium' | 'High';
  effort: number;
  sdlc: 'Agile' | 'Waterfall' | 'Iterative';
  githubMatches?: string[];
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
  huggingFaceToken?: string;
  githubToken?: string;
}

export const DEMO_PROJECTS: ProjectIdea[] = [
  {
    id: '1',
    title: 'Smart Campus Navigation System',
    description: 'A mobile-first web app that helps students navigate large university campuses using indoor mapping and AR waypoints. Includes real-time room availability and event scheduling.',
    uniqueness: 78,
    risk: 'Medium',
    effort: 8,
    sdlc: 'Agile',
    githubMatches: ['campus-map', 'university-navigator']
  },
  {
    id: '2',
    title: 'AI-Powered Study Group Matcher',
    description: 'Platform that uses ML to match students with compatible study partners based on learning styles, schedules, and course performance. Features chat and scheduling.',
    uniqueness: 85,
    risk: 'Medium',
    effort: 10,
    sdlc: 'Agile',
    githubMatches: ['study-buddy']
  },
  {
    id: '3',
    title: 'Collaborative Code Review Platform',
    description: 'A peer code review system designed for academic settings with inline commenting, rubric-based grading, and plagiarism detection integration.',
    uniqueness: 62,
    risk: 'Low',
    effort: 6,
    sdlc: 'Iterative',
    githubMatches: ['code-review-tool', 'peer-review-system']
  },
  {
    id: '4',
    title: 'Lab Equipment Booking System',
    description: 'Web application for managing and booking laboratory equipment with calendar integration, usage tracking, and maintenance scheduling.',
    uniqueness: 71,
    risk: 'Low',
    effort: 5,
    sdlc: 'Waterfall',
    githubMatches: ['lab-booking']
  },
  {
    id: '5',
    title: 'Real-time Project Progress Tracker',
    description: 'Dashboard for tracking team project milestones with burndown charts, automated GitHub integration, and slack/email notifications for deadlines.',
    uniqueness: 54,
    risk: 'Low',
    effort: 7,
    sdlc: 'Agile',
    githubMatches: ['project-tracker', 'milestone-tracker']
  }
];
