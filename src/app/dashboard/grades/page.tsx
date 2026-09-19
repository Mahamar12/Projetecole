'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Classroom, Subject } from '@/types';
import { calculateWeightedAverage, getMention, getRankSuffix } from '@/lib/grading';
import { 
  FileSpreadsheet, PlusCircle, CheckCircle2, 
  Search, Award, Sparkles, Printer, Save, Lock, Unlock, 
  Edit3, Eye, Clock, Users, Calendar, Filter, X, ChevronRight, ShieldCheck
} from 'lucide-react';

interface GradeRow {
  studentId: string;
  studentName: string;
  matricule: string;
  devoir1: number;
  devoir2: number;
  composition: number;
  coeff: number;
}

interface TeacherPublication {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherPhoto: string;
  className: string;
  subjectName: string;
  coeff: number;
  evalType: string;
  title: string;
  date: string;
  publishedAt: string;
  studentCount: number;
  classAverage: number;
  isLocked: boolean;
  grades: { studentId: string; studentName: string; matricule: string; score: number }[];
}

export default function GradesEntryPage() {
  const { classes, subjects, students, teachers, addNotification } = useApp();

  const [mainTab, setMainTab] = useState<'SPREADSHEET' | 'PUBLICATIONS'>('PUBLICATIONS');
  const [selectedClassId, setSelectedClassId] = useState('c-3a');
  const [selectedSubjectId, setSelectedSubjectId] = useState('s-math');
  const [term, setTerm] = useState('TRIMESTRE_1');
  const [isSaved, setIsSaved] = useState(false);

  // Selected Publication for Director Modal Inspection/Modification
  const [selectedPublication, setSelectedPublication] = useState<TeacherPublication | null>(null);
  const [editingGrades, setEditingGrades] = useState<{ [studentId: string]: number }>({});
  const [isDirectorSaved, setIsDirectorSaved] = useState(false);

  // List of Mock Teacher Publications across the school
  const [publications, setPublications] = useState<TeacherPublication[]>([
    {
      id: 'pub-1',
      teacherId: 't-1',
      teacherName: 'M. Ibrahima Diallo',
      teacherPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      className: '3ème A',
      subjectName: 'Mathématiques',
      coeff: 4,
      evalType: 'DEVOIR',
      title: 'Devoir N°2 — Théorème de Pythagore',
      date: '28/09/2025',
      publishedAt: '28/09/2025 à 14h30',
      studentCount: 5,
      classAverage: 15.20,
      isLocked: true,
      grades: [
        { studentId: 'stu-1', studentName: 'Awa Diop', matricule: 'EIS-2024-0012', score: 18 },
        { studentId: 'stu-7', studentName: 'Aïssatou Sarr', matricule: 'EIS-2024-0102', score: 10.5 },
        { studentId: 'stu-8', studentName: 'Ibrahima Ndao', matricule: 'EIS-2024-0115', score: 15 },
        { studentId: 'stu-9', studentName: 'Khadija Gomis', matricule: 'EIS-2024-0120', score: 12 },
        { studentId: 'stu-10', studentName: 'Ousmane Cissé', matricule: 'EIS-2024-0125', score: 9 },
      ],
    },
    {
      id: 'pub-2',
      teacherId: 't-2',
      teacherName: 'Mme Fatou Bintou Sow',
      teacherPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      className: '6ème B',
      subjectName: 'Français & Littérature',
      coeff: 4,
      evalType: 'COMPOSITION',
      title: 'Composition du 1er Trimestre (Explication de texte)',
      date: '03/12/2024',
      publishedAt: '03/12/2024 à 16h45',
      studentCount: 4,
      classAverage: 14.85,
      isLocked: true,
      grades: [
        { studentId: 'stu-2', studentName: 'Moussa Diop', matricule: 'EIS-2024-0045', score: 14 },
        { studentId: 'stu-11', studentName: 'Oumar Sall', matricule: 'EIS-2024-0130', score: 15.5 },
        { studentId: 'stu-12', studentName: 'Mariama Niane', matricule: 'EIS-2024-0135', score: 16 },
        { studentId: 'stu-13', studentName: 'Cheikh Bamba', matricule: 'EIS-2024-0140', score: 14 },
      ],
    },
    {
      id: 'pub-3',
      teacherId: 't-3',
      teacherName: 'M. Cheikh Tidiane Sy',
      teacherPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      className: '1ère S1',
      subjectName: 'Physique - Chimie',
      coeff: 3,
      evalType: 'EXAMEN',
      title: 'Examen Blanc Régional — Ondes & Chimie',
      date: '15/11/2024',
      publishedAt: '15/11/2024 à 11h20',
      studentCount: 3,
      classAverage: 16.10,
      isLocked: true,
      grades: [
        { studentId: 'stu-1', studentName: 'Awa Diop', matricule: 'EIS-2024-0012', score: 17.5 },
        { studentId: 'stu-8', studentName: 'Ibrahima Ndao', matricule: 'EIS-2024-0115', score: 15.5 },
        { studentId: 'stu-9', studentName: 'Khadija Gomis', matricule: 'EIS-2024-0120', score: 15.3 },
      ],
    },
    {
      id: 'pub-4',
      teacherId: 't-5',
      teacherName: 'M. Ousmane Sembène',
      teacherPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      className: 'Terminale S2',
      subjectName: 'SVT',
      coeff: 2,
      evalType: 'EXERCICE',
      title: 'Interrogation Écrite — Biologie Végétale',
      date: '22/10/2024',
      publishedAt: '22/10/2024 à 10h00',
      studentCount: 3,
      classAverage: 15.33,
      isLocked: true,
      grades: [
        { studentId: 'stu-5', studentName: 'Fatou Sow', matricule: 'EIS-2024-0089', score: 16 },
        { studentId: 'stu-14', studentName: 'Saliou Gueye', matricule: 'EIS-2024-0145', score: 15 },
        { studentId: 'stu-15', studentName: 'Astou Camara', matricule: 'EIS-2024-0150', score: 15 },
      ],
    },
  ]);

  // Sample grades state for spreadsheet matrix
  const [gradeRows, setGradeRows] = useState<GradeRow[]>([
    { studentId: 'stu-1', studentName: 'Awa Diop', matricule: 'EIS-2024-0012', devoir1: 17, devoir2: 18, composition: 16.5, coeff: 4 },
    { studentId: 'stu-7', studentName: 'Aïssatou Sarr', matricule: 'EIS-2024-0102', devoir1: 11, devoir2: 10.5, composition: 12, coeff: 4 },
    { studentId: 'stu-8', studentName: 'Ibrahima Ndao', matricule: 'EIS-2024-0115', devoir1: 14, devoir2: 15, composition: 13.5, coeff: 4 },
    { studentId: 'stu-9', studentName: 'Khadija Gomis', matricule: 'EIS-2024-0120', devoir1: 13, devoir2: 12, composition: 14, coeff: 4 },
    { studentId: 'stu-10', studentName: 'Ousmane Cissé', matricule: 'EIS-2024-0125', devoir1: 8.5, devoir2: 9, composition: 10, coeff: 4 },
  ]);

  const updateGrade = (studentId: string, field: 'devoir1' | 'devoir2' | 'composition', value: number) => {
    setGradeRows(prev => prev.map((r: GradeRow) => r.studentId === studentId ? { ...r, [field]: value } : r));
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Open Director inspection modal for a publication
  const handleOpenDirectorInspection = (pub: TeacherPublication) => {
    setSelectedPublication(pub);
    const initialEditing: { [id: string]: number } = {};
    pub.grades.forEach(g => {
      initialEditing[g.studentId] = g.score;
    });
    setEditingGrades(initialEditing);
  };

  // Director saves modifications to a published evaluation
  const handleDirectorSaveModification = () => {
    if (!selectedPublication) return;

    const updatedGrades = selectedPublication.grades.map(g => ({
      ...g,
      score: editingGrades[g.studentId] !== undefined ? editingGrades[g.studentId] : g.score,
    }));

    const newSum = updatedGrades.reduce((acc, g) => acc + g.score, 0);
    const newAverage = Number((newSum / Math.max(updatedGrades.length, 1)).toFixed(2));

    const updatedPublication: TeacherPublication = {
      ...selectedPublication,
      grades: updatedGrades,
      classAverage: newAverage,
    };

    setPublications(prev => prev.map(p => p.id === selectedPublication.id ? updatedPublication : p));
    setIsDirectorSaved(true);

    addNotification({
      title: 'Modification de Notes par la Direction',
      message: `Le Directeur a ajusté les notes de "${selectedPublication.title}" de ${selectedPublication.teacherName}.`,
      type: 'ANNOUNCEMENT',
      channel: 'IN_APP',
      recipient: 'Enseignant & Parents',
    });

    setTimeout(() => {
      setIsDirectorSaved(false);
      setSelectedPublication(null);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Console Direction • Supervision & Évaluations</span>
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900">
            Gestion & Supervision des Notes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Historique des publications des enseignants, déverrouillage et droits d'édition exclusifs du Directeur
          </p>
        </div>

        <div className="flex items-center gap-3">
          {mainTab === 'SPREADSHEET' && (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition hover:scale-105"
            >
              {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{isSaved ? 'Notes Enregistrées !' : 'Enregistrer les Notes'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Director Main Navigation Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold">
        <button
          onClick={() => setMainTab('PUBLICATIONS')}
          className={`py-3 rounded-xl flex items-center justify-center gap-2 transition ${
            mainTab === 'PUBLICATIONS'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-4 h-4 text-blue-400" />
          <span>Publications des Enseignants (Liste & Supervision)</span>
          <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full">
            {publications.length}
          </span>
        </button>

        <button
          onClick={() => setMainTab('SPREADSHEET')}
          className={`py-3 rounded-xl flex items-center justify-center gap-2 transition ${
            mainTab === 'SPREADSHEET'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-blue-200" />
          <span>Grille Globale de Saisie (Matrice)</span>
        </button>
      </div>

      {/* TAB 1: LISTE DES PUBLICATIONS DES ENSEIGNANTS FOR DIRECTOR */}
      {mainTab === 'PUBLICATIONS' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Publications des Enseignants (Historique en Liste)
              </h3>
              <p className="text-xs text-slate-500">
                Consultez, déverrouillez et modifiez les évaluations publiées par les professeurs de l'établissement
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Privilège Directeur : Édition & Déverrouillage Actifs</span>
            </div>
          </div>

          {/* Publications Table List */}
          <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden text-xs">
            {publications.map((pub) => (
              <div
                key={pub.id}
                onClick={() => handleOpenDirectorInspection(pub)}
                className="p-4 hover:bg-blue-50/40 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                {/* Left: Teacher Info & Title */}
                <div className="flex items-start gap-3">
                  <img
                    src={pub.teacherPhoto}
                    alt={pub.teacherName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm group-hover:scale-105 transition shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition">
                        {pub.teacherName}
                      </span>
                      <span className="text-[10px] font-extrabold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                        {pub.subjectName} • {pub.className}
                      </span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        Coeff {pub.coeff}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-slate-800 text-xs mt-1">
                      {pub.title}
                    </h4>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span>📅 Date évaluation : <strong>{pub.date}</strong></span>
                      <span>•</span>
                      <span>🕒 Transmis le : {pub.publishedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Metrics & Action Button */}
                <div className="flex items-center gap-4 text-right shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Moyenne Classe</div>
                    <div className="font-extrabold text-blue-900 text-base">{pub.classAverage.toFixed(2)} / 20</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">{pub.studentCount} élèves évalués</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Verrouillé Prof</span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDirectorInspection(pub);
                      }}
                      className="px-4 py-2 bg-blue-600 group-hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm text-xs flex items-center gap-1.5 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Inspecter / Modifier</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DIRECTOR INSPECTION & MODIFICATION MODAL */}
      {selectedPublication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto border border-slate-200 text-xs">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedPublication.teacherPhoto}
                  alt={selectedPublication.teacherName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-extrabold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded">
                      {selectedPublication.subjectName} • {selectedPublication.className}
                    </span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-amber-700" />
                      <span>Privilège Directeur</span>
                    </span>
                  </div>
                  <h3 className="font-heading font-black text-lg text-slate-900">
                    {selectedPublication.title}
                  </h3>
                  <p className="text-slate-500 text-[11px]">
                    Publié par <strong>{selectedPublication.teacherName}</strong> le {selectedPublication.date}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPublication(null)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Director Notice */}
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-blue-900 flex items-center justify-between gap-3">
              <div>
                <span className="font-bold text-xs block">✏️ Modification réservée au Directeur</span>
                <span className="text-[11px] text-blue-700">
                  Vous pouvez ajuster les notes de n'importe quel élève. Les moyennes seront recalculées instantanément.
                </span>
              </div>
              <span className="font-extrabold text-blue-900 text-sm bg-white px-3 py-1 rounded-xl border border-blue-200 shrink-0">
                Moyenne : {selectedPublication.classAverage.toFixed(2)} / 20
              </span>
            </div>

            {/* Students Grades List for Modification */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
              <div className="p-3 bg-slate-50 font-bold text-slate-600 uppercase text-[10px] flex items-center justify-between">
                <span>Élèves de {selectedPublication.className} ({selectedPublication.grades.length})</span>
                <span>Note attribuée (/20)</span>
              </div>

              {selectedPublication.grades.map((g) => (
                <div key={g.studentId} className="p-3.5 flex items-center justify-between gap-3 bg-white hover:bg-slate-50/80 transition">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{g.studentName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{g.matricule}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={20}
                      step={0.5}
                      value={editingGrades[g.studentId] !== undefined ? editingGrades[g.studentId] : g.score}
                      onChange={(e) => setEditingGrades({
                        ...editingGrades,
                        [g.studentId]: Number(e.target.value)
                      })}
                      className="w-24 text-center font-black text-blue-900 bg-blue-50 border border-blue-300 rounded-xl p-2 focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  addNotification({
                    title: 'Publication Déverrouillée',
                    message: `Le Directeur a réautorisé l'enseignant ${selectedPublication.teacherName} à modifier l'évaluation ${selectedPublication.title}.`,
                    type: 'ANNOUNCEMENT',
                    channel: 'IN_APP',
                    recipient: selectedPublication.teacherName,
                  });
                  setSelectedPublication(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition flex items-center gap-1.5"
              >
                <Unlock className="w-4 h-4 text-slate-500" />
                <span>Déverrouiller pour l'Enseignant</span>
              </button>

              <button
                type="button"
                onClick={handleDirectorSaveModification}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition flex items-center gap-2"
              >
                {isDirectorSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
                <span>{isDirectorSaved ? 'Modifications Enregistrées !' : 'Enregistrer les Modifications (Directeur)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GRILLE GLOBALE DES NOTES (SPREADSHEET MATRIX) */}
      {mainTab === 'SPREADSHEET' && (
        <div className="space-y-4">
          {/* Selectors Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Classe :</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {classes.map((c: Classroom) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.level})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Matière & Coefficient :</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {subjects.map((s: Subject) => (
                  <option key={s.id} value={s.id}>{s.name} (Coeff {s.defaultCoeff})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Période :</label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="TRIMESTRE_1">1er Trimestre (Oct - Déc)</option>
                <option value="TRIMESTRE_2">2ème Trimestre (Jan - Mars)</option>
                <option value="TRIMESTRE_3">3ème Trimestre (Avr - Juin)</option>
              </select>
            </div>
          </div>

          {/* Grades Table Matrix */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Élève</th>
                    <th className="p-4 text-center">Devoir 1 (/20)</th>
                    <th className="p-4 text-center">Devoir 2 (/20)</th>
                    <th className="p-4 text-center">Composition (/20)</th>
                    <th className="p-4 text-center">Moyenne Matière</th>
                    <th className="p-4 text-center">Mention</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {gradeRows.map((row) => {
                    const avg = Number(((row.devoir1 + row.devoir2 + (row.composition * 2)) / 4).toFixed(2));
                    const mention = getMention(avg);

                    return (
                      <tr key={row.studentId} className="hover:bg-slate-50 transition">
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{row.studentName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{row.matricule}</div>
                        </td>

                        {/* Input Devoir 1 */}
                        <td className="p-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.25"
                            value={row.devoir1}
                            onChange={(e) => updateGrade(row.studentId, 'devoir1', Number(e.target.value))}
                            className="w-20 text-center font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2 focus:bg-white focus:ring-2 focus:ring-blue-500"
                          />
                        </td>

                        {/* Input Devoir 2 */}
                        <td className="p-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.25"
                            value={row.devoir2}
                            onChange={(e) => updateGrade(row.studentId, 'devoir2', Number(e.target.value))}
                            className="w-20 text-center font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2 focus:bg-white focus:ring-2 focus:ring-blue-500"
                          />
                        </td>

                        {/* Input Composition */}
                        <td className="p-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.25"
                            value={row.composition}
                            onChange={(e) => updateGrade(row.studentId, 'composition', Number(e.target.value))}
                            className="w-20 text-center font-bold text-blue-900 bg-blue-50/50 border border-blue-200 rounded-xl p-2 focus:bg-white focus:ring-2 focus:ring-blue-500"
                          />
                        </td>

                        {/* Moyenne Calculée */}
                        <td className="p-4 text-center">
                          <span className="font-heading font-black text-sm text-blue-900 bg-blue-100/60 px-3 py-1 rounded-xl">
                            {avg.toFixed(2)} / 20
                          </span>
                        </td>

                        {/* Mention */}
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${mention.badgeColor}`}>
                            {mention.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
