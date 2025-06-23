import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-yellow-400/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img 
                src="/Resources/Badge.png" 
                alt="Real Breda CF" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-bold text-white">Real Breda CF</span>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4 max-w-2xl">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300 leading-relaxed">
                <p className="font-semibold text-yellow-400 mb-2">Important Disclaimer</p>
                <p>
                  Real Breda CF is an <strong className="text-white">unofficial Pro Clubs team</strong> and is 
                  not affiliated with, endorsed by, or connected to NAC Breda, EA Sports, or any official 
                  football organization. This website is created by fans for entertainment purposes only.
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-400">
            <p>&copy; 2025 Real Breda CF Pro Clubs. All rights reserved.</p>
            <p className="mt-1">Built with passion for the beautiful game.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}