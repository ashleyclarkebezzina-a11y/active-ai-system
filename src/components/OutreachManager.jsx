import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

export default function OutreachManager() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [outreachStatus, setOutreachStatus] = useState({});
  const [messageTemplate, setMessageTemplate] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    messaged: 0,
    responded: 0,
    responseRate: 0
  });

  // Initialize with sample data
  useEffect(() => {
    const sampleLeads = [
      { id: 1, name: 'Kevin McKelvin', title: 'CEO', company: 'Tech Solutions Ltd', email: 'kevin@example.com', employees: 150, focus: 'Customer Service Automation' },
      { id: 2, name: 'Stuart Haslam', title: 'CTO', company: 'Digital Services Group', email: 'stuart@example.com', employees: 200, focus: 'CRM Automation' },
      { id: 3, name: 'Shelton Julius', title: 'Managing Director', company: 'IT Consulting Pro', email: 'shelton@example.com', employees: 95, focus: 'Sales Pipeline' },
      { id: 4, name: 'Sean Foley', title: 'Operations Manager', company: 'Enterprise Solutions', email: 'sean@example.com', employees: 250, focus: 'Client Onboarding' },
      { id: 5, name: 'Jonathan Abbott', title: 'Director', company: 'Business Systems Inc', email: 'jonathan@example.com', employees: 180, focus: 'Customer Service' },
    ];
    setLeads(sampleLeads);
    setFilteredLeads(sampleLeads);
    
    // Initialize status
    const initialStatus = {};
    sampleLeads.forEach(lead => {
      initialStatus[lead.id] = { messaged: false, responded: false, notes: '' };
    });
    setOutreachStatus(initialStatus);

    setMessageTemplate(`Hi [FIRST_NAME],

I noticed [COMPANY_NAME] is in the IT services space. We help firms like yours cut operational costs by automating [FOCUS_AREA] with AI agents—typically freeing up 10+ hours per team member weekly.

Worth a quick conversation to explore?

Best,
Active AI`);
  }, []);

  // Update stats
  useEffect(() => {
    const messaged = Object.values(outreachStatus).filter(s => s.messaged).length;
    const responded = Object.values(outreachStatus).filter(s => s.responded).length;
    setStats({
      total: leads.length,
      messaged,
      responded,
      responseRate: messaged > 0 ? ((responded / messaged) * 100).toFixed(1) : 0
    });
  }, [outreachStatus, leads]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = leads.filter(lead => 
      lead.name.toLowerCase().includes(term) ||
      lead.company.toLowerCase().includes(term) ||
      lead.title.toLowerCase().includes(term)
    );
    setFilteredLeads(filtered);
  };

  const generateMessage = (lead) => {
    return messageTemplate
      .replace('[FIRST_NAME]', lead.name.split(' ')[0])
      .replace('[COMPANY_NAME]', lead.company)
      .replace('[FOCUS_AREA]', lead.focus);
  };

  const toggleMessaged = (leadId) => {
    setOutreachStatus(prev => ({
      ...prev,
      [leadId]: { ...prev[leadId], messaged: !prev[leadId].messaged }
    }));
  };

  const toggleResponded = (leadId) => {
    setOutreachStatus(prev => ({
      ...prev,
      [leadId]: { ...prev[leadId], responded: !prev[leadId].responded }
    }));
  };

  const updateNotes = (leadId, notes) => {
    setOutreachStatus(prev => ({
      ...prev,
      [leadId]: { ...prev[leadId], notes }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Active AI Outreach Hub</h1>
          <p className="text-gray-600">LinkedIn outreach management for your IT services prospects</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Leads</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <TrendingUp className="text-blue-500" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Messaged</p>
                <p className="text-3xl font-bold text-blue-600">{stats.messaged}</p>
              </div>
              <MessageSquare className="text-blue-500" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Responses</p>
                <p className="text-3xl font-bold text-green-600">{stats.responded}</p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Response Rate</p>
                <p className="text-3xl font-bold text-indigo-600">{stats.responseRate}%</p>
              </div>
              <TrendingUp className="text-indigo-500" size={32} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leads List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Prospects ({filteredLeads.length})</h2>
              
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or company..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredLeads.map(lead => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`p-3 rounded-lg cursor-pointer transition ${
                      selectedLead?.id === lead.id
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <p className="font-semibold text-gray-800 text-sm">{lead.name}</p>
                    <p className="text-gray-600 text-xs">{lead.title}</p>
                    <p className="text-gray-500 text-xs">{lead.company}</p>
                    <div className="mt-2 flex gap-2">
                      {outreachStatus[lead.id]?.messaged && (
                        <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">Messaged</span>
                      )}
                      {outreachStatus[lead.id]?.responded && (
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Replied</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Message Composer */}
          <div className="lg:col-span-2">
            {selectedLead ? (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedLead.name}</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-600 text-sm">Title</p>
                    <p className="font-semibold text-gray-800">{selectedLead.title}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Company</p>
                    <p className="font-semibold text-gray-800">{selectedLead.company}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="font-semibold text-gray-800 text-sm">{selectedLead.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Team Size</p>
                    <p className="font-semibold text-gray-800">{selectedLead.employees} employees</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 text-sm mb-2">Recommended Focus</p>
                  <p className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">{selectedLead.focus}</p>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 text-sm mb-2">Personalized Message</p>
                  <textarea
                    value={generateMessage(selectedLead)}
                    readOnly
                    className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 font-mono text-sm h-32"
                  />
                  <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                    Copy Message
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={outreachStatus[selectedLead.id]?.messaged || false}
                        onChange={() => toggleMessaged(selectedLead.id)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="text-gray-800 font-semibold">Message Sent</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={outreachStatus[selectedLead.id]?.responded || false}
                        onChange={() => toggleResponded(selectedLead.id)}
                        className="w-5 h-5 text-green-600"
                      />
                      <span className="text-gray-800 font-semibold">Response Received</span>
                    </label>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm mb-2">Notes</p>
                    <textarea
                      value={outreachStatus[selectedLead.id]?.notes || ''}
                      onChange={(e) => updateNotes(selectedLead.id, e.target.value)}
                      placeholder="Add follow-up notes, next steps, etc."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 h-24"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center h-96">
                <p className="text-gray-600 text-center">Select a prospect to view details and compose your message</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
