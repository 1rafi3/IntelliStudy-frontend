import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, MessageCircle, Sparkles, TrendingUp, Bookmark, 
  BarChart2, Menu, X, ArrowRight, Play, ChevronDown, Sparkle
} from 'lucide-react';
import { CTAButton } from '@components/ui/CTAButton';
import { FeatureCard } from '@components/ui/FeatureCard';

// ─── FAQ Interface ────────────────────────────────────────────────────────────
interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does IntelliStudy AI create study roadmaps?",
    answer: "IntelliStudy AI analyzes your target topic, current skill level, and learning goals to structure a step-by-step custom curriculum. It breaks complex subjects down into organized, logical modules."
  },
  {
    question: "Can I try IntelliStudy AI for free?",
    answer: "Yes, you can register and start creating your first study roadmap and chatting with your AI coach immediately at zero cost. No credit card required."
  },
  {
    question: "How does the AI Study Coach work?",
    answer: "Our AI Study Coach acts as a 24/7 personal tutor. You can ask clarifying questions, request explanations in simpler terms, trigger quick quizzes, or ask for real-world application examples."
  },
  {
    question: "Can I bookmark resources and track my streak?",
    answer: "Absolutely. The platform includes interactive progress metrics, study session logging, streaks, and bookmarks to keep your resources structured in one dashboard."
  }
];

export const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col selection:bg-primary-100 selection:text-primary-900">
      
      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-md h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-sm">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center shadow-sm">
              <span className="text-white font-extrabold text-base font-display">I</span>
            </div>
            <div className="leading-none">
              <span className="text-sm font-bold text-neutral-800">IntelliStudy</span>
              <span className="text-[10px] text-primary-500 font-medium block">Your AI Coach</span>
            </div>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-lg">
            <a href="#features" className="text-sm font-medium text-neutral-500 hover:text-neutral-800 transition-micro">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-neutral-500 hover:text-neutral-800 transition-micro">How It Works</a>
            <a href="#faq" className="text-sm font-medium text-neutral-500 hover:text-neutral-800 transition-micro">FAQ</a>
            <span className="text-xs font-semibold text-neutral-400 bg-neutral-100 px-xs py-2xs rounded-md">Pricing (Coming Soon)</span>
          </nav>

          {/* Auth Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-sm">
            <Link to="/login">
              <CTAButton variant="secondary" size="sm">Sign In</CTAButton>
            </Link>
            <Link to="/register">
              <CTAButton variant="primary" size="sm">Get Started</CTAButton>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-xs text-neutral-500 hover:text-neutral-800 focus:outline-none"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-neutral-200 px-md py-lg space-y-md overflow-hidden"
            >
              <div className="flex flex-col gap-sm">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-neutral-600 py-xs border-b border-neutral-100">Features</a>
                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-neutral-600 py-xs border-b border-neutral-100">How It Works</a>
                <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-neutral-600 py-xs border-b border-neutral-100">FAQ</a>
              </div>
              <div className="flex items-center justify-between gap-sm pt-xs">
                <Link to="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <CTAButton variant="secondary" className="w-full">Sign In</CTAButton>
                </Link>
                <Link to="/register" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <CTAButton variant="primary" className="w-full">Get Started</CTAButton>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Hero Section ────────────────────────────────────────────────────── */}
      <section className="py-xl md:py-2xl max-w-7xl mx-auto px-md w-full grid grid-cols-1 lg:grid-cols-12 gap-xl items-center">
        <div className="lg:col-span-6 space-y-md text-left">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-xs px-sm py-[6px] rounded-full bg-primary-50 text-primary-600 text-xs font-semibold"
          >
            <Sparkle size={14} className="animate-pulse" />
            <span>Next-Generation Learning Platform</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-4xl sm:text-5xl font-black text-neutral-800 tracking-tight leading-[1.1] font-display"
          >
            Your Personal <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">AI Learning</span> Coach
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-neutral-500 text-base md:text-lg leading-relaxed max-w-lg"
          >
            Break down complex topics, generate custom structured study roadmaps, and learn 10x faster with a personal AI coach.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-sm pt-xs"
          >
            <Link to="/register">
              <CTAButton variant="primary" size="lg" className="w-full sm:w-auto gap-sm">
                Start Learning Free <ArrowRight size={16} />
              </CTAButton>
            </Link>
            <a href="#how-it-works">
              <CTAButton variant="secondary" size="lg" className="w-full sm:w-auto gap-sm">
                <Play size={16} fill="currentColor" /> How It Works
              </CTAButton>
            </a>
          </motion.div>
        </div>

        {/* Abstract Hero Graphic */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-6 flex justify-center"
        >
          <div className="w-full max-w-md aspect-square bg-gradient-to-tr from-primary-100 to-accent-100 rounded-3xl relative overflow-hidden flex items-center justify-center p-lg shadow-inner border border-neutral-200/50">
            <div className="absolute inset-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-lg shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-xs">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="text-xs font-semibold text-neutral-400">Roadmap Generator</div>
              </div>
              <div className="space-y-sm my-md">
                <div className="h-6 w-3/4 bg-primary-100 rounded-lg animate-pulse" />
                <div className="space-y-xs">
                  <div className="h-4 w-full bg-neutral-100 rounded-md" />
                  <div className="h-4 w-5/6 bg-neutral-100 rounded-md" />
                  <div className="h-4 w-4/5 bg-neutral-100 rounded-md" />
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-neutral-100 pt-sm">
                <div className="flex items-center gap-xs">
                  <div className="w-6 h-6 rounded-full bg-primary-500 text-white text-[10px] flex items-center justify-center font-bold">AI</div>
                  <span className="text-xs font-semibold text-neutral-600">Curriculum generated!</span>
                </div>
                <span className="text-xs font-bold text-primary-600">100% complete</span>
              </div>
            </div>
            {/* Background decoration */}
            <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-accent-200/30 blur-2xl" />
            <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-primary-200/30 blur-2xl" />
          </div>
        </motion.div>
      </section>

      {/* ── Trusted By ──────────────────────────────────────────────────────── */}
      <section className="py-lg bg-white border-y border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-md">
          <p className="text-center text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-md">
            Helping students and developers build futures at
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md md:gap-lg items-center justify-items-center opacity-40 grayscale">
            <span className="text-md font-bold text-neutral-600 tracking-wider">HARVARD</span>
            <span className="text-md font-bold text-neutral-600 tracking-wider">MIT TECH</span>
            <span className="text-md font-bold text-neutral-600 tracking-wider">STANFORD</span>
            <span className="text-md font-bold text-neutral-600 tracking-wider">BERKELEY</span>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────────── */}
      <section id="features" className="py-2xl max-w-7xl mx-auto px-md w-full scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto space-y-xs mb-xl">
          <h2 className="text-xs font-bold text-primary-600 uppercase tracking-widest">Platform Core</h2>
          <p className="text-3xl font-bold tracking-tight text-neutral-800 font-display">Engineered For Ultra-Efficient Studying</p>
          <p className="text-neutral-500 text-sm">Everything you need to master topics from scratch with zero learning friction.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          <FeatureCard 
            title="AI Study Roadmap" 
            description="Input any skill, topic, or role and get a fully structured, modular learning roadmap generated instantly."
            icon={BookOpen} 
          />
          <FeatureCard 
            title="AI Study Coach" 
            description="Chat 24/7 with an AI coach that simplifies definitions, writes custom code, and tests your topic knowledge."
            icon={MessageCircle} 
          />
          <FeatureCard 
            title="Smart Recommendations" 
            description="Get handpicked books, videos, and articles relevant to your roadmap module without searching."
            icon={Sparkles} 
          />
          <FeatureCard 
            title="Progress Tracking" 
            description="Visualize modules, completed subjects, and target deadlines with intuitive progress charts."
            icon={TrendingUp} 
          />
          <FeatureCard 
            title="Global Bookmarks" 
            description="Save roadmap links, coach explanations, and resources into a single bookmarks board."
            icon={Bookmark} 
          />
          <FeatureCard 
            title="Study Analytics" 
            description="Monitor study speeds, weekly goals, and daily streak counts in a central dashboard."
            icon={BarChart2} 
          />
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-2xl bg-white border-y border-neutral-200/50 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-md w-full">
          <div className="text-center max-w-2xl mx-auto space-y-xs mb-xl">
            <h2 className="text-xs font-bold text-primary-600 uppercase tracking-widest">Workflow</h2>
            <p className="text-3xl font-bold tracking-tight text-neutral-800 font-display">How IntelliStudy Works</p>
            <p className="text-neutral-500 text-sm">Follow three easy steps to launch your intelligent learning space.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg max-w-4xl mx-auto relative">
            {/* Step 1 */}
            <div className="space-y-sm text-center relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-primary-500 text-white font-black font-display text-lg flex items-center justify-center mx-auto shadow-sm">
                1
              </div>
              <h3 className="font-bold text-neutral-800">Create Account</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">Sign up in seconds. Define your learning goals and preferred structure.</p>
            </div>

            {/* Step 2 */}
            <div className="space-y-sm text-center relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-primary-500 text-white font-black font-display text-lg flex items-center justify-center mx-auto shadow-sm">
                2
              </div>
              <h3 className="font-bold text-neutral-800">Generate Roadmap</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">Enter any topic. Our AI builds a customized syllabus tailored to you.</p>
            </div>

            {/* Step 3 */}
            <div className="space-y-sm text-center relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-primary-500 text-white font-black font-display text-lg flex items-center justify-center mx-auto shadow-sm">
                3
              </div>
              <h3 className="font-bold text-neutral-800">Learn with AI</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">Study each card module while interacting with your coach to test skills.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────────── */}
      <section className="py-2xl max-w-7xl mx-auto px-md w-full">
        <div className="text-center max-w-2xl mx-auto space-y-xs mb-xl">
          <h2 className="text-xs font-bold text-primary-600 uppercase tracking-widest">Feedback</h2>
          <p className="text-3xl font-bold tracking-tight text-neutral-800 font-display">Loved By Hundreds of Students</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {/* Card 1 */}
          <div className="bg-white border border-neutral-200/60 rounded-2xl p-md flex flex-col justify-between shadow-sm">
            <p className="text-neutral-500 text-sm leading-relaxed italic">
              "IntelliStudy AI changed how I prepare for technical exams. The study coach acts as a personal tutor that never runs out of explanations."
            </p>
            <div className="flex items-center gap-xs pt-md border-t border-neutral-100 mt-md">
              <div className="w-8 h-8 rounded-full bg-neutral-200 font-bold text-xs flex items-center justify-center text-neutral-600">
                JD
              </div>
              <div className="leading-none">
                <p className="text-xs font-bold text-neutral-800">John Doe</p>
                <p className="text-[10px] text-neutral-400 font-medium">Computer Science Student</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-neutral-200/60 rounded-2xl p-md flex flex-col justify-between shadow-sm">
            <p className="text-neutral-500 text-sm leading-relaxed italic">
              "The structured roadmaps are incredible. Instead of drowning in bookmark lists, I got a clean, customized path that I completed in 3 weeks."
            </p>
            <div className="flex items-center gap-xs pt-md border-t border-neutral-100 mt-md">
              <div className="w-8 h-8 rounded-full bg-neutral-200 font-bold text-xs flex items-center justify-center text-neutral-600">
                SC
              </div>
              <div className="leading-none">
                <p className="text-xs font-bold text-neutral-800">Sarah Chen</p>
                <p className="text-[10px] text-neutral-400 font-medium">Junior Web Developer</p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-neutral-200/60 rounded-2xl p-md flex flex-col justify-between shadow-sm">
            <p className="text-neutral-500 text-sm leading-relaxed italic">
              "Creating roadmaps is fast, but the smart recommendations feature is what saves my time. Bookmarking resources directly into cards is perfect."
            </p>
            <div className="flex items-center gap-xs pt-md border-t border-neutral-100 mt-md">
              <div className="w-8 h-8 rounded-full bg-neutral-200 font-bold text-xs flex items-center justify-center text-neutral-600">
                MR
              </div>
              <div className="leading-none">
                <p className="text-xs font-bold text-neutral-800">Michael Ross</p>
                <p className="text-[10px] text-neutral-400 font-medium">Systems Engineer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ─────────────────────────────────────────────────────── */}
      <section id="faq" className="py-2xl bg-white border-y border-neutral-200/50 scroll-mt-16">
        <div className="max-w-3xl mx-auto px-md w-full">
          <div className="text-center space-y-xs mb-xl">
            <h2 className="text-xs font-bold text-primary-600 uppercase tracking-widest">Help Center</h2>
            <p className="text-3xl font-bold tracking-tight text-neutral-800 font-display">Frequently Asked Questions</p>
          </div>

          <div className="space-y-sm">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="border border-neutral-200/60 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-md py-sm bg-neutral-50/50 hover:bg-neutral-50 flex items-center justify-between text-left font-semibold text-neutral-700 transition-micro"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown size={18} className={`text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-md py-sm border-t border-neutral-200/60 text-sm text-neutral-500 leading-relaxed bg-white">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────────────── */}
      <section className="py-2xl max-w-5xl mx-auto px-md w-full text-center">
        <div className="bg-gradient-to-tr from-primary-600 to-accent-600 rounded-3xl p-xl text-white shadow-lg space-y-md relative overflow-hidden">
          {/* Background circles */}
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/5 blur-xl" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-white/5 blur-xl" />

          <div className="space-y-xs max-w-xl mx-auto relative z-10">
            <h2 className="text-3xl font-extrabold tracking-tight font-display">Ready To Supercharge Your Learning?</h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Create roadmaps, track sessions, and test skills with an interactive coach designed to build mastery from day one.
            </p>
          </div>
          <div className="pt-xs relative z-10">
            <Link to="/register">
              <CTAButton variant="secondary" size="lg" className="shadow-md bg-white hover:bg-neutral-100 text-primary-600 font-extrabold">
                Get Started For Free
              </CTAButton>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-neutral-200 py-xl mt-auto">
        <div className="max-w-7xl mx-auto px-md grid grid-cols-1 md:grid-cols-12 gap-lg justify-between items-start">
          <div className="md:col-span-4 space-y-xs">
            <div className="flex items-center gap-sm">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center">
                <span className="text-white font-extrabold text-base">I</span>
              </div>
              <span className="text-sm font-bold text-neutral-800">IntelliStudy</span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-xs">
              Next-generation AI platform helping students and developers outline study strategies and fast-track learning.
            </p>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-md md:justify-items-end w-full">
            <div className="space-y-xs">
              <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-widest">Platform</h4>
              <div className="flex flex-col gap-2xs text-xs text-neutral-500">
                <a href="#features" className="hover:text-neutral-800">Features</a>
                <a href="#how-it-works" className="hover:text-neutral-800">How It Works</a>
              </div>
            </div>

            <div className="space-y-xs">
              <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-widest">Help</h4>
              <div className="flex flex-col gap-2xs text-xs text-neutral-500">
                <a href="#faq" className="hover:text-neutral-800">FAQ</a>
                <span className="text-neutral-400">Support</span>
              </div>
            </div>

            <div className="space-y-xs">
              <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-widest">Legal</h4>
              <div className="flex flex-col gap-2xs text-xs text-neutral-500">
                <span className="text-neutral-400">Privacy</span>
                <span className="text-neutral-400">Terms</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-md border-t border-neutral-100 pt-md mt-lg flex flex-col sm:flex-row items-center justify-between gap-sm text-xs text-neutral-400">
          <p>© 2026 IntelliStudy AI. All rights reserved.</p>
          <div className="flex items-center gap-md">
            <span>Twitter</span>
            <span>GitHub</span>
            <span>Discord</span>
          </div>
        </div>
      </footer>
      
    </div>
  );
};
export default LandingPage;
