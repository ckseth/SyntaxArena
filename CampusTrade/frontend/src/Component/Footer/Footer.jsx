import React from 'react'
import { PlusCircle, Search, Mail, Phone, Globe, MessageCircle, Share2, Package } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='relative bg-slate-900 pt-24 pb-12 overflow-hidden' id='footer'>
      {/* Decorative orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] orb orb-indigo opacity-20" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] orb orb-purple opacity-15" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          
          {/* Logo & About */}
          <div className="col-span-1 md:col-span-2 space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-[-3deg] transition-all duration-300">
                <Package className="w-7 h-7" />
              </div>
              <span className="text-3xl font-black text-white tracking-tight">
                Campus<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Trade</span>
              </span>
            </Link>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              The premier marketplace for college students. Buy, sell, and rent everything from textbooks to electronics within your own campus community.
            </p>
            <div className="flex gap-4">
              {[Globe, MessageCircle, Share2].map((Icon, i) => (
                <button key={i} className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-sm text-slate-400 flex items-center justify-center hover:bg-gradient-to-br hover:from-indigo-600 hover:to-purple-600 hover:text-white transition-all duration-300 border border-white/5 hover:border-transparent hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-110 hover:rotate-[-3deg]">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white font-black uppercase tracking-widest text-sm">Company</h4>
            <ul className="space-y-4">
              {['Home', 'About Us', 'Privacy Policy', 'Terms of Service'].map(link => (
                <li key={link}>
                  <Link to="/" className="text-slate-400 font-medium hover:text-indigo-400 transition-colors duration-200 hover:translate-x-1 inline-block">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-white font-black uppercase tracking-widest text-sm">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-400 font-medium group">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/300/10 flex items-center justify-center group-hover:bg-indigo-50 dark:bg-indigo-900/300/20 transition-colors">
                  <Phone className="w-4 h-4 text-indigo-400" />
                </div>
                +91-9876543210
              </li>
              <li className="flex items-center gap-3 text-slate-400 font-medium group">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/300/10 flex items-center justify-center group-hover:bg-indigo-50 dark:bg-indigo-900/300/20 transition-colors">
                  <Mail className="w-4 h-4 text-indigo-400" />
                </div>
                support@campustrade.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Copyright 2026 © CampusTrade.com - All Rights Reserved.
          </p>
          <div className="flex gap-8">
            <span className="text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg backdrop-blur-sm">v1.2.4</span>
            <span className="text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg backdrop-blur-sm">Built for Students</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
