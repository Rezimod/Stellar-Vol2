import { notFound } from 'next/navigation';
import { getStarById } from '@/lib/supabase';
import StarCertificate from './StarCertificate';

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  try {
    const star = await getStarById(id);
    return {
      title: `Star "${star.name}" — Astroman Stellar`,
      description: `A star dedicated to ${star.dedicated_to}. "${star.message}"`,
    };
  } catch {
    return { title: 'Star Not Found' };
  }
}

export default async function StarPage({ params }: Props) {
  const { id } = await params;
  try {
    const star = await getStarById(id);
    return <StarCertificate star={star} />;
  } catch {
    notFound();
  }
}
