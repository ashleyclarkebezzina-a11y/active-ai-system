import React, { useState } from 'react';
import OutreachManager from './components/OutreachManager';
import OutreachAutomation from './components/OutreachAutomation';
import SalesSystem from './components/SalesSystem';
import { Menu, X } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState('manager');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Active AI</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <button
            onClick={() => setActiveView('manager')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${
              activeView === 'manager'
                ? 'bg-blue-600 font-semibold'
                : 'hover:bg-gray-800'
            }`}
          >
            {sidebarOpen ? '📊 Outreach Manager' : '📊'}
          </button>
          <button
            onClick={() => setActiveView('automation')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${
              activeView === 'automation'
                ? 'bg-blue-600 font-semibold'
                : 'hover:bg-gray-800'
            }`}
          >
            {sidebarOpen ? '⚙️ Automation' : '⚙️'}
          </button>
          <button
            onClick={() => setActiveView('sales')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${
              activeView === 'sales'
                ? 'bg-blue-600 font-semibold'
                : 'hover:bg-gray-800'
            }`}
          >
            {sidebarOpen ? '💼 Sales System' : '💼'}
          </button>
        </nav>

        {sidebarOpen && (
          <div className="p-4 border-t border-gray-800">
            <p className="text-xs text-gray-400">Active AI v1.0</p>
            <p className="text-xs text-gray-400 mt-2">Ready to scale your outreach</p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {activeView === 'manager' && <OutreachManager />}
        {activeView === 'automation' && <OutreachAutomation />}
        {activeView === 'sales' && <SalesSystem />}
      </div>
    </div>
  );
}
