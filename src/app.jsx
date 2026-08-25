import React, { useState } from 'react';
import { Heart, Zap, Users, Target, TrendingUp, Sparkles, Copy } from 'lucide-react';

export default function CLFHackathon() {
  const [activeTab, setActiveTab] = useState("context");
  const [ideas, setIdeas] = useState([
    { id: 1, pair: "Pair 1", title: "Idea Title", thesis: "", goToMarket: "", positioning: "", successMetrics: "", pitch: "", notes: "", votes: 0 },
    { id: 2, pair: "Pair 2", title: "Idea Title", thesis: "", goToMarket: "", positioning: "", successMetrics: "", pitch: "", notes: "", votes: 0 },
    { id: 3, pair: "Pair 3", title: "Idea Title", thesis: "", goToMarket: "", positioning: "", successMetrics: "", pitch: "", notes: "", votes: 0 },
    { id: 4, pair: "Pair 4", title: "Idea Title", thesis: "", goToMarket: "", positioning: "", successMetrics: "", pitch: "", notes: "", votes: 0 },
  ]);

  const [contextResponses, setContextResponses] = useState({
    clfMoment: "",
    currentPerception: "",
    desiredPerception: "",
    whyFading: "",
    uniqueCapability: "",
  });

  const [individuals, setIndividuals] = useState([
    { id: 1, name: "Stacia", brainstorm: "" },
    { id: 2, name: "Tunichia", brainstorm: "" },
    { id: 3, name: "Sarah", brainstorm: "" },
    { id: 4, name: "Judene", brainstorm: "" },
    { id: 5, name: "Deb", brainstorm: "" },
    { id: 6, name: "Madeleine", brainstorm: "" },
    { id: 7, name: "Derek", brainstorm: "" },
    { id: 8, name: "Megan", brainstorm: "" },
  ]);

  const [individualSynthesis, setIndividualSynthesis] = useState(null);
  const [isSynthesizingIndividuals, setIsSynthesizingIndividuals] = useState(false);
  const [expandedPair, setExpandedPair] = useState(null);
  const [themes, setThemes] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const addVote = (id) => {
    setIdeas(ideas.map(idea => idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea));
  };

  const updateIdea = (id, field, value) => {
    setIdeas(ideas.map(idea => idea.id === id ? { ...idea, [field]: value } : idea));
  };

  const updateIndividual = (id, field, value) => {
    setIndividuals(individuals.map(person => person.id === id ? { ...person, [field]: value } : person));
  };

  const updateContext = (field, value) => {
    setContextResponses({ ...contextResponses, [field]: value });
  };

  const generateThemesAndSuggestions = async () => {
    setIsGenerating(true);
    
    const ideaSummary = ideas
      .filter(idea => idea.title)
      .map(idea => `**${idea.pair}: ${idea.title}**\n- Thesis: ${idea.thesis || 'N/A'}\n- Positioning: ${idea.positioning || 'N/A'}\n- Success Metrics: ${idea.successMetrics || 'N/A'}`)
      .join('\n');

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a strategic advisor helping a VC fund (a16z's CLF) synthesize their hackathon ideas.\n\nHere are the four team pairs' repositioning ideas:\n\n${ideaSummary}\n\nPlease provide:\n1. CONNECTIVE THEMES\n2. STRONGEST ELEMENTS\n3. SYNTHESIS RECOMMENDATION\n4. BIGGEST GAPS\n5. NEXT STEPS\n\nBe direct and think like an a16z partner.`
          }]
        })
      });

      const data = await response.json();
      const content = data.content[0].text;
      setThemes({ raw: content });
      setSuggestions({ synthesis: "Generated", gaps: "Generated", nextSteps: "Generated" });
    } catch (error) {
      console.error("Error generating themes:", error);
      setThemes({ error: "Failed to generate analysis. Try again." });
    }
    
    setIsGenerating(false);
  };

  const synthesizeIndividualBrainstorms = async () => {
    setIsSynthesizingIndividuals(true);

    const brainstormSummary = individuals
      .filter(person => person.brainstorm)
      .map(person => `**${person.name}:**\n${person.brainstorm}`)
      .join('\n');

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1200,
          messages: [{
            role: "user",
            content: `You are analyzing brainstorms from an 8-person team at a16z's CLF about repositioning the fund.\n\nHere are the raw brainstorms:\n\n${brainstormSummary}\n\nPlease provide:\n1. EMERGING THEMES\n2. BOLD IDEAS\n3. COMMON CONCERNS\n4. AREAS OF AGREEMENT\n5. PROVOCATIVE QUESTIONS\n\nFormat as a briefing memo.`
          }]
        })
      });

      const data = await response.json();
      const content = data.content[0].text;
      setIndividualSynthesis({ raw: content, timestamp: new Date().toLocaleTimeString() });
    } catch (error) {
      console.error("Error synthesizing:", error);
      setIndividualSynthesis({ error: "Failed to synthesize. Try again." });
    }

    setIsSynthesizingIndividuals(false);
  };

  const sortedIdeas = [...ideas].sort((a, b) => b.votes - a.votes);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">CLF Reinvention Hackathon</h1>
          <p className="text-slate-300">From Celebrity Fund to Culture-Commerce Operating Partner</p>
          <div className="flex gap-4 mt-4 flex-wrap">
            <span className="px-3 py-1 bg-purple-900 text-purple-100 rounded-full text-sm">Tuesday Aug 25 – Wed Aug 26</span>
            <span className="px-3 py-1 bg-blue-900 text-blue-100 rounded-full text-sm">8 People</span>
            <span className="px-3 py-1 bg-green-900 text-green-100 rounded-full text-sm">4 Teams</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab("context")}
            className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
              activeTab === "context"
                ? "text-white border-b-2 border-purple-500"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            🎯 Context & Problem
          </button>
          <button
            onClick={() => setActiveTab("individual")}
            className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
              activeTab === "individual"
                ? "text-white border-b-2 border-purple-500"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            👤 Individual Ideas
          </button>
          <button
            onClick={() => setActiveTab("ideas")}
            className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
              activeTab === "ideas"
                ? "text-white border-b-2 border-purple-500"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            💡 Pair Responses
          </button>
          <button
            onClick={() => setActiveTab("themes")}
            className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
              activeTab === "themes"
                ? "text-white border-b-2 border-purple-500"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            🎯 Themes & Analysis
          </button>
          <button
            onClick={() => setActiveTab("synthesis")}
            className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
              activeTab === "synthesis"
                ? "text-white border-b-2 border-purple-500"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            ✨ AI Synthesis
          </button>
        </div>

        {/* Context Tab */}
        {activeTab === "context" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 border border-blue-700 rounded-lg p-8">
              <h2 className="text-3xl font-bold text-white mb-3">Setting the Context for CLF's Next Chapter</h2>
              <p className="text-blue-100 text-lg">Before we ideate on CLF's future, let's align on our foundation and what we're seeing shift in the market.</p>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-900 text-blue-100 rounded-full text-sm font-bold">1</span>
                  <h3 className="text-lg font-bold text-white">What is the core tenant that holds CLF together?</h3>
                </div>
                <textarea
                  value={contextResponses.clfMoment}
                  onChange={(e) => updateContext("clfMoment", e.target.value)}
                  placeholder="What's the foundational belief or mission?"
                  className="w-full bg-slate-700 text-white rounded p-4 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                />
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex gap-2 mb-3">
                  <span className="px-3 py-1 bg-purple-900 text-purple-100 rounded-full text-sm font-bold">2</span>
                  <h3 className="text-lg font-bold text-white">What partnerships or moments have best embodied this?</h3>
                </div>
                <textarea
                  value={contextResponses.currentPerception}
                  onChange={(e) => updateContext("currentPerception", e.target.value)}
                  placeholder="Examples of CLF's impact..."
                  className="w-full bg-slate-700 text-white rounded p-4 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                />
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex gap-2 mb-3">
                  <span className="px-3 py-1 bg-green-900 text-green-100 rounded-full text-sm font-bold">3</span>
                  <h3 className="text-lg font-bold text-white">What shifts are we noticing in the market or firm?</h3>
                </div>
                <textarea
                  value={contextResponses.desiredPerception}
                  onChange={(e) => updateContext("desiredPerception", e.target.value)}
                  placeholder="Trends and opportunities..."
                  className="w-full bg-slate-700 text-white rounded p-4 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                />
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex gap-2 mb-3">
                  <span className="px-3 py-1 bg-orange-900 text-orange-100 rounded-full text-sm font-bold">4</span>
                  <h3 className="text-lg font-bold text-white">How is CLF perceived right now, and why?</h3>
                </div>
                <textarea
                  value={contextResponses.whyFading}
                  onChange={(e) => updateContext("whyFading", e.target.value)}
                  placeholder="Current narrative about CLF..."
                  className="w-full bg-slate-700 text-white rounded p-4 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                />
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex gap-2 mb-3">
                  <span className="px-3 py-1 bg-pink-900 text-pink-100 rounded-full text-sm font-bold">5</span>
                  <h3 className="text-lg font-bold text-white">What do we want to be true about CLF in 12 months?</h3>
                </div>
                <textarea
                  value={contextResponses.uniqueCapability}
                  onChange={(e) => updateContext("uniqueCapability", e.target.value)}
                  placeholder="Our aspiration..."
                  className="w-full bg-slate-700 text-white rounded p-4 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                />
              </div>
            </div>
          </div>
        )}

        {/* Individual Ideas Tab */}
        {activeTab === "individual" && (
          <div className="space-y-6">
            <div className="bg-blue-900 border border-blue-700 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-white mb-2">Phase 1: Individual Brainstorm (25 min)</h3>
              <p className="text-blue-100 text-sm">Work solo with Claude/ChatGPT. Don't overthink it. Throw everything at it: half-formed ideas, questions, provocations, possibilities.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {individuals.map((person) => (
                <div key={person.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6 flex flex-col">
                  <div className="text-lg font-bold text-white mb-4 pb-3 border-b border-slate-700">
                    {person.name}
                  </div>
                  <textarea
                    value={person.brainstorm}
                    onChange={(e) => updateIndividual(person.id, "brainstorm", e.target.value)}
                    placeholder="Brainstorm everything..."
                    className="w-full bg-slate-700 text-white rounded p-4 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 flex-grow font-mono resize-none"
                  />
                </div>
              ))}
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles size={20} /> AI Synthesis
                </h3>
                <button
                  onClick={synthesizeIndividualBrainstorms}
                  disabled={isSynthesizingIndividuals}
                  className={`px-4 py-2 rounded font-semibold transition flex items-center gap-2 ${
                    isSynthesizingIndividuals
                      ? "bg-slate-600 text-slate-300 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  }`}
                >
                  <Sparkles size={16} />
                  {isSynthesizingIndividuals ? "Synthesizing..." : "Generate AI Insights"}
                </button>
              </div>

              {individualSynthesis?.error && (
                <div className="bg-red-900 border border-red-700 text-red-100 p-4 rounded">
                  {individualSynthesis.error}
                </div>
              )}

              {individualSynthesis?.raw && (
                <div className="bg-slate-700 rounded p-6 text-white font-mono text-sm whitespace-pre-wrap overflow-auto max-h-[500px]">
                  {individualSynthesis.raw}
                </div>
              )}

              {!individualSynthesis && (
                <div className="bg-slate-700 rounded p-6 text-slate-400 text-center text-sm">
                  AI synthesis will appear here once generated
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pair Responses Tab */}
        {activeTab === "ideas" && (
          <div className="space-y-6">
            {ideas.map((idea) => (
              <div key={idea.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-700">
                  <div className="flex-1">
                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">{idea.pair}</div>
                    <input
                      value={idea.title}
                      onChange={(e) => updateIdea(idea.id, "title", e.target.value)}
                      placeholder="Repositioning Name/Title"
                      className="text-2xl font-bold text-white bg-transparent border-b border-slate-700 focus:border-purple-500 outline-none w-full"
                    />
                  </div>
                  <button
                    onClick={() => addVote(idea.id)}
                    className={`p-3 rounded transition ${
                      idea.votes > 0
                        ? "bg-purple-900 text-purple-100"
                        : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                    }`}
                  >
                    <Heart size={20} fill={idea.votes > 0 ? "currentColor" : "none"} />
                  </button>
                </div>

                <div className="mb-4 inline-block px-3 py-1 bg-purple-900 text-purple-100 rounded text-sm font-semibold">
                  {idea.votes} votes
                </div>

                <div className="space-y-5 mt-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      1. Thesis — Core capability/value prop
                    </label>
                    <textarea
                      value={idea.thesis}
                      onChange={(e) => updateIdea(idea.id, "thesis", e.target.value)}
                      placeholder="What uniquely valuable capability does CLF have?"
                      className="w-full bg-slate-700 text-white rounded p-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      2. Go-to-Market — How do we activate this with portfolio?
                    </label>
                    <textarea
                      value={idea.goToMarket}
                      onChange={(e) => updateIdea(idea.id, "goToMarket", e.target.value)}
                      placeholder="Partnership approach, founders to approach, test structure..."
                      className="w-full bg-slate-700 text-white rounded p-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      3. Positioning/Brand — New name, brand, or positioning
                    </label>
                    <textarea
                      value={idea.positioning}
                      onChange={(e) => updateIdea(idea.id, "positioning", e.target.value)}
                      placeholder="E.g., 'Cultural Strategy Partners', tagline, metaphor..."
                      className="w-full bg-slate-700 text-white rounded p-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      4. Internal Pitch — 2-3 sentences for a16z partners
                    </label>
                    <textarea
                      value={idea.pitch}
                      onChange={(e) => updateIdea(idea.id, "pitch", e.target.value)}
                      placeholder="What's the one thing that makes them go 'oh, I need this'?"
                      className="w-full bg-slate-700 text-white rounded p-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows="2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      5. Success Metrics — Year 1 impact measurement
                    </label>
                    <textarea
                      value={idea.successMetrics}
                      onChange={(e) => updateIdea(idea.id, "successMetrics", e.target.value)}
                      placeholder="Deal volume, founder satisfaction, $ attributed, portfolio velocity..."
                      className="w-full bg-slate-700 text-white rounded p-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows="2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={idea.notes}
                      onChange={(e) => updateIdea(idea.id, "notes", e.target.value)}
                      placeholder="Risks, opportunities, observations..."
                      className="w-full bg-slate-700 text-white rounded p-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows="2"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={20} /> Vote Summary
              </h3>
              <div className="space-y-3">
                {sortedIdeas.map((idea, idx) => (
                  <div key={idea.id} className="flex items-center gap-4">
                    <span className="text-slate-400 font-semibold w-8">#{idx + 1}</span>
                    <div className="flex-1">
                      <div className="text-white font-semibold">{idea.title || "Untitled"}</div>
                      <div className="text-slate-400 text-sm">{idea.pair}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-purple-600 h-full transition-all"
                          style={{
                            width: `${Math.max((idea.votes / Math.max(...sortedIdeas.map(i => i.votes), 1)) * 100, 5)}%`,
                          }}
                        />
                      </div>
                      <span className="text-white font-bold w-8 text-right">{idea.votes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Themes Tab */}
        {activeTab === "themes" && (
          <div className="space-y-6">
            <div className="bg-blue-900 border border-blue-700 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles size={20} /> Emerging Themes
                </h3>
                <button
                  onClick={generateThemesAndSuggestions}
                  disabled={isGenerating}
                  className={`px-4 py-2 rounded font-semibold transition flex items-center gap-2 ${
                    isGenerating
                      ? "bg-slate-600 text-slate-300 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  }`}
                >
                  <Sparkles size={16} />
                  {isGenerating ? "Analyzing..." : "Generate AI Analysis"}
                </button>
              </div>

              <p className="text-slate-300 text-sm">
                Once you've filled in responses from all 4 pairs, click "Generate AI Analysis" to automatically extract themes and get synthesis recommendations.
              </p>
            </div>

            {themes?.error && (
              <div className="bg-red-900 border border-red-700 text-red-100 p-4 rounded">
                {themes.error}
              </div>
            )}

            {themes?.raw && (
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="bg-slate-700 rounded p-6 text-white font-mono text-sm whitespace-pre-wrap overflow-auto max-h-96">
                  {themes.raw}
                </div>
              </div>
            )}

            {!themes && (
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-center text-slate-400">
                Analysis will appear here once generated
              </div>
            )}
          </div>
        )}

        {/* Synthesis Tab */}
        {activeTab === "synthesis" && (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles size={24} /> AI-Powered Synthesis
              </h3>
              
              {themes?.error && (
                <div className="bg-red-900 border border-red-700 text-red-100 p-4 rounded mb-4">
                  {themes.error}
                </div>
              )}

              {themes?.raw ? (
                <div className="bg-slate-700 rounded p-6 text-white font-mono text-sm whitespace-pre-wrap overflow-auto max-h-96">
                  {themes.raw}
                </div>
              ) : (
                <div className="bg-slate-700 rounded p-6 text-slate-400 text-center">
                  <p className="mb-4">No analysis generated yet.</p>
                  <p className="text-sm">Generate analysis from the "Themes & Analysis" tab.</p>
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-900 border border-blue-700 rounded text-blue-100 text-sm">
                <strong>💡 How this works:</strong> The AI reads all 4 pairs' responses and identifies connective themes, strongest elements, synthesis recommendations, gaps, and next steps.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
