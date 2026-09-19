'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AttendanceStatus, Student, AttendanceRecord, Classroom } from '@/types';
import { 
  Clock, CheckCircle2, AlertTriangle, Smartphone, 
  Calendar, Users, Save, Sparkles, Printer 
} from 'lucide-react';

export default function AttendancePage() {
  const { classes, students, attendances, updateAttendance, addNotification } = useApp();

  const [selectedClassId, setSelectedClassId] = useState('c-3a');
  const [selectedDate, setSelectedDate] = useState('2025-02-19');
  const [isSaved, setIsSaved] = useState(false);

  const classStudents = students.filter((s: Student) => s.classId === selectedClassId || s.className === '3ème A');

  // Status counters
  const totalClassCount = classStudents.length;
  const presentCount = attendances.filter((a: AttendanceRecord) => a.status === 'PRESENT').length;
  const absentCount = attendances.filter((a: AttendanceRecord) => a.status === 'ABSENT').length;
  const retardCount = attendances.filter((a: AttendanceRecord) => a.status === 'RETARD').length;

  const handleStatusChange = (attId: string, status: AttendanceStatus) => {
    updateAttendance(attId, status);
  };

  const handleSaveAttendance = () => {
    setIsSaved(true);
    addNotification({
      title: 'Appel Enregistré',
      message: `Feuille d'appel validée pour la 3ème A (${presentCount} présents, ${absentCount} absents). Notifications parents envoyées.`,
      type: 'STUDENT_ABSENT',
      channel: 'SMS',
      recipient: 'Vie Scolaire',
    });
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Vie Scolaire & Assiduité</span>
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900">
            Feuille d'Appel & Gestion des Absences
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Appel rapide tactile en classe et notification automatique des parents par SMS / WhatsApp
          </p>
        </div>

        <button
          onClick={handleSaveAttendance}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition hover:scale-105"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Appel Validé & Parents Notifiés !' : 'Valider l\'Appel du Cours'}</span>
        </button>
      </div>

      {/* Selectors & Live Counter */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Classe :</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {classes.map((c: Classroom) => (
                <option key={c.id} value={c.id}>{c.name} ({c.studentCount} élèves)</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Date du Jour :</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Counter Card */}
        <div className="lg:col-span-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-around text-center">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Présents</div>
            <div className="font-heading font-black text-xl text-emerald-600">{presentCount}</div>
          </div>
          <div className="h-8 w-px bg-slate-100" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Absents</div>
            <div className="font-heading font-black text-xl text-rose-600">{absentCount}</div>
          </div>
          <div className="h-8 w-px bg-slate-100" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Retards</div>
            <div className="font-heading font-black text-xl text-amber-600">{retardCount}</div>
          </div>
        </div>
      </div>

      {/* Student Attendance List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="font-heading font-bold text-xs uppercase text-slate-600 tracking-wider">
            Élèves de la classe ({attendances.length})
          </span>
          <span className="text-[11px] font-semibold text-indigo-700">
            Cliquez sur un bouton pour changer le statut en direct
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {attendances.map((att: AttendanceRecord) => (
            <div key={att.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                  {att.studentName.split(' ')[0][0]}{att.studentName.split(' ')[1]?.[0] || ''}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">{att.studentName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{att.matricule} • {att.className}</div>
                  {att.reason && (
                    <div className="text-[11px] text-rose-600 font-medium mt-0.5">Motif : {att.reason}</div>
                  )}
                </div>
              </div>

              {/* 1-Tap Status Selector */}
              <div className="grid grid-cols-4 gap-1.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleStatusChange(att.id, 'PRESENT')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    att.status === 'PRESENT'
                      ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Présent
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(att.id, 'ABSENT')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    att.status === 'ABSENT'
                      ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Absent
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(att.id, 'RETARD')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    att.status === 'RETARD'
                      ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-400'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Retard
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(att.id, 'JUSTIFIE')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    att.status === 'JUSTIFIE'
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Justifié
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
