'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, RotateCcw, ChevronDown, ChevronRight, FileText, Play, Clock, Zap } from 'lucide-react';

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  
  const [weekOf, setWeekOf] = useState(() => {
    const now = new Date();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - now.getDay()); // Get last Sunday
    return sunday.toISOString().split('T')[0];
  });

  const getWeekRange = () => {
    const sunday = new Date(weekOf);
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };
    
    return `${formatDate(sunday)} - ${formatDate(saturday)}`;
  };

  const getLastSunday5AM = () => {
    const now = new Date();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - now.getDay()); // Get last Sunday
    sunday.setHours(5, 0, 0, 0); // Set to 5:00 AM
    return sunday;
  };

  const formatLastRun = (minutesOffset: number) => {
    const baseTime = getLastSunday5AM();
    baseTime.setMinutes(baseTime.getMinutes() + minutesOffset);
    return baseTime.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const [processes, setProcesses] = useState({
    payfile_received: { 
      done: false, 
      label: 'PayFile Received from NY', 
      category: 'intake' as const,
      schedule: 'Saturday 12:00 PM EST',
      avgDuration: '~5 min',
      lastRun: formatLastRun(-1020),
      status: 'automated' as 'pending' | 'running' | 'success' | 'failed' | 'automated' | 'manual'
    },
    decryption: { 
      done: false, 
      label: 'Decryption', 
      category: 'intake' as const,
      schedule: 'Sunday 5:00 AM EST',
      avgDuration: '~2 min',
      lastRun: formatLastRun(0),
      status: 'automated' as 'pending' | 'running' | 'success' | 'failed' | 'automated' | 'manual'
    },
    payfile_raw: { 
      done: false, 
      label: 'PAYFILE_RAW', 
      category: 'extraction' as const,
      schedule: 'Sunday 5:02 AM EST',
      avgDuration: '~3 min',
      lastRun: formatLastRun(2),
      status: 'automated' as 'pending' | 'running' | 'success' | 'failed' | 'automated' | 'manual'
    },
    payfile_extracted: { 
      done: false, 
      label: 'PAYFILE_EXTRACTED', 
      category: 'extraction' as const,
      schedule: 'Sunday 5:05 AM EST',
      avgDuration: '~4 min',
      lastRun: formatLastRun(5),
      status: 'automated' as 'pending' | 'running' | 'success' | 'failed' | 'automated' | 'manual'
    },
    mismatched_premiums: { 
      done: false, 
      label: 'MISMATCHED_PREMIUMS', 
      category: 'validation' as const,
      schedule: 'Sunday 5:10 AM EST',
      avgDuration: '~2 min',
      lastRun: formatLastRun(10),
      status: 'automated' as 'pending' | 'running' | 'success' | 'failed' | 'automated' | 'manual'
    },
    users_not_in_database: { 
      done: false, 
      label: 'USERS_NOT_IN_DATABASE', 
      category: 'validation' as const,
      schedule: 'Sunday 5:12 AM EST',
      avgDuration: '~3 min',
      lastRun: formatLastRun(12),
      status: 'automated' as 'pending' | 'running' | 'success' | 'failed' | 'automated' | 'manual'
    },
    active_users_missing: { 
      done: false, 
      label: 'ACTIVE_USERS_MISSING', 
      category: 'validation' as const,
      schedule: 'Sunday 5:15 AM EST',
      avgDuration: '~2 min',
      lastRun: formatLastRun(15),
      status: 'automated' as 'pending' | 'running' | 'success' | 'failed' | 'automated' | 'manual'
    },
    deduction_status_changes: { 
      done: false, 
      label: 'DEDUCTION_STATUS_CHANGES', 
      category: 'validation' as const,
      schedule: 'Sunday 5:17 AM EST',
      avgDuration: '~2 min',
      lastRun: formatLastRun(17),
      status: 'automated' as 'pending' | 'running' | 'success' | 'failed' | 'automated' | 'manual'
    },
    sent_ny_files: { 
      done: false, 
      label: 'SENT_NY_FILES', 
      category: 'outgoing' as const,
      schedule: 'Thursday 4:05 PM EST',
      avgDuration: '~1 min',
      lastRun: null as string | null,
      status: 'automated' as 'pending' | 'running' | 'success' | 'failed' | 'automated' | 'manual'
    },
    premium_mismatches_all: { 
      done: false, 
      label: 'PREMIUM_MISMATCHES_ALL', 
      category: 'standalone' as const,
      schedule: 'On Demand',
      avgDuration: '~3 min',
      lastRun: null as string | null,
      status: 'manual' as 'pending' | 'running' | 'success' | 'failed' | 'automated' | 'manual'
    },
    master_sheet_changes: { 
      done: false, 
      label: 'MASTER_SHEET_CHANGES', 
      category: 'standalone' as const,
      schedule: 'On Demand',
      avgDuration: '~2 min',
      lastRun: null as string | null,
      status: 'manual' as 'pending' | 'running' | 'success' | 'failed' | 'automated' | 'manual'
    },
    premium_history_all: { 
      done: false, 
      label: 'PREMIUM_HISTORY_ALL', 
      category: 'standalone' as const,
      schedule: 'On Demand',
      avgDuration: '~5 min',
      lastRun: null as string | null,
      status: 'manual' as 'pending' | 'running' | 'success' | 'failed' | 'automated' | 'manual'
    },
    ms_errors: { 
      done: false, 
      label: 'MSErrors', 
      category: 'standalone' as const,
      schedule: 'On Demand',
      avgDuration: '~1 min',
      lastRun: null as string | null,
      status: 'manual' as 'pending' | 'running' | 'success' | 'failed' | 'automated' | 'manual'
    },
    error_files: { 
      done: false, 
      label: 'ERROR_FILES', 
      category: 'standalone' as const,
      schedule: 'On Demand',
      avgDuration: '~2 min',
      lastRun: null as string | null,
      status: 'manual' as 'pending' | 'running' | 'success' | 'failed' | 'automated' | 'manual'
    },
    past_pay_files: { 
      done: false, 
      label: 'PAST_PAY_FILES', 
      category: 'standalone' as const,
      schedule: 'On Demand',
      avgDuration: '~3 min',
      lastRun: null as string | null,
      status: 'manual' as 'pending' | 'running' | 'success' | 'failed' | 'automated' | 'manual'
    },
  });

  const [expandedCategories, setExpandedCategories] = useState({
    intake: true, extraction: true, validation: true, outgoing: true, standalone: true
  });

  const [unionStatus, setUnionStatus] = useState({
    COBA: { done: false },
    L831: { done: false },
    MISC: { done: false },
    MASTER_SHEET: { done: false }
  });

  // Load from localStorage after mount
  useEffect(() => {
    setMounted(true);
    const savedProcesses = localStorage.getItem('processes');
    const savedUnions = localStorage.getItem('unionStatus');
    
    if (savedProcesses) {
      const parsed = JSON.parse(savedProcesses);
      // Recalculate timestamps with current dates
      const updated = {
        ...parsed,
        payfile_received: { ...parsed.payfile_received, lastRun: formatLastRun(-1020) },
        decryption: { ...parsed.decryption, lastRun: formatLastRun(0) },
        payfile_raw: { ...parsed.payfile_raw, lastRun: formatLastRun(2) },
        payfile_extracted: { ...parsed.payfile_extracted, lastRun: formatLastRun(5) },
        mismatched_premiums: { ...parsed.mismatched_premiums, lastRun: formatLastRun(10) },
        users_not_in_database: { ...parsed.users_not_in_database, lastRun: formatLastRun(12) },
        active_users_missing: { ...parsed.active_users_missing, lastRun: formatLastRun(15) },
        deduction_status_changes: { ...parsed.deduction_status_changes, lastRun: formatLastRun(17) }
      };
      setProcesses(updated);
    }
    if (savedUnions) {
      setUnionStatus(JSON.parse(savedUnions));
    }
  }, []);

  const categories: Record<string, { label: string; color: string }> = {
    intake: { label: '1. Intake', color: 'bg-purple-500' },
    extraction: { label: '2. Extraction', color: 'bg-blue-500' },
    validation: { label: '3. Validation Scripts', color: 'bg-yellow-500' },
    outgoing: { label: '4. Outgoing to NY', color: 'bg-pink-500' },
    standalone: { label: 'Standalone Processes', color: 'bg-gray-500' }
  };

  type ProcessKey = keyof typeof processes;
  type UnionKey = keyof typeof unionStatus;
  type CategoryKey = keyof typeof expandedCategories;

  const toggleProcess = (key: ProcessKey) => {
    setProcesses((prev: typeof processes) => {
      // Only allow toggling if not already done
      if (prev[key].done) return prev;
      return {
        ...prev,
        [key]: { ...prev[key], done: true }
      };
    });
  };

  const toggleUnion = (union: UnionKey) => {
    setUnionStatus((prev: typeof unionStatus) => {
      // Only allow toggling if not already done
      if (prev[union].done) return prev;
      return {
        ...prev,
        [union]: { done: true }
      };
    });
  };

  const toggleCategory = (cat: CategoryKey) => {
    setExpandedCategories((prev: typeof expandedCategories) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const resetAll = () => {
    setProcesses((prev: typeof processes) => {
      const reset: any = {};
      (Object.keys(prev) as ProcessKey[]).forEach(k => reset[k] = { ...prev[k], done: false });
      return reset;
    });
    setUnionStatus((prev: typeof unionStatus) => {
      const reset: any = {};
      (Object.keys(prev) as UnionKey[]).forEach(k => reset[k] = { done: false });
      return reset;
    });
  };

  const completedCount = Object.values(processes).filter(p => p.done && p.category !== 'standalone').length;
  const totalCount = Object.values(processes).filter(p => p.category !== 'standalone').length;
  const progress = (completedCount / totalCount) * 100;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'running': return 'text-blue-400';
      case 'success': return 'text-green-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'running': return 'bg-blue-500/20 border-blue-500 text-blue-400';
      case 'success': return 'bg-green-500/20 border-green-500 text-green-400';
      case 'failed': return 'bg-red-500/20 border-red-500 text-red-400';
      case 'automated': return 'bg-purple-500/20 border-purple-500 text-purple-400';
      case 'manual': return 'bg-gray-500/20 border-gray-500 text-gray-400';
      default: return 'bg-gray-500/20 border-gray-500 text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'automated': return 'AUTO';
      case 'manual': return 'MANUAL';
      default: return status.toUpperCase();
    }
  };

  const getProcessesByCategory = (cat: CategoryKey) => {
    return Object.entries(processes).filter(([_, p]) => p.category === cat);
  };

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('processes', JSON.stringify(processes));
  }, [processes]);

  useEffect(() => {
    localStorage.setItem('unionStatus', JSON.stringify(unionStatus));
  }, [unionStatus]);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="text-pink-500" size={32} />
            <h1 className="text-3xl font-bold">Weekly Process Tracker</h1>
          </div>
          <p className="text-slate-400">Tri-State Benefits - PayFile Processing</p>
          <p className="text-slate-500 text-sm mt-1">Week: {getWeekRange()}</p>
        </div>

        {/* Week Selector & Reset */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <label className="text-slate-400 text-sm">Week of:</label>
            <input
              type="date"
              value={weekOf}
              onChange={(e) => setWeekOf(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <button
            onClick={resetAll}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
          >
            <RotateCcw size={16} />
            Reset Week
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-800 rounded-xl p-4 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Weekly Process Progress</span>
            <span className="text-white font-medium">{completedCount} / {totalCount}</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-pink-500 to-green-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Union Status */}
        <div className="bg-slate-800 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-medium text-slate-400 mb-3">Union Processing Status</h3>
          <div className="flex flex-wrap gap-3">
            {(Object.entries(unionStatus) as [UnionKey, { done: boolean }][]).map(([union, status]) => (
              <button
                key={union}
                onClick={() => toggleUnion(union)}
                disabled={status.done}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  status.done 
                    ? 'bg-green-500/20 border-green-500 text-green-400 cursor-default' 
                    : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500 cursor-pointer'
                }`}
              >
                {status.done ? <CheckCircle size={16} /> : <Circle size={16} />}
                {union}
              </button>
            ))}
          </div>
        </div>

        {/* Process Categories */}
        <div className="space-y-4">
          {(Object.entries(categories) as [CategoryKey, { label: string; color: string }][]).map(([catKey, catInfo]) => {
            const catProcesses = getProcessesByCategory(catKey);
            const catCompleted = catProcesses.filter(([_, p]) => p.done).length;
            const isExpanded = expandedCategories[catKey];

            return (
              <div key={catKey} className="bg-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleCategory(catKey)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-750 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${catInfo.color}`} />
                    <span className="font-medium">{catInfo.label}</span>
                    <span className="text-slate-500 text-sm">
                      ({catCompleted}/{catProcesses.length})
                    </span>
                  </div>
                  {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-2">
                    {catProcesses.map(([key, process]) => (
                      <div
                        key={key}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                          process.done
                            ? 'bg-green-500/10 border-green-500/50'
                            : 'bg-slate-700/50 border-slate-600'
                        }`}
                      >
                        <button
                          onClick={() => toggleProcess(key as ProcessKey)}
                          className={`flex items-center gap-3 flex-1 ${process.done ? 'cursor-default' : process.category === 'standalone' ? 'cursor-default' : 'cursor-pointer'}`}
                          disabled={process.done || process.category === 'standalone'}
                        >
                          {process.done ? (
                            <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                          ) : (
                            <Circle size={20} className="text-slate-500 flex-shrink-0" />
                          )}
                          <div className="text-left">
                            <div className="font-mono text-sm text-slate-300">{process.label}</div>
                            <div className="flex items-center gap-3 mt-1 text-xs">
                              <span className="flex items-center gap-1 text-slate-500">
                                <Clock size={12} />
                                {process.schedule}
                              </span>
                              <span className="flex items-center gap-1 text-slate-500">
                                <Zap size={12} />
                                {process.avgDuration}
                              </span>
                              {process.lastRun && (
                                <span className="text-slate-300 font-medium">
                                  Last: {process.lastRun}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                        
                        <div className="flex items-center gap-2">
                          {process.category !== 'standalone' && (
                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusBadge(process.status)}`}>
                              {getStatusLabel(process.status)}
                            </span>
                          )}
                          {process.category === 'standalone' && (
                            <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-500/20 border border-green-500 text-green-400">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                              </span>
                              ACTIVE
                            </span>
                          )}
                          {process.status === 'manual' && process.category !== 'standalone' && (
                            <button
                              className="p-2 hover:bg-slate-600 rounded-lg transition-colors text-slate-400 hover:text-white"
                              title="Run Now"
                            >
                              <Play size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Completion Message */}
        {progress === 100 && (
          <div className="mt-6 bg-green-500/20 border border-green-500 rounded-xl p-4 text-center">
            <CheckCircle className="inline-block mb-2 text-green-500" size={32} />
            <p className="text-green-400 font-medium">All weekly processes complete! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}