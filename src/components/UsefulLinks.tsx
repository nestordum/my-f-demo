import { useState, useEffect } from 'react';
import { ExternalLink, BookOpen, FileText, Library, Globe, GraduationCap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type LinkRow = Database['public']['Tables']['useful_links']['Row'];

const CATEGORY_ICONS: Record<string, typeof BookOpen> = {
  'Бібліотека': Library,
  'Електронні ресурси': Globe,
  'Документи': FileText,
  'Навчання': GraduationCap,
  'Дослідження': BookOpen,
};

const CATEGORY_COLORS: Record<string, string> = {
  'Бібліотека': 'from-purple-500 to-purple-600',
  'Електронні ресурси': 'from-purple-600 to-amber-500',
  'Документи': 'from-amber-500 to-amber-600',
  'Навчання': 'from-purple-500 to-amber-500',
  'Дослідження': 'from-amber-500 to-purple-600',
};

export function UsefulLinks() {
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    try {
      const { data, error } = await supabase
        .from('useful_links')
        .select('*')
        .order('order_index')
        .order('title');

      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  }

  const categories = Array.from(new Set(links.map(link => link.category)));

  const filteredLinks = selectedCategory === 'all'
    ? links
    : links.filter(link => link.category === selectedCategory);

  const linksByCategory = filteredLinks.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = [];
    }
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, LinkRow[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedCategory === 'all'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-400 hover:text-purple-600'
          }`}
        >
          Всі категорії
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === category
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-400 hover:text-purple-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {Object.keys(linksByCategory).length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <ExternalLink className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Немає посилань за обраною категорією</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(linksByCategory).map(([category, categoryLinks]) => {
            const Icon = CATEGORY_ICONS[category] || ExternalLink;
            const gradientColor = CATEGORY_COLORS[category] || 'from-gray-500 to-gray-600';

            return (
              <div key={category} className="space-y-4">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${gradientColor} text-white font-semibold shadow-md`}>
                  <Icon className="w-5 h-5" />
                  <span>{category}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-white rounded-lg border-2 border-gray-200 p-5 hover:border-purple-400 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-1">
                            {link.title}
                          </h3>
                          {link.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {link.description}
                            </p>
                          )}
                        </div>
                        <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors flex-shrink-0" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
