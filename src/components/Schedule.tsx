import { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type ScheduleRow = Database['public']['Tables']['schedule']['Row'];

const DAYS_ORDER = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'];

export function Schedule() {
  const [scheduleData, setScheduleData] = useState<ScheduleRow[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedule();
  }, []);

  async function fetchSchedule() {
    try {
      const { data, error } = await supabase
        .from('schedule')
        .select('*')
        .order('time_slot');

      if (error) throw error;
      setScheduleData(data || []);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  }

  const groups = Array.from(new Set(scheduleData.map(item => item.group_name))).sort();

  const filteredSchedule = scheduleData.filter(item => {
    const dayMatch = selectedDay === 'all' || item.day_of_week === selectedDay;
    const groupMatch = selectedGroup === 'all' || item.group_name === selectedGroup;
    return dayMatch && groupMatch;
  });

  const scheduleByDay = DAYS_ORDER.reduce((acc, day) => {
    const daySchedule = filteredSchedule.filter(item => item.day_of_week === day);
    if (daySchedule.length > 0) {
      acc[day] = daySchedule;
    }
    return acc;
  }, {} as Record<string, ScheduleRow[]>);

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case 'Лекція': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Семінар': return 'bg-green-100 text-green-800 border-green-300';
      case 'Практика': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">День тижня</label>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Всі дні</option>
            {DAYS_ORDER.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Група</label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Всі групи</option>
            {groups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>
      </div>

      {Object.keys(scheduleByDay).length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Немає занять за обраними критеріями</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(scheduleByDay).map(([day, lessons]) => (
            <div key={day} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {day}
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {lessons.map((lesson) => (
                  <div key={lesson.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex items-center gap-2 text-gray-600 lg:w-32 flex-shrink-0">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{lesson.time_slot}</span>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-lg font-semibold text-gray-900">{lesson.subject}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLessonTypeColor(lesson.lesson_type)}`}>
                            {lesson.lesson_type}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
                            {lesson.group_name}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{lesson.teacher}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>Аудиторія {lesson.room}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
