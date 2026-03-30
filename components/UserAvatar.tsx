interface UserAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function UserAvatar({ name, size = 'md' }: UserAvatarProps) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-16 h-16 text-xl',
  };

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-bold flex-shrink-0`}
      style={{
        background: 'linear-gradient(135deg, rgba(56,240,255,0.2), rgba(122,95,255,0.2))',
        border: '1px solid rgba(56,240,255,0.30)',
        color: '#38F0FF',
      }}
    >
      {initials}
    </div>
  );
}
