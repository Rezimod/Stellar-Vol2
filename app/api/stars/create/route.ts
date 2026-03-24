import { NextRequest, NextResponse } from 'next/server';
import { registerStar } from '@/lib/stellar';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { starName, ownerName, dedicatedTo, occasionDate, message } = body;

    if (!starName || !ownerName || !dedicatedTo || !occasionDate || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (message.length < 10) {
      return NextResponse.json({ error: 'Message too short' }, { status: 400 });
    }

    const result = await registerStar({
      name: starName.trim(),
      dedicated_to: dedicatedTo.trim(),
      message: message.trim(),
      owner_name: ownerName.trim(),
      occasion_date: occasionDate,
    });

    // Encode all star data into the URL — no database needed
    const starData = {
      id:                 result.star_id,
      name:               starName.trim(),
      dedicated_to:       dedicatedTo.trim(),
      message:            message.trim(),
      owner_name:         ownerName.trim(),
      occasion_date:      occasionDate,
      ra:                 result.ra,
      dec:                result.dec,
      constellation:      result.constellation,
      magnitude:          result.magnitude,
      tx_hash:            result.tx_hash,
      certificate_number: result.certificate_number,
      created_at:         new Date().toISOString().split('T')[0],
    };

    const encoded = Buffer.from(JSON.stringify(starData)).toString('base64url');
    return NextResponse.json({ id: encoded });

  } catch (err) {
    console.error('[stars/create]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    );
  }
}
