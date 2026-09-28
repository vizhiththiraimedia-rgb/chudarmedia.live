import React, { useState } from 'react';
import { Tv, Save, Plus, Trash2, Check } from 'lucide-react';
import { LiveStreamConfig, ProgramScheduleItem } from '../../types';

interface LiveTvManagerProps {
  config: LiveStreamConfig;
  onSave: (config: LiveStreamConfig) => void;
}

export const LiveTvManager: React.FC<LiveTvManagerProps> = ({ config, onSave }) => {
  const [streamUrl, setStreamUrl] = useState(config.streamUrl);
  const [title, setTitle] = useState(config.title);
  const [description, setDescription] = useState(config.description);
  const [isLive, setIsLive] = useState(config.isLive);
  const [currentProgram, setCurrentProgram] = useState(config.currentProgram);
  const [presenter, setPresenter] = useState(config.presenter);
  const [schedule, setSchedule] = useState<ProgramScheduleItem[]>(config.schedule);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [newTime, setNewTime] = useState('');
  const [newProgTitle, setNewProgTitle] = useState('');
  const [newHost, setNewHost] = useState('');
  const [newCat, setNewCat] = useState('Cinema');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: LiveStreamConfig = {
      ...config,
      streamUrl: streamUrl.trim(),
      title: title.trim(),
      description: description.trim(),
      isLive,
      currentProgram: currentProgram.trim(),
      presenter: presenter.trim(),
      schedule
    };

    onSave(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddScheduleItem = () => {
    if (!newTime || !newProgTitle) return;
    setSchedule([
      ...schedule,
      {
        time: newTime.trim(),
        title: newProgTitle.trim(),
        host: newHost.trim() || 'Chudar Cinema Anchor',
        category: newCat
      }
    ]);
    setNewTime('');
    setNewProgTitle('');
    setNewHost('');
  };

  const handleRemoveScheduleItem = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Tv className="w-5 h-5 text-[#C8102E]" />
            <span>24/7 Cinema Live TV & Broadcast Controls</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Configure live video stream URL (YouTube Live / HLS .m3u8), on-air badge, and daily show schedule
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Live TV stream settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5 bg-white p-5 rounded border border-neutral-200">
        <div className="p-4 bg-neutral-50 rounded border border-neutral-200 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Broadcast Stream Source
            </h3>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
              <input
                type="checkbox"
                checked={isLive}
                onChange={(e) => setIsLive(e.target.checked)}
                className="rounded text-[#C8102E]"
              />
              <span className={isLive ? 'text-[#C8102E]' : 'text-neutral-500'}>
                {isLive ? '● STREAM IS ON AIR (LIVE)' : '○ STREAM IS OFF AIR'}
              </span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Live Stream Embed URL (YouTube Live / HLS .m3u8) *
            </label>
            <input
              type="text"
              required
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              placeholder="https://www.youtube.com/embed/live_stream?channel=..."
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded bg-white font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Current Show / Program Title
            </label>
            <input
              type="text"
              value={currentProgram}
              onChange={(e) => setCurrentProgram(e.target.value)}
              placeholder="e.g. Cinema Round-up: Friday Releases & Box Office"
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded bg-white font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Presenter / Host
            </label>
            <input
              type="text"
              value={presenter}
              onChange={(e) => setPresenter(e.target.value)}
              placeholder="e.g. Ramesh Karthik & Saroja"
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Program Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-neutral-300 rounded bg-white"
          />
        </div>

        {/* Schedule */}
        <div className="pt-4 border-t border-neutral-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 mb-3">
            Broadcast Schedule Lineup
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-3 bg-neutral-50 p-3 rounded border border-neutral-200">
            <input
              type="text"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              placeholder="Time (e.g. 19:00 - 20:30)"
              className="px-2.5 py-1.5 text-xs border border-neutral-300 rounded bg-white"
            />
            <input
              type="text"
              value={newProgTitle}
              onChange={(e) => setNewProgTitle(e.target.value)}
              placeholder="Show Title"
              className="px-2.5 py-1.5 text-xs border border-neutral-300 rounded bg-white sm:col-span-2"
            />
            <button
              type="button"
              onClick={handleAddScheduleItem}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded cursor-pointer flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Schedule</span>
            </button>
          </div>

          <div className="divide-y divide-neutral-200 border border-neutral-200 rounded">
            {schedule.map((item, idx) => (
              <div key={idx} className="p-3 flex items-center justify-between text-xs hover:bg-neutral-50">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-[#C8102E] w-28">{item.time}</span>
                  <span className="font-bold text-neutral-800">{item.title}</span>
                  <span className="text-neutral-400">({item.host})</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveScheduleItem(idx)}
                  className="text-neutral-400 hover:text-red-600 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-[#C8102E] hover:bg-[#a50d25] text-white text-xs font-bold rounded cursor-pointer flex items-center gap-2 shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>Save Live Stream Settings</span>
        </button>
      </form>
    </div>
  );
};
