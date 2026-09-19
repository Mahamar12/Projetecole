'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import { 
  ShieldCheck, School, Briefcase, DollarSign, 
  GraduationCap, Users, User, ChevronDown, Sparkles, ExternalLink, Compass, Key
} from 'lucide-react';

const roles: { role: UserRole; label: string; icon: any; path: string; color: string }[] = [
  { role: 'SUPER_ADMIN', label: 'Super Admin SaaS', icon: ShieldCheck, path: '/superadmin', color: 'bg-purple-600' },
  { role: 'SCHOOL_ADMIN', label: 'Directeur (Admin)', icon: School, path: '/dashboard', color: 'bg-blue-600' },
  { role: 'SECRETARY', label: 'Secrétaire', icon: Briefcase, path: '/dashboard/students', color: 'bg-indigo-600' },
  { role: 'ACCOUNTANT', label: 'Comptable', icon: DollarSign, path: '/dashboard/payments', color: 'bg-emerald-600' },
  { role: 'TEACHER', label: 'Enseignant (Appel & Notes)', icon: GraduationCap, path: '/portal-teacher', color: 'bg-amber-600' },
  { role: 'PARENT', label: 'Parent d\'élèves', icon: Users, path: '/portal-parent', color: 'bg-rose-600' },
  { role: 'STUDENT', label: 'Élève (Mes Notes & Planning)', icon: User, path: '/portal-student', color: 'bg-teal-600' },
];

export default function RoleSwitcherFloating() {
  const { currentRole, setCurrentRole, currentSchool } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const activeRoleObj = roles.find(r => r.role === currentRole) || roles[1];

  const handleSelectRole = (r: typeof roles[0]) => {
    setCurrentRole(r.role);
    setIsOpen(false);
    router.push(r.path);
  };

  return (
    <div className="no-print sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white text-xs px-3 py-1.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 flex-wrap">
        {/* Left: Brand / Quick Links */}
        <div className="flex items-center gap-3">
          <Link 
            href="/" 
            className="flex items-center gap-1.5 font-bold tracking-tight text-white hover:text-blue-400 transition"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-heading text-sm">EduGestion Africa</span>
          </Link>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">
            {currentSchool.name} ({currentSchool.city}, {currentSchool.country})
          </span>
        </div>

        {/* Center: Live Role Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 hidden lg:inline font-medium">Mode Démo Multi-Rôles :</span>
          
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full font-semibold text-white shadow-sm transition ${activeRoleObj.color} hover:brightness-110`}
            >
              <activeRoleObj.icon className="w-3.5 h-3.5" />
              <span>{activeRoleObj.label}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden">
                  <div className="px-3 py-1.5 border-b border-slate-700/60 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Sélectionner un profil utilisateur
                  </div>
                  {roles.map((r) => {
                    const Icon = r.icon;
                    const isSelected = r.role === currentRole;
                    return (
                      <button
                        key={r.role}
                        onClick={() => handleSelectRole(r)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs transition ${
                          isSelected 
                            ? 'bg-blue-600/20 text-blue-300 font-semibold border-l-2 border-blue-500' 
                            : 'text-slate-200 hover:bg-slate-700/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center text-white ${r.color}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span>{r.label}</span>
                        </div>
                        {isSelected && <span className="text-[10px] bg-blue-500/30 text-blue-200 px-1.5 py-0.5 rounded">Actif</span>}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Quick Nav */}
        <div className="flex items-center gap-2 text-slate-300">
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-full transition shadow-sm"
          >
            <Key className="w-3.5 h-3.5" />
            <span>🔐 Inscription & Connexion Matricule</span>
          </Link>
          <Link
            href="/onboarding"
            className="hover:text-white transition flex items-center gap-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Config Établissement</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            <Compass className="w-3 h-3 text-blue-400" />
            <span>Landing Page</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
