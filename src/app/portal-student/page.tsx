'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Student, HomeworkItem } from '@/types';
import { 
  GraduationCap, Award, Calendar, BookOpen, Clock, 
  CheckCircle2, FileSpreadsheet, Printer, Sparkles, User, X, ChevronRight, MessageSquare
} from 'lucide-react';
import ReportCardView from '@/components/documents/ReportCardView';

interface TeacherSubjectNotes {
  teacherId: string;
  teacherName: string;
  photo: string;
  subject: string;
  coeff: number;
  average: number;
  notesDevoirs: { title: string; score: number; max: number; date: string }[];
  notesExercices: { title: string; score: number; max: number; date: string }[];
  noteComposition: { title: string; score: number; max: number; date: string };
  appreciation: string;
}

export default function StudentPortalPage() {
  const { students, timetables, homeworks, activeReportCard, teachers } = useApp();

  // Demo active student: Awa Diop (3ème A)
  const currentStudent = students[0];
  const [activeTab, setActiveTab] = useState<'GRADES' | 'TIMETABLE' | 'BULLETIN' | 'HOMEWORK'>('GRADES');
  const [selectedTeacherNotes, setSelectedTeacherNotes] = useState<TeacherSubjectNotes | null>(null);

  const myTimetable = timetables.filter((s: any) => s.className === currentStudent.className || s.classId === currentStudent.classId);
  const days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI'];

  // List of subject teachers with detailed published grades
  const teacherSubjectData: TeacherSubjectNotes[] = [
    {
      teacherId: 't-1',
      teacherName: 'M. Ibrahima Diallo',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      subject: 'Mathématiques',
      coeff: 4,
      average: 17.17,
      notesDevoirs: [
        { title: 'Devoir N°1 — Algèbre & Équations', score: 17, max: 20, date: '12 Oct 2024' },
        { title: 'Devoir N°2 — Théorème de Pythagore', score: 18, max: 20, date: '05 Nov 2024' },
      ],
      notesExercices: [
        { title: 'Interrogation N°1 — Calcul vectoriel', score: 17.5, max: 20, date: '20 Oct 2024' },
      ],
      noteComposition: { title: 'Composition Trimestre 1', score: 16.5, max: 20, date: '02 Déc 2024' },
      appreciation: 'Excellentes compétences en calcul et géométrie. Travail très rigoureux et régulier.',
    },
    {
      teacherId: 't-2',
      teacherName: 'Mme Fatou Bintou Sow',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      subject: 'Français & Littérature',
      coeff: 4,
      average: 15.50,
      notesDevoirs: [
        { title: 'Devoir de Rédaction — Expression Écrite', score: 15, max: 20, date: '15 Oct 2024' },
        { title: 'Contrôle de Grammaire & Conjugaison', score: 16, max: 20, date: '08 Nov 2024' },
      ],
      notesExercices: [
        { title: 'Exposé Oral — Une si longue lettre', score: 16, max: 20, date: '25 Oct 2024' },
      ],
      noteComposition: { title: 'Composition Trimestre 1 (Explication de Texte)', score: 15.5, max: 20, date: '03 Déc 2024' },
      appreciation: 'Bonne qualité de rédaction et très bonne aisance à l\'oral. Continue ainsi !',
    },
    {
      teacherId: 't-3',
      teacherName: 'M. Cheikh Tidiane Sy',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      subject: 'Physique - Chimie',
      coeff: 3,
      average: 17.50,
      notesDevoirs: [
        { title: 'Devoir N°1 — Chimie Organique', score: 18, max: 20, date: '18 Oct 2024' },
        { title: 'Devoir N°2 — Électricité & Circuits', score: 17.5, max: 20, date: '12 Nov 2024' },
      ],
      notesExercices: [
        { title: 'Travaux Pratiques en Laboratoire', score: 18, max: 20, date: '28 Oct 2024' },
      ],
      noteComposition: { title: 'Composition Trimestre 1', score: 17.0, max: 20, date: '04 Déc 2024' },
      appreciation: 'Remarquable esprit d\'analyse scientifique. Participation active en classe.',
    },
    {
      teacherId: 't-5',
      teacherName: 'M. Ousmane Sembène',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      subject: 'Sciences de la Vie et de la Terre (SVT)',
      coeff: 2,
      average: 15.83,
      notesDevoirs: [
        { title: 'Devoir de Géologie & Séismes', score: 16, max: 20, date: '14 Oct 2024' },
        { title: 'Schéma du Système Cardiaque', score: 15, max: 20, date: '10 Nov 2024' },
      ],
      notesExercices: [
        { title: 'Interrogation Écrite — Biologie Végétale', score: 16, max: 20, date: '22 Oct 2024' },
      ],
      noteComposition: { title: 'Composition Trimestre 1', score: 16.5, max: 20, date: '05 Déc 2024' },
      appreciation: 'Très bon travail. Bonne assimilation des mécanismes biologiques.',
    },
    {
      teacherId: 't-4',
      teacherName: 'Mme Mariama Ba',
      photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
      subject: 'Anglais',
      coeff: 2,
      average: 15.00,
      notesDevoirs: [
        { title: 'Reading Comprehension Test', score: 14, max: 20, date: '16 Oct 2024' },
        { title: 'Essay Writing — African Culture', score: 15, max: 20, date: '11 Nov 2024' },
      ],
      notesExercices: [
        { title: 'Listening Comprehension & Vocabulary', score: 15, max: 20, date: '24 Oct 2024' },
      ],
      noteComposition: { title: 'First Term Examination', score: 16.0, max: 20, date: '06 Déc 2024' },
      appreciation: 'Good progress in English. Keep working on fluency and vocabulary.',
    },
    {
      teacherId: 't-6',
      teacherName: 'Mme Aminata Traoré',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      subject: 'Histoire - Géographie',
      coeff: 2,
      average: 16.50,
      notesDevoirs: [
        { title: 'Devoir d\'Histoire — L\'Afrique précoloniale', score: 16, max: 20, date: '19 Oct 2024' },
        { title: 'Cartographie & Climatologie', score: 16.5, max: 20, date: '14 Nov 2024' },
      ],
      notesExercices: [
        { title: 'Interrogation sur les Ressources Minières', score: 17, max: 20, date: '29 Oct 2024' },
      ],
      noteComposition: { title: 'Composition Trimestre 1', score: 17.0, max: 20, date: '07 Déc 2024' },
      appreciation: 'Culture générale impressionnante. Analyse critique et synthétique très appréciée.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Student Profile Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentStudent.photo || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'}
            alt={currentStudent.firstName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-400 shadow-md"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-600 text-blue-200 text-xs font-bold mb-1">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Portail Élève • Année Scolaire 2024-2025</span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl">
              {currentStudent.firstName} {currentStudent.lastName}
            </h1>
            <p className="text-xs sm:text-sm text-blue-200 mt-0.5">
              Classe de <strong className="text-white">{currentStudent.className}</strong> • Matricule : <span className="font-mono text-white font-bold">{currentStudent.matricule}</span>
            </p>
          </div>
        </div>

        {/* Quick Rank Badge */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-right shrink-0">
          <div className="text-[10px] uppercase font-bold text-blue-200">Moyenne Générale (T1)</div>
          <div className="font-heading font-black text-2xl text-emerald-300">
            {currentStudent.averageGrade?.toFixed(2)} <span className="text-xs text-slate-300">/ 20</span>
          </div>
          <div className="text-[11px] font-bold text-amber-300 mt-0.5">
            ★ Rang : 1ère sur 29 élèves
          </div>
        </div>
      </div>

      {/* Student Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold">
        <button
          onClick={() => setActiveTab('GRADES')}
          className={`py-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
            activeTab === 'GRADES' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Mes Profs & Notes</span>
        </button>

        <button
          onClick={() => setActiveTab('TIMETABLE')}
          className={`py-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
            activeTab === 'TIMETABLE' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Mon Emploi du Temps</span>
        </button>

        <button
          onClick={() => setActiveTab('BULLETIN')}
          className={`py-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
            activeTab === 'BULLETIN' ? 'bg-rose-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Mon Bulletin & Rang</span>
        </button>

        <button
          onClick={() => setActiveTab('HOMEWORK')}
          className={`py-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
            activeTab === 'HOMEWORK' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Devoirs à Faire</span>
        </button>
      </div>

      {/* TAB 1 : MES PROFESSEURS ET LEURS NOTES PUBLIÉES */}
      {activeTab === 'GRADES' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Mes Enseignants & Relevés de Notes par Matière
                </h3>
                <p className="text-slate-500 text-xs">
                  Cliquez sur un professeur pour consulter le détail de vos devoirs, interrogations et compositions
                </p>
              </div>
              <span className="font-extrabold text-blue-900 text-xs bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                {teacherSubjectData.length} Enseignants de {currentStudent.className}
              </span>
            </div>

            {/* Grid of Teacher Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teacherSubjectData.map((item) => (
                <div
                  key={item.teacherId}
                  onClick={() => setSelectedTeacherNotes(item)}
                  className="bg-slate-50 hover:bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-500/50 hover:shadow-lg transition cursor-pointer group space-y-3 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.photo}
                      alt={item.teacherName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm group-hover:scale-105 transition"
                    />
                    <div>
                      <div className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition">
                        {item.teacherName}
                      </div>
                      <div className="text-[11px] font-bold text-blue-800 flex items-center gap-1">
                        <span>{item.subject}</span>
                        <span className="text-[10px] bg-blue-100 text-blue-900 px-1.5 py-0.2 rounded">
                          Coeff {item.coeff}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Moyenne</span>
                      <span className="font-extrabold text-blue-900 text-base">{item.average.toFixed(2)} / 20</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 group-hover:translate-x-1 transition">
                      <span>Voir mes notes</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETAILED NOTES PER TEACHER */}
      {selectedTeacherNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedTeacherNotes.photo}
                  alt={selectedTeacherNotes.teacherName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
                />
                <div>
                  <div className="text-[10px] font-extrabold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded inline-block">
                    {selectedTeacherNotes.subject} • Coeff {selectedTeacherNotes.coeff}
                  </div>
                  <h3 className="font-heading font-black text-lg text-slate-900 mt-0.5">
                    {selectedTeacherNotes.teacherName}
                  </h3>
                  <p className="text-xs text-slate-500">Enseignant de {currentStudent.className}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTeacherNotes(null)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Subject Average Badge */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-4 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-200">Moyenne Actuelle de la Matière</span>
                <div className="font-heading font-black text-2xl text-emerald-300">
                  {selectedTeacherNotes.average.toFixed(2)} <span className="text-xs text-slate-300">/ 20</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-white/20 text-white px-2 py-1 rounded font-bold">1er Trimestre</span>
              </div>
            </div>

            {/* Section 1 : Devoirs de classe */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>📝 Devoirs de Classe</span>
                <span className="text-slate-400 text-[10px]">Notes publiées</span>
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl p-3 bg-slate-50 space-y-2">
                {selectedTeacherNotes.notesDevoirs.map((n, idx) => (
                  <div key={idx} className="pt-2 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{n.title}</div>
                      <div className="text-[10px] text-slate-400">{n.date}</div>
                    </div>
                    <div className="font-extrabold text-blue-900 text-sm bg-white px-3 py-1 rounded-xl border border-slate-200">
                      {n.score} / {n.max}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2 : Interrogations & Exercices */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>✏️ Interrogations & Exercices</span>
                <span className="text-slate-400 text-[10px]">Notes d'oral / TP</span>
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl p-3 bg-slate-50 space-y-2">
                {selectedTeacherNotes.notesExercices.map((n, idx) => (
                  <div key={idx} className="pt-2 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{n.title}</div>
                      <div className="text-[10px] text-slate-400">{n.date}</div>
                    </div>
                    <div className="font-extrabold text-blue-900 text-sm bg-white px-3 py-1 rounded-xl border border-slate-200">
                      {n.score} / {n.max}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3 : Composition Trimestrielle */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>📜 Composition du Trimestre</span>
                <span className="text-amber-600 font-bold text-[10px]">Coeff {selectedTeacherNotes.coeff}</span>
              </h4>
              <div className="border border-amber-200 rounded-2xl p-3 bg-amber-50/50 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{selectedTeacherNotes.noteComposition.title}</div>
                  <div className="text-[10px] text-slate-500">{selectedTeacherNotes.noteComposition.date}</div>
                </div>
                <div className="font-black text-amber-900 text-base bg-white px-3 py-1 rounded-xl border border-amber-300">
                  {selectedTeacherNotes.noteComposition.score} / {selectedTeacherNotes.noteComposition.max}
                </div>
              </div>
            </div>

            {/* Section 4 : Appréciation de l'Enseignant */}
            <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-2xl space-y-1 text-xs">
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>Appréciation de {selectedTeacherNotes.teacherName} :</span>
              </div>
              <p className="text-slate-600 italic text-[11px] leading-relaxed">
                « {selectedTeacherNotes.appreciation} »
              </p>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedTeacherNotes(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
              >
                Fermer la Fiche Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2 : MON EMPLOI DU TEMPS */}
      {activeTab === 'TIMETABLE' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Mon Emploi du Temps Hebdomadaire — Classe de {currentStudent.className}
              </h3>
              <p className="text-slate-500 text-[11px]">Planning officiel des cours, professeurs et salles de classe</p>
            </div>
            <button onClick={() => window.print()} className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded-xl flex items-center gap-1">
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer mon planning</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {days.map((d) => {
              const daySlots = myTimetable.filter((s: any) => s.dayOfWeek === d);
              return (
                <div key={d} className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                  <div className="font-heading font-black text-xs text-slate-800 uppercase border-b pb-1">
                    {d}
                  </div>
                  {daySlots.length > 0 ? (
                    daySlots.map((slot: any) => (
                      <div key={slot.id} className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-sm">
                        <div className="font-bold text-blue-900">{slot.subjectName}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{slot.startTime} - {slot.endTime}</div>
                        <div className="text-[10px] text-slate-700 font-semibold">{slot.teacherName} • {slot.room}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400 text-[11px] italic py-4 text-center">Pas de cours</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3 : MON BULLETIN */}
      {activeTab === 'BULLETIN' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Mon Bulletin Scolaire Officiel — 1er Trimestre
              </h3>
              <p className="text-slate-500 text-xs">Relevé de notes certifié avec signatures et appréciations du conseil</p>
            </div>
            <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md">
              <Printer className="w-4 h-4" />
              <span>Imprimer mon Bulletin (A4)</span>
            </button>
          </div>

          <ReportCardView reportCard={activeReportCard} />
        </div>
      )}

      {/* TAB 4 : DEVOIRS À FAIRE */}
      {activeTab === 'HOMEWORK' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Mes Devoirs et Exercices à Rendre
              </h3>
              <p className="text-slate-500 text-[11px]">Cahier de texte en ligne pour la classe de {currentStudent.className}</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {homeworks.map((hw: HomeworkItem) => (
              <div key={hw.id} className="py-3.5 flex items-start justify-between gap-4">
                <div>
                  <span className="font-bold text-blue-700 uppercase text-[10px] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{hw.subjectName}</span>
                  <h4 className="font-bold text-slate-900 mt-1 text-sm">{hw.title}</h4>
                  <p className="text-slate-600 leading-relaxed mt-0.5">{hw.description}</p>
                  <div className="text-[10px] text-slate-400 mt-1 font-medium">Donné par M. Diallo</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-100 block">
                    À rendre : {hw.dueDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
