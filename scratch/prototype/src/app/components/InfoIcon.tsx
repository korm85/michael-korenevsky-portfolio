import { Tooltip } from './Tooltip';

interface InfoIconProps {
  tooltip: string;
  size?: number;
}

export function InfoIcon({ tooltip, size = 12 }: InfoIconProps) {
  return (
    <Tooltip content={tooltip}>
      <span className="inline-flex items-center justify-center cursor-help leading-[0]">
        <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="7" cy="7" r="6" stroke="#59747a" strokeWidth="1.2" />
          <text x="7" y="10.5" textAnchor="middle" fill="#59747a" fontSize="9" fontFamily="'Centra No2:Medium', sans-serif">i</text>
        </svg>
      </span>
    </Tooltip>
  );
}