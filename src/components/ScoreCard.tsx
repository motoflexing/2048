interface ScoreCardProps {
  label: string;
  value: number;
  isBest?: boolean;
}

export function ScoreCard({ label, value, isBest = false }: ScoreCardProps) {
  return (
    <div
      className="flex flex-col items-center min-w-[100px] px-4 py-3 rounded-xl transition-all duration-200"
      style={{
        backgroundColor: isBest ? '#EF4444' : '#191B20',
        boxShadow: isBest ? '0 4px 20px rgba(239, 68, 68, 0.3)' : '0 2px 12px rgba(0,0,0,0.3)',
      }}
    >
      <span
        className="text-xs font-medium tracking-wider uppercase"
        style={{ color: isBest ? 'rgba(255,255,255,0.8)' : '#9296A0' }}
      >
        {label}
      </span>
      <span
        className="text-2xl font-bold mt-1"
        style={{ color: isBest ? '#FFFFFF' : '#F5F5F5' }}
      >
        {value.toLocaleString()}
      </span>
    </div>
  );
}