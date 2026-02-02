import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, CheckCircle, TrendingUp, Upload, Filter } from 'lucide-react';

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
  
  const [filters, setFilters] = useState({
    minEmployees: 0,
    maxEmployees: 10000,
    country: 'all',
    messageStatus: 'all'
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    const sampleLeads = [
      { id: 1, firstName: 'Kevin', lastName: 'McKelvin', title: 'CEO', company: 'Tech Solutions Ltd', email: 'kevin@example.com', employees: 150, country: 'United Kingdom', focus: 'Customer Service Automation' },
      { id: 2, firstName: 'Stuart', lastName: 'Haslam', title: 'CTO', company: 'Digital Services Group', email: 'stuart@example.com', employees: 200, country: 'United Kingdom', focus: 'CRM Automation' },
      { id: 3, firstName: 'Shelton', lastName: 'Julius', title: 'Managing Director', company: 'IT Consulting Pro', email: 'shelton@example.com', employees: 95, country: 'United Kingdom', focus: 'Sales Pipeline' },
      { id: 4, firstName: 'Sean', lastName: 'Foley', title: 'Operations Manager', company: 'Enterprise Solutions', email: 'sean@example.com', employees: 250, country: 'United Kingdom', focus: 'Client Onboarding' },
      { id: 5, firstName: 'Jonathan', lastName: 'Abbott', title: 'Director', company: 'Business Systems Inc', email: 'jonathan@example.com', employees: 180, country: 'United Kingdom', focus: 'Customer Service' },
    ];
    setLeads(sampleLeads);
    setFilteredLeads(sampleLeads);
    
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadStatus('Uploading...');
    
    try {
      // Dynamic import of xlsx library
      const XLSX = await import('xlsx');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const processedLeads = jsonData.map((row, index) => ({
            id: index + 1,
            firstName: row['First Name'] || '',
            lastName: row['Last Name'] || '',
            title: row['Title'] || '',
            company: row['Company Name '] || row['Company Name'] || '',
            email: row['Email'] || '',
            employees: row['# Employees'] || 0,
            country: row['Company Country'] || row['Country'] || '',
            website: row['Website'] || '',
            city: row['Company City'] || row['City'] || '',
            linkedin: row['Person Linkedin Url'] || '',
            focus: determineFocus(row['Title'] || '')
          }));

          setLeads(processedLeads);
          setFilteredLeads(processedLeads);
          
          const newStatus = {};
          processedLeads.forEach(lead => {
            newStatus[lead.id] = { messaged: false, responded: false, notes: '' };
          });
          setOutreachStatus(newStatus);
          
          setUploadStatus(`✓ Loaded ${processedLeads.length} leads successfully!`);
          setTimeout(() => setUploadStatus(''), 3000);
        } catch (error) {
          setUploadStatus('✗ Error loading file. Please check the format.');
          setTimeout(() => setUploadStatus(''), 3000);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      setUploadStatus('✗ Error: XLSX library not available');
      setTimeout(() => setUploadStatus(''), 3000);
    }
  };

  const determineFocus = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('sales') || titleLower.includes('revenue')) return 'Sales Pipeline';
    if (titleLower.includes('customer') || titleLower.includes('support')) return 'Customer Service Automation';
    if (titleLower.includes('operation')) return 'Client Onboarding';
    return 'CRM Automation';
  };

  const applyFilters = () => {
    let filtered = [...leads];

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.minEmployees > 0) {
      filtered = filtered.filter(lead => lead.employees >= filters.minEmployees);
    }

    if (filters.maxEmployees < 10000) {
      filtered = filtered.filter(lead => lead.employees <= filters.maxEmployees);
    }

    if (filters.country !== 'all') {
      filtered = filtered.filter(lead => lead.country === filters.country);
    }

    if (filters.messageStatus === 'messaged') {
      filtered = filtered.filter(lead => outreachStatus[lead.id]?.messaged);
    } else if (filters.messageStatus === 'not-messaged') {
      filtered = filtered.filter(lead => !outreachStatus[lead.id]?.messaged);
    } else if (filters.messageStatus === 'responded') {
      filtered = filtered.filter(lead => outreachStatus[lead.id]?.responded);
    }

    setFilteredLeads(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, leads, outreachStatus]);

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
    setSearchTerm(e.target.value);
  };

  const generateMessage = (lead) => {
    return messageTemplate
      .replace('[FIRST_NAME]', lead.firstName)
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

  const resetFilters = () => {
    setFilters({
      minEmployees: 0,
      maxEmployees: 10000,
      country: 'all',
      messageStatus: 'all'
    });
    setSearchTerm('');
  };

  const uniqueCountries = [...new Set(leads.map(l => l.country).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Active AI Outreach Hub</h1>
          <p className="text-gray-600">LinkedIn outreach management for your IT services prospects</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Import Your Leads</h2>
              <p className="text-gray-600 text-sm">Upload your Excel file to populate all leads</p>
            </div>
            <label className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer flex items-center gap-2">
              <Upload size={20} />
              Upload Excel File
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
          {uploadStatus && (
            <div className={`mt-4 p-3 rounded-lg ${uploadStatus.includes('✓') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {uploadStatus}
            </div>
          )}
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Prospects ({filteredLeads.length})</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <Filter size={20} className="text-gray-600" />
                </button>
              </div>
              
              {/* Filters Panel */}
              {showFilters && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Filters</h3>
                    <button onClick={resetFilters} className="text-sm text-blue-600 hover:text-blue-800">
                      Reset All
                    </button>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-700 font-medium">Min Employees</label>
                    <input
                      type="number"
                      value={filters.minEmployees}
                      onChange={(e) => setFilters({...filters, minEmployees: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-700 font-medium">Max Employees</label>
                    <input
                      type="number"
                      value={filters.maxEmployees}
                      onChange={(e) => setFilters({...filters, maxEmployees: parseInt(e.target.value) || 10000})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
                      placeholder="10000"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-700 font-medium">Country</label>
                    <select
                      value={filters.country}
                      onChange={(e) => setFilters({...filters, country: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
                    >
                      <option value="all">All Countries</option>
                      {uniqueCountries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-700 font-medium">Status</label>
                    <select
                      value={filters.messageStatus}
                      onChange={(e) => setFilters({...filters, messageStatus: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
                    >
                      <option value="all">All Leads</option>
                      <option value="not-messaged">Not Messaged</option>
                      <option value="messaged">Messaged</option>
                      <option value="responded">Responded</option>
                    </select>
                  </div>
                </div>
              )}

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
                    <p className="font-semibold text-gray-800 text-sm">{lead.firstName} {lead.lastName}</p>
                    <p className="text-gray-600 text-xs">{lead.title}</p>
                    <p className="text-gray-500 text-xs">{lead.company}</p>
                    <p className="text-gray-400 text-xs">{lead.employees} employees</p>
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
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedLead.firstName} {selectedLead.lastName}</h2>
                
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
                  <div>
                    <p className="text-gray-600 text-sm">Location</p>
                    <p className="font-semibold text-gray-800">{selectedLead.city}, {selectedLead.country}</p>
                  </div>
                  {selectedLead.linkedin && (
                    <div>
                      <p className="text-gray-600 text-sm">LinkedIn</p>
                      <a href={selectedLead.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                        View Profile
                      </a>
                    </div>
                  )}
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
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(generateMessage(selectedLead));
                      alert('Message copied to clipboard!');
                    }}
                    className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
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
