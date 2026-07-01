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

    // Skill matching logic
    const userSkillsLower = user.skills.map(s => s.toLowerCase());
    const requiredSkills = problem.requiredSkills;

    const matchingSkills = requiredSkills.filter(s => userSkillsLower.includes(s.toLowerCase()));
    const missingSkills = requiredSkills.filter(s => !userSkillsLower.includes(s.toLowerCase()));

    const matchPercent = Math.round((matchingSkills.length / Math.max(1, requiredSkills.length)) * 100);

    // Learning priorities & recommended courses
    const learningPriority = missingSkills.map((skill, index) => {
      const isCritical = index === 0; // mark first missing skill as critical/high priority
      return {
        skill,
        priority: isCritical ? 'High' : 'Medium',
        estimatedTime: isCritical ? '8-10 hours' : '4-6 hours',
        course: `Mastering ${skill} for Hackathons (courtesy of FreeCodeCamp / YouTube)`
      };
    });

    // Teammate recommendations for missing skills
    // Find users who have at least one of the missing skills
    const otherUsers = getUsers().filter(u => u.id !== userId);
    const recommendedTeammates = otherUsers.map(u => {
      const hasSkills = u.skills.filter(s => missingSkills.some(ms => ms.toLowerCase() === s.toLowerCase()));
      return {
        developer: {
          id: u.id,
          name: u.name,
          avatar: u.avatar,
          skills: u.skills,
          preferredRole: u.preferredRole,
          college: u.college
        },
        matchingSkills: hasSkills
      };
    }).filter(t => t.matchingSkills.length > 0)
      .sort((a, b) => b.matchingSkills.length - a.matchingSkills.length)
      .slice(0, 3); // top 3 teammates

    return NextResponse.json({
      matchPercent,
      matchingSkills,
      missingSkills,
      learningPriority,
      recommendedTeammates
    });
  } catch (error) {
    console.error("AI Skill Gap Error:", error);
    return NextResponse.json({ error: 'Failed to compute skill gap analysis' }, { status: 500 });
  }
}
