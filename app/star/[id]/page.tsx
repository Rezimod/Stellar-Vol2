import { notFound } from 'next/navigation';
import StarCertificate from './StarCertificate';
import type { StarRecord } from '@/lib/types';

interface Props { params: Promise<{ id: string }> }

function decodeStarId(id: string): StarRecord | null {
  try {
    const json = Buffer.from(id, 'base64url').toString('utf8');
    return JSON.parse(json) as StarRecord;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const star = decodeStarId(id);
  if (!star) return { title: 'Star Not Found' };
  return {
    title: `Star "${star.name}" — Astroman Stellar`,
    description: `A star dedicated to ${star.dedicated_to}. "${star.message}"`,
  };
}

export default async function StarPage({ params }: Props) {
  const { id } = await params;
  const star = decodeStarId(id);
  if (!star) notFound();
  return <StarCertificate star={star} />;
}
