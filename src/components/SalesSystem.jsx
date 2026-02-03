import React, { useState } from 'react';
import { FileText, Phone, DollarSign, CheckCircle2, Copy, Download } from 'lucide-react';

export default function SalesSystem() {
  const [activeTab, setActiveTab] = useState('discovery');
  const [proposalData, setProposalData] = useState({
    companyName: '',
    contactName: '',
    contactTitle: '',
    email: '',
    painPoints: [],
    selectedPainPoint: '',
    teamSize: '',
    currentSpend: '',
    automationArea: 'Customer Service',
    timeline: '3-6 months'
  });

  const [pricingModel] = useState({
    areas: {
      'Customer Service Automation': { base: 5000, perHour: 50, deliveryWeeks: 4 },
      'CRM Automation': { base: 6000, perHour: 50, deliveryWeeks: 3 },
      'Sales Pipeline': { base: 7000, perHour: 55, deliveryWeeks: 4 },
      'Client Onboarding': { base: 5500, perHour: 50, deliveryWeeks: 3 }
    }
  });

  const discoveryScript = [
    {
      section: 'Opening',
      questions: [
        {
          num: 1,
          question: "Thanks for jumping on the call. Before we dive in, can you give me a quick overview of what your team does and your main focus right now?",
          notes: 'Listen for: Team size, service offerings, current priorities'
        }
      ]
    },
    {
      section: 'Pain Point Identification',
      questions: [
        {
          num: 2,
          question: "When it comes to customer service or support, what's the biggest headache your team faces right now? Walk me through a typical day.",
          notes: 'Listen for: Volume, repetitive tasks, time spent, cost impact'
        },
        {
          num: 3,
          question: "How much time would you say your team spends on manual, repetitive tasks each week? Can you give me specific examples?",
          notes: 'Listen for: Hours spent, specific processes, team members involved'
        },
        {
          num: 4,
          question: "What's that costing you? Are we talking lost productivity, delayed client responses, or something else?",
          notes: 'Listen for: Dollar impact, opportunity cost, client satisfaction issues'
        }
      ]
    },
    {
      section: 'Current Solutions',
      questions: [
        {
          num: 5,
          question: "Are you currently using any tools or software to handle this? How's that working out?",
          notes: 'Listen for: Current tech stack, gaps, frustrations, integration issues'
        },
        {
          num: 6,
          question: "What would the ideal solution look like for you? What would it need to do?",
          notes: 'Listen for: Specific features needed, integration requirements, outcomes'
        }
      ]
    },
    {
      section: 'Implementation & Budget',
      questions: [
        {
          num: 7,
          question: "How soon would you want to implement something like this? Are we talking weeks, months?",
          notes: 'Listen for: Timeline urgency, decision-making process, dependencies'
        },
        {
          num: 8,
          question: "Roughly, what kind of budget are you working with for a solution like this?",
          notes: 'Listen for: Budget range, flexibility, approval process'
        },
        {
          num: 9,
          question: "Who else needs to be involved in this decision? Are there other stakeholders I should be talking to?",
          notes: 'Listen for: Decision-makers, influencers, approval chain'
        }
      ]
    },
    {
      section: 'Closing',
      questions: [
        {
          num: 10,
          question: "Based on what you've shared, I think we could potentially save your team 10-15 hours per week. Does that sound valuable? If we put together a tailored proposal, would you be interested in reviewing it?",
          notes: 'Listen for: Interest level, next steps, objections'
        }
      ]
    }
  ];

  const painPointOptions = [
    'Customer Service 24/7 Support',
    'CRM Data Management',
    'Sales Pipeline Automation',
    'Client Onboarding Process',
    'Email & Ticket Management',
    'Lead Qualification',
    'Invoice Processing',
    'Report Generation'
  ];

  const addPainPoint = () => {
    if (proposalData.selectedPainPoint && !proposalData.painPoints.includes(proposalData.selectedPainPoint)) {
      setProposalData(prev => ({
        ...prev,
        painPoints: [...prev.painPoints, prev.selectedPainPoint],
        selectedPainPoint: ''
      }));
    }
  };

  const removePainPoint = (point) => {
    setProposalData(prev => ({
      ...prev,
      painPoints: prev.painPoints.filter(p => p !== point)
    }));
  };

  const calculateProposal = () => {
    const pricing = pricingModel.areas[proposalData.automationArea];
    const estimatedHours = proposalData.teamSize ? parseInt(proposalData.teamSize) * 20 : 50;
    const servicesCost = pricing.base;
    const implementationCost = estimatedHours * pricing.perHour;
    const totalCost = servicesCost + implementationCost;
    
    return {
      servicesCost,
      implementationCost,
      totalCost,
      estimatedHours,
      deliveryWeeks: pricing.deliveryWeeks,
      monthlySavings: Math.floor((estimatedHours * 50) / 4.33) // Hours saved * hourly rate / weeks
    };
  };

  const generateProposalText = () => {
    const proposal = calculateProposal();
    return `PROPOSAL FOR: ${proposalData.companyName}

Contact: ${proposalData.contactName}, ${proposalData.contactTitle}
Date: ${new Date().toLocaleDateString()}

---

EXECUTIVE SUMMARY

Activ-AI proposes to automate key processes for ${proposalData.companyName}, focusing on ${proposalData.automationArea}. This solution will reduce manual workload, improve efficiency, and lower operational costs.

---

PAIN POINTS IDENTIFIED
${proposalData.painPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

---

PROPOSED SOLUTION

Activ-AI will implement an AI-powered automation system that:
• Handles repetitive, manual tasks automatically
• Integrates with your existing systems
• Scales as your business grows
• Provides detailed reporting and analytics

---

PROJECT SCOPE & DELIVERABLES

Service Focus: ${proposalData.automationArea}
Implementation Timeline: ${proposal.deliveryWeeks} weeks
Team Size: ${proposalData.teamSize} employees
Estimated Hours: ${proposal.estimatedHours} hours

---

PRICING BREAKDOWN

Base Service Fee: £${proposal.servicesCost.toLocaleString()}
Implementation & Configuration: £${proposal.implementationCost.toLocaleString()}
─────────────────────────────
TOTAL PROJECT COST: £${proposal.totalCost.toLocaleString()}

---

EXPECTED OUTCOMES

Hours Saved Per Week: ${proposalData.teamSize ? parseInt(proposalData.teamSize) * 10 : '15-20'}
Monthly Cost Savings: £${proposal.monthlySavings.toLocaleString()}
ROI Timeline: ${Math.ceil(proposal.totalCost / (proposal.monthlySavings * 4))} months
Client Satisfaction Impact: Significant improvement in response times

---

NEXT STEPS

1. Review this proposal
2. Schedule implementation kick-off call
3. Provide system access details
4. Begin Phase 1 setup

For questions, contact: Activ-AI
Timeline: Ready to start within 2 weeks

---

This proposal is valid for 30 days.`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Activ-AI Sales System</h1>
          <p className="text-gray-600">Discovery calls, proposals, and pricing framework</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab('discovery')}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              activeTab === 'discovery'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 border border-gray-300 hover:border-blue-500'
            }`}
          >
            <Phone size={20} /> Discovery Script
          </button>
          <button
            onClick={() => setActiveTab('proposal')}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              activeTab === 'proposal'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 border border-gray-300 hover:border-blue-500'
            }`}
          >
            <FileText size={20} /> Proposal Generator
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              activeTab === 'pricing'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 border border-gray-300 hover:border-blue-500'
            }`}
          >
            <DollarSign size={20} /> Pricing Model
          </button>
        </div>

        {/* Discovery Call Script */}
        {activeTab === 'discovery' && (
          <div className="space-y-6">
            {discoveryScript.map((section, sectionIdx) => (
              <div key={sectionIdx} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-600 text-white px-6 py-4">
                  <h3 className="text-xl font-bold">{section.section}</h3>
                </div>
                <div className="p-6 space-y-6">
                  {section.questions.map((q, qIdx) => (
                    <div key={qIdx} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                          {q.num}
                        </div>
                        <div className="flex-1">
                          <p className="text-lg font-semibold text-gray-800">{q.question}</p>
                        </div>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg ml-11">
                        <p className="text-sm text-gray-700"><strong>Listen for:</strong> {q.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg">
              <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                <CheckCircle2 size={20} /> Key Principles
              </h4>
              <ul className="space-y-2 text-gray-800">
                <li>• Let them talk 70% of the time—listen actively</li>
                <li>• Translate pain points into specific outcomes they care about</li>
                <li>• Always confirm understanding: "So what I'm hearing is..."</li>
                <li>• End with a clear next step: proposal delivery and review timeline</li>
                <li>• Take detailed notes for your proposal</li>
              </ul>
            </div>
          </div>
        )}

        {/* Proposal Generator */}
        {activeTab === 'proposal' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Generate Professional Proposal</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={proposalData.companyName}
                    onChange={(e) => setProposalData({ ...proposalData, companyName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="e.g., Tech Solutions Ltd"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Name</label>
                  <input
                    type="text"
                    value={proposalData.contactName}
                    onChange={(e) => setProposalData({ ...proposalData, contactName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="e.g., John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Title</label>
                  <input
                    type="text"
                    value={proposalData.contactTitle}
                    onChange={(e) => setProposalData({ ...proposalData, contactTitle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="e.g., CEO"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={proposalData.email}
                    onChange={(e) => setProposalData({ ...proposalData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Team Size (Affected Users)</label>
                <input
                  type="number"
                  value={proposalData.teamSize}
                  onChange={(e) => setProposalData({ ...proposalData, teamSize: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="e.g., 10"
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-4">Pain Points Discussed</label>
                <div className="flex gap-2 mb-3">
                  <select
                    value={proposalData.selectedPainPoint}
                    onChange={(e) => setProposalData({ ...proposalData, selectedPainPoint: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select a pain point...</option>
                    {painPointOptions.map(point => (
                      <option key={point} value={point}>{point}</option>
                    ))}
                  </select>
                  <button
                    onClick={addPainPoint}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {proposalData.painPoints.map(point => (
                    <div key={point} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {point}
                      <button
                        onClick={() => removePainPoint(point)}
                        className="text-blue-600 hover:text-blue-800 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Automation Area</label>
                  <select
                    value={proposalData.automationArea}
                    onChange={(e) => setProposalData({ ...proposalData, automationArea: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option>Customer Service Automation</option>
                    <option>CRM Automation</option>
                    <option>Sales Pipeline</option>
                    <option>Client Onboarding</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Timeline</label>
                  <select
                    value={proposalData.timeline}
                    onChange={(e) => setProposalData({ ...proposalData, timeline: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option>1-2 weeks</option>
                    <option>3-6 weeks</option>
                    <option>3-6 months</option>
                    <option>6-12 months</option>
                  </select>
                </div>
              </div>

              {proposalData.companyName && proposalData.contactName && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-6 rounded-lg font-mono text-sm whitespace-pre-wrap border border-gray-200 max-h-96 overflow-y-auto">
                    {generateProposalText()}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generateProposalText());
                        alert('Proposal copied to clipboard!');
                      }}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
                    >
                      <Copy size={20} /> Copy Proposal
                    </button>
                    <button
                      onClick={() => {
                        const element = document.createElement('a');
                        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(generateProposalText()));
                        element.setAttribute('download', `${proposalData.companyName}_Proposal.txt`);
                        element.style.display = 'none';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                      className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
                    >
                      <Download size={20} /> Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pricing Model */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-8">Pricing Framework</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {Object.entries(pricingModel.areas).map(([area, pricing]) => (
                  <div key={area} className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 transition">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">{area}</h4>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Base Service Fee</span>
                        <span className="font-bold text-2xl text-blue-600">£{pricing.base.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Implementation (per hour)</span>
                        <span className="font-bold text-lg text-blue-600">£{pricing.perHour}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Typical Delivery</span>
                        <span className="font-bold text-lg text-blue-600">{pricing.deliveryWeeks} weeks</span>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg text-sm text-gray-700">
                      <p className="font-semibold mb-2">Typical Project: £{(pricing.base + (50 * pricing.perHour)).toLocaleString()}</p>
                      <p className="text-xs">(Base + ~50 hours implementation)</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-lg">
                <h4 className="font-bold text-purple-900 mb-3">Pricing Strategy</h4>
                <ul className="space-y-2 text-gray-800">
                  <li>• <strong>Base Fee:</strong> Covers discovery, design, and initial setup</li>
                  <li>• <strong>Implementation Hours:</strong> Custom development based on complexity</li>
                  <li>• <strong>ROI Focus:</strong> Position as cost-saving investment, not expense</li>
                  <li>• <strong>Example:</strong> A company saving 100 hours/month at £50/hr = £5,000/month savings</li>
                  <li>• <strong>Flexible:</strong> Can offer payment plans for larger projects</li>
                </ul>
              </div>

              <div className="mt-8 bg-green-50 border-l-4 border-green-600 p-6 rounded-lg">
                <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={20} /> Sales Talking Points
                </h4>
                <ul className="space-y-2 text-gray-800">
                  <li>✓ "This typically pays for itself in 2-4 months through time savings"</li>
                  <li>✓ "We can start small and scale—no massive upfront commitment"</li>
                  <li>✓ "You keep your data—we just automate the busy work"</li>
                  <li>✓ "Ongoing support included for the first 90 days"</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
