'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { NotificationItem } from '@/types';
import { 
  Bell, Search, PlusCircle, CreditCard, UserPlus, 
  CheckCircle2, AlertTriangle, Calendar, ChevronRight, X
} from 'lucide-react';
import NewPaymentModal from '@/components/payments/NewPaymentModal';
import NewStudentModal from '@/components/modals/NewStudentModal';

interface TopBarProps {
  onToggleMobileMenu?: () => void;
}

export default function TopBar({ onToggleMobileMenu }: TopBarProps) {
  const { currentSchool, notifications, markNotificationAsRead, currentRole } = useApp();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  const unreadCount = notifications.filter((n: NotificationItem) => !n.isRead).length;

  return (
    <>
      <header className="sticky top-8 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: School Identifier & Year */}
        <div className="flex items-center gap-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-slate-900 text-base md:text-lg truncate max-w-xs md:max-w-md">
                {currentSchool.name}
              </h2>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                {currentSchool.code}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Année Scolaire 2024 - 2025</span>
              <span>•</span>
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Trimestre 1 En Cours
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Action Button for School Admin, Accountant, Secretary */}
          {['SCHOOL_ADMIN', 'ACCOUNTANT', 'SECRETARY'].includes(currentRole) && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 transition"
              >
                <CreditCard className="w-4 h-4" />
                <span>Encaisser Paiement</span>
              </button>

              <button
                onClick={() => setIsStudentModalOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>Inscrire Élève</span>
              </button>
            </div>
          )}

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotifOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsNotifOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-600" />
                      <span className="font-heading font-bold text-slate-900 text-sm">Notifications & Alertes</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                      {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map((notif: NotificationItem) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationAsRead(notif.id)}
                        className={`p-3 text-xs transition cursor-pointer hover:bg-slate-50 ${
                          !notif.isRead ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                            {notif.type === 'PAYMENT_RECEIVED' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                            {notif.type === 'STUDENT_ABSENT' && <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
                            {notif.type === 'PAYMENT_DUE' && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                            <span>{notif.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.createdAt}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{notif.message}</p>
                        {notif.recipient && (
                          <div className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-400">
                            <span>Destinataire :</span>
                            <span className="font-medium text-slate-600">{notif.recipient}</span>
                            <span className="ml-auto font-semibold text-emerald-600">{notif.channel}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                    <span className="text-[11px] text-slate-500 font-medium">
                      Compatible Passerelles WhatsApp & SMS Afrique (Orange, Twilio, Wave)
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
              AD
            </div>
            <div className="hidden lg:block text-left">
              <div className="font-semibold text-xs text-slate-800 leading-none">Amadou Diallo</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Directeur Principal</div>
            </div>
          </div>
        </div>
      </header>

      {/* Modales globales de paiement & nouvel élève */}
      {isPaymentModalOpen && (
        <NewPaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} />
      )}
      {isStudentModalOpen && (
        <NewStudentModal isOpen={isStudentModalOpen} onClose={() => setIsStudentModalOpen(false)} />
      )}
    </>
  );
}
