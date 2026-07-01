import { NextResponse } from 'next/server';
import { getTeams, createTeam, joinTeam, leaveTeam, addNotification, getUserById } from '@/lib/db';

export async function GET() {
  try {
    const teams = getTeams();
    return NextResponse.json(teams);
  } catch (error) {
    console.error("Teams GET Error:", error);
    return NextResponse.json({ error: 'Failed to retrieve teams' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create') {
      const { name, hackathonId, problemStatementId, idea, requiredSkills, missingRoles, creator } = body;
      if (!name || !hackathonId || !creator) {
        return NextResponse.json({ error: 'Name, hackathonId, and creator are required' }, { status: 400 });
      }
      
      const newTeam = createTeam({
        name,
        hackathonId,
        problemStatementId: problemStatementId || '',
        idea: idea || '',
        requiredSkills: requiredSkills || [],
        missingRoles: missingRoles || [],
        members: [{
          id: creator.id,
          name: creator.name,
          role: creator.preferredRole || 'Leader',
          avatar: creator.avatar
        }]
      });
      return NextResponse.json({ success: true, team: newTeam });
    }

    if (action === 'join') {
      const { teamId, userId, preferredRole } = body;
      if (!teamId || !userId) {
        return NextResponse.json({ error: 'Team ID and User ID are required' }, { status: 400 });
      }

      const user = getUserById(userId);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const team = joinTeam(teamId, user, preferredRole);
      if (!team) {
        return NextResponse.json({ error: 'Team not found or failed to join' }, { status: 404 });
      }
      return NextResponse.json({ success: true, team });
    }

    if (action === 'leave') {
      const { teamId, userId } = body;
      if (!teamId || !userId) {
        return NextResponse.json({ error: 'Team ID and User ID are required' }, { status: 400 });
      }

      const team = leaveTeam(teamId, userId);
      return NextResponse.json({ success: true, team });
    }

    if (action === 'invite') {
      const { teamId, senderName, receiverId, teamName } = body;
      if (!teamId || !senderName || !receiverId) {
        return NextResponse.json({ error: 'Missing invitation parameters' }, { status: 400 });
      }

      const notification = addNotification({
        userId: receiverId,
        type: 'team_invitation',
        title: 'Team Invitation',
        message: `${senderName} invited you to join team '${teamName || 'Hackathon Team'}'`,
        senderName,
        teamId
      });

      return NextResponse.json({ success: true, notification });
    }

    return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
  } catch (error) {
    console.error("Teams POST Error:", error);
    return NextResponse.json({ error: 'Failed to process team action' }, { status: 500 });
  }
}
