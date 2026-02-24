import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type ScheduleRow = Database['public']['Tables']['schedule']['Row'];
type ScheduleInsert = Database['public']['Tables']['schedule']['Insert'];

const DAYS = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'];
const LESSON_TYPES = ['Лекція', 'Семінар', 'Практика'];

const emptyForm: ScheduleInsert = {
  day_of_week: 'Понеділок',
  time_slot: '09:00-10:30',
  subject: '',
  teacher: '',
  room: '',
  group_name: '',
  lesson_type: 'Лекція',
};

export function ScheduleEditor() {
  const [scheduleData, setScheduleData] = useState<ScheduleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ScheduleInsert>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
      setError('Помилка при завантаженні розкладу');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.subject || !formData.teacher || !formData.room || !formData.group_name) {
      setError('Заповніть усі поля');
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('schedule')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        setSuccess('Заняття відредаговано');
      } else {
        const { error } = await supabase
          .from('schedule')
          .insert([formData]);

        if (error) throw error;
        setSuccess('Заняття додано');
      }

      setFormData(emptyForm);
      setEditingId(null);
      setIsFormOpen(false);
      fetchSchedule();
    } catch (error) {
      console.error('Error:', error);
      setError('Помилка при збереженні');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Ви впевнені?')) return;

    try {
      const { error } = await supabase
        .from('schedule')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccess('Заняття видалено');
      fetchSchedule();
    } catch (error) {
      console.error('Error:', error);
      setError('Помилка при видаленні');
    }
  }

  function handleEdit(item: ScheduleRow) {
    setFormData({
      day_of_week: item.day_of_week,
      time_slot: item.time_slot,
      subject: item.subject,
      teacher: item.teacher,
      room: item.room,
      group_name: item.group_name,
      lesson_type: item.lesson_type,
    });
    setEditingId(item.id);
    setIsFormOpen(true);
  }

  function handleCancel() {
    setFormData(emptyForm);
    setEditingId(null);
    setIsFormOpen(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-green-700">
          {success}
        </div>
      )}

      {!isFormOpen ? (
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Додати заняття
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border-2 border-purple-200 p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Редагування заняття' : 'Додавання нового заняття'}
            </h3>
            <button
              type="button"
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">День тижня</label>
              <select
                value={formData.day_of_week}
                onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {DAYS.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Час</label>
              <input
                type="text"
                placeholder="09:00-10:30"
                value={formData.time_slot}
                onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Предмет</label>
              <input
                type="text"
                placeholder="Назва предмету"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Викладач</label>
              <input
                type="text"
                placeholder="ПІБ викладача"
                value={formData.teacher}
                onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Аудиторія</label>
              <input
                type="text"
                placeholder="Номер аудиторії"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Група</label>
              <input
                type="text"
                placeholder="Назва групи"
                value={formData.group_name}
                onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Тип заняття</label>
              <select
                value={formData.lesson_type}
                onChange={(e) => setFormData({ ...formData, lesson_type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {LESSON_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              {editingId ? 'Зберегти зміни' : 'Додати'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Скасувати
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {scheduleData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Немає занять. Додайте перше заняття.</p>
          </div>
        ) : (
          scheduleData.map((item) => (
            <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{item.subject}</h4>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">{item.lesson_type}</span>
                    <span className="text-xs bg-blue-100 px-2 py-1 rounded text-blue-700">{item.group_name}</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">День:</span> {item.day_of_week}, {item.time_slot}</p>
                    <p><span className="font-medium">Викладач:</span> {item.teacher}</p>
                    <p><span className="font-medium">Аудиторія:</span> {item.room}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Редагувати</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Видалити</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
