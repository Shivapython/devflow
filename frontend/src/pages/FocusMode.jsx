import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Volume2, VolumeX } from 'lucide-react';

const FocusMode = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    let interval;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (!isBreak) {
      setSessionsCompleted((prev) => prev + 1);
      setIsBreak(true);
      setTimeLeft(5 * 60); // 5 minute break
      if (soundEnabled) {
        playNotificationSound();
      }
    } else {
      setIsBreak(false);
      setTimeLeft(25 * 60); // Back to work
      if (soundEnabled) {
        playNotificationSound();
      }
    }
  };

  const playNotificationSound = () => {
    // In a real app, you'd play an actual sound here
    console.log('🔔 Timer completed!');
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak 
    ? ((5 * 60 - timeLeft) / (5 * 60)) * 100
    : ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <div className="min-h-screen bg-dark-bg p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-accent-blue rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-purple rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 gradient-text">
            Focus Mode
          </h1>
          <p className="text-gray-400 text-lg">
            {isBreak ? '☕ Take a break!' : '🎯 Stay focused on your task'}
          </p>
        </div>

        {/* Main Timer Card */}
        <div className="bg-dark-card rounded-3xl p-12 border border-dark-border mb-8 relative overflow-hidden">
          {/* Progress Ring Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <svg className="w-full h-full" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-accent-blue"
              />
            </svg>
          </div>

          <div className="relative z-10">
            {/* Timer Display */}
            <div className="text-center mb-8">
              <div className="text-9xl font-bold text-white neon-glow mb-4">
                {formatTime(timeLeft)}
              </div>
              <p className="text-2xl text-gray-400">
                {isBreak ? 'Break Time' : 'Focus Time'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-dark-border rounded-full h-4 mb-8 overflow-hidden">
              <div
                className={`h-4 rounded-full transition-all duration-1000 ${
                  isBreak 
                    ? 'bg-gradient-to-r from-accent-green to-emerald-600' 
                    : 'bg-gradient-to-r from-accent-blue to-accent-purple'
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={toggleTimer}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isRunning 
                    ? 'bg-accent-red hover:bg-accent-red/80 shadow-lg shadow-accent-red/50' 
                    : 'bg-gradient-to-r from-accent-blue to-accent-purple hover:scale-110 shadow-lg shadow-accent-blue/50'
                }`}
              >
                {isRunning ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </button>

              <button
                onClick={resetTimer}
                className="w-16 h-16 rounded-full bg-dark-hover border border-dark-border hover:border-accent-blue flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <RotateCcw className="w-6 h-6 text-white" />
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="w-16 h-16 rounded-full bg-dark-hover border border-dark-border hover:border-accent-blue flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                {soundEnabled ? (
                  <Volume2 className="w-6 h-6 text-accent-blue" />
                ) : (
                  <VolumeX className="w-6 h-6 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sessions Completed */}
          <div className="bg-dark-card rounded-xl p-6 border border-dark-border text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-blue to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coffee className="w-8 h-8 text-white" />
            </div>
            <p className="text-4xl font-bold text-white mb-2">{sessionsCompleted}</p>
            <p className="text-gray-400">Sessions Today</p>
          </div>

          {/* Total Focus Time */}
          <div className="bg-dark-card rounded-xl p-6 border border-dark-border text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-green to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-white" />
            </div>
            <p className="text-4xl font-bold text-white mb-2">{sessionsCompleted * 25}</p>
            <p className="text-gray-400">Minutes Focused</p>
          </div>

          {/* Current Streak */}
          <div className="bg-dark-card rounded-xl p-6 border border-dark-border text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-yellow to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔥</span>
            </div>
            <p className="text-4xl font-bold text-white mb-2">7</p>
            <p className="text-gray-400">Day Streak</p>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 rounded-xl p-6 border border-accent-blue/30">
          <h3 className="text-xl font-bold text-white mb-4">💡 Pomodoro Tips</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Work for 25 minutes without distractions</li>
            <li>• Take a 5-minute break after each session</li>
            <li>• After 4 sessions, take a longer 15-30 minute break</li>
            <li>• Stay hydrated and stretch during breaks</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;