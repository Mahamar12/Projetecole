'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Student, Classroom, Subject, Teacher } from '@/types';
import ReportCardView from '@/components/documents/ReportCardView';
import { generateReportCardForStudent } from '@/lib/grading';
import { 
  Award, Printer, Download, Search, Users, ChevronRight, 
  School, User, Calendar, CheckCircle2, Sparkles, Filter,
  GraduationCap
} from 'lucide-react';

export default function ReportCardsGeneratorPage() {
  const { students, classes, subjects, teachers } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>('c-3a');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('stu-1');
  const [selectedTerm, setSelectedTerm] = useState<string>('TRIMESTRE_1');

  // Filter students based on selected class
  const filteredStudents = useMemo(() => {
    if (selectedClassId === 'ALL') {
      return students;
    }
    return students.filter((s: Student) => s.classId === selectedClassId);
  }, [students, selectedClassId]);

  // When class changes, automatically update selectedStudentId to the first student of that class
  const handleClassChange = (newClassId: string) => {
    setSelectedClassId(newClassId);
    const studentsInNewClass = newClassId === 'ALL' 
      ? students 
      : students.filter((s: Student) => s.classId === newClassId);
    
    if (studentsInNewClass.length > 0) {
      setSelectedStudentId(studentsInNewClass[0].id);
    }
  };

  // Find currently selected student
  const currentStudent = useMemo(() => {
    return students.find((s: Student) => s.id === selectedStudentId) || filteredStudents[0] || students[0];
  }, [students, filteredStudents, selectedStudentId]);

  // Find currently selected class object
  const currentClass = useMemo(() => {
    return classes.find((c: Classroom) => c.id === selectedClassId) || 
           classes.find((c: Classroom) => c.id === currentStudent?.classId) || 
           classes[0];
  }, [classes, selectedClassId, currentStudent]);

  // Get all classmates for rank calculation
  const classmates = useMemo(() => {
    if (!currentStudent) return [];
    return students.filter((s: Student) => s.classId === currentStudent.classId);
  }, [students, currentStudent]);

  // Generate dynamic report card
  const generatedReportCard = useMemo(() => {
    if (!currentStudent) return null;
    return generateReportCardForStudent(
      currentStudent,
      selectedTerm,
      subjects,
      teachers,
      classmates
    );
  }, [currentStudent, selectedTerm, subjects, teachers, classmates]);

  return (
    <div className="space-y-6">
      {/* Header & Cascading Selectors */}
      <div className="no-print bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>Évaluations & Résultats Officiels</span>
            </div>
            <h1 className="font-heading font-black text-2xl text-slate-900">
              Génération des Bulletins Scolaires
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Sélectionnez une classe pour filtrer les élèves, puis éditez le bulletin officiel certifié
            </p>
          </div>

          {/* Action Button: Print current report card */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md shadow-slate-900/20 transition hover:scale-105"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer le Bulletin Actuel</span>
            </button>
          </div>
        </div>

        {/* CASCADING FILTER CONTROLS */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-end text-xs">
          {/* Dropdown 1 : CLASSE */}
          <div>
            <label className="block font-extrabold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <School className="w-4 h-4 text-blue-600" />
              <span>1. Choisir la Classe :</span>
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => handleClassChange(e.target.value)}
              className="w-full font-bold bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="ALL">🌐 Toutes les classes ({classes.length})</option>
              {classes.map((cls: Classroom) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} ({cls.cycle} • {cls.studentCount} élèves)
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown 2 : ÉLÈVE (Dynamically Filtered) */}
          <div>
            <label className="block font-extrabold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-600" />
                <span>2. Choisir l'Élève :</span>
              </span>
              <span className="text-[10px] text-indigo-600 font-bold px-1.5 py-0.5 bg-indigo-50 rounded">
                {filteredStudents.length} élève{filteredStudents.length > 1 ? 's' : ''}
              </span>
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full font-bold bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s: Student) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} — {s.matricule} ({s.className})
                  </option>
                ))
              ) : (
                <option value="">Aucun élève dans cette classe</option>
              )}
            </select>
          </div>

          {/* Dropdown 3 : TRIMESTRE / PÉRIODE */}
          <div>
            <label className="block font-extrabold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>3. Période / Trimestre :</span>
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full font-bold bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            >
              <option value="TRIMESTRE_1">1er Trimestre (Octobre - Décembre)</option>
              <option value="TRIMESTRE_2">2ème Trimestre (Janvier - Mars)</option>
              <option value="TRIMESTRE_3">3ème Trimestre (Avril - Juin)</option>
              <option value="ANNUEL">Bilan Annuel & Délibération</option>
            </select>
          </div>
        </div>

        {/* Quick Class Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Accès Rapide :
          </span>
          <button
            onClick={() => handleClassChange('ALL')}
            className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition ${
              selectedClassId === 'ALL'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tous les Élèves
          </button>
          {classes.map((cls: Classroom) => {
            const isSelected = cls.id === selectedClassId;
            return (
              <button
                key={cls.id}
                onClick={() => handleClassChange(cls.id)}
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

        {/* Selected Student Context Banner */}
        {currentStudent && (
          <div className="p-3.5 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80 border border-blue-100 rounded-2xl flex items-center justify-between flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-3">
              <img
                src={currentStudent.photo || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'}
                alt={currentStudent.firstName}
                className="w-11 h-11 rounded-xl object-cover border-2 border-blue-200 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-black text-slate-900 text-sm sm:text-base">
                    {currentStudent.firstName} {currentStudent.lastName}
                  </h3>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 font-bold">
                    {currentStudent.matricule}
                  </span>
                </div>
                <div className="text-slate-600 mt-0.5">
                  Classe : <strong className="text-blue-900">{currentStudent.className}</strong> • Parent : {currentStudent.parentName} ({currentStudent.parentPhone})
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Moyenne Générale</span>
                <div className="font-heading font-black text-blue-900 text-base">
                  {currentStudent.averageGrade?.toFixed(2) || '15.00'} <span className="text-xs text-slate-400">/ 20</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Effectif Classe</span>
                <div className="font-extrabold text-slate-800 text-sm">
                  {classmates.length || currentClass?.studentCount || 29} élèves
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Render Dynamic Bulletin View */}
      {generatedReportCard ? (
        <ReportCardView reportCard={generatedReportCard} />
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400 italic">
          Veuillez sélectionner un élève pour afficher son bulletin scolaire.
        </div>
      )}
    </div>
  );
}
