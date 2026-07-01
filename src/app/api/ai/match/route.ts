import { NextResponse } from 'next/server';
import { getUserById, getUsers, UserProfile } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const targetUserId = searchParams.get('targetUserId');

    if (!userId) {
      return NextResponse.json({ error: 'userId query parameter is required' }, { status: 400 });
    }

    const user = getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const allUsers = getUsers().filter(u => u.id !== userId);

    const calculateMatch = (u1: UserProfile, u2: UserProfile) => {
      const s1 = new Set(u1.skills.map((s: string) => s.toLowerCase()));
      const s2 = new Set(u2.skills.map((s: string) => s.toLowerCase()));
      
      const common = [...s1].filter(x => s2.has(x));
      const onlyU1 = [...s1].filter(x => !s2.has(x));
      const onlyU2 = [...s2].filter(x => !s1.has(x));
      
      const skillScore = Math.min(100, Math.floor(
        (common.length * 15) + (onlyU2.length * 12) + 35
      ));

      const int1 = new Set(u1.interests.map((i: string) => i.toLowerCase()));
      const int2 = new Set(u2.interests.map((i: string) => i.toLowerCase()));
      const commonInterests = [...int1].filter(x => int2.has(x));
      const interestScore = Math.min(100, Math.floor(
        (commonInterests.length / Math.max(1, int1.size)) * 50 + 50
      ));

      const availScore = u1.availability.slice(0, 4) === u2.availability.slice(0, 4) ? 95 : 75;
      const commScore = u1.experience === u2.experience ? 90 : 80;
      const overallScore = Math.floor((skillScore * 0.4) + (interestScore * 0.3) + (availScore * 0.15) + (commScore * 0.15));

      const strengths = [];
      if (commonInterests.length > 0) strengths.push(`Shared interest in ${commonInterests.map(i => i.toUpperCase()).join(', ')}`);
      const backendSkills = onlyU2.filter((s: string) => ['solidity', 'rust', 'go', 'python', 'node.js'].includes(s));
      if (backendSkills.length > 0) {
        strengths.push(`Complements backend/blockchain expertise with ${backendSkills.map(s => s.toUpperCase()).join(', ')}`);
      }
      if (strengths.length === 0) strengths.push('Complementary work ethic and tech stack alignment');

      const weaknesses = [];
      if (common.length === 0) weaknesses.push('Lack of direct tech stack overlap, which may require detailed API specs');
      if (u1.experience === 'Advanced' && u2.experience === 'Beginner') weaknesses.push('Mentorship needs due to developer experience gaps');
      if (weaknesses.length === 0) weaknesses.push('Minor schedule alignment required for deep syncs');

      const improvements = [
        'Organize a 10-minute brainstorming session on Discord/Slack.',
        'Define exact schema/API endpoints early to unlock parallel flows.'
      ];

      return {
        overall: overallScore,
        skills: skillScore,
        interests: interestScore,
        availability: availScore,
        communication: commScore,
        recommendedRole: u2.preferredRole || "Developer",
        strengths,
        weaknesses,
        improvements
      };
    };

    if (targetUserId) {
      const targetUser = getUserById(targetUserId);
      if (!targetUser) {
        return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
      }
      const match = calculateMatch(user, targetUser);
      return NextResponse.json({ developer: targetUser, match });
    }

    const matches = allUsers.map(u => ({
      developer: u,
      match: calculateMatch(user, u)
    })).sort((a, b) => b.match.overall - a.match.overall);

    return NextResponse.json(matches);
  } catch (error) {
    console.error("AI Match GET Error:", error);
    return NextResponse.json({ error: 'Failed to compute AI matches' }, { status: 500 });
  }
}
