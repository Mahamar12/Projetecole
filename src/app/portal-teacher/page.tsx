'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AttendanceStatus, AttendanceRecord } from '@/types';
import { 
  GraduationCap, Clock, FileSpreadsheet, BookOpen, 
  Calendar, CheckCircle2, Save, Users, PlusCircle, Send, Award, Lock, ShieldCheck, FileCheck, Check
} from 'lucide-react';
import Link from 'next/link';

export default function TeacherPortalPage() {
  const { teachers, attendances, updateAttendance, addNotification, classes, timetables, students } = useApp();
  const currentTeacher = teachers[0]; // M. Ibrahima Diallo (Mathématiques)

  const [activeTab, setActiveTab] = useState<'ATTENDANCE' | 'GRADES' | 'BULLETIN_TRANSMISSION' | 'TIMETABLE' | 'HOMEWORK'>('GRADES');
  
  // Teacher Class Isolation: Filter only classes assigned to this teacher
  const teacherClasses = classes.filter((c: any) => 
    currentTeacher.assignedClasses.some((ac: any) => ac.classId === c.id || ac.className === c.name)
  );

  const [selectedClassId, setSelectedClassId] = useState(teacherClasses[0]?.id || 'c-3a');
  const [evalType, setEvalType] = useState<'DEVOIR' | 'COMPOSITION' | 'EXERCICE' | 'EXAMEN' | 'TRIMESTRE' | 'BULLETIN'>('DEVOIR');
  const [evalTitle, setEvalTitle] = useState('Devoir N°2 — Théorème de Pythagore');
  const [evalDate, setEvalDate] = useState('2025-09-28');
  const [isSaved, setIsSaved] = useState(false);
  
  // Published grades lock state
  const [isGradesPublished, setIsGradesPublished] = useState(false);
  const [isLockedForTeacher, setIsLockedForTeacher] = useState(false);

  // Bulletin Transmission State
  const [bulletinTerm, setBulletinTerm] = useState('TRIMESTRE_1');
  const [isBulletinTransmitted, setIsBulletinTransmitted] = useState(false);
  const [transmissionDate, setTransmissionDate] = useState<string | null>(null);

  // Student Bulletin Grades & Appreciations State
  const [bulletinGrades, setBulletinGrades] = useState<{ [studentId: string]: { grade: number; comment: string } }>({
    'stu-1': { grade: 16.5, comment: 'Très bon trimestre, élève rigoureux et très assidu.' },
    'stu-2': { grade: 14.0, comment: 'Bons résultats, poursuivez les efforts en géométrie.' },
    'stu-3': { grade: 12.5, comment: 'Ensemble satisfaisant, potentiel à exploiter.' },
  });

  // Filter teacher's own timetable slots
  const myTimetable = timetables.filter((s: any) => s.teacherId === currentTeacher.id || s.teacherName.includes(currentTeacher.lastName));
  const days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI'];

  // Students in teacher's selected class
  const selectedClass = classes.find((c: any) => c.id === selectedClassId) || teacherClasses[0];
  const classStudents = students.filter((s: any) => s.classId === selectedClassId || s.className === selectedClass?.name);

  const handleStatus = (attId: string, status: AttendanceStatus) => {
    updateAttendance(attId, status);
  };

  const handleSaveAppel = () => {
    setIsSaved(true);
    addNotification({
      title: 'Appel Enregistré par l\'Enseignant',
      message: `M. Diallo a validé l'appel pour ${selectedClass?.name || 'la classe'}.`,
      type: 'STUDENT_ABSENT',
      channel: 'IN_APP',
      recipient: 'Administration',
    });
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handlePublishGrades = (e: React.FormEvent) => {
    e.preventDefault();

    if (evalType === 'BULLETIN') {
      setActiveTab('BULLETIN_TRANSMISSION');
      return;
    }

    setIsGradesPublished(true);
    setIsLockedForTeacher(true);

    const formattedDate = evalDate ? new Date(evalDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '28/09/2025';

    addNotification({
      title: `Publication des Notes (${evalType})`,
      message: `${currentTeacher.firstName} ${currentTeacher.lastName} a publié les notes de ${evalTitle} du ${formattedDate} pour la classe de ${selectedClass?.name}. Modification désormais verrouillée.`,
      type: 'ANNOUNCEMENT',
      channel: 'WHATSAPP',
      recipient: 'Parents & Élèves',
    });
  };

  // Official Bulletin Transmission to Director
  const handleTransmitBulletinToDirector = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const timeStr = `${now.toLocaleDateString('fr-FR')} à ${now.getHours()}h${now.getMinutes().toString().padStart(2, '0')}`;
    
    setIsBulletinTransmitted(true);
    setTransmissionDate(timeStr);

    addNotification({
      title: '📥 TRANSMISSION NOTES BULLETIN (Action Enseignant)',
      message: `M. ${currentTeacher.firstName} ${currentTeacher.lastName} (${currentTeacher.specialty}) a officiellement transmis les notes & appréciations de bulletin pour la classe de ${selectedClass?.name || '6ème A'} (${bulletinTerm === 'TRIMESTRE_1' ? '1er Trimestre' : '2ème Trimestre'}) au Directeur de l'Établissement.`,
      type: 'ANNOUNCEMENT',
      channel: 'WHATSAPP',
      recipient: 'Administration',
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
      {/* Teacher Profile Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentTeacher.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={currentTeacher.firstName}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-white/30"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-800 text-blue-300 text-[10px] font-bold uppercase mb-1">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Espace Enseignant Mobile</span>
            </div>
            <h1 className="font-heading font-black text-xl sm:text-2xl">
              {currentTeacher.firstName} {currentTeacher.lastName}
            </h1>
            <p className="text-xs text-blue-200">
              Professeur de {currentTeacher.specialty} • Classes Attribuées: <strong>{teacherClasses.map(c => c.name).join(' & ')}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile-Friendly Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold">
        <button
          onClick={() => setActiveTab('ATTENDANCE')}
          className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition ${
            activeTab === 'ATTENDANCE' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Faire l'Appel</span>
        </button>

        <button
          onClick={() => setActiveTab('GRADES')}
          className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition ${
            activeTab === 'GRADES' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Publier Notes</span>
        </button>

        <button
          onClick={() => setActiveTab('BULLETIN_TRANSMISSION')}
          className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition relative ${
            activeTab === 'BULLETIN_TRANSMISSION' 
              ? 'bg-amber-600 text-white shadow-sm' 
              : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200'
          }`}
        >
          <Award className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Notes Bulletin</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1 right-1 animate-ping"></span>
        </button>

        <button
          onClick={() => setActiveTab('TIMETABLE')}
          className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition ${
            activeTab === 'TIMETABLE' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Mon Planning</span>
        </button>

        <button
          onClick={() => setActiveTab('HOMEWORK')}
          className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition ${
            activeTab === 'HOMEWORK' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Devoirs</span>
        </button>
      </div>

      {/* Tab Content 1 : Appel Tactile Rapide */}
      {activeTab === 'ATTENDANCE' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">Appel Tactile en Début de Cours</h3>
              <p className="text-xs text-slate-500">
                Classe de <strong>{selectedClass?.name || '3ème A'}</strong> • Mathématiques (08h00 - 10h00)
              </p>
            </div>
            
            {/* Restricted Class Selector for Attendance */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-600">Classe Enseignée :</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900"
              >
                {teacherClasses.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <button
                onClick={handleSaveAppel}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition"
              >
                {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
                <span>{isSaved ? 'Appel Enregistré !' : 'Valider l\'Appel'}</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-blue-700 font-semibold bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 flex items-center justify-between">
            <span>🔒 Affichage restreint aux élèves de la classe de <strong>{selectedClass?.name}</strong> ({classStudents.length} élèves)</span>
            <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold">Prof. {currentTeacher.lastName}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {classStudents.map((stu: any) => {
              const att = attendances.find((a: AttendanceRecord) => a.studentId === stu.id) || {
                id: `att-${stu.id}`,
                studentId: stu.id,
                studentName: `${stu.firstName} ${stu.lastName}`,
                matricule: stu.matricule,
                status: 'PRESENT'
              };

              return (
                <div key={stu.id} className="py-3 flex items-center justify-between gap-2">
                  <div className="text-xs">
                    <div className="font-bold text-slate-900">{stu.firstName} {stu.lastName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{stu.matricule} • {selectedClass?.name}</div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStatus(att.id, 'PRESENT')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        att.status === 'PRESENT' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      P
                    </button>
                    <button
                      onClick={() => handleStatus(att.id, 'ABSENT')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        att.status === 'ABSENT' ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      A
                    </button>
                    <button
                      onClick={() => handleStatus(att.id, 'RETARD')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        att.status === 'RETARD' ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      R
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content 2 : Publier les Notes (Devoirs & Compositions) */}
      {activeTab === 'GRADES' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5 text-xs">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">Saisie & Publication des Notes</h3>
              <p className="text-slate-500 text-[11px]">Saisissez les notes pour les classes où M. Diallo dispense des cours</p>
            </div>
            <Link
              href="/dashboard/grades"
              className="text-blue-600 hover:underline font-bold text-xs flex items-center gap-1"
            >
              <span>Vue Direction</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-extrabold">Admin</span>
            </Link>
          </div>

          {/* Locked Status Notice */}
          {isLockedForTeacher && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 space-y-2">
              <div className="flex items-center justify-between font-bold text-xs">
                <span className="flex items-center gap-1.5 text-amber-900">
                  🔒 Notes Publiées & Verrouillées pour l'Enseignant
                </span>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-extrabold">
                  Statut : Publié du {evalDate ? new Date(evalDate).toLocaleDateString('fr-FR') : '28/09/2025'}
                </span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Une fois publiées et transmises aux parents, les notes ne peuvent plus être modifiées par le professeur.
                <strong> Seul le Directeur de l'Établissement a le privilège de modifier ou déverrouiller ces notes.</strong>
              </p>
              <div className="pt-1 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setIsLockedForTeacher(false)}
                  className="px-3 py-1 bg-amber-900 text-white rounded-lg text-[10px] font-bold hover:bg-amber-800 transition"
                >
                  🔓 Mode Directeur : Autoriser la modification
                </button>
              </div>
            </div>
          )}

          {/* Interactive Evaluation Choice Pills */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-700">Sélectionner le Type de Note à Publier :</label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { type: 'DEVOIR', label: '📝 Devoir de classe', defaultTitle: 'Devoir N°2 — Théorème de Pythagore' },
                { type: 'EXERCICE', label: '✏️ Exercice & Interro', defaultTitle: 'Interrogation N°3 — Calcul vectoriel' },
                { type: 'COMPOSITION', label: '📜 Composition', defaultTitle: 'Composition du 1er Trimestre' },
                { type: 'EXAMEN', label: '🎓 Examen Blanc', defaultTitle: 'Examen Blanc Régional de Mathématiques' },
                { type: 'BULLETIN', label: '📋 Note de Bulletin (Directeur)', defaultTitle: 'Transmission des Notes de Bulletin' },
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  disabled={isLockedForTeacher}
                  onClick={() => {
                    if (item.type === 'BULLETIN') {
                      setActiveTab('BULLETIN_TRANSMISSION');
                    } else {
                      setEvalType(item.type as any);
                      setEvalTitle(item.defaultTitle);
                    }
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 border ${
                    evalType === item.type
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handlePublishGrades} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Classe Attribuée *
                </label>
                <select
                  disabled={isLockedForTeacher}
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 disabled:opacity-60"
                >
                  {teacherClasses.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name} (Maths)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catégorie *</label>
                <select
                  disabled={isLockedForTeacher}
                  value={evalType}
                  onChange={(e) => {
                    const newType = e.target.value as any;
                    if (newType === 'BULLETIN') {
                      setActiveTab('BULLETIN_TRANSMISSION');
                    } else {
                      setEvalType(newType);
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 disabled:opacity-60"
                >
                  <option value="DEVOIR">📝 Devoir de classe</option>
                  <option value="EXERCICE">✏️ Exercice & Interro</option>
                  <option value="COMPOSITION">📜 Composition</option>
                  <option value="EXAMEN">🎓 Examen Blanc</option>
                  <option value="BULLETIN">📋 Note de Bulletin (Directeur)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  📅 Date de l'Évaluation *
                </label>
                <input
                  type="date"
                  required
                  disabled={isLockedForTeacher}
                  value={evalDate}
                  onChange={(e) => setEvalDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Intitulé du Devoir *</label>
                <input
                  type="text"
                  required
                  disabled={isLockedForTeacher}
                  value={evalTitle}
                  onChange={(e) => setEvalTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 disabled:opacity-60"
                />
              </div>
            </div>

            {/* List of Students to input grades */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
              <div className="font-bold text-slate-800 flex items-center justify-between">
                <span>Élèves de {selectedClass?.name} ({classStudents.length} élèves)</span>
                <span className="text-[11px] text-slate-400">Note / 20</span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100">
                {classStudents.map((s: any, idx: number) => (
                  <div key={s.id} className="pt-2 flex items-center justify-between gap-3">
                    <div className="font-bold text-slate-900">
                      {s.firstName} {s.lastName} <span className="text-[10px] text-slate-400 font-mono">({s.matricule})</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      step={0.5}
                      disabled={isLockedForTeacher}
                      defaultValue={14 + (idx % 5)}
                      className="w-20 bg-white border border-slate-300 rounded-xl p-2 text-center font-bold text-blue-900 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400 font-medium">Matière : <strong>Mathématiques</strong></span>
              
              {isLockedForTeacher ? (
                <div className="flex items-center gap-2 text-rose-700 font-bold bg-rose-50 px-4 py-2 rounded-xl border border-rose-200">
                  <span>🔒 Publication Verrouillée (Action du Directeur requise)</span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  <Save className="w-4 h-4" />
                  <span>Publier les Notes (Transmettre aux Parents)</span>
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* NEW TAB CONTENT 3 : TRANSMISSION DES NOTES DE BULLETIN AU DIRECTEUR (REQUESTED BY USER) */}
      {activeTab === 'BULLETIN_TRANSMISSION' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6 text-xs">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs mb-1 border border-amber-300">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Transmission Réservée au Directeur</span>
              </div>
              <h3 className="font-heading font-black text-xl text-slate-900">
                Saisie & Transmission des Notes de Bulletin
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Transmettez vos moyennes trimestrielles et appréciations directement au Directeur pour le calcul des bulletins officiels.
              </p>
            </div>

            <Link
              href="/dashboard/report-cards"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Voir Côté Directeur</span>
            </Link>
          </div>

          {/* Privacy Security Box */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl space-y-1.5 text-amber-950">
            <div className="font-extrabold text-xs flex items-center gap-2 text-amber-900">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>🔒 Règle de Confidentialité Strictement Appliquée</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900">
              Les notes et appréciations transmises dans cet espace sont <strong>strictement réservées au Directeur de l'Établissement</strong>. 
              Ni les élèves ni les parents n'ont accès à ces données tant que le Directeur n'a pas validé et édité les bulletins scolaires officiels.
            </p>
          </div>

          {/* Transmission Success Notification Badge */}
          {isBulletinTransmitted && (
            <div className="p-4 bg-emerald-950 text-emerald-200 rounded-2xl border border-emerald-500/50 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Notes du Bulletin Transmises au Directeur avec Succès !</span>
                </span>
                <span className="text-[10px] bg-emerald-800 text-white px-2.5 py-1 rounded-lg font-mono font-bold">
                  {transmissionDate}
                </span>
              </div>
              <p className="text-xs text-emerald-200 leading-relaxed">
                Le Directeur a reçu une notification administrative avec vos moyennes et appréciations pour la classe de <strong>{selectedClass?.name}</strong> ({bulletinTerm === 'TRIMESTRE_1' ? '1er Trimestre' : '2ème Trimestre'}). Les bulletins scolaires certifiés peuvent maintenant être édités par la Direction.
              </p>
            </div>
          )}

          {/* Configuration Form */}
          <form onSubmit={handleTransmitBulletinToDirector} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <label className="block font-extrabold text-slate-700 mb-1">
                  1. Sélectionner la Classe *
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => {
                    setSelectedClassId(e.target.value);
                    setIsBulletinTransmitted(false);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                >
                  {teacherClasses.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name} (Mathématiques)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1">
                  2. Période du Bulletin *
                </label>
                <select
                  value={bulletinTerm}
                  onChange={(e) => {
                    setBulletinTerm(e.target.value);
                    setIsBulletinTransmitted(false);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="TRIMESTRE_1">🏆 1er Trimestre (Bulletin Officiel)</option>
                  <option value="TRIMESTRE_2">🏆 2ème Trimestre (Bulletin Officiel)</option>
                  <option value="TRIMESTRE_3">🏆 3ème Trimestre (Bilan Annuel)</option>
                </select>
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1">
                  3. Enseignant & Matière *
                </label>
                <div className="p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 flex items-center justify-between">
                  <span>M. {currentTeacher.lastName}</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-extrabold">
                    Mathématiques
                  </span>
                </div>
              </div>
            </div>

            {/* Students Table for Bulletin Grades & Comments */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-3.5 bg-slate-900 text-white font-bold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-amber-400" />
                  <span>Saisie des Moyennes & Appréciations de Bulletin ({classStudents.length} Élèves)</span>
                </span>
                <span className="text-[10px] bg-white/10 text-amber-200 px-2.5 py-1 rounded-lg border border-white/10 font-extrabold">
                  Note / 20 & Appréciation
                </span>
              </div>

              <div className="divide-y divide-slate-100 bg-white">
                {classStudents.map((s: any, idx: number) => {
                  const currentData = bulletinGrades[s.id] || { 
                    grade: 14 + (idx % 5), 
                    comment: 'Bon travail d’ensemble, élève assidu et participatif.' 
                  };

                  return (
                    <div key={s.id} className="p-4 hover:bg-slate-50/80 transition space-y-2">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{s.firstName} {s.lastName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">Matricule: {s.matricule} • Classe de {selectedClass?.name}</div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <label className="text-[11px] font-bold text-slate-600 shrink-0">Moyenne Bulletin :</label>
                          <input
                            type="number"
                            min={0}
                            max={20}
                            step={0.25}
                            value={currentData.grade}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setBulletinGrades(prev => ({
                                ...prev,
                                [s.id]: { ...prev[s.id], grade: val }
                              }));
                            }}
                            className="w-24 bg-amber-50 border border-amber-300 rounded-xl p-2 text-center font-black text-sm text-amber-950 focus:ring-2 focus:ring-amber-500"
                          />
                          <span className="font-bold text-slate-400 text-xs">/ 20</span>
                        </div>
                      </div>

                      {/* Teacher Comment */}
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">
                          Appréciation de l'Enseignant (Figurera sur le bulletin officiel) :
                        </label>
                        <input
                          type="text"
                          value={currentData.comment}
                          onChange={(e) => {
                            const txt = e.target.value;
                            setBulletinGrades(prev => ({
                              ...prev,
                              [s.id]: { ...prev[s.id], comment: txt }
                            }));
                          }}
                          placeholder="Appréciation du professeur..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Official Transmission Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
              <div className="text-[11px] text-slate-500 italic">
                ★ En cliquant sur transmettre, le Directeur recevra automatiquement vos notes pour compiler le bulletin officiel.
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold shadow-lg shadow-amber-600/30 transition flex items-center justify-center gap-2.5 text-xs uppercase tracking-wider"
              >
                <Send className="w-4 h-4" />
                <span>Transmettre Officiellement au Directeur</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab Content 4 : Mon Emploi du Temps (Professeur) */}
      {activeTab === 'TIMETABLE' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">Mon Emploi du Temps Personnel</h3>
              <p className="text-slate-500 text-[11px]">Planning de cours et salles enseignées par {currentTeacher.firstName} {currentTeacher.lastName}</p>
            </div>
            <span className="font-extrabold text-amber-900 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
              {myTimetable.length * 2} heures de cours / semaine
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {days.map((day) => {
              const slots = myTimetable.filter((s: any) => s.dayOfWeek === day);
              return (
                <div key={day} className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                  <div className="font-heading font-black text-xs text-slate-800 uppercase border-b pb-1">
                    {day}
                  </div>
                  {slots.length > 0 ? (
                    slots.map((slot: any) => (
                      <div key={slot.id} className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-sm">
                        <div className="font-bold text-blue-900">{slot.className}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{slot.startTime} - {slot.endTime}</div>
                        <div className="text-[10px] text-amber-800 font-bold">{slot.subjectName} • {slot.room}</div>
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

      {/* Tab Content 5 : Cahier de Devoirs */}
      {activeTab === 'HOMEWORK' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="font-heading font-bold text-lg text-slate-900">Devoirs & Cahier de Texte</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Publiez des exercices, devoirs maison et consignes pour vos élèves et leurs parents.
          </p>
          <Link
            href="/dashboard/homework"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700 transition"
          >
            + Publier un Devoir →
          </Link>
        </div>
      )}
    </div>
  );
}
