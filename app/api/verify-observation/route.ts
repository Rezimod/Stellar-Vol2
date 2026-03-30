import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateRewardCode, getRewardExpiryDate, getNewLevel } from '@/lib/missions/rewards';

interface VerifyRequest {
  mission_id: string;
  user_mission_id: string;
  photo_url: string;
  weather_snapshot: Record<string, unknown>;
  sky_data_snapshot: Record<string, unknown>;
}

interface AIVerificationResult {
  verified: boolean;
  confidence: number;
  scores: {
    authenticity: number;
    object_match: number;
    consistency: number;
    effort: number;
  };
  analysis: string;
  rejection_reason: string | null;
  tips: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: VerifyRequest = await request.json();
    const { mission_id, user_mission_id, photo_url, weather_snapshot, sky_data_snapshot } = body;

    // Fetch mission details
    const { data: mission } = await supabase
      .from('missions')
      .select('*')
      .eq('id', mission_id)
      .single();

    if (!mission) {
      return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
    }

    // Fetch image and convert to base64
    const imageResponse = await fetch(photo_url);
    if (!imageResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: 400 });
    }
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const contentType = imageResponse.headers.get('content-type') ?? 'image/jpeg';

    const verificationPrompt = `You are an astronomy observation verification AI for SkyWatcher by Astroman.

Your job is to analyze a user-submitted photo and determine if it is a genuine observation of the target celestial object.

TARGET OBJECT: ${mission.target_object}
MISSION: ${mission.description_en}
DIFFICULTY: ${mission.difficulty}

CURRENT CONDITIONS AT SUBMISSION:
- Date/Time: ${new Date().toISOString()}
- Location: Tbilisi, Georgia (41.7151°N, 44.8271°E)
- Cloud Cover: ${(weather_snapshot as Record<string, unknown>).cloudcover ?? 'unknown'}%
- Temperature: ${(weather_snapshot as Record<string, unknown>).temperature ?? 'unknown'}°C
- Moon Phase: ${(sky_data_snapshot as Record<string, unknown>).moon_phase ?? 'unknown'}
- Moon Illumination: ${(sky_data_snapshot as Record<string, unknown>).moon_illumination ?? 'unknown'}%
- Target Object Altitude: ${(sky_data_snapshot as Record<string, unknown>).target_altitude ?? 'unknown'}°

ANALYZE THE IMAGE FOR:

1. AUTHENTICITY CHECK (weight: 40%)
   - Does this look like a photo taken through a telescope, binoculars, or camera?
   - Are there signs this is a screenshot from a planetarium app?
   - Does it look like a downloaded image from Google, NASA, or Wikipedia?
   - Check for: watermarks, perfect studio quality, UI elements, text overlays
   - Real photography signs: blur, noise/grain, tracking imperfections, atmospheric effects

2. OBJECT IDENTIFICATION (weight: 30%)
   - Can the target object be identified in the image?
   - For planets: Is size/brightness approximately correct?
   - For the Moon: Are phase and features consistent with current moon phase?
   - For deep sky objects: Is the general shape/color reasonable for amateur equipment?
   - For meteors: Is there a streak pattern consistent with a meteor?

3. CONSISTENCY CHECK (weight: 20%)
   - Is the observation physically possible right now?
   - If cloud cover is >80%, a crystal clear photo would be suspicious
   - Does the image quality match what amateur equipment could capture?

4. EFFORT ASSESSMENT (weight: 10%)
   - Does this show genuine effort from the observer?
   - Even imperfect photos showing real attempts should score well here

RESPOND IN THIS EXACT JSON FORMAT:
{
  "verified": true,
  "confidence": 0.75,
  "scores": {
    "authenticity": 0.80,
    "object_match": 0.70,
    "consistency": 0.75,
    "effort": 0.85
  },
  "analysis": "2-3 sentence explanation of your assessment.",
  "rejection_reason": null,
  "tips": "1 sentence tip for better observation next time."
}

VERIFICATION THRESHOLD: confidence >= 0.55 means verified=true.
Be encouraging but honest. An imperfect photo of the real sky is worth more than a perfect downloaded image.`;

    // Call Anthropic API
    const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: contentType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                data: base64Image,
              },
            },
            { type: 'text', text: verificationPrompt },
          ],
        }],
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`Anthropic API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const rawText = aiData.content[0]?.text ?? '{}';

    let result: AIVerificationResult;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
    } catch {
      result = {
        verified: false,
        confidence: 0,
        scores: { authenticity: 0, object_match: 0, consistency: 0, effort: 0 },
        analysis: 'Could not analyze the image.',
        rejection_reason: 'Analysis failed. Please try again.',
        tips: 'Ensure the image is clear and shows the target object.',
      };
    }

    // Update user_missions record
    const updateData: Record<string, unknown> = {
      ai_analysis: result,
      ai_score: result.confidence,
      submitted_at: new Date().toISOString(),
    };

    if (result.verified) {
      updateData.status = 'verified';
      updateData.verified_at = new Date().toISOString();
    } else {
      updateData.status = 'rejected';
      updateData.rejection_reason = result.rejection_reason;
    }

    await supabase
      .from('user_missions')
      .update(updateData)
      .eq('id', user_mission_id)
      .eq('user_id', user.id);

    // If verified, award points and create reward
    let rewardCode: string | null = null;
    if (result.verified) {
      // Get current profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('xp, total_points, missions_completed')
        .eq('id', user.id)
        .single();

      if (profile) {
        const newXP = profile.xp + mission.xp_reward;
        const newPoints = profile.total_points + mission.points_reward;
        const newLevel = getNewLevel(newXP);

        await supabase
          .from('profiles')
          .update({
            xp: newXP,
            total_points: newPoints,
            level: newLevel,
            missions_completed: profile.missions_completed + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      }

      // Create reward if mission has one
      if (mission.reward_type) {
        rewardCode = generateRewardCode();
        await supabase.from('rewards').insert({
          user_id: user.id,
          mission_id: mission.id,
          reward_type: mission.reward_type,
          reward_code: rewardCode,
          description_en: mission.reward_description_en ?? mission.reward_type,
          description_ka: mission.reward_description_ka ?? mission.reward_type,
          expires_at: getRewardExpiryDate(90),
        });
      }
    }

    return NextResponse.json({
      verified: result.verified,
      confidence: result.confidence,
      scores: result.scores,
      analysis: result.analysis,
      rejection_reason: result.rejection_reason,
      tips: result.tips,
      reward_code: rewardCode,
      points_earned: result.verified ? mission.points_reward : 0,
      xp_earned: result.verified ? mission.xp_reward : 0,
    });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
