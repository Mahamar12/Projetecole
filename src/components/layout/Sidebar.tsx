'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  LayoutDashboard, Users, UserCheck, GraduationCap, School, 
  UserPlus, DollarSign, CreditCard, AlertCircle, FileSpreadsheet, 
  Award, Clock, Calendar, BookOpen, MessageSquare, 
  FileText, BarChart3, Bot, Settings, ChevronRight, X, CheckCircle2, ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  href: string;
  label: string;
  icon: any;
  badge?: string;
  alertBadge?: string;
  highlight?: boolean;
  isNew?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function Sidebar({ isMobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { currentSchool, overdueFees, notifications } = useApp();

  const overdueCount = overdueFees.length;

  const navSections: NavSection[] = [
    {
      title: 'Vue d\'ensemble',
      items: [
        { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
      ]
    },
    {
      title: 'Gestion Scolaire',
      items: [
        { href: '/dashboard/students', label: 'Élèves', icon: Users, badge: '842' },
        { href: '/dashboard/parents', label: 'Parents / Familles', icon: UserCheck },
        { href: '/dashboard/teachers', label: 'Enseignants', icon: GraduationCap, badge: '54' },
        { href: '/dashboard/classes', label: 'Classes & Niveaux', icon: School, badge: '24' },
        { href: '/dashboard/enrollments', label: 'Inscriptions', icon: UserPlus },
      ]
    },
    {
      title: 'Finances & Trésorerie',
      items: [
        { href: '/dashboard/fees', label: 'Frais & Grille tarifaire', icon: DollarSign },
        { href: '/dashboard/payments', label: 'Paiements & Reçus', icon: CreditCard, highlight: true },
        { href: '/dashboard/overdue', label: 'Gestion des Impayés', icon: AlertCircle, alertBadge: overdueCount > 0 ? `${overdueCount}` : undefined },
      ]
    },
    {
      title: 'Pédagogie & Présences',
      items: [
        { href: '/dashboard/grades', label: 'Notes & Saisie', icon: FileSpreadsheet },
        { href: '/dashboard/report-cards', label: 'Bulletins Scolaires', icon: Award, highlight: true },
        { href: '/dashboard/passages', label: 'Admis & Passages', icon: CheckCircle2, highlight: true },
        { href: '/dashboard/attendance', label: 'Absences & Présences', icon: Clock },
        { href: '/dashboard/timetable', label: 'Emploi du Temps', icon: Calendar },
        { href: '/dashboard/homework', label: 'Devoirs & Cahier', icon: BookOpen },
      ]
    },
    {
      title: 'Outils & Pilotage',
      items: [
        { href: '/dashboard/communication', label: 'WhatsApp & SMS', icon: MessageSquare },
        { href: '/dashboard/documents', label: 'Documents Officiels', icon: FileText },
        { href: '/dashboard/reports', label: 'Rapports & Exports', icon: BarChart3 },
        { href: '/dashboard/ai-assistant', label: 'Assistant IA Scolaire', icon: Bot, isNew: true },
        { href: '/dashboard/settings', label: 'Paramètres École', icon: Settings },
      ]
    },
    {
      title: 'Portails Multi-Rôles',
      items: [
        { href: '/portal-parent', label: 'Espace Parents', icon: Users, highlight: true },
        { href: '/portal-teacher', label: 'Espace Enseignants', icon: GraduationCap },
        { href: '/portal-student', label: 'Espace Élèves', icon: BookOpen },
        { href: '/superadmin', label: 'Super Admin SaaS', icon: ShieldCheck },
      ]
    }
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-white border-r border-slate-200">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white font-black flex items-center justify-center text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              EG
            </div>
            <div>
              <div className="font-heading font-extrabold text-slate-900 text-base tracking-tight flex items-center gap-1">
                EduGestion <span className="text-emerald-600">Africa</span>
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Multi-Écoles SaaS
              </div>
            </div>
          </Link>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation links */}
        <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)]">
          {navSections.map((sec, idx) => (
            <div key={idx}>
              <div className="px-3 mb-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {sec.title}
              </div>
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onCloseMobile}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 transition ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`} />
                        <span>{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {item.badge && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                            isActive ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        {item.alertBadge && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-rose-500 text-white animate-pulse">
                            {item.alertBadge}
                          </span>
                        )}
                        {item.isNew && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 text-white uppercase tracking-wider">
                            IA
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Mobile Money status */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/80">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-700">Wave & OM Connectés</span>
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
            FCFA
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
