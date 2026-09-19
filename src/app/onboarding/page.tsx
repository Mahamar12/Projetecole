'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  School, MapPin, Phone, Mail, Globe, 
  Calendar, Layers, UserPlus, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Building 
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { updateSchool, setCurrentRole } = useApp();

  const [step, setStep] = useState(1);

  // Form State across 10 steps
  const [schoolName, setSchoolName] = useState('Groupe Scolaire Excellence Teranga');
  const [logoUrl, setLogoUrl] = useState('https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop&q=80');
  const [address, setAddress] = useState('Avenue Cheikh Anta Diop, Fann Point E');
  const [phone, setPhone] = useState('+221 33 825 90 00');
  const [email, setEmail] = useState('contact@teranga-excellence.sn');
  const [city, setCity] = useState('Dakar');
  const [country, setCountry] = useState('Sénégal');
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [selectedLevels, setSelectedLevels] = useState<string[]>([
    'Préscolaire', 'Élémentaire (CI-CM2)', 'Collège (6e-3e)', 'Lycée (2nde-Tle)'
  ]);
  const [adminName, setAdminName] = useState('Dr. Cheikh Tidiane Seck');
  const [adminEmail, setAdminEmail] = useState('directeur@teranga-excellence.sn');
  const [adminPassword, setAdminPassword] = useState('Pass123456');

  const totalSteps = 10;

  const toggleLevel = (lvl: string) => {
    if (selectedLevels.includes(lvl)) {
      setSelectedLevels(selectedLevels.filter(l => l !== lvl));
    } else {
      setSelectedLevels([...selectedLevels, lvl]);
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchool({
      name: schoolName,
      address,
      phone,
      email,
      city,
      country,
      academicLevels: selectedLevels,
      code: 'GSET-DKR',
      slug: 'teranga-excellence',
    });
    setCurrentRole('SCHOOL_ADMIN');
    router.push('/dashboard');
  };

  const nextStep = () => setStep(prev => Math.min(totalSteps, prev + 1));
  const prevStep = () => setStep(prev => Math.max(1, prev - 1));

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <div className="w-full max-w-xl text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700 text-blue-300 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Configuration Rapide Établissement</span>
        </div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl tracking-tight">
          Bienvenue sur EduGestion Africa
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Étape {step} sur {totalSteps} — Créez et activez votre école en quelques minutes
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Card Form */}
      <div className="w-full max-w-xl bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <form onSubmit={step === 10 ? handleFinish : (e) => { e.preventDefault(); nextStep(); }}>
          {/* Étape 1 : Nom de l'école */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 text-blue-400">
                <School className="w-8 h-8" />
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">Étape 1 : Nom de l'établissement</h3>
                  <p className="text-xs text-slate-400">Quel est le nom officiel de votre école ?</p>
                </div>
              </div>
              <input
                type="text"
                required
                autoFocus
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="ex: Groupe Scolaire Mariama Bâ"
                className="w-full text-base font-bold text-white bg-slate-900 border border-slate-600 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Étape 2 : Logo */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 text-blue-400">
                <Building className="w-8 h-8" />
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">Étape 2 : Logo de l'école</h3>
                  <p className="text-xs text-slate-400">Il apparaîtra sur vos bulletins et reçus officiels.</p>
                </div>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-700 rounded-2xl flex items-center gap-4">
                <img src={logoUrl} alt="Logo" className="w-16 h-16 rounded-xl object-cover border border-slate-700" />
                <div className="flex-1 text-xs">
                  <div className="font-bold text-white mb-1">Aperçu du Logo</div>
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="w-full text-xs text-slate-300 bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Étape 3 : Adresse */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 text-blue-400">
                <MapPin className="w-8 h-8" />
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">Étape 3 : Adresse physique</h3>
                  <p className="text-xs text-slate-400">Quartier, rue ou repère géographique</p>
                </div>
              </div>
              <input
                type="text"
                required
                autoFocus
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="ex: Route des Almadies, Enclos 4B"
                className="w-full text-sm font-semibold text-white bg-slate-900 border border-slate-600 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Étape 4 : Téléphone */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 text-emerald-400">
                <Phone className="w-8 h-8" />
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">Étape 4 : Numéro de téléphone</h3>
                  <p className="text-xs text-slate-400">Numéro du standard ou de la direction</p>
                </div>
              </div>
              <input
                type="tel"
                required
                autoFocus
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="ex: +221 33 800 00 00"
                className="w-full text-sm font-semibold text-white bg-slate-900 border border-slate-600 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          {/* Étape 5 : Email */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 text-blue-400">
                <Mail className="w-8 h-8" />
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">Étape 5 : Email de l'établissement</h3>
                  <p className="text-xs text-slate-400">Pour recevoir les notifications et rapports</p>
                </div>
              </div>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ex: direction@ecole.sn"
                className="w-full text-sm font-semibold text-white bg-slate-900 border border-slate-600 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Étape 6 : Ville */}
          {step === 6 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 text-blue-400">
                <MapPin className="w-8 h-8" />
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">Étape 6 : Ville d'implantation</h3>
                  <p className="text-xs text-slate-400">Ville principale où se situe le campus</p>
                </div>
              </div>
              <input
                type="text"
                required
                autoFocus
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="ex: Dakar, Thiès, Saint-Louis, Touba"
                className="w-full text-sm font-semibold text-white bg-slate-900 border border-slate-600 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Étape 7 : Pays */}
          {step === 7 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 text-emerald-400">
                <Globe className="w-8 h-8" />
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">Étape 7 : Pays d'exercice</h3>
                  <p className="text-xs text-slate-400">Devise et formats monétaires (FCFA)</p>
                </div>
              </div>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full text-sm font-semibold text-white bg-slate-900 border border-slate-600 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Sénégal">Sénégal (XOF - FCFA)</option>
                <option value="Côte d'Ivoire">Côte d'Ivoire (XOF - FCFA)</option>
                <option value="Mali">Mali (XOF - FCFA)</option>
                <option value="Bénin">Bénin (XOF - FCFA)</option>
                <option value="Togo">Togo (XOF - FCFA)</option>
                <option value="Burkina Faso">Burkina Faso (XOF - FCFA)</option>
                <option value="Guinée">Guinée (GNF)</option>
                <option value="Cameroun">Cameroun (XAF - FCFA)</option>
              </select>
            </div>
          )}

          {/* Étape 8 : Année scolaire */}
          {step === 8 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 text-amber-400">
                <Calendar className="w-8 h-8" />
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">Étape 8 : Année scolaire en cours</h3>
                  <p className="text-xs text-slate-400">Session active pour les inscriptions et notes</p>
                </div>
              </div>
              <input
                type="text"
                required
                autoFocus
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2024-2025"
                className="w-full text-sm font-semibold text-white bg-slate-900 border border-slate-600 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          {/* Étape 9 : Niveaux enseignés */}
          {step === 9 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 text-purple-400">
                <Layers className="w-8 h-8" />
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">Étape 9 : Niveaux & Cycles enseignés</h3>
                  <p className="text-xs text-slate-400">Cochez les cycles pris en charge par votre école</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Préscolaire',
                  'Élémentaire (CI-CM2)',
                  'Collège (6e-3e)',
                  'Lycée (2nde-Tle)',
                  'Enseignement Technique',
                  'Formation Professionnelle'
                ].map((lvl) => {
                  const isChecked = selectedLevels.includes(lvl);
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => toggleLevel(lvl)}
                      className={`p-3 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition ${
                        isChecked 
                          ? 'bg-blue-600/30 border-blue-500 text-blue-200' 
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <span>{lvl}</span>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Étape 10 : Compte Administrateur */}
          {step === 10 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 text-emerald-400">
                <UserPlus className="w-8 h-8" />
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">Étape 10 : Compte Directeur Principal</h3>
                  <p className="text-xs text-slate-400">Accès administrateur complet de l'établissement</p>
                </div>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Nom et Prénom du Directeur *</label>
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full text-xs font-semibold text-white bg-slate-900 border border-slate-600 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Email de Connexion *</label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full text-xs font-semibold text-white bg-slate-900 border border-slate-600 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Mot de Passe Sécurisé *</label>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full text-xs font-semibold text-white bg-slate-900 border border-slate-600 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-700 mt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>
            ) : <div />}

            {step < totalSteps ? (
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-600/30 transition ml-auto"
              >
                <span>Étape Suivante</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 shadow-xl shadow-emerald-500/30 transition ml-auto"
              >
                <Sparkles className="w-4 h-4" />
                <span>Créer et Ouvrir l'École</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
