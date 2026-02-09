import { useState } from 'react';
import { BookOpen, Calendar, Link as LinkIcon, Menu, X } from 'lucide-react';
import { Schedule } from './components/Schedule';
import { UsefulLinks } from './components/UsefulLinks';

function App() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'links'>('schedule');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-4 py-4 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-2.5 rounded-xl shadow-lg">
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
                    ? 'bg-blue-600 text-white shadow-md'
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
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LinkIcon className="w-5 h-5" />
                <span>Корисні посилання</span>
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
                    ? 'bg-blue-600 text-white shadow-md'
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
            </nav>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 lg:px-8 lg:py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {activeTab === 'schedule' ? 'Розклад занять' : 'Корисні посилання'}
          </h2>
          <p className="text-gray-600">
            {activeTab === 'schedule'
              ? 'Перегляньте розклад занять для вашої групи'
              : 'Швидкий доступ до навчальних матеріалів та ресурсів'}
          </p>
        </div>

        {activeTab === 'schedule' ? <Schedule /> : <UsefulLinks />}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              © {new Date().getFullYear()} Гуманітарний факультет
            </p>
            <p className="text-sm">
              Всі права захищено
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
