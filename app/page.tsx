'use client';

import React, { useState } from 'react';
import { CheckCircle, Circle, RotateCcw, ChevronDown, ChevronRight, FileText } from 'lucide-react';

export default function AdminDashboard() {
  const [weekOf, setWeekOf] = useState(() => {
    const now = new Date();
    const sat = new Date(now);
    sat.setDate(now.getDate() - now.getDay() - 1);
    return sat.toISOString().split('T')[0];
  });

  const [processes, setProcesses] = useState({
    payfile_received: { done: false, label: 'PayFile Received from NY', category: 'intake' },
    decryption: { done: false, label: 'Decryption', category: 'intake' },
    payfile_raw: { done: false, label: 'PAYFILE_RAW', category: 'extraction' },
    payfile_extracted: { done: false, label: 'PAYFILE_EXTRACTED', category: 'extraction' },
    mismatched_premiums: { done: false, label: 'MISMATCHED_PREMIUMS', category: 'validation' },
    users_not_in_database: { done: false, label: 'USERS_NOT_IN_DATABASE', category: 'validation' },
    active_users_missing: { done: false, label: 'ACTIVE_USERS_MISSING', category: 'validation' },
    deduction_status_changes: { done: false, label: 'DEDUCTION_STATUS_CHANGES', category: 'validation' },
    premium_mismatches_all: { done: false, label: 'PREMIUM_MISMATCHES_ALL', category: 'reports' },
    master_sheet_changes: { done: false, label: 'MASTER_SHEET_CHANGES', category: 'reports' },
    premium_history_all: { done: false, label: 'PREMIUM_HISTORY_ALL', category: 'reports' },
    ms_errors: { done: false, label: 'MSErrors', category: 'reports' },
    error_files: { done: false, label: 'ERROR_FILES', category: 'reports' },
    sent_ny_files: { done: false, label: 'SENT_NY_FILES', category: 'outgoing' },
    past_pay_files: { done: false, label: 'PAST_PAY_FILES', category: 'archive' },
  });

  const [expandedCategories, setExpandedCategories] = useState({
    intake: true, extraction: true, validation: true, reports: true, outgoing: true, archive: true
  });

  const [unionStatus, setUnionStatus] = useState({
    COBA: { done: false },
    L831: { done: false },
    MISC: { done: false },
    MASTER_SHEET: { done: false }
  });

  const categories: Record<string, { label: string; color: string }> = {
    intake: { label: '1. Intake', color: 'bg-purple-500' },
    extraction: { label: '2. Extraction', color: 'bg-blue-500' },
    validation: { label: '3. Validation Scripts', color: 'bg-yellow-500' },
    reports: { label: '4. Reports', color: 'bg-green-500' },
    outgoing: { label: '5. Outgoing to NY', color: 'bg-pink-500' },
    archive: { label: '6. Archive', color: 'bg-gray-500' }
  };

  const toggleProcess = (key: string) => {
    setProcesses(prev => ({
      ...prev,
      [key]: { ...prev[key], done: !prev[key].done }
    }));
  };

  const toggleUnion = (union: string) => {
    setUnionStatus(prev => ({
      ...prev,
      [union]: { done: !prev[union].done }
    }));
  };

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const resetAll = () => {
    setProcesses(prev => {
      const reset: typeof processes = {};
      Object.keys(prev).forEach(k => reset[k] = { ...prev[k], done: false });
      return reset;
    });
    setUnionStatus(prev => {
      const reset: typeof unionStatus = {};
      Object.keys(prev).forEach(k => reset[k] = { done: false });
      return reset;
    });
  };

  const completedCount = Object.values(processes).filter(p => p.done).length;
  const totalCount = Object.keys(processes).length;
  const progress = (completedCount / totalCount) * 100;

  const getProcessesByCategory = (cat: string) => {
    return Object.entries(processes).filter(([_, p]) => p.category === cat);
  };

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
            <span className="text-slate-400">Weekly Progress</span>
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
            {Object.entries(unionStatus).map(([union, status]) => (
              <button
                key={union}
                onClick={() => toggleUnion(union)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  status.done
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
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
          {Object.entries(categories).map(([catKey, catInfo]) => {
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
                      <button
                        key={key}
                        onClick={() => toggleProcess(key)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          process.done
                            ? 'bg-green-500/10 border-green-500/50 text-green-400'
                            : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {process.done ? (
                          <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                        ) : (
                          <Circle size={20} className="text-slate-500 flex-shrink-0" />
                        )}
                        <span className="text-left font-mono text-sm">{process.label}</span>
                      </button>
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
            <p className="text-green-400 font-medium">All processes complete for this week! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}
