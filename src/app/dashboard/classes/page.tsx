'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Classroom, Subject, TimetableSlot } from '@/types';
import { School, PlusCircle, Users, Award, BookOpen, Layers, CheckCircle2, Calendar, ChevronRight, X, GraduationCap, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function ClassesManagementPage() {
  const { classes, subjects, timetables } = useApp();
  const [selectedClassForTimetable, setSelectedClassForTimetable] = useState<string | null>(null);

  const activeClass = classes.find((c: Classroom) => c.id === selectedClassForTimetable);
  const activeClassSlots = timetables.filter((s: TimetableSlot) => s.classId === selectedClassForTimetable || s.className === activeClass?.name);

  const days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI'] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-1">
            <School className="w-3.5 h-3.5" />
            <span>Organisation Pédagogique</span>
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900">
            Gestion des Classes & Niveaux ({classes.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cycles Primaire, Collège, Lycée, capacités de salles, professeurs principaux et emplois du temps
          </p>
        </div>

        <Link
          href="/dashboard/timetable"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition hover:scale-105"
        >
          <Calendar className="w-4 h-4" />
          <span>Voir Tous les Emplois du Temps →</span>
        </Link>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls: Classroom) => (
          <div key={cls.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                  cls.cycle === 'PRIMAIRE' ? 'bg-emerald-100 text-emerald-800' :
                  cls.cycle === 'COLLEGE' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {cls.cycle} • {cls.level}
                </span>
                <h3 className="font-heading font-black text-xl text-slate-900 mt-1">{cls.name}</h3>
                <div className="text-xs text-slate-500 font-medium">{cls.roomNumber || 'Salle 101'}</div>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Effectif</div>
                <div className="font-heading font-black text-lg text-slate-900">
                  {cls.studentCount} <span className="text-xs font-normal text-slate-400">/ {cls.capacity}</span>
                </div>
              </div>
            </div>

            {/* Capacity Progress Bar */}
            <div>
              <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                <span>Remplissage</span>
                <span>{Math.round((cls.studentCount / cls.capacity) * 100)} %</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full" 
                  style={{ width: `${(cls.studentCount / cls.capacity) * 100}%` }} 
                />
              </div>
            </div>

            {/* Main Teacher & Average */}
            <div className="p-3 bg-slate-50 rounded-2xl space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Professeur Principal :</span>
                <span className="font-bold text-slate-900">{cls.mainTeacherName || 'M. Ibrahima Diallo'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Moyenne de Classe :</span>
                <span className="font-black text-blue-700">{cls.averageGrade?.toFixed(1) || '13.5'} / 20</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <Link href="/dashboard/students" className="hover:underline">
                Liste des élèves
              </Link>
              <button
                onClick={() => setSelectedClassForTimetable(cls.id)}
                className="hover:underline flex items-center gap-1 text-blue-700 hover:text-blue-900"
              >
                <span>Emploi du temps</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Subjects & Coefficients Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-black text-lg text-slate-900">
              Matières & Coefficients Officiels (Sénégal / UEMOA)
            </h3>
            <p className="text-xs text-slate-500">Grille pédagogique utilisée pour le calcul automatique des moyennes et classements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {subjects.map((s: Subject) => (
            <div key={s.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-slate-900">{s.name}</div>
                <div className="text-[10px] text-slate-500 font-mono">Code : {s.code}</div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-black text-xs">
                  Coeff {s.defaultCoeff}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Quick Timetable for Class */}
      {selectedClassForTimetable && activeClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedClassForTimetable(null)} />

          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="text-[10px] uppercase font-bold text-blue-600">Emploi du temps de la classe</div>
                <h3 className="font-heading font-black text-xl text-slate-900">{activeClass.name}</h3>
                <p className="text-xs text-slate-500">Professeur Principal : <strong>{activeClass.mainTeacherName || 'M. Ibrahima Diallo'}</strong> • Salle : <strong>{activeClass.roomNumber || 'Salle 101'}</strong></p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard/timetable"
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition"
                >
                  Ouvrir Vue Complète →
                </Link>
                <button
                  onClick={() => setSelectedClassForTimetable(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Timetable Days */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {days.map((day) => {
                const daySlots = activeClassSlots.filter((s: TimetableSlot) => s.dayOfWeek === day);
                daySlots.sort((a: TimetableSlot, b: TimetableSlot) => a.startTime.localeCompare(b.startTime));

                return (
                  <div key={day} className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-2">
                    <div className="font-heading font-extrabold text-xs text-slate-900 border-b border-slate-200 pb-1 flex justify-between">
                      <span>{day}</span>
                      <span className="text-[10px] text-slate-400">{daySlots.length} cours</span>
                    </div>

                    <div className="space-y-2">
                      {daySlots.length > 0 ? (
                        daySlots.map((s: TimetableSlot) => (
                          <div key={s.id} className={`p-2.5 rounded-xl border ${s.color} text-xs space-y-1 shadow-sm`}>
                            <div className="font-bold text-[11px] leading-tight">{s.subjectName}</div>
                            <div className="text-[10px] font-bold text-slate-800 flex items-center gap-1">
                              <GraduationCap className="w-3 h-3" />
                              <span className="truncate">{s.teacherName}</span>
                            </div>
                            <div className="flex items-center justify-between text-[9px] text-slate-600 pt-1 border-t border-black/10">
                              <span>{s.startTime}-{s.endTime}</span>
                              <span>{s.room}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-[11px] text-slate-400 italic text-center py-4">
                          Pas de cours
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
