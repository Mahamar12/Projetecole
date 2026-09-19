'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Teacher, Student } from '@/types';
import { 
  GraduationCap, User, Users, ShieldCheck, Key, Lock, 
  CheckCircle2, AlertCircle, Sparkles, ArrowRight, School, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { teachers, students, setCurrentRole, setCurrentParentChildId } = useApp();
  const router = useRouter();

  const [portalType, setPortalType] = useState<'TEACHER' | 'STUDENT' | 'PARENT'>('TEACHER');

  // Form Fields
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [parentPhone, setParentPhone] = useState('');

  // Error and Success Feedback States
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Quick Demo Auto-Fill Handlers
  const fillTeacherDemo = () => {
    const t = teachers[0]; // M. Diallo
    setPortalType('TEACHER');
    setFirstName(t.firstName);
    setLastName(t.lastName);
    setBirthDate('1985-06-12');
    setMatricule(t.matricule || 'PRF-2024-0001');
    setPassword('Prof2025Secret');
    setErrorMsg(null);
  };

  const fillStudentDemo = () => {
    const s = students[0]; // Awa Diop
    setPortalType('STUDENT');
    setFirstName(s.firstName);
    setLastName(s.lastName);
    setBirthDate(s.birthDate);
    setMatricule(s.matricule);
    setPassword('Eleve2025Pass');
    setErrorMsg(null);
  };

  const fillParentDemo = () => {
    const s = students[0]; // Awa Diop
    setPortalType('PARENT');
    setLastName('Diop');
    setFirstName('Mamadou');
    setParentPhone('+221 77 123 45 67');
    setMatricule(s.matricule);
    setErrorMsg(null);
  };

  // Submit Handler with Strict Matricule Validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanMatricule = matricule.trim().toUpperCase();

    // 1. TEACHER VALIDATION
    if (portalType === 'TEACHER') {
      const matchTeacher = teachers.find(
        (t: Teacher) => t.matricule && t.matricule.toUpperCase() === cleanMatricule
      );

      if (!matchTeacher) {
        setErrorMsg(
          `🛑 Accès Refusé : Le numéro matricule "${cleanMatricule}" n'existe pas dans le registre de l'école. Tant que le Directeur ne vous a pas généré et attribué un matricule valide, vous ne pouvez pas accéder au Tableau de Bord Enseignant.`
        );
        return;
      }

      setSuccessMsg(`✅ Matricule Vérifié ! Bienvenue M. ${matchTeacher.firstName} ${matchTeacher.lastName} (${matchTeacher.specialty}). Redirection vers votre Portail...`);
      setCurrentRole('TEACHER');
      setTimeout(() => {
        router.push('/portal-teacher');
      }, 1500);
    }

    // 2. STUDENT VALIDATION
    else if (portalType === 'STUDENT') {
      const matchStudent = students.find(
        (s: Student) => s.matricule && s.matricule.toUpperCase() === cleanMatricule
      );

      if (!matchStudent) {
        setErrorMsg(
          `🛑 Accès Refusé : Le numéro matricule "${cleanMatricule}" est invalide ou introuvable. Seuls les élèves inscrits par le Directeur avec un matricule officiel peuvent accéder à leur espace.`
        );
        return;
      }

      setSuccessMsg(`✅ Matricule Élève Reçu ! Bienvenue ${matchStudent.firstName} ${matchStudent.lastName} (Classe de ${matchStudent.className}). Redirection...`);
      setCurrentRole('STUDENT');
      setTimeout(() => {
        router.push('/portal-student');
      }, 1500);
    }

    // 3. PARENT VALIDATION (USING CHILD MATRICULE)
    else if (portalType === 'PARENT') {
      const matchChild = students.find(
        (s: Student) => s.matricule && s.matricule.toUpperCase() === cleanMatricule
      );

      if (!matchChild) {
        setErrorMsg(
          `🛑 Accès Refusé : Le numéro matricule d'enfant "${cleanMatricule}" est introuvable. En tant que Parent, vous devez saisir le numéro matricule officiel attribué à votre enfant par le Directeur.`
        );
        return;
      }

      setSuccessMsg(`✅ Famille Identifiée ! Accès autorisé pour le suivi de ${matchChild.firstName} ${matchChild.lastName} (${matchChild.className}). Redirection...`);
      setCurrentRole('PARENT');
      setCurrentParentChildId(matchChild.id);
      setTimeout(() => {
        router.push('/portal-parent');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full mx-auto space-y-6 relative z-10">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-bold mb-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'Accueil EduGestion Africa</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-500/30 text-blue-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Portail de Vérification des Matricules & Authentification</span>
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white">
            Connexion & Inscription Utilisateurs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Vérification stricte du numéro matricule attribué par le Directeur pour l'accès aux Tableaux de Bord
          </p>
        </div>

        {/* Quick Demo Fill Pills */}
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2 text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-1.5 text-[11px] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Mode Démo — Remplissage Rapide des Matricules Valides :</span>
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={fillTeacherDemo}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition text-[11px] font-bold"
            >
              👨‍🏫 Professeur (Diallo : PRF-2024-0001)
            </button>

            <button
              type="button"
              onClick={fillStudentDemo}
              className="px-3 py-1.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30 transition text-[11px] font-bold"
            >
              🎓 Élève (Awa Diop : EIS-2024-0012)
            </button>

            <button
              type="button"
              onClick={fillParentDemo}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition text-[11px] font-bold"
            >
              👨‍👩‍👦 Parent (Matricule Enfant)
            </button>
          </div>
        </div>

        {/* Main Auth Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          {/* Role Choice Tabs */}
          <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setPortalType('TEACHER');
                setErrorMsg(null);
              }}
              className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition ${
                portalType === 'TEACHER' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Enseignant</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPortalType('STUDENT');
                setErrorMsg(null);
              }}
              className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition ${
                portalType === 'STUDENT' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Élève</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPortalType('PARENT');
                setErrorMsg(null);
              }}
              className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition ${
                portalType === 'PARENT' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Parent</span>
            </button>
          </div>

          {/* Alert Error Message */}
          {errorMsg && (
            <div className="p-4 bg-rose-950/80 border border-rose-600/50 rounded-2xl text-rose-200 text-xs space-y-1 animate-in fade-in">
              <div className="font-extrabold flex items-center gap-2 text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>Erreur de Vérification de Matricule</span>
              </div>
              <p className="leading-relaxed text-[11px] text-rose-200">{errorMsg}</p>
            </div>
          )}

          {/* Success Notification */}
          {successMsg && (
            <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-200 text-xs flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="font-bold">{successMsg}</span>
            </div>
          )}

          {/* Verification Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Common Fields: Nom & Prénom */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Prénom *</label>
                <input
                  type="text"
                  required
                  placeholder="votre prénom"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Nom *</label>
                <input
                  type="text"
                  required
                  placeholder="votre nom"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Date of Birth or Parent Phone */}
            {portalType !== 'PARENT' ? (
              <div>
                <label className="block font-bold text-slate-300 mb-1">Date de Naissance *</label>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div>
                <label className="block font-bold text-slate-300 mb-1">Téléphone Tuteur / Parent *</label>
                <input
                  type="text"
                  required
                  placeholder="+221 77 000 00 00"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* CRITICAL MATRICULE FIELD */}
            <div className="p-4 bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-500/40 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-extrabold text-blue-300 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>
                    {portalType === 'PARENT' 
                      ? "Numéro Matricule de l'Enfant (Élève) *" 
                      : "Numéro Matricule Attribué par le Directeur *"}
                  </span>
                </label>
                <span className="text-[9px] bg-blue-900 text-blue-200 px-2 py-0.5 rounded font-extrabold border border-blue-700">
                  Verrou de Sécurité
                </span>
              </div>

              <input
                type="text"
                required
                placeholder={
                  portalType === 'TEACHER' ? 'ex: PRF-2024-0001' : 'ex: EIS-2024-0012'
                }
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                className="w-full font-mono font-black text-base uppercase bg-slate-950 border border-blue-400 rounded-xl p-3 text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />

              <p className="text-[10px] text-blue-200 italic leading-relaxed">
                ⚡ <strong>Règle stricte</strong> : Vous ne pourrez pas accéder à votre Tableau de Bord si vous ne saisissez pas le numéro matricule exact généré par la Direction.
              </p>
            </div>

            {/* Password Creation (For Teacher and Student) */}
            {portalType !== 'PARENT' && (
              <div>
                <label className="block font-bold text-slate-300 mb-1">Créer un Mot de Passe Personnels *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-3 font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 text-sm mt-4"
            >
              <span>Vérifier mon Matricule & Accéder à mon Tableau de Bord</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
