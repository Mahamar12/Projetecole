'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Classroom } from '@/types';
import { formatFCFA } from '@/lib/currency';
import { X, UserPlus, CheckCircle2, User, Phone, MapPin, Calendar, HeartPulse } from 'lucide-react';

interface NewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewStudentModal({ isOpen, onClose }: NewStudentModalProps) {
  const { classes, addStudent } = useApp();

  const [matricule, setMatricule] = useState(`EIS-2025-0${Math.floor(100 + Math.random() * 900)}`);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [birthDate, setBirthDate] = useState('2010-05-15');
  const [birthPlace, setBirthPlace] = useState('Dakar');
  const [nationality, setNationality] = useState('Sénégalaise');
  const [classId, setClassId] = useState(classes[0]?.id || 'c-3a');
  const [address, setAddress] = useState('Almadies, Dakar');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [medicalNotes, setMedicalNotes] = useState('Aucune allergie');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('+221 77 ');
  const [relationship, setRelationship] = useState('Père');
  const [totalFees, setTotalFees] = useState(350000);
  const [paidFees, setPaidFees] = useState(100000);

  if (!isOpen) return null;

  const selectedClass = classes.find((c: Classroom) => c.id === classId) || classes[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !parentName) return;

    addStudent({
      matricule,
      firstName,
      lastName,
      gender,
      birthDate,
      birthPlace,
      nationality,
      address,
      bloodGroup,
      medicalNotes,
      classId: selectedClass.id,
      className: selectedClass.name,
      level: selectedClass.level,
      academicYear: selectedClass.academicYear,
      status: 'INSCRIT',
      parentId: `p-${Date.now()}`,
      parentName,
      parentPhone,
      parentWhatsapp: parentPhone,
      relationship,
      totalFees: Number(totalFees),
      paidFees: Number(paidFees),
      feeBalance: Number(totalFees) - Number(paidFees),
      averageGrade: 14.5,
      unjustifiedAbsences: 0,
      photo: gender === 'MALE'
        ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-700 to-indigo-800 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-5 h-5" />
            <div>
              <h3 className="font-heading font-bold text-base">Nouvelle Inscription Élève</h3>
              <p className="text-[11px] text-blue-100">Génération automatique de matricule et dossier scolaire</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-blue-800/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Automatic Matricule Box */}
          <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-1 text-xs">
            <div className="flex items-center justify-between font-bold text-blue-900">
              <span className="flex items-center gap-1.5 font-extrabold">
                <UserPlus className="w-4 h-4 text-blue-600" />
                <span>N° Matricule / Immatriculation Généré Automatiquement *</span>
              </span>
              <span className="text-[9px] bg-blue-200 text-blue-900 px-2 py-0.5 rounded font-extrabold">
                Droits Directeur
              </span>
            </div>
            <input
              type="text"
              required
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              className="w-full font-mono font-black text-sm bg-white border border-blue-300 rounded-xl p-2.5 text-blue-950 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-[10px] text-blue-800 block italic">
              ★ Ce matricule sert d'identifiant unique à l'élève pour le Portail Élève et aux parents pour le Portail Parents. Seul le Directeur peut l'éditer.
            </span>
          </div>

          {/* Section 1 : État Civil */}
          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-blue-800 mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4" />
              1. Informations Personnelles de l'Élève
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Prénom(s) *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Aminata"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nom de Famille *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Seck"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Genre *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MALE">Masculin (Garçon)</option>
                  <option value="FEMALE">Féminin (Fille)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date de Naissance *</label>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lieu de Naissance</label>
                <input
                  type="text"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nationalité</label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2 : Affectation Classe */}
          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-blue-800 mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              2. Classe et Niveaux
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Classe d'Affectation *</label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {classes.map((c: Classroom) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.cycle} - Prof: {c.mainTeacherName})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Adresse Domicile</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3 : Parents & Tuteurs */}
          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-blue-800 mb-3 flex items-center gap-1.5">
              <Phone className="w-4 h-4" />
              3. Responsable Légal / Parent
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nom Complet Parent *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Babacar Seck"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="+221 77 123 45 67"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lien de Parenté</label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Père">Père</option>
                  <option value="Mère">Mère</option>
                  <option value="Tuteur légal">Tuteur légal</option>
                  <option value="Oncle/Tante">Oncle/Tante</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4 : Frais Scolaires & Acompte */}
          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-blue-800 mb-3 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4" />
              4. Frais de Scolarité & Santé
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Frais Annuels (FCFA)</label>
                <input
                  type="number"
                  step={5000}
                  value={totalFees}
                  onChange={(e) => setTotalFees(Number(e.target.value))}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Acompte / Inscription Versé</label>
                <input
                  type="number"
                  step={5000}
                  value={paidFees}
                  onChange={(e) => setPaidFees(Number(e.target.value))}
                  className="w-full text-xs font-bold text-emerald-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Groupe Sanguin</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="O+">O+</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-600/30 transition flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Valider l'Inscription</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
