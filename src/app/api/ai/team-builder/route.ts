import { NextResponse } from 'next/server';
import { getUserById, readDb, getUsers } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const hackathonId = searchParams.get('hackathonId');
    const problemStatementId = searchParams.get('problemStatementId');

    if (!userId || !hackathonId || !problemStatementId) {
      return NextResponse.json({ error: 'userId, hackathonId, and problemStatementId are required' }, { status: 400 });
    }

    const user = getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const db = readDb();
    const hackathon = db.hackathons.find(h => h.id === hackathonId);
    if (!hackathon) {
      return NextResponse.json({ error: 'Hackathon not found' }, { status: 404 });
    }

    const problem = hackathon.problemStatements.find(p => p.id === problemStatementId);
    if (!problem) {
      return NextResponse.json({ error: 'Problem statement not found' }, { status: 404 });
    }

    // Required roles from problem statement
    const requiredRoles = problem.roles;
    const requiredSkills = problem.requiredSkills;

    // Filter out user's skills to find missing skills
    const userSkillsLower = user.skills.map(s => s.toLowerCase());
    const missingSkills = requiredSkills.filter(s => !userSkillsLower.includes(s.toLowerCase()));

    // Find other developers who match the missing skills
    const allDevelopers = getUsers().filter(u => u.id !== userId);
    
    // Sort developers by how many missing skills they cover
    const developerScores = allDevelopers.map(dev => {
      const coveredSkills = dev.skills.filter(s => 
        missingSkills.some(ms => ms.toLowerCase() === s.toLowerCase())
      );
      return {
        dev,
        score: coveredSkills.length,
        coveredSkills
      };
    }).sort((a, b) => b.score - a.score);

    // Pick top 2 developers to fill the team
    const recommendedTeammates = developerScores
      .filter(ds => ds.score > 0)
      .slice(0, 2)
      .map(ds => ({
        id: ds.dev.id,
        name: ds.dev.name,
        avatar: ds.dev.avatar,
        college: ds.dev.college,
        preferredRole: ds.dev.preferredRole,
        skills: ds.dev.skills,
        coveredSkills: ds.coveredSkills
      }));

    // Calculate dynamic team stats
    const teamMembersCount = recommendedTeammates.length + 1; // including current user
    const totalCoveredSkillsSet = new Set([
      ...user.skills.map(s => s.toLowerCase()),
      ...recommendedTeammates.flatMap(t => t.skills.map(s => s.toLowerCase()))
    ]);

    const problemSkillsSet = new Set(requiredSkills.map(s => s.toLowerCase()));
    const finalMatchingSkills = requiredSkills.filter(s => totalCoveredSkillsSet.has(s.toLowerCase()));
    const finalMissingSkills = requiredSkills.filter(s => !totalCoveredSkillsSet.has(s.toLowerCase()));

    const teamScore = Math.min(100, Math.round((finalMatchingSkills.length / Math.max(1, requiredSkills.length)) * 50 + 50));
    const winningProbability = Math.min(98, Math.round(teamScore * 0.9 + (teamMembersCount * 2) + Math.floor(Math.random() * 5)));

    // Dynamic Strengths & Weaknesses
    const strengths = [
      `Complete skill coverage for: ${finalMatchingSkills.join(', ')}`,
      `Strong profile synergy with members from ${Array.from(new Set([user.college, ...recommendedTeammates.map(t => t.college)])).join(', ')}`,
      `Balanced roles covering ${user.preferredRole} and ${recommendedTeammates.map(t => t.preferredRole).join(' & ')}`
    ];

    const weaknesses = finalMissingSkills.length > 0 
      ? [`Still missing direct coverage for: ${finalMissingSkills.join(', ')}`]
      : ['No major technical skill gaps detected for this problem statement'];

    const improvements = [
      'Connect on GitHub to review each other\'s repository structures.',
      'Establish a clear Trello or GitHub Project Board to distribute development tasks.'
    ];

    return NextResponse.json({
      recommendedTeammates,
      missingRoles: finalMissingSkills,
      teamScore,
      strengths,
      weaknesses,
      winningProbability,
      suggestedImprovements: improvements
    });
  } catch (error) {
    console.error("AI Team Builder Error:", error);
    return NextResponse.json({ error: 'Failed to build team recommendations' }, { status: 500 });
  }
}
