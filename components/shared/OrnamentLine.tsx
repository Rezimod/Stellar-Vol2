interface Props { className?: string; }

export default function OrnamentLine({ className = '' }: Props) {
  return <div className={`ornament-line my-6 ${className}`} />;
}
