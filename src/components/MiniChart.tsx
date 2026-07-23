import { cn } from './ConfirmModal';

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface MiniBarChartProps {
  data: BarData[];
  maxVal?: number;
  height?: number;
}

export function MiniBarChart({ data, maxVal, height = 120 }: MiniBarChartProps) {
  const calculatedMax = maxVal || Math.max(...data.map(d => d.value), 1);

  return (
    <div className="flex items-end justify-between gap-2 pt-4 px-2" style={{ height: `${height}px` }}>
      {data.map((item, idx) => {
        const percentage = Math.round((item.value / calculatedMax) * 100);
        return (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
            <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
              {item.value}
            </span>
            <div className="w-full bg-slate-900/80 rounded-t-lg border border-slate-800 relative flex items-end overflow-hidden h-full">
              <div
                className={cn(
                  "w-full rounded-t transition-all duration-500",
                  item.color || "bg-gradient-to-t from-indigo-600 to-blue-500"
                )}
                style={{ height: `${percentage}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 font-medium truncate w-full text-center">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
