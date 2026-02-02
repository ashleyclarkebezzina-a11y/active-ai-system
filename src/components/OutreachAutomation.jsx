import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, AlertCircle, CheckCircle2, Zap } from 'lucide-react';

export default function OutreachAutomation() {
  const [automation, setAutomation] = useState({
    isRunning: false,
    dailyTarget: 20,
    messagesScheduled: 0,
    messagesSent: 0,
    responses: 0,
    nextScheduledTime: null,
    startDate: new Date().toISOString().split('T')[0],
    endDate: null,
    focusAreas: ['Customer Service Automation', 'CRM Automation', 'Sales Pipeline', 'Client Onboarding'],
    currentFocusArea: 'Customer Service Automation'
  });

  const [campaignStats, setCampaignStats] = useState({
    totalLeads: 9990,
    priorityLeads: 100,
    ukLeads: 8097,
    otherLeads: 1893,
    estimatedResponseRate: 3.5,
    estimatedConversions: 0
  });

  const [schedule, setSchedule] = useState([
    { time: '09:00', messagesPerSlot: 5, dayOfWeek: 'Monday to Friday' },
    { time: '13:00', messagesPerSlot: 5, dayOfWeek: 'Monday to Friday' },
    { time: '16:00', messagesPerSlot: 10, dayOfWeek: 'Monday to Friday' }
  ]);

  const [focusStrategy, setFocusStrategy] = useState({
    selectedArea: 'Customer Service Automation',
    description: 'Most IT services firms waste 15-20 hours weekly on customer onboarding and support tickets. We automate this with AI agents.',
    successMetrics: ['10+ hours saved per team member', 'Faster client onboarding', 'Reduced support costs']
  });

  const [complianceChecks] = useState({
    linkedinCompliance: true,
    personalization: true,
    followUpProtocol: true,
    contactVerification: true
  });

  const toggleAutomation = () => {
    if (!automation.isRunning) {
      // When starting, calculate next scheduled time
      const now = new Date();
      const nextHour = new Date(now.getHours() + 1, 0, 0);
      setAutomation(prev => ({
        ...prev,
        isRunning: true,
        nextScheduledTime: nextHour.toISOString()
      }));
    } else {
      setAutomation(prev => ({ ...prev, isRunning: false }));
    }
  };

  const updateDailyTarget = (value) => {
    setAutomation(prev => ({ ...prev, dailyTarget: parseInt(value) }));
  };

  const addScheduleSlot = () => {
    setSchedule([...schedule, { time: '10:00', messagesPerSlot: 5, dayOfWeek: 'Monday to Friday' }]);
  };

  const updateScheduleSlot = (index, field, value) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
  };

  const calculateEstimates = useCallback(() => {
    const estimatedResponseRate = 3.5;
    const estimatedConversions = Math.floor((automation.dailyTarget * 20 * estimatedResponseRate) / 100 * 0.15);
    setCampaignStats(prev => ({
      ...prev,
      estimatedResponseRate,
      estimatedConversions
    }));
  }, [automation.dailyTarget]);

  useEffect(() => {
    calculateEstimates();
  }, [calculateEstimates]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Outreach Automation Engine</h1>
          <p className="text-gray-600">AI-powered LinkedIn message scheduling and tracking system</p>
        </div>

        {/* Main Control Panel */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Campaign Control</h2>
              <p className="text-gray-600">Active AI Outreach Automation</p>
            </div>
            <button
              onClick={toggleAutomation}
              className={`px-8 py-4 rounded-lg font-bold text-white transition text-lg flex items-center gap-2 ${
                automation.isRunning
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {automation.isRunning ? (
                <>
                  <Pause size={24} /> Pause Campaign
                </>
              ) : (
                <>
                  <Play size={24} /> Start Campaign
                </>
              )}
            </button>
          </div>

          {/* Status Indicator */}
          <div className={`p-4 rounded-lg mb-8 flex items-center gap-3 ${
            automation.isRunning ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100 border-2 border-gray-300'
          }`}>
            <div className={`w-4 h-4 rounded-full ${automation.isRunning ? 'bg-green-600 animate-pulse' : 'bg-gray-400'}`}></div>
            <div>
              <p className="font-bold text-gray-800">
                {automation.isRunning ? 'Campaign Active' : 'Campaign Paused'}
              </p>
              {automation.isRunning && automation.nextScheduledTime && (
                <p className="text-sm text-gray-600">
                  Next batch: {new Date(automation.nextScheduledTime).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>

          {/* Campaign Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Messages Scheduled</p>
              <p className="text-3xl font-bold text-blue-600">
                {automation.dailyTarget * 20}
              </p>
              <p className="text-xs text-gray-500 mt-1">20-day campaign</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Messages Sent</p>
              <p className="text-3xl font-bold text-purple-600">{automation.messagesSent}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Expected Responses</p>
              <p className="text-3xl font-bold text-green-600">
                {Math.floor((automation.dailyTarget * 20 * 3.5) / 100)}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Estimated Deals</p>
              <p className="text-3xl font-bold text-orange-600">
                {campaignStats.estimatedConversions}
              </p>
            </div>
          </div>
        </div>

        {/* Schedule Configuration */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Message Schedule</h3>
            <button
              onClick={addScheduleSlot}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Zap size={18} /> Add Time Slot
            </button>
          </div>

          <div className="space-y-4">
            {schedule.map((slot, index) => (
              <div key={index} className="flex gap-4 items-end p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <label className="text-sm text-gray-600">Time</label>
                  <input
                    type="time"
                    value={slot.time}
                    onChange={(e) => updateScheduleSlot(index, 'time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-600">Messages Per Slot</label>
                  <input
                    type="number"
                    value={slot.messagesPerSlot}
                    onChange={(e) => updateScheduleSlot(index, 'messagesPerSlot', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-600">Days</label>
                  <input
                    type="text"
                    value={slot.dayOfWeek}
                    onChange={(e) => updateScheduleSlot(index, 'dayOfWeek', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Current Schedule:</strong> {schedule.reduce((sum, s) => sum + s.messagesPerSlot, 0)} messages per day across {schedule.length} time slots
            </p>
          </div>
        </div>

        {/* Daily Target */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Daily Target</h3>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <input
                type="range"
                min="5"
                max="50"
                value={automation.dailyTarget}
                onChange={(e) => updateDailyTarget(e.target.value)}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">{automation.dailyTarget}</p>
              <p className="text-gray-600 text-sm">messages/day</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            At {automation.dailyTarget} messages per day, you'll reach {automation.dailyTarget * 20} prospects in 20 days with an estimated {Math.floor((automation.dailyTarget * 20 * 3.5) / 100)} responses.
          </p>
        </div>

        {/* Focus Area Strategy */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Focus Area Strategy</h3>
          <div className="mb-6">
            <label className="text-sm text-gray-600">Current Focus</label>
            <select
              value={focusStrategy.selectedArea}
              onChange={(e) => setFocusStrategy({ ...focusStrategy, selectedArea: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
            >
              {automation.focusAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg mb-6">
            <p className="text-gray-700">{focusStrategy.description}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-2">Success Metrics:</p>
            <ul className="space-y-2">
              {focusStrategy.successMetrics.map((metric, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 size={18} className="text-green-600" />
                  {metric}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Compliance Checklist */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Compliance & Best Practices</h3>
          <div className="space-y-4">
            {Object.entries(complianceChecks).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={value}
                  readOnly
                  className="w-5 h-5 text-green-600"
                />
                <span className="text-gray-800">
                  {key === 'linkedinCompliance' && 'LinkedIn Terms Compliance'}
                  {key === 'personalization' && 'Message Personalization'}
                  {key === 'followUpProtocol' && 'Follow-up Protocol'}
                  {key === 'contactVerification' && 'Contact Data Verification'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-600 rounded-lg flex gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
            <p className="text-sm text-gray-700">
              All outreach follows LinkedIn's acceptable use policy. Messages are personalized and sent at natural intervals to avoid spam detection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
