import { useState } from 'react';
import { BookOpen, Calendar, Link as LinkIcon, Menu, X, Settings } from 'lucide-react';
import { Schedule } from './components/Schedule';
import { UsefulLinks } from './components/UsefulLinks';
import { ScheduleEditor } from './components/ScheduleEditor';

function App() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'links' | 'edit'>('schedule');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-amber-50">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-4 py-4 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-600 to-amber-500 p-2.5 rounded-xl shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  Гуманітарний факультет
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  Розклад занять та корисні ресурси
                </p>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>

            <nav className="hidden lg:flex gap-2">
              <button
                onClick={() => setActiveTab('schedule')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                  activeTab === 'schedule'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span>Розклад</span>
              </button>
              <button
                onClick={() => setActiveTab('links')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                  activeTab === 'links'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LinkIcon className="w-5 h-5" />
                <span>Корисні посилання</span>
              </button>
              <button
                onClick={() => setActiveTab('edit')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                  activeTab === 'edit'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Редагування</span>
              </button>
            </nav>
          </div>

          {mobileMenuOpen && (
            <nav className="lg:hidden border-t border-gray-200 px-4 py-3 space-y-2">
              <button
                onClick={() => {
                  setActiveTab('schedule');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'schedule'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span>Розклад</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('links');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'links'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LinkIcon className="w-5 h-5" />
                <span>Корисні посилання</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('edit');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'edit'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Редагування</span>
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 lg:px-8 lg:py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {activeTab === 'schedule' ? 'Розклад занять' : activeTab === 'links' ? 'Корисні посилання' : 'Редагування розкладу'}
          </h2>
          <p className="text-gray-600">
            {activeTab === 'schedule'
              ? 'Перегляньте розклад занять для вашої групи'
              : activeTab === 'links'
              ? 'Швидкий доступ до навчальних матеріалів та ресурсів'
              : 'Керуйте розкладом занять - додавайте, редагуйте та видаляйте заняття'}
          </p>
        </div>

        {activeTab === 'schedule' ? <Schedule /> : activeTab === 'links' ? <UsefulLinks /> : <ScheduleEditor />}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div className="text-center md:text-left text-gray-600">
              <p className="mb-1 font-semibold">
                © {new Date().getFullYear()} Гуманітарний факультет
              </p>
              <p className="text-sm">
                Всі права захищено
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('edit');
                window.scrollTo(0, 0);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-amber-500 text-white rounded-lg hover:shadow-lg transition-shadow font-medium"
            >
              <Settings className="w-4 h-4" />
              <span>Редагувати розклад</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
