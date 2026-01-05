
import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Bot, 
  Search, 
  Filter, 
  Mail, 
  Linkedin, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  TrendingUp,
  Globe,
  Plus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { ALUMNI_DATA } from './mockData';
import { Alumnus, View } from './types';
import { getAlumniAdvice, parseAlumniSearch } from './geminiService';

// --- Helper Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any; 
  label: string; 
  active: boolean; 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      active 
        ? 'bg-indigo-600 text-white shadow-md' 
        : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ icon: Icon, label, value, subtext, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{subtext}</p>
    </div>
  </div>
);

// Explicitly typing as React.FC to resolve TypeScript error when passing 'key' in loops
const AlumniCard: React.FC<{ alum: Alumnus }> = ({ alum }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
    <div className="flex items-center gap-4 mb-4">
      <img 
        src={alum.imageUrl} 
        alt={alum.name} 
        className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-50" 
      />
      <div>
        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{alum.name}</h3>
        <p className="text-sm text-slate-500 flex items-center gap-1">
          <GraduationCap size={14} /> Class of {alum.gradYear}
        </p>
      </div>
    </div>
    
    <div className="space-y-2 mb-4">
      <p className="text-sm text-slate-600 flex items-center gap-2">
        <Briefcase size={14} className="text-indigo-500" />
        {alum.role} at {alum.company}
      </p>
      <p className="text-sm text-slate-600 flex items-center gap-2">
        <MapPin size={14} className="text-indigo-500" />
        {alum.location}
      </p>
    </div>

    <div className="flex flex-wrap gap-2 mb-4">
      {alum.skills.slice(0, 3).map(skill => (
        <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded uppercase">
          {skill}
        </span>
      ))}
    </div>

    <div className="pt-4 border-t border-slate-100 flex gap-3">
      <a href={`mailto:${alum.email}`} className="text-slate-400 hover:text-indigo-600 transition-colors">
        <Mail size={18} />
      </a>
      <a href={alum.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors">
        <Linkedin size={18} />
      </a>
    </div>
  </div>
);

// --- Main Views ---

const DashboardView = ({ alumni }: { alumni: Alumnus[] }) => {
  const stats = useMemo(() => {
    const years = alumni.reduce((acc: any, a) => {
      acc[a.gradYear] = (acc[a.gradYear] || 0) + 1;
      return acc;
    }, {});
    
    const gradData = Object.entries(years).map(([year, count]) => ({
      year: parseInt(year),
      count: count as number
    })).sort((a, b) => a.year - b.year);

    const industries = alumni.reduce((acc: any, a) => {
      acc[a.industry] = (acc[a.industry] || 0) + 1;
      return acc;
    }, {});

    const industryData = Object.entries(industries).map(([name, value]) => ({
      name,
      value: value as number
    }));

    return { gradData, industryData };
  }, [alumni]);

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Alumni" value={alumni.length} subtext="+12% from last year" color="bg-indigo-600" />
        <StatCard icon={TrendingUp} label="Employment Rate" value="96.4%" subtext="In relevant fields" color="bg-emerald-500" />
        <StatCard icon={Globe} label="Top Region" value="North America" subtext="62% of alumni base" color="bg-amber-500" />
        <StatCard icon={GraduationCap} label="Recent Grads" value="24" subtext="Class of 2023" color="bg-violet-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Graduation Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.gradData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Industry Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.industryData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.industryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 justify-center">
            {stats.industryData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                <span className="text-xs text-slate-600 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DirectoryView = ({ alumni }: { alumni: Alumnus[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredAlumni = useMemo(() => {
    return alumni.filter(a => {
      const matchesSearch = 
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'All' || a.industry === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [alumni, searchTerm, activeFilter]);

  const industries = ['All', ...Array.from(new Set(alumni.map(a => a.industry)))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search name, company, or role..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {industries.map(ind => (
            <button
              key={ind}
              onClick={() => setActiveFilter(ind)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === ind 
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlumni.map(alum => (
          <AlumniCard key={alum.id} alum={alum} />
        ))}
        {filteredAlumni.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No alumni found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

const AIAssistantView = ({ alumni }: { alumni: Alumnus[] }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);

  const handleSend = async () => {
    if (!query.trim()) return;
    
    const userMessage = query;
    setQuery('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const response = await getAlumniAdvice(userMessage, alumni);
    
    setChatHistory(prev => [...prev, { role: 'assistant', text: response || "Something went wrong." }]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      <div className="bg-indigo-600 p-4 text-white flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-lg">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="font-bold">AlumniConnect AI</h2>
          <p className="text-xs text-indigo-100">Intelligent networking & career matching</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {chatHistory.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Bot size={48} className="mx-auto mb-4 opacity-20" />
            <p className="max-w-sm mx-auto">Ask me anything about our alumni network. I can suggest mentors, find people in specific industries, or help with outreach.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button 
                onClick={() => setQuery("Who graduated in 2018?")}
                className="px-3 py-1.5 bg-slate-100 rounded-full text-xs text-slate-600 hover:bg-slate-200"
              >
                "Who graduated in 2018?"
              </button>
              <button 
                onClick={() => setQuery("Find me a mentor in Tech.")}
                className="px-3 py-1.5 bg-slate-100 rounded-full text-xs text-slate-600 hover:bg-slate-200"
              >
                "Find me a mentor in Tech."
              </button>
            </div>
          </div>
        )}
        {chatHistory.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-800 rounded-tl-none'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Ask AI about alumni..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !query.trim()}
            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Search size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [alumni] = useState<Alumnus[]>(ALUMNI_DATA);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold text-slate-900">AlumniConnect</span>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeView === 'dashboard'} 
            onClick={() => setActiveView('dashboard')} 
          />
          <SidebarItem 
            icon={Users} 
            label="Directory" 
            active={activeView === 'directory'} 
            onClick={() => setActiveView('directory')} 
          />
          <SidebarItem 
            icon={Bot} 
            label="AI Assistant" 
            active={activeView === 'ai-assistant'} 
            onClick={() => setActiveView('ai-assistant')} 
          />
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors px-2 py-2">
            <Plus size={18} />
            <span className="text-sm font-medium">Add Alumnus</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <h1 className="text-lg font-bold text-slate-900 capitalize">
            {activeView.replace('-', ' ')}
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">Admin User</p>
              <p className="text-xs text-slate-500">Super Administrator</p>
            </div>
            <img 
              src="https://picsum.photos/seed/admin/100/100" 
              alt="Admin" 
              className="w-10 h-10 rounded-full border border-slate-200"
            />
          </div>
        </header>

        {/* View Content */}
        <div className="p-6 md:p-8 flex-1 overflow-auto">
          {activeView === 'dashboard' && <DashboardView alumni={alumni} />}
          {activeView === 'directory' && <DirectoryView alumni={alumni} />}
          {activeView === 'ai-assistant' && <AIAssistantView alumni={alumni} />}
        </div>

        {/* Mobile Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-20">
          <button 
            onClick={() => setActiveView('dashboard')}
            className={`flex flex-col items-center p-2 rounded-lg ${activeView === 'dashboard' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500'}`}
          >
            <LayoutDashboard size={20} />
            <span className="text-[10px] font-bold mt-1">Home</span>
          </button>
          <button 
            onClick={() => setActiveView('directory')}
            className={`flex flex-col items-center p-2 rounded-lg ${activeView === 'directory' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500'}`}
          >
            <Users size={20} />
            <span className="text-[10px] font-bold mt-1">People</span>
          </button>
          <button 
            onClick={() => setActiveView('ai-assistant')}
            className={`flex flex-col items-center p-2 rounded-lg ${activeView === 'ai-assistant' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500'}`}
          >
            <Bot size={20} />
            <span className="text-[10px] font-bold mt-1">Assistant</span>
          </button>
        </nav>
      </main>
    </div>
  );
}
