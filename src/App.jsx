import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Main App Component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

// Landing Page Component
const LandingPage = () => {
  const navigate = useNavigate();
  const [beatsMode, setBeatsMode] = useState(false);
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const terminalRef = useRef(null);
  const featureCardsRef = useRef([]);
  const beatBarsRef = useRef([]);
  const floatingElementsRef = useRef([]);
  const tl = useRef(null);

  useEffect(() => {
    // Ensure everything is visible
    gsap.set(containerRef.current, { autoAlpha: 1 });
    
    // Create master timeline
    tl.current = gsap.timeline();
    
    // Header entrance with glow effect
    tl.current.fromTo(titleRef.current,
      { 
        opacity: 0,
        scale: 0.8,
        filter: 'blur(10px)'
      },
      {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power3.out'
      }
    );

    // Hero section staggered entrance
    tl.current.fromTo('.hero-text h1',
      { 
        opacity: 0,
        y: 100,
        rotationX: 90 
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 1.5,
        ease: 'back.out(1.7)',
        stagger: 0.2
      },
      '-=0.8'
    );

    // Code terminal typing effect
    const codeLines = terminalRef.current?.querySelectorAll('.code-line');
    if (codeLines) {
      tl.current.fromTo(codeLines,
        { 
          opacity: 0,
          x: -50,
          filter: 'blur(5px)'
        },
        {
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out'
        },
        '-=0.5'
      );
    }

    // Create floating elements
    createFloatingElements();

    // Animate feature cards on scroll
    featureCardsRef.current.forEach((card, i) => {
      if (card) {
        gsap.fromTo(card,
          {
            opacity: 0,
            y: 100,
            rotationY: 45,
            scale: 0.8
          },
          {
            opacity: 1,
            y: 0,
            rotationY: 0,
            scale: 1,
            duration: 1,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            },
            delay: i * 0.1,
            ease: 'back.out(1.7)'
          }
        );

        // Hover effect
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.05,
            y: -10,
            rotationY: 5,
            duration: 0.3,
            ease: 'power2.out',
            boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)'
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            y: 0,
            rotationY: 0,
            duration: 0.3,
            ease: 'power2.out',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
          });
        });
      }
    });

    // Animate beat bars continuously
    const animateBeatBars = () => {
      if (beatsMode && beatBarsRef.current.length > 0) {
        beatBarsRef.current.forEach((bar, i) => {
          if (bar) {
            gsap.to(bar, {
              height: () => `${40 + Math.random() * 120}px`,
              duration: 0.3,
              repeat: -1,
              yoyo: true,
              ease: 'power2.inOut',
              delay: i * 0.02
            });
          }
        });
      }
    };

    if (beatsMode) animateBeatBars();

    // Scroll-triggered header effect
    gsap.to('header', {
      backgroundColor: 'rgba(17, 24, 39, 0.98)',
      backdropFilter: 'blur(20px)',
      paddingTop: '1rem',
      paddingBottom: '1rem',
      duration: 0.5,
      scrollTrigger: {
        trigger: document.body,
        start: '100px top',
        end: 'bottom top',
        scrub: true
      }
    });

    // Parallax effect for hero
    gsap.to('.hero-visual', {
      y: () => -window.scrollY * 0.1,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      tl.current?.kill();
    };
  }, [beatsMode]);

  const createFloatingElements = () => {
    const elements = [];
    for (let i = 0; i < 15; i++) {
      const el = document.createElement('div');
      el.className = 'floating-element';
      el.style.cssText = `
        position: fixed;
        width: ${gsap.utils.random(20, 60)}px;
        height: ${gsap.utils.random(20, 60)}px;
        background: linear-gradient(45deg, 
          rgba(${gsap.utils.random(139, 200)}, ${gsap.utils.random(92, 150)}, 246, 0.1),
          rgba(16, 185, 129, 0.1)
        );
        border-radius: ${gsap.utils.random(0, 50)}%;
        left: ${gsap.utils.random(0, 100)}%;
        top: ${gsap.utils.random(0, 100)}%;
        z-index: -1;
        pointer-events: none;
      `;
      document.querySelector('.floating-container')?.appendChild(el);
      elements.push(el);

      gsap.to(el, {
        x: gsap.utils.random(-100, 100),
        y: gsap.utils.random(-100, 100),
        rotation: gsap.utils.random(0, 360),
        duration: gsap.utils.random(3, 8),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
    floatingElementsRef.current = elements;
  };

  const handleLogin = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      onComplete: () => navigate('/login')
    });
  };

  const handleSignup = () => {
    const button = event?.currentTarget;
    if (button) {
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            rotateY: 90,
            duration: 0.6,
            onComplete: () => navigate('/signup')
          });
        }
      });
    }
  };

  const features = [
    {
      icon: '🎮',
      title: 'Interactive Challenges',
      description: 'Solve real-world coding problems with instant feedback.'
    },
    {
      icon: '🏆',
      title: 'Achievements & Rewards',
      description: 'Unlock badges and earn special titles for completing milestones.'
    },
    {
      icon: '📈',
      title: 'Progress Tracking',
      description: 'Visualize your coding journey with detailed stats and skill graphs.'
    },
    {
      icon: '👥',
      title: 'Multiplayer Mode',
      description: 'Challenge friends to coding duels and climb global leaderboards.'
    },
    {
      icon: '💼',
      title: 'Real Projects',
      description: 'Build actual applications and games for your portfolio.'
    },
    {
      icon: '🎵',
      title: 'Beats Mode',
      description: 'Code to the rhythm with immersive audio-visual experiences.'
    }
  ];

  const toggleBeatsMode = () => {
    if (!beatsMode) {
      // Enter beats mode
      gsap.to('body', {
        background: 'linear-gradient(45deg, #0f0c29, #302b63, #24243e)',
        duration: 1,
        ease: 'power2.inOut'
      });
      
      // Pulse effect
      gsap.to('.beats-mode-section', {
        scale: 1.02,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    } else {
      // Exit beats mode
      gsap.to('body', {
        background: '#111827',
        duration: 1,
        ease: 'power2.inOut'
      });
      gsap.killTweensOf('.beats-mode-section');
    }
    setBeatsMode(!beatsMode);
  };

  return (
    <div ref={containerRef} className="landing-page min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Floating elements container */}
      <div className="floating-container fixed inset-0 z-0 pointer-events-none"></div>

      {/* Header */}
      <header className="fixed top-0 w-full py-6 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-purple-600/30">
        <div className="container mx-auto px-6">
          <nav className="flex justify-between items-center">
            <div ref={titleRef} className="text-3xl font-bold font-['Orbitron'] bg-gradient-to-r from-purple-600 via-emerald-500 to-amber-500 bg-clip-text text-transparent animate-gradient">
              Code<span className="text-amber-500">Quest</span>
            </div>
            <div className="hidden md:flex gap-8">
              {['Features', 'Challenges', 'Leaderboard', 'Community'].map((item, i) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-200 hover:text-purple-400 font-semibold transition-colors duration-300 relative group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>
            <div className="flex gap-4 items-center">
              <button 
                onClick={handleLogin}
                className="px-6 py-3 border-2 border-purple-600 text-white rounded-xl font-semibold hover:bg-purple-600/20 hover:border-purple-500 hover:scale-105 transition-all duration-300 group relative overflow-hidden"
              >
                <span className="relative z-10">Log In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-purple-600/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
              </button>
              <button 
                onClick={handleSignup}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-emerald-500 text-white rounded-xl font-bold font-['Orbitron'] tracking-wider shadow-lg hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">Start Coding Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="hero pt-48 pb-32 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="hero-text lg:w-1/2">
              <h1 className="text-6xl lg:text-7xl font-bold font-['Orbitron'] mb-8 leading-tight">
                Level Up Your <span className="bg-gradient-to-r from-purple-600 via-emerald-500 to-amber-500 bg-clip-text text-transparent animate-gradient">Coding Skills</span> Through Play
              </h1>
              <p className="text-2xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
                CodeQuest transforms learning to code into an exciting adventure. Solve challenges, earn XP, unlock achievements, and compete with friends on your journey to becoming a coding master.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 mt-12">
                <button 
                  onClick={handleSignup}
                  className="px-10 py-5 bg-gradient-to-r from-purple-600 to-emerald-500 text-white rounded-2xl font-bold font-['Orbitron'] text-xl shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 relative group overflow-hidden"
                >
                  <span className="relative z-10">Start Your Quest</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </button>
                <button 
                  onClick={() => {
                    const demoBtn = event?.currentTarget;
                    gsap.to(demoBtn, {
                      scale: 0.95,
                      duration: 0.1,
                      yoyo: true,
                      repeat: 1,
                      onComplete: () => alert('Opening demo video...')
                    });
                  }}
                  className="px-10 py-5 border-3 border-purple-600 text-purple-400 rounded-2xl font-bold font-['Orbitron'] text-xl hover:bg-purple-600/10 hover:border-purple-500 transition-all duration-300"
                >
                  Watch Demo
                </button>
              </div>
              <div className="mt-16 flex items-center gap-8">
                <div className="flex">
                  {['JS', 'PY', 'C++'].map((lang, i) => (
                    <div 
                      key={lang}
                      className="w-14 h-14 bg-gradient-to-br from-purple-600 to-emerald-500 rounded-full flex items-center justify-center border-4 border-gray-900 font-bold shadow-lg"
                      style={{ marginLeft: i > 0 ? '-12px' : '0' }}
                    >
                      {lang}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-gray-400 text-lg">
                    Join <strong className="text-white">25,000+</strong> developers leveling up their skills
                  </p>
                </div>
              </div>
            </div>
            <div className="hero-visual lg:w-1/2">
              <div ref={terminalRef} className="code-terminal bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-purple-600/30 transform perspective-1000">
                <div className="flex gap-3 mb-8">
                  <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg"></div>
                  <div className="w-4 h-4 bg-amber-500 rounded-full shadow-lg"></div>
                  <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-lg"></div>
                </div>
                <div className="font-mono text-base space-y-3">
                  <div className="code-line text-purple-400">function <span className="text-emerald-400">solveChallenge</span>() {'{'}</div>
                  <div className="code-line ml-6 text-purple-400">const xp = <span className="text-emerald-400">calculateXP</span>();</div>
                  <div className="code-line ml-6 text-purple-400">const levelUp = xp &gt; <span className="text-amber-500">1000</span>;</div>
                  <div className="code-line ml-6"></div>
                  <div className="code-line ml-6 text-purple-400">if (levelUp) {'{'}</div>
                  <div className="code-line ml-12 text-emerald-400">unlockAchievement<span className="text-amber-500">("Code Master")</span>;</div>
                  <div className="code-line ml-12 text-emerald-400">addToLeaderboard();</div>
                  <div className="code-line ml-6">{'}'}</div>
                  <div className="code-line">{'}'}</div>
                  <div className="code-line text-gray-500 mt-4">// Earn 150 XP for solving this challenge!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features py-28 bg-gradient-to-b from-gray-900 to-gray-800/50" id="features">
        <div className="container mx-auto px-6">
          <h2 className="section-title text-5xl font-bold font-['Orbitron'] text-center mb-20 relative">
            <span className="bg-gradient-to-r from-purple-600 to-emerald-500 bg-clip-text text-transparent">Game Features</span>
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-4 w-32 h-1.5 bg-gradient-to-r from-purple-600 to-emerald-500 rounded-full"></div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div 
                key={index}
                ref={el => featureCardsRef.current[index] = el}
                className="feature-card bg-gray-800/30 backdrop-blur-lg rounded-3xl p-10 border border-purple-600/20 transform-gpu"
              >
                <div className="text-5xl mb-8 transform-gpu">{feature.icon}</div>
                <h3 className="text-2xl font-bold font-['Orbitron'] mb-6">{feature.title}</h3>
                <p className="text-gray-300 text-lg leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beats Mode Section */}
      <section className="beats-mode-section py-28 text-center bg-gradient-to-b from-gray-800/50 to-gray-900" id="beatsMode">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold font-['Orbitron'] mb-8">
            <span className="bg-gradient-to-r from-purple-600 to-emerald-500 bg-clip-text text-transparent">Beats Mode</span>
          </h2>
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto mb-16 leading-relaxed">
            Turn up the energy! Code to the rhythm with visual effects that sync to your music. Activate Beats Mode for an immersive coding experience.
          </p>
          
          <div className="inline-flex bg-gray-800/50 backdrop-blur-lg rounded-full p-2 border-2 border-purple-600/50 mb-16">
            <button 
              className={`px-10 py-4 rounded-full font-bold font-['Orbitron'] text-lg transition-all duration-300 relative overflow-hidden ${
                beatsMode 
                  ? 'bg-gradient-to-r from-purple-600 to-emerald-500 text-white shadow-2xl' 
                  : 'bg-transparent text-gray-400 hover:text-white'
              }`}
              onClick={toggleBeatsMode}
            >
              <span className="relative z-10">Beats ON</span>
              {beatsMode && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-purple-600 animate-pulse"></div>
              )}
            </button>
            <button 
              className={`px-10 py-4 rounded-full font-bold font-['Orbitron'] text-lg transition-all duration-300 ${
                !beatsMode 
                  ? 'bg-gradient-to-r from-purple-600 to-emerald-500 text-white shadow-2xl' 
                  : 'bg-transparent text-gray-400 hover:text-white'
              }`}
              onClick={toggleBeatsMode}
            >
              Beats OFF
            </button>
          </div>
          
          <div className="beats-visual h-64 flex items-end justify-center gap-2 mb-10">
            {Array.from({ length: 40 }).map((_, index) => (
              <div 
                key={index}
                ref={el => beatBarsRef.current[index] = el}
                className="beat-bar w-4 bg-gradient-to-t from-purple-600 via-emerald-500 to-amber-500 rounded-t-2xl shadow-lg"
                style={{
                  height: '100px'
                }}
              />
            ))}
          </div>
          
          {/* Audio visualizer effect */}
          <div className="relative h-2 w-full max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-emerald-500/20 rounded-full"></div>
            <div className={`absolute inset-0 bg-gradient-to-r from-purple-600 to-emerald-500 rounded-full transition-all duration-300 ${beatsMode ? 'animate-pulse' : ''}`}></div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section py-28 text-center bg-gradient-to-br from-purple-600/10 via-gray-900 to-emerald-500/10">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold font-['Orbitron'] mb-8">
            Ready to Begin Your <span className="bg-gradient-to-r from-purple-600 to-emerald-500 bg-clip-text text-transparent">Coding Adventure</span>?
          </h2>
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto mb-16 leading-relaxed">
            Join thousands of developers who are leveling up their skills through play.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <button 
              onClick={handleSignup}
              className="px-12 py-6 bg-gradient-to-r from-purple-600 to-emerald-500 text-white rounded-2xl font-bold font-['Orbitron'] text-xl shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Start Free Trial</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
            <button 
              onClick={handleLogin}
              className="px-12 py-6 border-3 border-purple-600 text-purple-400 rounded-2xl font-bold font-['Orbitron'] text-xl hover:bg-purple-600/10 hover:border-purple-500 hover:scale-105 transition-all duration-300"
            >
              Log In to Continue
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-purple-600/30 pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 mb-16">
            <div>
              <div className="text-3xl font-bold font-['Orbitron'] bg-gradient-to-r from-purple-600 to-emerald-500 bg-clip-text text-transparent mb-8">
                Code<span className="text-amber-500">Quest</span>
              </div>
              <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                Gamified coding platform designed to make learning to code fun, engaging, and effective for developers of all levels.
              </p>
              <div className="flex gap-5">
                {['🐦', '💬', '🐱', '📺'].map((icon, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="w-12 h-12 bg-gray-800/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-600 hover:to-emerald-500 hover:scale-110 transition-all duration-300 transform-gpu"
                    onMouseEnter={(e) => {
                      gsap.to(e.currentTarget, {
                        rotation: 360,
                        duration: 0.5,
                        ease: 'back.out(1.7)'
                      });
                    }}
                  >
                    <span className="text-xl">{icon}</span>
                  </a>
                ))}
              </div>
            </div>
            
            {[
              { title: 'Platform', items: ['Challenges', 'Leaderboard', 'Achievements', 'Community'] },
              { title: 'Languages', items: ['JavaScript', 'Python', 'Java', 'C++'] },
              { title: 'Company', items: ['About Us', 'Careers', 'Blog', 'Contact'] }
            ].map((section, idx) => (
              <div key={idx}>
                <h3 className="text-2xl font-bold font-['Orbitron'] mb-8">{section.title}</h3>
                <ul className="space-y-5">
                  {section.items.map((item) => (
                    <li key={item}>
                      <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 text-lg group flex items-center">
                        <span className="w-2 h-2 bg-gradient-to-r from-purple-600 to-emerald-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 pt-10 text-center">
            <p className="text-gray-500 text-lg">
              &copy; 2023 CodeQuest. All rights reserved. | Level up your coding skills through play!
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-gpu {
          transform: translateZ(0);
        }
      `}</style>
    </div>
  );
};

// Login Page Component with enhanced animations
const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const sidePanelRef = useRef(null);

  useEffect(() => {
    gsap.set(containerRef.current, { autoAlpha: 1 });
    
    const tl = gsap.timeline();
    
    // Page entrance with 3D flip
    tl.fromTo(containerRef.current,
      {
        rotationY: -90,
        opacity: 0,
        scale: 0.8
      },
      {
        rotationY: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'back.out(1.7)'
      }
    );

    // Form elements staggered entrance
    tl.fromTo('.form-element',
      {
        opacity: 0,
        y: 50,
        filter: 'blur(10px)'
      },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      },
      '-=0.5'
    );

    // Side panel glow effect
    tl.fromTo(sidePanelRef.current,
      {
        backgroundPosition: '200% 200%'
      },
      {
        backgroundPosition: '0% 0%',
        duration: 2,
        ease: 'power2.inOut'
      },
      '-=0.3'
    );

    // Input focus effects
    const inputs = formRef.current?.querySelectorAll('input');
    inputs?.forEach(input => {
      input.addEventListener('focus', () => {
        gsap.to(input, {
          scale: 1.02,
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      input.addEventListener('blur', () => {
        gsap.to(input, {
          scale: 1,
          boxShadow: '0 0 0px rgba(139, 92, 246, 0)',
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

    return () => tl.kill();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const button = e.target.querySelector('button[type="submit"]');
    gsap.to(button, {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        // Particle burst effect
        for (let i = 0; i < 20; i++) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          particle.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: linear-gradient(45deg, #8b5cf6, #10b981);
            border-radius: 50%;
            left: ${button.getBoundingClientRect().left + button.offsetWidth / 2}px;
            top: ${button.getBoundingClientRect().top + button.offsetHeight / 2}px;
            pointer-events: none;
            z-index: 1000;
          `;
          document.body.appendChild(particle);

          gsap.to(particle, {
            x: gsap.utils.random(-100, 100),
            y: gsap.utils.random(-100, 100),
            opacity: 0,
            scale: 0,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => particle.remove()
          });
        }

        console.log('Login data:', formData);
        localStorage.setItem('codequest_token', 'mock_token');
        
        // Page exit animation
        gsap.to(containerRef.current, {
          rotationY: 90,
          opacity: 0,
          duration: 0.8,
          onComplete: () => navigate('/dashboard')
        });
      }
    });
  };

  return (
    <div ref={containerRef} className="login-page min-h-screen bg-gray-900 flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div ref={formRef} className="max-w-lg w-full">
          <div className="text-center mb-12 form-element">
            <div className="text-4xl font-bold font-['Orbitron'] bg-gradient-to-r from-purple-600 to-emerald-500 bg-clip-text text-transparent mb-6 animate-gradient">
              Code<span className="text-amber-500">Quest</span>
            </div>
            <h1 className="text-4xl font-bold font-['Orbitron'] mb-4">Welcome Back, Adventurer!</h1>
            <p className="text-gray-400 text-xl">Sign in to continue your coding journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="form-element">
              <label className="block text-gray-300 mb-4 font-semibold text-lg">📧 Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="coder@example.com"
                required
                className="w-full px-6 py-4 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700 rounded-2xl text-white focus:outline-none focus:border-purple-600 transition-all duration-300 text-lg"
              />
            </div>

            <div className="form-element">
              <label className="block text-gray-300 mb-4 font-semibold text-lg">🔒 Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-6 py-4 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700 rounded-2xl text-white focus:outline-none focus:border-purple-600 transition-all duration-300 text-lg"
              />
            </div>

            <div className="form-element flex justify-between items-center">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-6 h-6 text-purple-600 rounded focus:ring-2 focus:ring-purple-600 cursor-pointer opacity-0 absolute"
                  />
                  <div className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-all duration-300 ${formData.rememberMe ? 'bg-purple-600 border-purple-600' : 'border-gray-600 group-hover:border-purple-500'}`}>
                    {formData.rememberMe && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-gray-300 text-lg group-hover:text-white transition-colors duration-300">Remember me</span>
              </label>
              <a href="#" className="text-purple-400 hover:text-purple-300 text-lg font-semibold transition-colors duration-300">Forgot password?</a>
            </div>

            <button 
              type="submit"
              className="form-element w-full py-5 bg-gradient-to-r from-purple-600 to-emerald-500 text-white rounded-2xl font-bold font-['Orbitron'] text-xl hover:opacity-90 transition-opacity duration-300 relative overflow-hidden group shadow-2xl"
            >
              <span className="relative z-10">Sign In to Quest</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>

            <div className="form-element relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-6 bg-gray-900 text-gray-400 text-lg">Or continue with</span>
              </div>
            </div>

            <div className="form-element grid grid-cols-2 gap-6">
              <button 
                type="button"
                className="py-4 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-700/50 hover:border-purple-500 transition-all duration-300 group text-lg"
                onClick={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1
                  });
                }}
              >
                <span className="text-2xl">G</span> Google
              </button>
              <button 
                type="button"
                className="py-4 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-700/50 hover:border-purple-500 transition-all duration-300 group text-lg"
                onClick={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1
                  });
                }}
              >
                <span className="text-2xl">🐱</span> GitHub
              </button>
            </div>

            <div className="form-element text-center space-y-6 mt-12">
              <p className="text-gray-400 text-lg">
                New to CodeQuest? <Link to="/signup" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors duration-300">Create an account</Link>
              </p>
              <p>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-300 text-lg flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Home
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Side Panel */}
      <div 
        ref={sidePanelRef}
        className="login-side-panel hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 via-gray-900 to-emerald-500 bg-[length:200%_200%] p-16 items-center justify-center"
        style={{ backgroundSize: '200% 200%' }}
      >
        <div className="max-w-xl text-white">
          <h2 className="text-5xl font-bold font-['Orbitron'] mb-8">Continue Your Adventure</h2>
          <p className="text-2xl mb-16">Pick up where you left off and continue leveling up your coding skills.</p>
          
          <div className="space-y-12">
            {[
              { icon: '🏆', title: 'Track Your Progress', desc: 'Check your achievements and XP gained' },
              { icon: '👥', title: 'Join Challenges', desc: 'Compete with friends on the leaderboard' },
              { icon: '🎮', title: 'Unlock New Levels', desc: 'Access advanced coding challenges' }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-6 group cursor-pointer">
                <div className="text-4xl transform-gpu group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">{item.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-emerald-400 transition-all duration-300">{item.title}</h3>
                  <p className="text-gray-100 text-lg">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Signup Page Component with enhanced animations
const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    skillLevel: 'beginner',
    acceptTerms: false
  });
  const containerRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    gsap.set(containerRef.current, { autoAlpha: 1 });
    
    const tl = gsap.timeline();
    
    // Page entrance with 3D rotation
    tl.fromTo(containerRef.current,
      {
        rotationX: -90,
        opacity: 0,
        scale: 0.8
      },
      {
        rotationX: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'back.out(1.7)'
      }
    );

    // Form elements wave entrance
    tl.fromTo('.signup-form > *',
      {
        opacity: 0,
        y: 80,
        rotationX: 45
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      },
      '-=0.5'
    );

    // Skill level selector animation
    const select = formRef.current?.querySelector('select');
    if (select) {
      select.addEventListener('change', (e) => {
        gsap.to(e.target, {
          scale: 1.05,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out'
        });
      });
    }

    return () => tl.kill();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const button = e.target.querySelector('button[type="submit"]');
    
    // Ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.cssText = `
      position: absolute;
      width: 100px;
      height: 100px;
      background: rgba(139, 92, 246, 0.3);
      border-radius: 50%;
      left: ${e.clientX - button.getBoundingClientRect().left - 50}px;
      top: ${e.clientY - button.getBoundingClientRect().top - 50}px;
      pointer-events: none;
      z-index: 1;
    `;
    button.appendChild(ripple);

    gsap.to(ripple, {
      scale: 10,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => ripple.remove()
    });

    gsap.to(button, {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        console.log('Signup data:', formData);
        localStorage.setItem('codequest_token', 'mock_token');
        
        // Confetti effect
        for (let i = 0; i < 50; i++) {
          const confetti = document.createElement('div');
          confetti.className = 'confetti';
          confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: linear-gradient(45deg, #8b5cf6, #10b981, #f59e0b);
            border-radius: 2px;
            left: ${button.getBoundingClientRect().left + button.offsetWidth / 2}px;
            top: ${button.getBoundingClientRect().top + button.offsetHeight / 2}px;
            pointer-events: none;
            z-index: 1000;
          `;
          document.body.appendChild(confetti);

          gsap.to(confetti, {
            x: gsap.utils.random(-300, 300),
            y: gsap.utils.random(-300, 300),
            rotation: gsap.utils.random(0, 720),
            opacity: 0,
            scale: 0,
            duration: 1.5,
            ease: 'power2.out',
            onComplete: () => confetti.remove()
          });
        }

        // Page exit with particle trail
        gsap.to(containerRef.current, {
          y: -100,
          opacity: 0,
          rotation: 10,
          duration: 0.8,
          onComplete: () => navigate('/dashboard')
        });
      }
    });
  };

  return (
    <div ref={containerRef} className="signup-page min-h-screen bg-gray-900 flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div ref={formRef} className="max-w-lg w-full">
          <div className="text-center mb-12">
            <div className="text-4xl font-bold font-['Orbitron'] bg-gradient-to-r from-purple-600 to-emerald-500 bg-clip-text text-transparent mb-6 animate-gradient">
              Code<span className="text-amber-500">Quest</span>
            </div>
            <h1 className="text-4xl font-bold font-['Orbitron'] mb-4">Start Your Coding Adventure!</h1>
            <p className="text-gray-400 text-xl">Create your account to begin leveling up</p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form space-y-8">
            <div>
              <label className="block text-gray-300 mb-4 font-semibold text-lg">👤 Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="CodeWarrior42"
                required
                className="w-full px-6 py-4 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700 rounded-2xl text-white focus:outline-none focus:border-purple-600 transition-all duration-300 text-lg"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-4 font-semibold text-lg">📧 Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="coder@example.com"
                required
                className="w-full px-6 py-4 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700 rounded-2xl text-white focus:outline-none focus:border-purple-600 transition-all duration-300 text-lg"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-4 font-semibold text-lg">🔒 Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-6 py-4 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700 rounded-2xl text-white focus:outline-none focus:border-purple-600 transition-all duration-300 text-lg"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-4 font-semibold text-lg">🔒 Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-6 py-4 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700 rounded-2xl text-white focus:outline-none focus:border-purple-600 transition-all duration-300 text-lg"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-4 font-semibold text-lg">Skill Level</label>
              <select
                name="skillLevel"
                value={formData.skillLevel}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700 rounded-2xl text-white focus:outline-none focus:border-purple-600 transition-all duration-300 text-lg appearance-none"
              >
                <option value="beginner">🎮 Beginner - Just starting out</option>
                <option value="intermediate">⚔️ Intermediate - Some experience</option>
                <option value="advanced">🏆 Advanced - Ready for challenges</option>
              </select>
            </div>

            <div>
              <label className="flex items-start space-x-4 cursor-pointer group">
                <div className="relative mt-1">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    required
                    className="w-6 h-6 text-purple-600 rounded focus:ring-2 focus:ring-purple-600 cursor-pointer opacity-0 absolute"
                  />
                  <div className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-all duration-300 ${formData.acceptTerms ? 'bg-purple-600 border-purple-600' : 'border-gray-600 group-hover:border-purple-500'}`}>
                    {formData.acceptTerms && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-gray-300 text-lg group-hover:text-white transition-colors duration-300">
                  I agree to the <a href="#" className="text-purple-400 hover:text-purple-300">Terms of Service</a> and <a href="#" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>
                </span>
              </label>
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-purple-600 to-emerald-500 text-white rounded-2xl font-bold font-['Orbitron'] text-xl hover:opacity-90 transition-opacity duration-300 relative overflow-hidden group shadow-2xl"
            >
              <span className="relative z-10">Begin Your Quest</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-6 bg-gray-900 text-gray-400 text-lg">Or sign up with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <button 
                type="button"
                className="py-4 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-700/50 hover:border-purple-500 transition-all duration-300 group text-lg"
                onClick={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1
                  });
                }}
              >
                <span className="text-2xl">G</span> Google
              </button>
              <button 
                type="button"
                className="py-4 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-700/50 hover:border-purple-500 transition-all duration-300 group text-lg"
                onClick={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1
                  });
                }}
              >
                <span className="text-2xl">🐱</span> GitHub
              </button>
            </div>

            <div className="text-center space-y-6 mt-12">
              <p className="text-gray-400 text-lg">
                Already have an account? <Link to="/login" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors duration-300">Sign in here</Link>
              </p>
              <p>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-300 text-lg flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Home
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Side Panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 to-emerald-500 p-16 items-center justify-center">
        <div className="max-w-xl text-white">
          <h2 className="text-5xl font-bold font-['Orbitron'] mb-8">Start Your Journey</h2>
          <p className="text-2xl mb-16">Join thousands of developers on an epic coding adventure.</p>
          
          <div className="space-y-12">
            {[
              { icon: '🎯', title: 'Earn XP & Level Up', desc: 'Gain experience points with every challenge completed' },
              { icon: '🏅', title: 'Unlock Achievements', desc: 'Collect badges and showcase your coding skills' },
              { icon: '🌎', title: 'Global Community', desc: 'Connect with developers worldwide' }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-6 group">
                <div className="text-4xl transform-gpu group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">{item.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-100 text-lg">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component with enhanced animations
const Dashboard = () => {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    xp: 2450,
    level: 12,
    rank: 42,
    streak: 7,
    completed: 87
  });
  const containerRef = useRef(null);
  const xpCounterRef = useRef(null);
  const achievementCardsRef = useRef([]);

  useEffect(() => {
    gsap.set(containerRef.current, { autoAlpha: 1 });
    
    const tl = gsap.timeline();
    
    // Dashboard entrance with slide and fade
    tl.fromTo(containerRef.current,
      {
        y: 100,
        opacity: 0,
        scale: 0.95
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power3.out'
      }
    );

    // Animate XP counter
    tl.fromTo(xpCounterRef.current,
      {
        innerText: 0,
        textShadow: '0 0 0px rgba(245, 158, 11, 0)'
      },
      {
        innerText: userStats.xp,
        duration: 2,
        ease: 'power2.out',
        snap: { innerText: 1 },
        textShadow: '0 0 20px rgba(245, 158, 11, 0.5)',
        onComplete: () => {
          gsap.to(xpCounterRef.current, {
            textShadow: '0 0 0px rgba(245, 158, 11, 0)',
            duration: 0.5,
            repeat: 3,
            yoyo: true
          });
        }
      },
      '-=0.5'
    );

    // Animate stats with bouncy effect
    tl.fromTo('.stat-item',
      {
        scale: 0,
        opacity: 0,
        y: 50
      },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: 'back.out(1.7)'
      },
      '-=1.5'
    );

    // Achievement cards 3D flip animation
    achievementCardsRef.current.forEach((card, i) => {
      if (card) {
        gsap.fromTo(card,
          {
            rotationY: 180,
            opacity: 0,
            scale: 0.5
          },
          {
            rotationY: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: i * 0.2,
            ease: 'back.out(1.7)'
          }
        );
      }
    });

    // Current challenge glow effect
    const glowTl = gsap.timeline({ repeat: -1, yoyo: true });
    glowTl.to('.current-challenge', {
      boxShadow: '0 0 40px rgba(139, 92, 246, 0.4)',
      duration: 1.5,
      ease: 'sine.inOut'
    });

    // Floating effect for quick action buttons
    gsap.to('.quick-action', {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.2
    });

    return () => {
      tl.kill();
      glowTl.kill();
    };
  }, []);

  const achievements = [
    { icon: '🏆', title: 'Code Newbie', desc: 'Complete 10 challenges', unlocked: true },
    { icon: '⚡', title: 'Speed Coder', desc: 'Solve 5 challenges in under 5 minutes', unlocked: true },
    { icon: '🔥', title: 'Streak Master', desc: 'Maintain 7-day streak', unlocked: true },
    { icon: '👑', title: 'Legendary Coder', desc: 'Reach level 20', unlocked: false }
  ];

  const handleLogout = () => {
    gsap.to(containerRef.current, {
      y: -100,
      opacity: 0,
      rotation: -5,
      duration: 0.6,
      onComplete: () => {
        localStorage.removeItem('codequest_token');
        navigate('/');
      }
    });
  };

  const handleButtonClick = (e) => {
    // Ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
      z-index: 1;
    `;
    e.currentTarget.appendChild(ripple);

    gsap.to(ripple, {
      scale: 2,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => ripple.remove()
    });

    gsap.to(e.currentTarget, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out'
    });
  };

  return (
    <div ref={containerRef} className="dashboard min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-xl border-b border-purple-600/30 py-6 sticky top-0 z-50 shadow-2xl">
        <div className="container mx-auto px-8">
          <nav className="flex justify-between items-center">
            <div className="text-3xl font-bold font-['Orbitron'] bg-gradient-to-r from-purple-600 to-emerald-500 bg-clip-text text-transparent animate-gradient">
              Code<span className="text-amber-500">Quest</span>
            </div>
            
            <div className="hidden lg:flex gap-6">
              {['Dashboard', 'Challenges', 'Leaderboard', 'Profile'].map((item, i) => (
                <button 
                  key={item}
                  className={`px-6 py-3 rounded-xl font-bold font-['Orbitron'] transition-all duration-300 transform-gpu ${
                    item === 'Dashboard' 
                      ? 'bg-gradient-to-r from-purple-600/30 to-emerald-500/30 text-purple-400 shadow-lg' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/30 hover:scale-105'
                  }`}
                  onClick={handleButtonClick}
                >
                  {item}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-emerald-500 rounded-full flex items-center justify-center font-bold text-xl shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  CW
                </div>
                <div>
                  <div className="font-bold text-lg">CodeWarrior42</div>
                  <div className="text-sm text-gray-400">Level {userStats.level}</div>
                </div>
              </div>
              
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-full text-amber-400 font-bold shadow-lg">
                <span className="text-xl">🔥</span>
                <span ref={xpCounterRef} className="xp-counter">{userStats.xp}</span>
                <span>XP</span>
              </div>
              
              <button 
                onClick={handleLogout}
                className="px-6 py-3 bg-gradient-to-r from-red-600/20 to-red-700/20 text-red-400 rounded-xl font-bold font-['Orbitron'] hover:scale-105 hover:bg-red-600/30 transition-all duration-300 shadow-lg"
                onClick={handleButtonClick}
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="py-12">
        <div className="container mx-auto px-8">
          {/* Welcome Banner */}
          <div className="current-challenge bg-gradient-to-r from-purple-600/20 via-gray-800/50 to-emerald-500/20 backdrop-blur-lg rounded-3xl p-10 mb-12 border border-purple-600/30 shadow-2xl transform-gpu">
            <div className="flex flex-col lg:flex-row justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold font-['Orbitron'] mb-4">Welcome back, Adventurer! 🎮</h1>
                <p className="text-gray-200 text-xl">You're on level {userStats.level} with <span className="xp-counter font-bold">{userStats.xp}</span> XP. Keep going to unlock the next level!</p>
              </div>
              <div className="mt-8 lg:mt-0">
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-8">
                    {[
                      { value: userStats.rank, label: 'Global Rank', color: 'purple' },
                      { value: userStats.streak, label: 'Day Streak', color: 'emerald' },
                      { value: userStats.completed, label: 'Completed', color: 'amber' }
                    ].map((stat, i) => (
                      <div key={i} className="stat-item text-center">
                        <div className={`text-3xl font-bold font-['Orbitron'] bg-gradient-to-r from-${stat.color}-600 to-${stat.color}-500 bg-clip-text text-transparent`}>
                          {stat.value}
                        </div>
                        <div className="text-gray-400 text-sm mt-2">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* Current Challenge */}
            <div className="lg:col-span-2 bg-gray-800/30 backdrop-blur-lg rounded-3xl p-8 border border-purple-600/20 shadow-2xl">
              <h3 className="text-2xl font-bold font-['Orbitron'] mb-6 flex items-center gap-3">
                <span className="text-3xl">💻</span>
                Current Challenge
              </h3>
              <div className="bg-gray-900/50 p-8 rounded-2xl border-l-4 border-purple-600">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-xl font-bold mb-4">Algorithm Master: Binary Search</h4>
                    <p className="text-gray-300 mb-6 text-lg">Solve this algorithm challenge to earn 150 XP</p>
                    <div className="flex gap-3 mb-6">
                      <span className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-full font-semibold">Medium</span>
                      <span className="px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-full font-semibold">JavaScript</span>
                    </div>
                  </div>
                  <div className="text-5xl">🎯</div>
                </div>
                <div className="flex gap-6">
                  <button 
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-emerald-500 text-white rounded-xl font-bold font-['Orbitron'] text-lg hover:opacity-90 transition-opacity duration-300 shadow-2xl"
                    onClick={handleButtonClick}
                  >
                    Continue Challenge
                  </button>
                  <button 
                    className="px-8 py-4 border-2 border-gray-700 text-gray-400 rounded-xl font-bold font-['Orbitron'] text-lg hover:border-purple-600 hover:text-purple-400 transition-all duration-300"
                    onClick={handleButtonClick}
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-gray-800/30 backdrop-blur-lg rounded-3xl p-8 border border-purple-600/20 shadow-2xl">
              <h3 className="text-2xl font-bold font-['Orbitron'] mb-6 flex items-center gap-3">
                <span className="text-3xl">👑</span>
                Leaderboard
              </h3>
              <div className="text-center py-8">
                <div className="text-7xl font-bold font-['Orbitron'] bg-gradient-to-r from-purple-600 to-emerald-500 bg-clip-text text-transparent mb-4">
                  #{userStats.rank}
                </div>
                <p className="text-gray-400 text-lg mb-8">Out of 2,500 players</p>
                <button 
                  className="w-full px-8 py-4 border-2 border-purple-600 text-purple-400 rounded-xl font-bold font-['Orbitron'] text-lg hover:bg-purple-600/10 transition-all duration-300 shadow-lg"
                  onClick={handleButtonClick}
                >
                  View Full Leaderboard
                </button>
              </div>
            </div>
          </div>

          {/* Achievements & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800/30 backdrop-blur-lg rounded-3xl p-8 border border-purple-600/20 shadow-2xl">
              <h3 className="text-2xl font-bold font-['Orbitron'] mb-8 flex items-center gap-3">
                <span className="text-3xl">🏆</span>
                Achievements
              </h3>
              <div className="space-y-6">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index}
                    ref={el => achievementCardsRef.current[index] = el}
                    className={`achievement-card flex items-center gap-6 p-6 rounded-2xl transition-all duration-300 transform-gpu ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-r from-purple-600/10 to-emerald-500/10 border border-purple-600/30 hover:scale-105' 
                        : 'bg-gray-900/50 border border-gray-700/50 opacity-50'
                    }`}
                  >
                    <div className={`text-4xl ${achievement.unlocked ? 'animate-pulse' : ''}`}>{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-bold text-xl mb-2">{achievement.title}</div>
                      <div className="text-gray-400">{achievement.desc}</div>
                    </div>
                    {achievement.unlocked ? (
                      <div className="text-emerald-400 font-bold">Unlocked</div>
                    ) : (
                      <div className="text-gray-500">Locked</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/30 backdrop-blur-lg rounded-3xl p-8 border border-purple-600/20 shadow-2xl">
              <h3 className="text-2xl font-bold font-['Orbitron'] mb-8 flex items-center gap-3">
                <span className="text-3xl">⚡</span>
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: '💻', label: 'Start New Challenge', color: 'purple' },
                  { icon: '⚔️', label: 'Join Multiplayer Duel', color: 'red' },
                  { icon: '📚', label: 'Explore Learning Paths', color: 'emerald' },
                  { icon: '👥', label: 'Invite Friends', color: 'blue' }
                ].map((action, index) => (
                  <button
                    key={index}
                    className="quick-action p-6 rounded-2xl border transition-all duration-300 hover:scale-105 transform-gpu"
                    style={{
                      borderColor: `var(--color-${action.color}-600)`,
                      background: `linear-gradient(135deg, rgba(var(--color-${action.color}-600), 0.1), rgba(var(--color-${action.color}-500), 0.1))`
                    }}
                    onClick={handleButtonClick}
                  >
                    <div className="text-3xl mb-4">{action.icon}</div>
                    <div className="font-bold text-lg">{action.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        :root {
          --color-purple-600: 139, 92, 246;
          --color-purple-500: 168, 85, 247;
          --color-emerald-600: 5, 150, 105;
          --color-emerald-500: 16, 185, 129;
          --color-red-600: 220, 38, 38;
          --color-red-500: 239, 68, 68;
          --color-blue-600: 37, 99, 235;
          --color-blue-500: 59, 130, 246;
          --color-amber-600: 217, 119, 6;
          --color-amber-500: 245, 158, 11;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .transform-gpu {
          transform: translateZ(0);
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default App;