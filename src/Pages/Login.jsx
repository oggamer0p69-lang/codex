import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const containerRef = useRef(null);
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Initial animation
    const tl = gsap.timeline();
    tl.from(containerRef.current, {
      duration: 0.8,
      scale: 0.8,
      opacity: 1,
      ease: "back.out(1.7)"
    })
    .from(titleRef.current, {
      duration: 0.6,
      y: -50,
      opacity: 0,
      ease: "power3.out"
    }, "-=0.3")
    .from(formRef.current, {
      duration: 0.6,
      y: 30,
      opacity: 0,
      ease: "power3.out"
    }, "-=0.2");
  }, []);

  useEffect(() => {
    // Animate form switch
    gsap.from(formRef.current, {
      duration: 0.5,
      x: isLogin ? 50 : -50,
      opacity: 0,
      ease: "power2.out"
    });
  }, [isLogin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Button click animation
    const tl = gsap.timeline();
    tl.to(buttonRef.current, {
      duration: 0.1,
      scale: 0.95,
      ease: "power2.in"
    })
    .to(buttonRef.current, {
      duration: 0.1,
      scale: 1,
      ease: "power2.out"
    });

    if (isLogin) {
      console.log('Login attempt:', { email: formData.email, password: formData.password });
      // Add your login logic here
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      console.log('Register attempt:', formData);
      // Add your registration logic here
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div 
        ref={containerRef}
        className="relative w-full max-w-md"
      >
        {/* Animated Background Elements - Increased opacity */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-400 rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute top-1/2 -right-16 w-16 h-16 bg-green-400 rounded-full opacity-60 animate-ping"></div>

        {/* Main Container - Increased opacity and better contrast */}
        <div className="bg-gray-800/95 backdrop-blur-lg rounded-2xl border-2 border-yellow-400 shadow-2xl shadow-yellow-500/50 p-8 relative overflow-hidden">
          {/* Decorative Game Elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-red-400 to-yellow-400"></div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full border-2 border-white"></div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-500 rounded-full border-2 border-white"></div>

          <h1 
            ref={titleRef}
            className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-400 font-mono"
          >
            {isLogin ? 'LEVEL LOGIN' : 'NEW GAME+'}
          </h1>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-2 font-mono">
                  PLAYER NAME
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="w-full px-4 py-3 bg-gray-700/80 border-2 border-yellow-400/50 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all duration-300 font-mono"
                  placeholder="Enter your username"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-yellow-300 mb-2 font-mono">
                EMAIL
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-700/80 border-2 border-yellow-400/50 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all duration-300 font-mono"
                placeholder="player@game.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-yellow-300 mb-2 font-mono">
                PASSWORD
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-700/80 border-2 border-yellow-400/50 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all duration-300 font-mono"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-2 font-mono">
                  CONFIRM PASSWORD
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="w-full px-4 py-3 bg-gray-700/80 border-2 border-yellow-400/50 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all duration-300 font-mono"
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              ref={buttonRef}
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-yellow-500 to-red-500 text-white font-bold rounded-lg border-2 border-yellow-300 hover:from-yellow-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-yellow-500/50 font-mono text-lg"
            >
              {isLogin ? 'START GAME' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={switchMode}
              className="text-yellow-300 hover:text-yellow-200 font-mono text-sm transition-colors duration-200 underline"
            >
              {isLogin ? 'New Player? JOIN THE QUEST →' : 'Already have an account? LOGIN →'}
            </button>
          </div>

          {/* Game Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="text-white">
              <div className="text-2xl font-bold font-mono">1.2M</div>
              <div className="text-xs text-yellow-300">PLAYERS</div>
            </div>
            <div className="text-white">
              <div className="text-2xl font-bold font-mono">24/7</div>
              <div className="text-xs text-yellow-300">ONLINE</div>
            </div>
            <div className="text-white">
              <div className="text-2xl font-bold font-mono">999</div>
              <div className="text-xs text-yellow-300">LEVELS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;