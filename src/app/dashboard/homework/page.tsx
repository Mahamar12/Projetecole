'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { HomeworkItem, Classroom, Subject } from '@/types';
import { BookOpen, PlusCircle, Calendar, Clock, CheckCircle2, FileText, X } from 'lucide-react';

export default function HomeworkPage() {
  const { homeworks, addHomework, classes, subjects } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectName, setSubjectName] = useState('Mathématiques');
  const [className, setClassName] = useState('3ème A');
  const [dueDate, setDueDate] = useState('2025-02-26');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    addHomework({
      title,
      description,
      subjectId: 's-math',
      subjectName,
      classId: 'c-3a',
      className,
      teacherName: 'M. Ibrahima Diallo',
      dueDate,
      totalStudents: 29,
    });

    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Travail Personnel & Devoirs</span>
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900">
            Cahier de Texte & Devoirs ({homeworks.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Publication des exercices à faire à la maison et consultation par les parents et élèves
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/30 transition hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Publier un Devoir</span>
        </button>
      </div>

      {/* Homework List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {homeworks.map((hw: HomeworkItem) => (
          <div key={hw.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 text-[10px] font-black uppercase">
                  {hw.subjectName}
                </span>
                <span className="text-[11px] font-bold text-slate-700">{hw.className}</span>
              </div>

              <h3 className="font-heading font-bold text-base text-slate-900 leading-snug">
                {hw.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                {hw.description}
              </p>

              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                <span>Par : <strong className="text-slate-800">{hw.teacherName}</strong></span>
                <span className="flex items-center gap-1 font-bold text-rose-600">
                  <Clock className="w-3.5 h-3.5" />
                  Pour le : {hw.dueDate}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                Rendus : <strong>{hw.submissionsCount || 0}</strong> / {hw.totalStudents || 29}
              </span>
              <button className="font-bold text-blue-600 hover:underline">
                Détails →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Publier Devoir */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-bold text-lg text-slate-900">Publier un Nouveau Devoir</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Titre de l'évaluation / devoir *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Exercices page 92 - Théorème de Thalès"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Classe *</label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-amber-500"
                  >
                    {classes.map((c: Classroom) => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Matière *</label>
                  <select
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-amber-500"
                  >
                    {subjects.map((s: Subject) => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date limite de remise *</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Consignes détaillées *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Détaillez les exercices à faire et consignes de rédaction..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 shadow-md"
                >
                  Publier le Devoir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
