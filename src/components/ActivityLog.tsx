import { Activity, Clock, User } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

export function ActivityLog() {
  const { activityLog } = useWorkspace();

  if (activityLog.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-slate-500">
        <Activity className="w-8 h-8 mb-2 opacity-40" />
        <p className="text-xs">Belum ada aktivitas tercatat.</p>
      </div>
    );
  }

  return (
    <div className="space-y-0 relative font-sans">
      {activityLog.slice(0, 15).map((activity, index) => {
        const time = new Date(activity.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const isLast = index === Math.min(activityLog.length, 15) - 1;
        
        return (
          <div key={activity.id} className="flex gap-3 text-xs relative group">
            <div className="relative z-10 flex flex-col items-center mt-1">
              <div className="w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-slate-900 shadow-sm shadow-indigo-500/50" />
              {!isLast && <div className="w-0.5 h-full bg-slate-800/80 mt-1" />}
            </div>
            <div className="flex-1 pb-4">
              <p className="text-slate-200 font-medium leading-snug">{activity.detail}</p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {time}
                </span>
                {activity.user_name && (
                  <span className="flex items-center gap-1 text-indigo-400 font-semibold bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                    <User className="w-2.5 h-2.5" />
                    {activity.user_name}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
