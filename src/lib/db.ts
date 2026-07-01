import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src/lib/db.json');

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  college: string;
  degree: string;
  year: string;
  bio: string;
  skills: string[];
  experience: string;
  preferredRole: string;
  interests: string[];
  availability: string;
  github: string;
  linkedin: string;
  portfolio: string;
  avatar: string;
}

export interface ProblemStatement {
  id: string;
  title: string;
  description: string;
  summary: string;
  difficulty: string;
  estimatedTime: string;
  requiredSkills: string[];
  recommendedStack: string[];
  roles: string[];
  roadmap: string[];
  resources: string[];
  deliverables: string[];
  innovationTips: string;
  challenges: string;
  ideas: string[];
}

export interface Hackathon {
  id: string;
  name: string;
  organizer: string;
  banner: string;
  registrationDeadline: string;
  eventDate: string;
  type: string;
  prizePool: string;
  minTeamSize: number;
  maxTeamSize: number;
  domain: string;
  difficulty: string;
  problemStatements: ProblemStatement[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface Team {
  id: string;
  name: string;
  hackathonId: string;
  problemStatementId: string;
  idea: string;
  requiredSkills: string[];
  missingRoles: string[];
  members: TeamMember[];
  aiScore: number;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  senderName: string;
  teamId?: string;
  timestamp: string;
  read: boolean;
}

export interface DatabaseSchema {
  users: UserProfile[];
  hackathons: Hackathon[];
  teams: Team[];
  messages: Message[];
  notifications: Notification[];
}

export function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { users: [], hackathons: [], teams: [], messages: [], notifications: [] };
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read local DB:", error);
    return { users: [], hackathons: [], teams: [], messages: [], notifications: [] };
  }
}

export function writeDb(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error("Failed to write to local DB:", error);
  }
}

// User Helpers
export function getUsers(): UserProfile[] {
  return readDb().users;
}

export function getUserById(id: string): UserProfile | undefined {
  return readDb().users.find(u => u.id === id);
}

export function getUserByEmail(email: string): UserProfile | undefined {
  return readDb().users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(user: Omit<UserProfile, "id" | "avatar">): UserProfile {
  const db = readDb();
  const id = (Math.max(0, ...db.users.map(u => parseInt(u.id) || 0)) + 1).toString();
  const avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`;
  const newUser: UserProfile = { ...user, id, avatar };
  
  db.users.push(newUser);
  writeDb(db);
  return newUser;
}

export function updateUser(id: string, data: Partial<UserProfile>): UserProfile | null {
  const db = readDb();
  const index = db.users.findIndex(u => u.id === id);
  if (index === -1) return null;
  
  db.users[index] = { ...db.users[index], ...data };
  writeDb(db);
  return db.users[index];
}

// Team Helpers
export function getTeams(): Team[] {
  return readDb().teams;
}

export function createTeam(team: Omit<Team, "id" | "aiScore">): Team {
  const db = readDb();
  const id = "t" + (Math.max(0, ...db.teams.map(t => parseInt(t.id.replace("t", "")) || 0)) + 1).toString();
  
  // Calculate a simulated AI team balance score based on skills vs required
  const baseScore = 60;
  const skillCount = team.requiredSkills.length;
  const memberCount = team.members.length;
  const aiScore = Math.min(100, baseScore + (memberCount * 10) + (skillCount * 2) + Math.floor(Math.random() * 10));

  const newTeam: Team = { ...team, id, aiScore };
  db.teams.push(newTeam);
  writeDb(db);
  return newTeam;
}

export function joinTeam(teamId: string, user: UserProfile, preferredRole: string): Team | null {
  const db = readDb();
  const teamIndex = db.teams.findIndex(t => t.id === teamId);
  if (teamIndex === -1) return null;

  const team = db.teams[teamIndex];
  
  // Check if already in the team
  if (team.members.some(m => m.id === user.id)) return team;

  const newMember: TeamMember = {
    id: user.id,
    name: user.name,
    role: preferredRole || user.preferredRole || "Developer",
    avatar: user.avatar
  };

  team.members.push(newMember);

  // Recalculate dynamic aiScore and remove appropriate missingRoles
  team.missingRoles = team.missingRoles.filter(role => 
    !newMember.role.toLowerCase().includes(role.toLowerCase()) &&
    !role.toLowerCase().includes(newMember.role.toLowerCase())
  );
  team.aiScore = Math.min(100, team.aiScore + 8 + Math.floor(Math.random() * 5));

  db.teams[teamIndex] = team;
  writeDb(db);
  return team;
}

export function leaveTeam(teamId: string, userId: string): Team | null {
  const db = readDb();
  const teamIndex = db.teams.findIndex(t => t.id === teamId);
  if (teamIndex === -1) return null;

  const team = db.teams[teamIndex];
  const originalMembersCount = team.members.length;
  team.members = team.members.filter(m => m.id !== userId);

  // If team is empty, delete it
  if (team.members.length === 0) {
    db.teams = db.teams.filter(t => t.id !== teamId);
    writeDb(db);
    return null;
  }

  // Adjust missingRoles and score
  if (team.members.length < originalMembersCount) {
    team.aiScore = Math.max(50, team.aiScore - 12);
  }

  db.teams[teamIndex] = team;
  writeDb(db);
  return team;
}

// Message Helpers
export function getMessages(chatId: string): Message[] {
  return readDb().messages.filter(m => m.chatId === chatId);
}

export function sendMessage(senderId: string, receiverId: string, content: string): Message {
  const db = readDb();
  const id = "m" + (db.messages.length + 1).toString();
  
  // ChatId is standard, e.g. "smallerId_largerId" to share conversation
  const sortedIds = [senderId, receiverId].sort();
  const chatId = `${sortedIds[0]}_${sortedIds[1]}`;

  const newMessage: Message = {
    id,
    chatId,
    senderId,
    receiverId,
    content,
    timestamp: new Date().toISOString()
  };

  db.messages.push(newMessage);
  writeDb(db);
  return newMessage;
}

// Notification Helpers
export function getNotifications(userId: string): Notification[] {
  return readDb().notifications.filter(n => n.userId === userId);
}

export function addNotification(notification: Omit<Notification, "id" | "timestamp" | "read">): Notification {
  const db = readDb();
  const id = "n" + (db.notifications.length + 1).toString();
  const newNotification: Notification = {
    ...notification,
    id,
    timestamp: new Date().toISOString(),
    read: false
  };

  db.notifications.push(newNotification);
  writeDb(db);
  return newNotification;
}

export function markNotificationsRead(userId: string): void {
  const db = readDb();
  db.notifications = db.notifications.map(n => n.userId === userId ? { ...n, read: true } : n);
  writeDb(db);
}
