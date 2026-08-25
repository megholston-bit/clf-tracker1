import React, { useState } from 'react';
import { Heart, Zap, Users, Target, TrendingUp, Save, Sparkles, Copy } from 'lucide-react';

export default function CLFHackathon() {
  const [activeTab, setActiveTab] = useState("context");
  const [preworkResponses, setPreworkResponses] = useState({
    problem: "",
    perception: "",
    opportunities: "",
    notes: "",
  });
  const [ideas, setIdeas] = useState([
    { 
      id: 1, 
      pair: "Pair 1", 
      title: "Idea Title",
      thesis: "",
      goToMarket: "",
      positioning: "",
      successMetrics: "",
      pitch: "",
      notes: "",
      votes: 0 
    },
    { 
      id: 2, 
      pair: "Pair 2", 
      title: "Idea Title",
      thesis: "",
      goToMarket: "",
      positioning: "",
      successMetrics: "",
      pitch: "",
      notes: "",
      votes: 0 
    },
    { 
      id: 3, 
      pair: "Pair 3", 
      title: "Idea Title",
      thesis: "",
      goToMarket: "",
      positioning: "",
      successMetrics: "",
      pitch: "",
      notes: "",
      votes: 0 
    },
    { 
      id: 4, 
      pair: "Pair 4", 
      title: "Idea Title",
      thesis: "",
      goToMarket: "",
      positioning: "",
      successMetrics: "",
      pitch: "",
      notes: "",
      votes: 0 
    },
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
  const [expandedIndividual, setExpandedIndividual] = useState(null);
  const [themes, setThemes] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedContext, setExpandedContext] = useState(null);

  const addVote = (id) => {
    setIdeas(ideas.map(idea => 
      idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea
    ));
  };

  const updateIdea = (id, field, value) => {
    setIdeas(ideas.map(idea =>
      idea.id === id ? { ...idea, [field]: value } : idea
    ));
  };

  const updateIndividual = (id, field, value) => {
    setIndividuals(individuals.map(person =>
      person.id === id ? { ...person, [field]: value } : person
    ));
  };

  const updateContext = (field, value) => {
    setContextResponses({
      ...contextResponses,
      [field]: value,
    });
  };

  const generateThemesAndSuggestions = async () => {
    setIsGenerating(true);
    
    // Prepare the ideas summary for Claude
    const ideaSummary = ideas
      .filter(idea => idea.title)
      .map(idea => ({
        pair: idea.pair,
        title: idea.title,
        thesis: idea.thesis,
        positioning: idea.positioning,
        successMetrics: idea.successMetrics,
      }))
      .map(idea => `
**${idea.pair}: ${idea.title}**
- Thesis: ${idea.thesis || 'N/A'}
- Positioning: ${idea.positioning || 'N/A'}
- Success Metrics: ${idea.successMetrics || 'N/A'}
      `)
      .join('\n');

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `You are a strategic advisor helping a VC fund (a16z's CLF) synthesize their hackathon ideas on how to reposition from "celebrity fund" to "culture-commerce operating partner."

Here are the four team pairs' repositioning ideas:

${ideaSummary}

Please provide:

1. **CONNECTIVE THEMES** (3-4 patterns that emerge across all ideas - what's the common thread?)
2. **STRONGEST ELEMENTS** (Which 2-3 specific ideas or components are most compelling and a16z-aligned?)
3. **SYNTHESIS RECOMMENDATION** (If you had to combine the best parts into ONE core repositioning, what would it be?)
4. **BIGGEST GAPS** (What's missing from these ideas that would make them more complete?)
5. **NEXT STEPS** (What's the minimum viable partnership or proof point to validate this?)

Be direct, specific, and think like a16z partner would think.`,
            }
          ],
        })
      });

      const data = await response.json();
      const content = data.content[0].text;
      
      // Parse the response into sections
      const sections = content.split(/\n(?=\d\.|###)/);
      setThemes({
        raw: content,
        sections: sections,
      });
      
      // Generate suggestions separately
      setSuggestions({
        synthesis: content.includes("SYNTHESIS") ? "Generated" : "Pending",
        gaps: content.includes("GAPS") ? "Generated" : "Pending",
        nextSteps: content.includes("NEXT STEPS") ? "Generated" : "Pending",
      });
    } catch (error) {
      console.error("Error generating themes:", error);
      setThemes({
        error: "Failed to generate analysis. Try again or enter analysis manually.",
      });
    }
    
    setIsGenerating(false);
  };

  const synthesizeIndividualBrainstorms = async () => {
    setIsSynthesizingIndividuals(true);

    const brainstormSummary = individuals
      .filter(person => person.brainstorm)
      .map(person => `
**${person.name}:**
${person.brainstorm}
      `)
      .join('\n');

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1200,
          messages: [
            {
              role: "user",
              content: `You are a strategic advisor analyzing brainstorms from an 8-person team at a16z's Cultural Leadership Fund (CLF) about how to reposition the fund for greater impact and visibility.

Here are the raw brainstorms from each team member:

${brainstormSummary}

Your job is to synthesize these raw ideas into insights that will prepare the team for pair work. Please provide:

1. **EMERGING THEMES** (What themes, patterns, or ideas keep coming up? What's the common thread across different people's thinking?)
2. **BOLD IDEAS** (What are the 3-4 boldest or most interesting repositioning ideas you're seeing?)
3. **COMMON CONCERNS** (What challenges or obstacles keep appearing?)
4. **AREAS OF AGREEMENT** (Where is the team already aligned?)
5. **PROVOCATIVE QUESTIONS** (What questions should the pairs dig into that came up in the brainstorms?)

Format this as a briefing memo that prepares the team to go into pair work aligned on insights but ready to deepen and challenge ideas. Be direct and specific.`,
            }
          ],
        })
      });

      const data = await response.json();
      const content = data.content[0].text;

      setIndividualSynthesis({
        raw: content,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (error) {
      console.error("Error synthesizing individual brainstorms:", error);
      setIndividualSynthesis({
        error: "Failed to synthesize. Try again or read brainstorms manually.",
      });
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

        {/* Context & Problem Tab */}
        {activeTab === "context" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 border border-blue-700 rounded-lg p-8">
              <h2 className="text-3xl font-bold text-white mb-3">Setting the Context for CLF's Next Chapter</h2>
              <p className="text-blue-100 text-lg">
                Before we ideate on CLF's future, let's align on our foundation and what we're seeing shift in the market. These questions help us understand what made CLF matter in the first place, and what opportunities we see ahead.
              </p>
            </div>

            <div className="space-y-6">
              {/* Question 1 */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-900 text-blue-100 rounded-full text-sm font-bold">1</span>
                  <h3 className="text-lg font-bold text-white">What is the core tenant that holds CLF together?</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4">
                  What's the foundational belief or mission that CLF was built on? What makes CLF matter? What's our north star?
                </p>
                <textarea
                  value={contextResponses.clfMoment}
                  onChange={(e) => updateContext("clfMoment", e.target.value)}
                  placeholder="e.g., 'Connecting cultural leaders with the technology ecosystem to build wealth and opportunity for Black communities', 'Culture is a competitive advantage in tech', 'Cultural credibility unlocks markets'..."
                  className="w-full bg-slate-700 text-white rounded p-4 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                />
              </div>

              {/* Question 2 */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex gap-2 mb-3">
                  <span className="px-3 py-1 bg-purple-900 text-purple-100 rounded-full text-sm font-bold">2</span>
                  <h3 className="text-lg font-bold text-white">What partnerships or moments have best embodied this?</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4">
                  What are 1-2 examples of CLF work that really showed what we're capable of? (Examples: Raspberry AI × Theophilio, Function Health × NBPA, Knicks × Doppel, Timothy Chalamet × Calchy)
                </p>
                <textarea
                  value={contextResponses.currentPerception}
                  onChange={(e) => updateContext("currentPerception", e.target.value)}
                  placeholder="Describe partnerships or initiatives that perfectly demonstrate CLF's impact and capability..."
                  className="w-full bg-slate-700 text-white rounded p-4 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                />
              </div>

              {/* Question 3 */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex gap-2 mb-3">
                  <span className="px-3 py-1 bg-green-900 text-green-100 rounded-full text-sm font-bold">3</span>
                  <h3 className="text-lg font-bold text-white">What shifts are we noticing in the market or the firm?</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4">
                  What trends, changes, or opportunities are we seeing that CLF is uniquely positioned to address? What's new or emerging that opens a door for us?
                </p>
                <textarea
                  value={contextResponses.desiredPerception}
                  onChange={(e) => updateContext("desiredPerception", e.target.value)}
                  placeholder="e.g., 'Portfolio companies are looking for cultural credibility to reach Gen Z', 'Founders care more about authentic GTM than celebrity endorsements', 'Culture is becoming central to every company's strategy'..."
                  className="w-full bg-slate-700 text-white rounded p-4 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                />
              </div>

              {/* Question 4 */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex gap-2 mb-3">
                  <span className="px-3 py-1 bg-orange-900 text-orange-100 rounded-full text-sm font-bold">4</span>
                  <h3 className="text-lg font-bold text-white">How is CLF perceived right now, and why?</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4">
                  What's the current narrative about CLF inside and outside a16z? What box are we in? What would people say CLF does?
                </p>
                <textarea
                  value={contextResponses.whyFading}
                  onChange={(e) => updateContext("whyFading", e.target.value)}
                  placeholder="e.g., 'We're seen as the celebrity/culture investor fund', 'People think we only do LP connects', 'We're considered a nice-to-have rather than essential'..."
                  className="w-full bg-slate-700 text-white rounded p-4 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                />
              </div>

              {/* Question 5 */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex gap-2 mb-3">
                  <span className="px-3 py-1 bg-pink-900 text-pink-100 rounded-full text-sm font-bold">5</span>
                  <h3 className="text-lg font-bold text-white">What do we want to be true about CLF in 12 months?</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4">
                  What's the narrative we want to own? What should partners, founders, and the market say about CLF? What's our aspiration?
                </p>
                <textarea
                  value={contextResponses.uniqueCapability}
                  onChange={(e) => updateContext("uniqueCapability", e.target.value)}
                  placeholder="e.g., 'CLF is essential to every founder's go-to-market strategy', 'We're the culture-commerce operating partner', 'When founders need cultural credibility, they think of CLF first'..."
                  className="w-full bg-slate-700 text-white rounded p-4 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                />
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap size={20} /> Context Summary
              </h3>
              <div className="space-y-4">
                {contextResponses.clfMoment && (
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="text-blue-300 text-xs font-semibold">CLF'S CORE TENANT</div>
                    <div className="text-white text-sm mt-1">{contextResponses.clfMoment}</div>
                  </div>
                )}
                {contextResponses.currentPerception && (
                  <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <div className="text-purple-300 text-xs font-semibold">PARTNERSHIP EXAMPLES</div>
                    <div className="text-white text-sm mt-1">{contextResponses.currentPerception}</div>
                  </div>
                )}
                {contextResponses.desiredPerception && (
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <div className="text-green-300 text-xs font-semibold">MARKET SHIFTS & OPPORTUNITIES</div>
                    <div className="text-white text-sm mt-1">{contextResponses.desiredPerception}</div>
                  </div>
                )}
                {contextResponses.whyFading && (
                  <div className="border-l-4 border-orange-500 pl-4 py-2">
                    <div className="text-orange-300 text-xs font-semibold">CURRENT PERCEPTION</div>
                    <div className="text-white text-sm mt-1">{contextResponses.whyFading}</div>
                  </div>
                )}
                {contextResponses.uniqueCapability && (
                  <div className="border-l-4 border-pink-500 pl-4 py-2">
                    <div className="text-pink-300 text-xs font-semibold">OUR ASPIRATION (12 MONTHS)</div>
                    <div className="text-white text-sm mt-1">{contextResponses.uniqueCapability}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Individual Ideas Tab */}
        {activeTab === "individual" && (
          <div className="space-y-6">
            <div className="bg-blue-900 border border-blue-700 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-white mb-2">Phase 1: Individual Brainstorm (25 min)</h3>
              <p className="text-blue-100 text-sm mb-3">
                Work solo with Claude/ChatGPT. Don't overthink it. Throw everything at it: half-formed ideas, questions, provocations, possibilities. What would change if CLF could do X? What if we owned Y positioning? What if we partnered with Z types of companies?
              </p>
              <p className="text-blue-100 text-sm">
                This is a brainstorm dump, not a final position. Write messy. Write multiple ideas. Write contradictions. We'll synthesize after.
              </p>
            </div>

            {/* Individual Brainstorm Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {individuals.map((person) => (
                <div key={person.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6 flex flex-col">
                  <div className="text-lg font-bold text-white mb-4 pb-3 border-b border-slate-700">
                    {person.name}
                  </div>
                  <textarea
                    value={person.brainstorm}
                    onChange={(e) => updateIndividual(person.id, "brainstorm", e.target.value)}
                    placeholder="Brainstorm everything: multiple ideas, questions, provocations, 'what ifs', concerns, observations, inspirations from other companies/funds, anything that comes to mind about repositioning CLF..."
                    className="w-full bg-slate-700 text-white rounded p-4 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 flex-grow font-mono resize-none"
                  />
                </div>
              ))}
            </div>

            {/* AI Synthesis Section */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles size={20} /> AI Synthesis from Individual Brainstorms
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

              <p className="text-slate-400 text-sm mb-4">
                Once everyone's finished brainstorming, click "Generate AI Insights" to have Claude extract themes, bold ideas, common concerns, and provocative questions from all the raw brainstorms. This preps everyone for pair work.
              </p>

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

              {individualSynthesis?.timestamp && (
                <div className="text-xs text-slate-400 mt-3">
                  Generated at {individualSynthesis.timestamp}
                </div>
              )}
            </div>

            {/* Raw Brainstorms Preview */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users size={20} /> Brainstorms at a Glance
              </h3>
              <div className="space-y-4">
                {individuals
                  .filter(p => p.brainstorm)
                  .map((person, idx) => (
                    <div key={person.id} className="border-l-4 border-purple-500 pl-4 py-3">
                      <div className="font-semibold text-white text-sm">{person.name}</div>
                      <div className="text-slate-300 text-sm mt-2 whitespace-pre-wrap line-clamp-4">
                        {person.brainstorm}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Pair Responses Tab */}
        {activeTab === "ideas" && (
          <div className="space-y-6">
            {ideas.map((idea) => (
              <div key={idea.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                {/* Header */}
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
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => setExpandedPair(expandedPair === idea.id ? null : idea.id)}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition"
                    >
                      {expandedPair === idea.id ? "Collapse" : "Expand"}
                    </button>
                    <button
                      onClick={() => addVote(idea.id)}
                      className={`p-3 rounded transition ${
                        idea.votes > 0
                          ? "bg-purple-900 text-purple-100"
                          : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                      }`}
                      title="Vote for this idea"
                    >
                      <Heart size={20} fill={idea.votes > 0 ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>

                {/* Vote count */}
                <div className="mb-4 inline-block px-3 py-1 bg-purple-900 text-purple-100 rounded text-sm font-semibold">
                  {idea.votes} votes
                </div>

                {/* Expanded Form */}
                {expandedPair === idea.id && (
                  <div className="space-y-5 mt-6">
                    {/* Thesis */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        1. The Thesis — What's the core capability/value prop?
                      </label>
                      <textarea
                        value={idea.thesis}
                        onChange={(e) => updateIdea(idea.id, "thesis", e.target.value)}
                        placeholder="What uniquely valuable capability does CLF have that portfolio needs?"
                        className="w-full bg-slate-700 text-white rounded p-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows="3"
                      />
                    </div>

                    {/* Go-to-Market */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        2. Go-to-Market — How do we activate this with portfolio? What's the proof point?
                      </label>
                      <textarea
                        value={idea.goToMarket}
                        onChange={(e) => updateIdea(idea.id, "goToMarket", e.target.value)}
                        placeholder="E.g., partnership with X company, approach 1-2 founders, test structure..."
                        className="w-full bg-slate-700 text-white rounded p-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows="3"
                      />
                    </div>

                    {/* Positioning/Brand */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        3. Positioning/Brand — What's our new name, brand, or positioning?
                      </label>
                      <textarea
                        value={idea.positioning}
                        onChange={(e) => updateIdea(idea.id, "positioning", e.target.value)}
                        placeholder="E.g., 'Cultural Strategy Partners', 'Go-to-Market through Culture', tagline, metaphor..."
                        className="w-full bg-slate-700 text-white rounded p-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows="3"
                      />
                    </div>

                    {/* Internal Pitch */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        4. Internal Pitch — 2-3 sentences to pitch a16z partners
                      </label>
                      <textarea
                        value={idea.pitch}
                        onChange={(e) => updateIdea(idea.id, "pitch", e.target.value)}
                        placeholder="What's the one thing you'd say that makes them go 'oh, I need this'?"
                        className="w-full bg-slate-700 text-white rounded p-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows="2"
                      />
                    </div>

                    {/* Success Metrics */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        5. Success Metrics — How do we measure impact in Year 1?
                      </label>
                      <textarea
                        value={idea.successMetrics}
                        onChange={(e) => updateIdea(idea.id, "successMetrics", e.target.value)}
                        placeholder="E.g., deal volume, founder satisfaction, $ attributed, portfolio velocity..."
                        className="w-full bg-slate-700 text-white rounded p-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows="2"
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        value={idea.notes}
                        onChange={(e) => updateIdea(idea.id, "notes", e.target.value)}
                        placeholder="Any other thoughts, risks, opportunities, or observations..."
                        className="w-full bg-slate-700 text-white rounded p-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows="2"
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <button
                        onClick={() => addVote(idea.id)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold transition flex items-center gap-2"
                      >
                        <Heart size={16} /> Vote for this idea
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(idea, null, 2));
                          alert("Copied to clipboard!");
                        }}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-semibold transition flex items-center gap-2"
                      >
                        <Copy size={16} /> Export
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Vote Summary */}
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

        {/* Themes & Analysis Tab */}
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

              <p className="text-slate-300 text-sm mb-4">
                Once you've filled in responses from all 4 pairs, click "Generate AI Analysis" to automatically extract themes, spot patterns, and get synthesis recommendations.
              </p>
            </div>

            {/* Manual Themes Entry */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap size={20} /> Key Themes (Editable)
              </h3>
              <textarea
                placeholder="List emerging themes, patterns, and insights from the pair responses..."
                defaultValue={themes?.raw || ""}
                className="w-full bg-slate-700 text-white rounded p-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                rows="8"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                  <Target size={18} /> Strongest Elements
                </h4>
                <p className="text-slate-400 text-sm mb-3">Which 2-3 ideas or components are most compelling?</p>
                <textarea
                  placeholder="E.g., 'Pair 2's thesis on proactive partnership development + Pair 3's success metrics framework'"
                  className="w-full bg-slate-700 text-white rounded p-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                />
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                  <Users size={18} /> Biggest Gaps
                </h4>
                <p className="text-slate-400 text-sm mb-3">What's missing or needs refinement?</p>
                <textarea
                  placeholder="E.g., 'No clear accountability owner', 'Need sector-specific strategies', 'ROI measurement unclear'"
                  className="w-full bg-slate-700 text-white rounded p-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                />
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                <Target size={18} /> First 60-Day Proof Point
              </h4>
              <textarea
                placeholder="What's the minimum viable partnership we could run in the next 60 days to validate this? E.g., 'Partner with [Company] on a cultural GTM initiative, measure X, present findings to partners'"
                className="w-full bg-slate-700 text-white rounded p-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
              />
            </div>
          </div>
        )}

        {/* AI Synthesis Tab */}
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
                  <button
                    onClick={generateThemesAndSuggestions}
                    disabled={isGenerating}
                    className={`px-6 py-3 rounded font-semibold transition flex items-center gap-2 mx-auto ${
                      isGenerating
                        ? "bg-slate-600 text-slate-300 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    <Sparkles size={18} />
                    {isGenerating ? "Generating..." : "Generate AI Analysis"}
                  </button>
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-900 border border-blue-700 rounded text-blue-100 text-sm">
                <strong>💡 How this works:</strong> The AI reads all 4 pairs' responses and identifies connective themes, strongest elements, synthesis recommendations, gaps, and next steps. It thinks like an a16z partner would.
              </div>
            </div>

            {suggestions && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-900 border border-green-700 rounded-lg p-4">
                  <h4 className="text-green-100 font-bold mb-2">✓ Themes</h4>
                  <p className="text-green-200 text-sm">{suggestions.synthesis}</p>
                </div>
                <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4">
                  <h4 className="text-yellow-100 font-bold mb-2">⚠ Gaps</h4>
                  <p className="text-yellow-200 text-sm">{suggestions.gaps}</p>
                </div>
                <div className="bg-purple-900 border border-purple-700 rounded-lg p-4">
                  <h4 className="text-purple-100 font-bold mb-2">→ Next Steps</h4>
                  <p className="text-purple-200 text-sm">{suggestions.nextSteps}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
