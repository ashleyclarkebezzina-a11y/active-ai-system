import React, { useState } from 'react';
import OutreachManager from './components/OutreachManager';
import OutreachAutomation from './components/OutreachAutomation';
import SalesSystem from './components/SalesSystem';
import { Menu, X } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState('manager');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-black text-white transition-all duration-300 flex flex-col border-r border-gray-800`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Activ-AI" className="w-10 h-10" />
              <div>
                <h1 className="text-lg font-bold tracking-wide">ACTIV-AI</h1>
                <p className="text-xs text-gray-400">Outreach System</p>
              </div>
            </div>
          )}
          {!sidebarOpen && (
            <img src="/logo.png" alt="Activ-AI" className="w-10 h-10 mx-auto" />
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-900 rounded-lg transition ml-auto"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <button
            onClick={() => setActiveView('manager')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${
              activeView === 'manager'
                ? 'bg-white text-black font-semibold'
                : 'hover:bg-gray-900 text-gray-300'
            }`}
          >
            {sidebarOpen ? '📊 Outreach Manager' : '📊'}
          </button>
          <button
            onClick={() => setActiveView('automation')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${
              activeView === 'automation'
                ? 'bg-white text-black font-semibold'
                : 'hover:bg-gray-900 text-gray-300'
            }`}
          >
            {sidebarOpen ? '📅 Outreach Planner' : '📅'}
          </button>
          <button
            onClick={() => setActiveView('sales')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${
              activeView === 'sales'
                ? 'bg-white text-black font-semibold'
                : 'hover:bg-gray-900 text-gray-300'
            }`}
          >
            {sidebarOpen ? '💼 Sales System' : '💼'}
          </button>
        </nav>

        {sidebarOpen && (
          <div className="p-4 border-t border-gray-800">
            <p className="text-xs text-gray-500">v1.0</p>
            <p className="text-xs text-gray-500 mt-1">Your AI Automation Development Partner</p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        {activeView === 'manager' && <OutreachManager />}
        {activeView === 'automation' && <OutreachAutomation />}
        {activeView === 'sales' && <SalesSystem />}
      </div>
    </div>
  );
}
