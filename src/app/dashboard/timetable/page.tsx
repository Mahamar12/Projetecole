'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { TimetableSlot, Classroom, Teacher, Subject } from '@/types';
import { 
  Calendar, PlusCircle, Clock, MapPin, Printer, 
  Users, GraduationCap, School, CheckCircle2, AlertTriangle, 
  Trash2, Filter, Sparkles, X, ChevronRight, BookOpen
} from 'lucide-react';

export default function TimetablePage() {
  const { currentSchool, classes, teachers, subjects, timetables, addTimetableSlot, deleteTimetableSlot } = useApp();

  const [viewMode, setViewMode] = useState<'CLASS' | 'TEACHER' | 'GRID'>('CLASS');
  const [selectedClassId, setSelectedClassId] = useState<string>('c-6a');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('t-1');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for new course slot
  const [newClassId, setNewClassId] = useState('c-6a');
  const [newSubjectId, setNewSubjectId] = useState('s-math');
  const [newTeacherId, setNewTeacherId] = useState('t-1');
  const [newDay, setNewDay] = useState<'LUNDI' | 'MARDI' | 'MERCREDI' | 'JEUDI' | 'VENDREDI' | 'SAMEDI'>('LUNDI');
  const [newStartTime, setNewStartTime] = useState('08:00');
  const [newEndTime, setNewEndTime] = useState('10:00');
  const [newRoom, setNewRoom] = useState('Salle 101');
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const days: ('LUNDI' | 'MARDI' | 'MERCREDI' | 'JEUDI' | 'VENDREDI' | 'SAMEDI')[] = [
    'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'
  ];

  const selectedClass = classes.find((c: Classroom) => c.id === selectedClassId) || classes[0];
  const selectedTeacher = teachers.find((t: Teacher) => t.id === selectedTeacherId) || teachers[0];

  // Filter slots depending on view mode
  const displayedSlots = timetables.filter((slot: TimetableSlot) => {
    if (viewMode === 'CLASS') {
      return slot.classId === selectedClassId || slot.className === selectedClass?.name;
    }
    if (viewMode === 'TEACHER') {
      return slot.teacherId === selectedTeacherId || slot.teacherName.includes(selectedTeacher?.lastName || '');
    }
    return true;
  });

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);

    const cls = classes.find((c: Classroom) => c.id === newClassId);
    const sub = subjects.find((s: Subject) => s.id === newSubjectId);
    const tch = teachers.find((t: Teacher) => t.id === newTeacherId);

    if (!cls || !sub || !tch) return;

    let color = 'bg-blue-100 text-blue-900 border-blue-300';
    if (sub.code === 'FR') color = 'bg-red-100 text-red-900 border-red-300';
    else if (sub.code === 'PC') color = 'bg-purple-100 text-purple-900 border-purple-300';
    else if (sub.code === 'SVT') color = 'bg-emerald-100 text-emerald-900 border-emerald-300';
    else if (sub.code === 'ANG') color = 'bg-amber-100 text-amber-900 border-amber-300';
    else if (sub.code === 'HG') color = 'bg-orange-100 text-orange-900 border-orange-300';
    else if (sub.code === 'EPS') color = 'bg-cyan-100 text-cyan-900 border-cyan-300';
    else if (sub.code === 'INFO') color = 'bg-sky-100 text-sky-900 border-sky-300';

    const res = addTimetableSlot({
      classId: cls.id,
      className: cls.name,
      subjectId: sub.id,
      subjectName: sub.name,
      teacherId: tch.id,
      teacherName: `${tch.firstName.startsWith('M') ? tch.firstName : 'M./Mme'} ${tch.lastName}`,
      dayOfWeek: newDay,
      startTime: newStartTime,
      endTime: newEndTime,
      room: newRoom,
      color,
    });

    if (!res.success) {
      setConflictError(res.error || 'Un conflit a été détecté pour ce créneau.');
    } else {
      setSuccessMessage('Cours ajouté au planning avec succès !');
      setTimeout(() => {
        setIsAddModalOpen(false);
        setSuccessMessage(null);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="no-print bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Planning & Emploi du Temps Interactif</span>
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900">
            Emploi du Temps Scolaire Dynamique
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Affichage instantané par classe ou par enseignant avec détection des conflits de salle
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer (A4)</span>
          </button>
          <button
            onClick={() => {
              setConflictError(null);
              setSuccessMessage(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Ajouter un Cours</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher & Filter Controls */}
      <div className="no-print bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        {/* Top View Selector */}
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mode d'affichage :</span>
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setViewMode('CLASS')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  viewMode === 'CLASS'
                    ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <School className="w-3.5 h-3.5" />
                <span>Vue par Classe</span>
              </button>

              <button
                onClick={() => setViewMode('TEACHER')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  viewMode === 'TEACHER'
                    ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Vue par Enseignant</span>
              </button>

              <button
                onClick={() => setViewMode('GRID')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  viewMode === 'GRID'
                    ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Grille Globale</span>
              </button>
            </div>
          </div>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
            {displayedSlots.length} cours programmés
          </span>
        </div>

        {/* Dynamic Selector Dropdown based on View Mode */}
        {viewMode === 'CLASS' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-2">
                <School className="w-4 h-4 text-blue-600" />
                <span>Sélectionner la classe à afficher :</span>
              </label>

              {/* Quick Class Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {classes.map((cls: Classroom) => {
                  const isSelected = cls.id === selectedClassId;
                  return (
                    <button
                      key={cls.id}
                      onClick={() => setSelectedClassId(cls.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cls.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Class Summary Banner */}
            {selectedClass && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl flex items-center justify-between flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-sm">
                    {selectedClass.name.split(' ')[0]}
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-slate-900 text-base">
                      Emploi du temps — {selectedClass.name}
                    </h3>
                    <div className="text-slate-600 mt-0.5">
                      Cycle : <strong className="text-slate-800">{selectedClass.cycle}</strong> • Salle Principale : <strong className="text-slate-800">{selectedClass.roomNumber || 'Salle 101'}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Professeur Principal</span>
                    <div className="font-bold text-slate-900">{selectedClass.mainTeacherName || 'M. Ibrahima Diallo'}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Effectif Classe</span>
                    <div className="font-extrabold text-blue-700">{selectedClass.studentCount} élèves</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {viewMode === 'TEACHER' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-600" />
                <span>Sélectionner l'enseignant pour voir son planning :</span>
              </label>

              {/* Quick Teacher Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {teachers.map((tch: Teacher) => {
                  const isSelected = tch.id === selectedTeacherId;
                  return (
                    <button
                      key={tch.id}
                      onClick={() => setSelectedTeacherId(tch.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition ${
                        isSelected
                          ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {tch.firstName.split(' ')[0]} {tch.lastName} ({tch.specialty})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Teacher Summary Banner */}
            {selectedTeacher && (
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl flex items-center justify-between flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedTeacher.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={selectedTeacher.firstName}
                    className="w-11 h-11 rounded-xl object-cover border-2 border-amber-200 shadow-sm"
                  />
                  <div>
                    <h3 className="font-heading font-black text-slate-900 text-base">
                      {selectedTeacher.firstName} {selectedTeacher.lastName}
                    </h3>
                    <div className="text-slate-600 mt-0.5">
                      Spécialité : <strong className="text-amber-800">{selectedTeacher.specialty}</strong> • Tél : {selectedTeacher.phone}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Charge Hebdomadaire</span>
                  <div className="font-extrabold text-amber-900 text-sm">
                    {displayedSlots.length * 2} heures de cours / semaine
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Printable Schedule Sheet (A4 Responsive Grid) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl printable-page text-slate-900 font-sans space-y-6">
        {/* Printable Official Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
              RÉPUBLIQUE DU SÉNÉGAL • ANNÉE SCOLAIRE 2024 - 2025
            </div>
            <div className="font-heading font-black text-xl text-blue-900 uppercase mt-1">
              {currentSchool.name}
            </div>
            <div className="text-xs text-slate-600 font-medium italic">
              « {currentSchool.slogan} »
            </div>
          </div>

          <div className="text-right">
            <div className="inline-block px-3 py-1 bg-slate-900 text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-sm">
              EMPLOI DU TEMPS OFFICIEL
            </div>
            <div className="font-heading font-black text-base text-blue-950 mt-1">
              {viewMode === 'CLASS' ? `CLASSE DE ${selectedClass?.name}` : viewMode === 'TEACHER' ? `PLANNING : ${selectedTeacher?.firstName} ${selectedTeacher?.lastName}` : 'GRILLE GLOBALE'}
            </div>
          </div>
        </div>

        {/* Days Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {days.slice(0, 5).map((day) => {
            const daySlots = displayedSlots.filter((s: TimetableSlot) => s.dayOfWeek === day);
            // Sort by start time
            daySlots.sort((a: TimetableSlot, b: TimetableSlot) => a.startTime.localeCompare(b.startTime));

            return (
              <div key={day} className="bg-slate-50/80 rounded-2xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="font-heading font-black text-xs uppercase text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between">
                    <span className="tracking-wider">{day}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white border font-bold text-slate-500">
                      {daySlots.length} cours
                    </span>
                  </div>

                  <div className="space-y-2.5 pt-2.5">
                    {daySlots.length > 0 ? (
                      daySlots.map((slot: TimetableSlot) => (
                        <div
                          key={slot.id}
                          className={`p-3 rounded-2xl border ${slot.color} space-y-1.5 shadow-sm relative group hover:shadow-md transition`}
                        >
                          {/* Top: Subject & Time */}
                          <div className="flex items-center justify-between">
                            <span className="font-heading font-black text-xs leading-snug">
                              {slot.subjectName}
                            </span>
                            <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-white/80 border">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>

                          {/* Teacher Name Prominently Displayed */}
                          <div className="flex items-center gap-1.5 text-xs font-bold opacity-95">
                            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{slot.teacherName}</span>
                          </div>

                          {/* Class / Room info */}
                          <div className="flex items-center justify-between text-[10px] font-semibold opacity-85 pt-1 border-t border-black/10">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{slot.room}</span>
                            </span>
                            <span className="font-extrabold">{slot.className}</span>
                          </div>

                          {/* Delete Slot Button for School Admin */}
                          <button
                            onClick={() => {
                              if (confirm(`Supprimer le cours de ${slot.subjectName} le ${slot.dayOfWeek} ?`)) {
                                deleteTimetableSlot(slot.id);
                              }
                            }}
                            className="no-print absolute top-1 right-1 p-1 rounded-lg bg-white/90 text-rose-600 opacity-0 group-hover:opacity-100 transition shadow-sm"
                            title="Supprimer ce créneau"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-xs text-slate-400 italic bg-white/50 rounded-xl border border-dashed border-slate-200">
                        Aucun cours
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-200/60 font-medium">
                  {daySlots.length * 2} heures de cours
                </div>
              </div>
            );
          })}
        </div>

        {/* Printable Footer Signatures */}
        <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-2 text-xs text-slate-800">
          <div>
            <div className="font-bold uppercase text-[11px]">Le Professeur Principal</div>
            <div className="h-14 flex items-center italic text-slate-400 text-[10px]">
              {selectedClass?.mainTeacherName || 'M. Ibrahima Diallo'}
            </div>
          </div>

          <div className="text-right">
            <div className="font-bold uppercase text-[11px]">Le Directeur des Études & Cachet</div>
            <div className="h-14 flex flex-col items-end justify-center">
              <div className="text-[9px] text-blue-900 font-bold border border-blue-900 px-2 py-0.5 rounded rotate-[-3deg] bg-blue-50 uppercase">
                Approuvé • EIS DAKAR
              </div>
              <div className="text-[10px] font-bold text-slate-800 mt-1">M. Amadou Diallo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal : Ajouter un Cours au Planning */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5" />
                <div>
                  <h3 className="font-heading font-bold text-base">Programmer un Nouveau Cours</h3>
                  <p className="text-[11px] text-blue-100">Avec détection intelligente des conflits de professeur et de salle</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-blue-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddSlot} className="p-6 space-y-4 text-xs">
              {/* Conflict Alert Banner */}
              {conflictError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-800 animate-in shake">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed font-semibold">
                    {conflictError}
                  </div>
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Classe & Matière */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Classe *</label>
                  <select
                    value={newClassId}
                    onChange={(e) => setNewClassId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    {classes.map((c: Classroom) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Matière *</label>
                  <select
                    value={newSubjectId}
                    onChange={(e) => setNewSubjectId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    {subjects.map((s: Subject) => (
                      <option key={s.id} value={s.id}>{s.name} (Coeff {s.defaultCoeff})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Enseignant */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Enseignant Responsable *</label>
                <select
                  value={newTeacherId}
                  onChange={(e) => setNewTeacherId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                >
                  {teachers.map((t: Teacher) => (
                    <option key={t.id} value={t.id}>
                      {t.firstName} {t.lastName} — Spécialité : {t.specialty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Jour & Salle */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jour de la semaine *</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    {days.map((d: string) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Salle de cours *</label>
                  <input
                    type="text"
                    required
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    placeholder="ex: Salle 101, Labo Sciences 2"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Horaires */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Heure de début *</label>
                  <select
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="08:00">08:00</option>
                    <option value="10:15">10:15</option>
                    <option value="15:00">15:00</option>
                    <option value="17:15">17:15</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Heure de fin *</label>
                  <select
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="10:00">10:00</option>
                    <option value="12:15">12:15</option>
                    <option value="17:00">17:00</option>
                    <option value="19:15">19:15</option>
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/30 transition hover:scale-105"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Valider le Créneau</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
