'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Teacher, TimetableSlot } from '@/types';
import { 
  GraduationCap, PlusCircle, Search, Phone, 
  Mail, BookOpen, School, Award, Calendar, CheckCircle2, Key, X, ShieldCheck, 
  UserCheck, Printer, Smartphone, FileText, Clock, Edit, Eye, MapPin, User, Check
} from 'lucide-react';
import Link from 'next/link';

const AVAILABLE_CLASSES = [
  '6ème A', '6ème B', '5ème A', '5ème B', 
  '4ème A', '3ème A', '3ème B', '2nde S', 
  '1ère S1', 'Terminale S2', 'Terminale L2'
];

const AVAILABLE_SUBJECTS = [
  'Mathématiques', 'Physique - Chimie', 'Français', 
  'SVT', 'Anglais', 'Histoire - Géographie', 
  'Informatique', 'Éducation Physique (EPS)', 'Arabe', 'Philosophie'
];

export default function TeachersManagementPage() {
  const { teachers, timetables, addTeacher, updateTeacher, addNotification } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Modals for Teacher Actions
  const [selectedTeacherForTimetable, setSelectedTeacherForTimetable] = useState<Teacher | null>(null);
  const [selectedTeacherForContract, setSelectedTeacherForContract] = useState<Teacher | null>(null);
  const [selectedTeacherForDetails, setSelectedTeacherForDetails] = useState<Teacher | null>(null);
  const [selectedTeacherForEdit, setSelectedTeacherForEdit] = useState<Teacher | null>(null);

  // New Teacher Form State
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newBirthDate, setNewBirthDate] = useState('1985-06-15');
  const [newBirthPlace, setNewBirthPlace] = useState('Dakar');
  const [newIdCardNumber, setNewIdCardNumber] = useState('1 755 1985 00234');
  const [newQuartier, setNewQuartier] = useState('Mermoz');
  const [newPhone, setNewPhone] = useState('+221 77 100 20 30');
  const [newEmail, setNewEmail] = useState('');
  const [newMatricule, setNewMatricule] = useState(`PRF-2025-000${teachers.length + 1}`);
  const [newContractType, setNewContractType] = useState('CDI');

  // Multi-Selection State for New Teacher
  const [newSelectedClasses, setNewSelectedClasses] = useState<string[]>(['3ème A', '6ème A']);
  const [newSelectedSubjects, setNewSelectedSubjects] = useState<string[]>(['Mathématiques']);

  // Edit Teacher Form State
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editBirthDate, setEditBirthDate] = useState('');
  const [editBirthPlace, setEditBirthPlace] = useState('');
  const [editIdCardNumber, setEditIdCardNumber] = useState('');
  const [editQuartier, setEditQuartier] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editMatricule, setEditMatricule] = useState('');
  const [editContractType, setEditContractType] = useState('');

  // Multi-Selection State for Edit Teacher
  const [editSelectedClasses, setEditSelectedClasses] = useState<string[]>([]);
  const [editSelectedSubjects, setEditSelectedSubjects] = useState<string[]>([]);

  const days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI'];

  const filtered = teachers.filter((t: Teacher) => 
    `${t.firstName} ${t.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.matricule && t.matricule.toLowerCase().includes(searchTerm.toLowerCase())) ||
    t.phone.includes(searchTerm)
  );

  // Toggle Selection Helper
  const toggleItem = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName || !newLastName) return;

    const assignedClasses = newSelectedClasses.flatMap(cls => 
      (newSelectedSubjects.length > 0 ? newSelectedSubjects : ['Matière Générale']).map(subj => ({
        classId: `c-${cls.toLowerCase().replace(/\s+/g, '')}`,
        className: cls,
        subjectId: `s-${subj.toLowerCase().replace(/\s+/g, '')}`,
        subjectName: subj
      }))
    );

    addTeacher({
      matricule: newMatricule,
      firstName: newFirstName,
      lastName: newLastName,
      birthDate: newBirthDate,
      birthPlace: newBirthPlace,
      idCardNumber: newIdCardNumber,
      quartier: newQuartier,
      specialty: newSelectedSubjects.length > 0 ? newSelectedSubjects.join(' & ') : 'Matière Générale',
      phone: newPhone,
      email: newEmail || `${newFirstName.toLowerCase().charAt(0)}.${newLastName.toLowerCase()}@eis-dakar.sn`,
      contractType: newContractType,
      hireDate: new Date().toISOString().split('T')[0],
      assignedClasses: assignedClasses.length > 0 ? assignedClasses : [
        { classId: 'c-3a', className: '3ème A', subjectId: 's-math', subjectName: 'Mathématiques' }
      ],
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });

    setIsAddModalOpen(false);

    addNotification({
      title: 'Enseignant Recruté avec Succès',
      message: `M. ${newFirstName} ${newLastName} (Classes : ${newSelectedClasses.join(', ')}) a été créé avec le matricule ${newMatricule}.`,
      type: 'ANNOUNCEMENT',
      channel: 'WHATSAPP',
      recipient: 'Enseignant & Administration',
    });

    // Reset Form
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
  };

  const openEditModal = (t: Teacher) => {
    setSelectedTeacherForEdit(t);
    setEditFirstName(t.firstName);
    setEditLastName(t.lastName);
    setEditBirthDate(t.birthDate || '1985-06-15');
    setEditBirthPlace(t.birthPlace || 'Dakar');
    setEditIdCardNumber(t.idCardNumber || '1 755 1985 00234');
    setEditQuartier(t.quartier || 'Mermoz');
    setEditPhone(t.phone);
    setEditEmail(t.email || '');
    setEditMatricule(t.matricule || `PRF-2024-000${t.id.replace('t-', '')}`);
    setEditContractType(t.contractType);

    // Extract current classes and subjects
    const existingClasses = Array.from(new Set(t.assignedClasses.map(ac => ac.className)));
    const existingSubjects = Array.from(new Set(t.assignedClasses.map(ac => ac.subjectName)));

    setEditSelectedClasses(existingClasses.length > 0 ? existingClasses : ['3ème A']);
    setEditSelectedSubjects(existingSubjects.length > 0 ? existingSubjects : [t.specialty]);
  };

  const handleUpdateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherForEdit) return;

    const assignedClasses = editSelectedClasses.flatMap(cls => 
      (editSelectedSubjects.length > 0 ? editSelectedSubjects : ['Matière Générale']).map(subj => ({
        classId: `c-${cls.toLowerCase().replace(/\s+/g, '')}`,
        className: cls,
        subjectId: `s-${subj.toLowerCase().replace(/\s+/g, '')}`,
        subjectName: subj
      }))
    );

    updateTeacher(selectedTeacherForEdit.id, {
      firstName: editFirstName,
      lastName: editLastName,
      birthDate: editBirthDate,
      birthPlace: editBirthPlace,
      idCardNumber: editIdCardNumber,
      quartier: editQuartier,
      specialty: editSelectedSubjects.length > 0 ? editSelectedSubjects.join(' & ') : 'Matière Générale',
      phone: editPhone,
      email: editEmail,
      matricule: editMatricule,
      contractType: editContractType,
      assignedClasses: assignedClasses.length > 0 ? assignedClasses : selectedTeacherForEdit.assignedClasses,
    });

    addNotification({
      title: 'Fiche Enseignant Modifiée',
      message: `M. ${editFirstName} ${editLastName} : Classes (${editSelectedClasses.join(', ')}) et Matières mis à jour par le Directeur.`,
      type: 'ANNOUNCEMENT',
      channel: 'WHATSAPP',
      recipient: 'Administration',
    });

    setSelectedTeacherForEdit(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Corps Professoral, Multi-Classes & Multi-Matières</span>
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900">
            Gestion des Enseignants ({teachers.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Attribution multi-classes et multi-spécialités, matricules automatiques et fiches RH
          </p>
        </div>

        <button
          onClick={() => {
            setNewMatricule(`PRF-2025-000${teachers.length + 1}`);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/30 transition hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Ajouter un Enseignant</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un professeur par matricule (ex: PRF-2024-0001), nom, matière ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
          />
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((t: Teacher) => (
          <div key={t.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition flex flex-col justify-between relative group">
            <div className="space-y-3">
              {/* Top Card Header with Quick Actions */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={t.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={t.firstName}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
                  />
                  <div>
                    <h3 className="font-heading font-bold text-slate-900 text-base">{t.firstName} {t.lastName}</h3>
                    <div className="font-semibold text-xs text-blue-700">{t.specialty}</div>
                    <div className="text-[10px] text-slate-400 font-medium">Contrat : {t.contractType} • Depuis {t.hireDate}</div>
                  </div>
                </div>

                {/* Director Quick Action Pills: View Details & Edit */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedTeacherForDetails(t)}
                    title="Voir Fiche & Tous les Détails"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditModal(t)}
                    title="Modifier les Informations (Directeur)"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-600 transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Automatic Matricule Credentials Badge */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span className="flex items-center gap-1.5 text-blue-900 font-extrabold">
                    <Key className="w-3.5 h-3.5 text-amber-600" />
                    <span>Matricule : {t.matricule || `PRF-2024-000${t.id.replace('t-', '')}`}</span>
                  </span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-extrabold flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-emerald-600" />
                    <span>Accès Portail</span>
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block italic">
                  Généré automatiquement par le Directeur pour l'accès espace prof
                </span>
              </div>

              {/* Main teacher badge if applicable */}
              {t.isMainTeacherOf && (
                <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-[11px] font-bold text-amber-800 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>Professeur Principal : {t.isMainTeacherOf}</span>
                </div>
              )}

              {/* Contacts */}
              <div className="space-y-1 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.phone}</span>
                </div>
                {t.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>{t.email}</span>
                  </div>
                )}
              </div>

              {/* Assigned classes & Subjects */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-slate-400">Classes & Matières Enseignées :</div>
                <div className="flex flex-wrap gap-1.5">
                  {t.assignedClasses.map((ac: any, idx: number) => (
                    <span key={idx} className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-800 text-[11px] font-semibold border border-blue-200/60">
                      {ac.subjectName} → <strong>{ac.className}</strong>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* INTERACTIVE BUTTONS FOOTER */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <button
                type="button"
                onClick={() => setSelectedTeacherForTimetable(t)}
                className="hover:underline flex items-center gap-1 text-slate-700 hover:text-blue-700"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>Emploi du temps</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTeacherForContract(t)}
                className="hover:underline flex items-center gap-1 text-blue-700 font-extrabold"
              >
                <Key className="w-3.5 h-3.5 text-blue-600" />
                <span>Identifiants & Contrat →</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: DÉTAILS COMPLETS DE L'ENSEIGNANT */}
      {selectedTeacherForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 border border-slate-200 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedTeacherForDetails.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={selectedTeacherForDetails.firstName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-amber-800 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {selectedTeacherForDetails.specialty}
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-800 uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Accès Actif
                    </span>
                  </div>
                  <h3 className="font-heading font-black text-xl text-slate-900 mt-1">
                    {selectedTeacherForDetails.firstName} {selectedTeacherForDetails.lastName}
                  </h3>
                  <p className="text-slate-500 text-[11px]">
                    Matricule Officiel : <strong className="font-mono text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">{selectedTeacherForDetails.matricule || 'PRF-2024-0001'}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTeacherForDetails(null)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Complete Registered Information Grid */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Tous les Détails Enseignants & Attributions</span>
              </h4>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Prénom & Nom</span>
                  <span className="font-bold text-slate-900 text-xs">{selectedTeacherForDetails.firstName} {selectedTeacherForDetails.lastName}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Numéro Matricule</span>
                  <span className="font-mono font-black text-amber-900 text-xs">{selectedTeacherForDetails.matricule || 'PRF-2024-0001'}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Date de Naissance</span>
                  <span className="font-bold text-slate-900 text-xs">{selectedTeacherForDetails.birthDate || '15 Juin 1985'}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Lieu de Naissance</span>
                  <span className="font-bold text-slate-900 text-xs">{selectedTeacherForDetails.birthPlace || 'Dakar'}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">N° Pièce d'Identité (CNI / Passeport)</span>
                  <span className="font-mono font-bold text-slate-900 text-xs">{selectedTeacherForDetails.idCardNumber || '1 755 1985 00234'}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Quartier / Domicile</span>
                  <span className="font-bold text-slate-900 text-xs">{selectedTeacherForDetails.quartier || 'Mermoz, Sacré-Cœur'}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Téléphone</span>
                  <span className="font-bold text-emerald-800 text-xs">{selectedTeacherForDetails.phone}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Adresse Email</span>
                  <span className="font-bold text-blue-800 text-xs">{selectedTeacherForDetails.email || 'Non renseigné'}</span>
                </div>

                <div className="col-span-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-extrabold uppercase mb-1">Classes & Matières Enseignées :</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTeacherForDetails.assignedClasses.map((ac: any, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 rounded-xl bg-blue-100 text-blue-900 text-xs font-bold border border-blue-300">
                        {ac.subjectName} → {ac.className}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const t = selectedTeacherForDetails;
                  setSelectedTeacherForDetails(null);
                  openEditModal(t);
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition flex items-center gap-1.5"
              >
                <Edit className="w-4 h-4" />
                <span>Modifier cette Fiche Enseignant (Directeur)</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer Fiche</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: MODIFICATION DES INFORMATIONS (MULTI-CLASSES & MULTI-MATIÈRES) */}
      {selectedTeacherForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 border border-slate-200 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-base text-slate-900">
                    Modifier la Fiche Enseignant (Directeur)
                  </h3>
                  <p className="text-slate-500 text-[11px]">Attribution multi-classes et multi-spécialités</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTeacherForEdit(null)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTeacher} className="space-y-4">
              {/* Matricule Box */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-amber-900 flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-amber-600" />
                    <span>Numéro Matricule (Droits Directeur) *</span>
                  </label>
                  <span className="text-[9px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-extrabold">
                    Immatriculation
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={editMatricule}
                  onChange={(e) => setEditMatricule(e.target.value)}
                  className="w-full font-mono font-black text-sm bg-white border border-amber-300 rounded-xl p-2.5 text-amber-950 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date de Naissance *</label>
                  <input
                    type="date"
                    required
                    value={editBirthDate}
                    onChange={(e) => setEditBirthDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lieu de Naissance *</label>
                  <input
                    type="text"
                    required
                    value={editBirthPlace}
                    onChange={(e) => setEditBirthPlace(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">N° Pièce d'Identité (CNI / Passeport) *</label>
                  <input
                    type="text"
                    required
                    value={editIdCardNumber}
                    onChange={(e) => setEditIdCardNumber(e.target.value)}
                    className="w-full font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quartier / Domicile *</label>
                  <input
                    type="text"
                    required
                    value={editQuartier}
                    onChange={(e) => setEditQuartier(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* MULTI-CLASSES SELECTION (REQUESTED BY USER) */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <label className="font-extrabold text-slate-800 flex items-center justify-between">
                  <span>📚 Classes Enseignées (Sélection Multiple) *</span>
                  <span className="text-[10px] text-blue-600 font-bold">{editSelectedClasses.length} classe(s) sélectionnée(s)</span>
                </label>

                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_CLASSES.map((cls) => {
                    const isSelected = editSelectedClasses.includes(cls);
                    return (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => toggleItem(cls, editSelectedClasses, setEditSelectedClasses)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                          isSelected 
                            ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400' 
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{cls}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* MULTI-SUBJECTS SELECTION (REQUESTED BY USER) */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <label className="font-extrabold text-slate-800 flex items-center justify-between">
                  <span>🔬 Matières & Spécialités Enseignées (Sélection Multiple) *</span>
                  <span className="text-[10px] text-amber-600 font-bold">{editSelectedSubjects.length} matière(s) sélectionnée(s)</span>
                </label>

                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SUBJECTS.map((subj) => {
                    const isSelected = editSelectedSubjects.includes(subj);
                    return (
                      <button
                        key={subj}
                        type="button"
                        onClick={() => toggleItem(subj, editSelectedSubjects, setEditSelectedSubjects)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                          isSelected 
                            ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400' 
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{subj}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Téléphone *</label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Adresse Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedTeacherForEdit(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md transition"
                >
                  Enregistrer les Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EMPLOI DU TEMPS DE L'ENSEIGNANT */}
      {selectedTeacherForTimetable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto border border-slate-200 text-xs">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedTeacherForTimetable.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={selectedTeacherForTimetable.firstName}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-amber-500 shadow-sm"
                />
                <div>
                  <span className="text-[10px] font-extrabold text-amber-800 uppercase bg-amber-50 px-2 py-0.5 rounded">
                    {selectedTeacherForTimetable.specialty}
                  </span>
                  <h3 className="font-heading font-black text-lg text-slate-900 mt-0.5">
                    Emploi du Temps — M. {selectedTeacherForTimetable.firstName} {selectedTeacherForTimetable.lastName}
                  </h3>
                  <p className="text-slate-500 text-[11px]">
                    Matricule : <strong className="font-mono text-slate-800">{selectedTeacherForTimetable.matricule || 'PRF-2024-0001'}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTeacherForTimetable(null)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Timetable Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {days.map((d) => {
                const teacherSlots = timetables.filter((slot: TimetableSlot) => 
                  slot.teacherId === selectedTeacherForTimetable.id || 
                  slot.teacherName.toLowerCase().includes(selectedTeacherForTimetable.lastName.toLowerCase())
                ).filter(slot => slot.dayOfWeek === d);

                return (
                  <div key={d} className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                    <div className="font-heading font-black text-xs text-slate-800 uppercase border-b pb-1">
                      {d}
                    </div>
                    {teacherSlots.length > 0 ? (
                      teacherSlots.map((slot) => (
                        <div key={slot.id} className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-sm">
                          <div className="font-bold text-blue-900">{slot.subjectName}</div>
                          <div className="text-[10px] text-amber-800 font-extrabold">{slot.className}</div>
                          <div className="text-[10px] text-slate-500 font-medium">{slot.startTime} - {slot.endTime}</div>
                          <div className="text-[10px] text-slate-600 font-semibold">{slot.room}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-400 text-[11px] italic py-4 text-center">Pas de cours</div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/dashboard/timetable"
                className="text-blue-600 font-bold hover:underline flex items-center gap-1"
              >
                <span>Ouvrir le Planning Général interactif →</span>
              </Link>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer l'Emploi du Temps (A4)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: IDENTIFIANTS DE CONNEXION & FICHE CONTRAT */}
      {selectedTeacherForContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200 text-xs">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedTeacherForContract.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={selectedTeacherForContract.firstName}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
                />
                <div>
                  <h3 className="font-heading font-black text-lg text-slate-900">
                    Fiche Contrat & Identifiants
                  </h3>
                  <p className="text-slate-500 text-[11px]">
                    {selectedTeacherForContract.firstName} {selectedTeacherForContract.lastName} ({selectedTeacherForContract.specialty})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTeacherForContract(null)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Box Identifiants Portail */}
            <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl text-white space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-blue-200 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>Identifiants Officiels Portail Enseignant</span>
                </span>
                <span className="text-[9px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 px-2 py-0.5 rounded font-extrabold">
                  Généré par Directeur
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-blue-200 block uppercase font-bold">Identifiant / Matricule</span>
                  <span className="font-mono font-black text-sm text-amber-300">
                    {selectedTeacherForContract.matricule || 'PRF-2024-0001'}
                  </span>
                </div>

                <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-blue-200 block uppercase font-bold">Mot de passe initial</span>
                  <span className="font-mono font-black text-sm text-white">
                    Prof2025Secret
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-blue-200 italic">
                ★ Le professeur utilise ce matricule pour ouvrir son Espace Enseignant sur le portail web ou mobile.
              </p>
            </div>

            {/* Fiche de Contrat Administratif */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider flex items-center justify-between">
                <span>📄 Informations de Contrat RH</span>
                <span className="text-slate-400 font-normal">Statut Actif</span>
              </h4>

              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl p-3 bg-slate-50 space-y-2">
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-bold">Type de Contrat :</span>
                  <span className="font-extrabold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {selectedTeacherForContract.contractType} (Temps Plein)
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-bold">Date d'embauche :</span>
                  <span className="font-bold text-slate-900">{selectedTeacherForContract.hireDate}</span>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-bold">Professeur Principal :</span>
                  <span className="font-bold text-amber-900 bg-amber-100/60 px-2 py-0.5 rounded">
                    {selectedTeacherForContract.isMainTeacherOf || 'Aucune classe principale'}
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-bold">Téléphone Pro :</span>
                  <span className="font-bold text-slate-900">{selectedTeacherForContract.phone}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center gap-2">
              <a
                href={`https://wa.me/${selectedTeacherForContract.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour M. ${selectedTeacherForContract.lastName}, voici vos identifiants d'accès au Portail Enseignant : Matricule: ${selectedTeacherForContract.matricule || 'PRF-2024-0001'} | Mot de passe: Prof2025Secret | Lien: http://localhost:3000/login`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Envoyer Identifiants par WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD TEACHER MODAL WITH MULTI-CLASSES & MULTI-SUBJECTS */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 border border-slate-200 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-base text-slate-900">
                    Nouveau Professeur (Accès Directeur)
                  </h3>
                  <p className="text-slate-500 text-[11px]">Création de fiche, attribution multi-classes et multi-spécialités</p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTeacher} className="space-y-4">
              {/* Automatic Matricule Box */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-amber-900 flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-amber-600" />
                    <span>Numéro Matricule Généré Automatiquement *</span>
                  </label>
                  <span className="text-[9px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-extrabold">
                    Droits Directeur
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={newMatricule}
                  onChange={(e) => setNewMatricule(e.target.value)}
                  className="w-full font-mono font-black text-sm bg-white border border-amber-300 rounded-xl p-2.5 text-amber-950 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Seydou"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Kane"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* DATE & LIEU DE NAISSANCE */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date de Naissance *</label>
                  <input
                    type="date"
                    required
                    value={newBirthDate}
                    onChange={(e) => setNewBirthDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lieu de Naissance *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Dakar / Thiès"
                    value={newBirthPlace}
                    onChange={(e) => setNewBirthPlace(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* NUMERO PIECE D'IDENTITE & QUARTIER */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">N° Pièce d'Identité (CNI / Passeport) *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: 1 755 1985 00234"
                    value={newIdCardNumber}
                    onChange={(e) => setNewIdCardNumber(e.target.value)}
                    className="w-full font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quartier / Domicile *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Mermoz, Sacré-Cœur"
                    value={newQuartier}
                    onChange={(e) => setNewQuartier(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* MULTI-CLASSES SELECTION (REQUESTED BY USER) */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <label className="font-extrabold text-slate-800 flex items-center justify-between">
                  <span>📚 Classes Enseignées (Possibilité de Sélectionner Plusieurs Classes) *</span>
                  <span className="text-[10px] text-blue-600 font-bold">{newSelectedClasses.length} classe(s) sélectionnée(s)</span>
                </label>

                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_CLASSES.map((cls) => {
                    const isSelected = newSelectedClasses.includes(cls);
                    return (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => toggleItem(cls, newSelectedClasses, setNewSelectedClasses)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                          isSelected 
                            ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400' 
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{cls}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* MULTI-SUBJECTS SELECTION (REQUESTED BY USER) */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <label className="font-extrabold text-slate-800 flex items-center justify-between">
                  <span>🔬 Matières & Spécialités (Possibilité de Sélectionner Plusieurs Matières) *</span>
                  <span className="text-[10px] text-amber-600 font-bold">{newSelectedSubjects.length} matière(s) sélectionnée(s)</span>
                </label>

                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SUBJECTS.map((subj) => {
                    const isSelected = newSelectedSubjects.includes(subj);
                    return (
                      <button
                        key={subj}
                        type="button"
                        onClick={() => toggleItem(subj, newSelectedSubjects, setNewSelectedSubjects)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                          isSelected 
                            ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400' 
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{subj}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Téléphone *</label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Adresse Email</label>
                  <input
                    type="email"
                    placeholder="enseignant@ecole.sn"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md transition"
                >
                  Enregistrer & Générer l'Accès
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
