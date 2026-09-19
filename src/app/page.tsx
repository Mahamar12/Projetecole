'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  School, CheckCircle2, ShieldCheck, Smartphone, 
  CreditCard, Award, Users, BookOpen, Clock, 
  ArrowRight, Sparkles, MessageSquare, ChevronDown, 
  Star, Phone, Mail, MapPin, PlayCircle
} from 'lucide-react';
import { formatFCFA } from '@/lib/currency';

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [selectedPlanPeriod, setSelectedPlanPeriod] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');

  const faqs = [
    {
      q: 'EduGestion Africa fonctionne-t-il avec une connexion Internet instable ou faible ?',
      a: 'Oui, absolument. Notre plateforme est développée avec une architecture PWA ultra-légère et un cache intelligent qui permet la saisie d\'appel et de notes même en cas de ralentissement réseau, avec synchronisation automatique dès le retour de la connexion.'
    },
    {
      q: 'Comment les parents règlent-ils les frais scolaires via Wave et Orange Money ?',
      a: 'Les parents peuvent soit payer directement en 1 clic depuis leur espace parent via Wave ou Orange Money, soit payer à la caisse de l\'école. Un reçu numérique officiel avec QR code et numéro de transaction unique est généré instantanément et envoyé par WhatsApp / SMS.'
    },
    {
      q: 'Peut-on personnaliser les coefficients et les maquettes de bulletins scolaires ?',
      a: 'Tout à fait. EduGestion s\'adapte aux programmes officiels du Sénégal, de la Côte d\'Ivoire, du Mali, du Cameroun et de toute l\'Afrique francophone. Chaque école configure ses matières, coefficients, cycles (Primaire, Collège, Lycée) et modèles de bulletins.'
    },
    {
      q: 'Nos données sont-elles sécurisées et isolées des autres établissements ?',
      a: 'La sécurité est notre priorité absolue. L\'architecture multi-tenant garantit une isolation stricte et étanche de la base de données. Aucun administrateur ou utilisateur d\'une école ne peut accéder aux dossiers d\'un autre établissement.'
    }
  ];

  const plans = [
    {
      name: 'PLAN STARTER',
      tagline: 'Idéal pour les petites écoles primaires ou maternelles',
      monthly: 10000,
      yearly: 100000,
      maxStudents: 'Jusqu\'à 200 élèves',
      features: [
        'Gestion des élèves & parents',
        'Saisie des présences & absences',
        'Paiements & reçus de caisse',
        'Bulletins trimestriels standards',
        'Support standard WhatsApp',
      ],
      popular: false,
      cta: 'Démarrer l\'essai gratuit',
    },
    {
      name: 'PLAN BUSINESS',
      tagline: 'Le plus choisi par les collèges et groupes scolaires',
      monthly: 25000,
      yearly: 250000,
      maxStudents: 'Jusqu\'à 600 élèves',
      features: [
        'Toutes les fonctionnalités Starter',
        'Paiements mobiles Wave & Orange Money',
        'Gestion avancée des impayés & relances',
        'Espace Parents & Espace Enseignants',
        'Emploi du temps & détection des conflits',
        'Relances automatiques par SMS & WhatsApp',
      ],
      popular: true,
      cta: 'Choisir le Plan Business',
    },
    {
      name: 'PLAN PRO',
      tagline: 'Pour les grands complexes scolaires et lycées d\'excellence',
      monthly: 50000,
      yearly: 500000,
      maxStudents: 'Élèves illimités',
      features: [
        'Toutes les fonctionnalités Business',
        'Multi-établissements & multi-sites',
        'Assistant IA administratif & analytique',
        'Rapports financiers et pédagogiques avancés',
        'Gestionnaire de compte dédié 24/7',
        'Formation sur site du personnel',
      ],
      popular: false,
      cta: 'Opter pour le Plan Pro',
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Navigation Bar */}
      <nav className="sticky top-8 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white font-black flex items-center justify-center text-lg shadow-md shadow-blue-500/20">
              EG
            </div>
            <div>
              <span className="font-heading font-black text-slate-900 text-lg tracking-tight">
                EduGestion <span className="text-emerald-600">Africa</span>
              </span>
              <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                Le SaaS des Écoles Privées
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#avantages" className="hover:text-blue-600 transition">Avantages</a>
            <a href="#fonctionnalites" className="hover:text-blue-600 transition">Fonctionnalités</a>
            <a href="#paiements" className="hover:text-blue-600 transition">Paiements Wave/OM</a>
            <a href="#tarifs" className="hover:text-blue-600 transition">Tarifs FCFA</a>
            <a href="#temoignages" className="hover:text-blue-600 transition">Témoignages</a>
            <a href="#faq" className="hover:text-blue-600 transition">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition hidden sm:inline-flex"
            >
              Accéder à la Démo
            </Link>
            <Link
              href="/onboarding"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-600/30 transition hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Créer mon école</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-blue-50/60 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Conçu pour le Sénégal & l'Afrique Francophone</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-slate-950 tracking-tight leading-[1.1]">
              Le logiciel de gestion pensé pour les <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-emerald-600">écoles africaines.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Centralisez vos élèves, paiements, notes, absences et communications dans une seule plateforme moderne, rapide et adaptée aux connexions Internet locales.
            </p>

            {/* Slogan pill */}
            <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 py-1.5 px-4 rounded-xl inline-block">
              « Une école mieux organisée, des parents mieux informés. »
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/onboarding"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-blue-600 text-white font-heading font-bold text-sm hover:bg-blue-700 shadow-xl shadow-blue-600/30 transition hover:scale-105 active:scale-95"
              >
                <span>Créer mon école gratuitement</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white border border-slate-300 text-slate-800 font-heading font-bold text-sm hover:bg-slate-50 shadow-sm transition"
              >
                <PlayCircle className="w-4 h-4 text-emerald-600" />
                <span>Tester la Démo Immédiate</span>
              </Link>
            </div>

            {/* Trust metrics */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto text-left">
              <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
                <div className="font-heading font-black text-xl text-blue-900">48+</div>
                <div className="text-[11px] text-slate-500 font-medium">Écoles partenaires</div>
              </div>
              <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
                <div className="font-heading font-black text-xl text-emerald-700">18 450</div>
                <div className="text-[11px] text-slate-500 font-medium">Élèves gérés</div>
              </div>
              <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
                <div className="font-heading font-black text-xl text-blue-900">100%</div>
                <div className="text-[11px] text-slate-500 font-medium">Compatible Wave/OM</div>
              </div>
              <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
                <div className="font-heading font-black text-xl text-emerald-700">0 FCFA</div>
                <div className="text-[11px] text-slate-500 font-medium">Frais d'installation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1 : Pourquoi EduGestion */}
      <section id="avantages" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs uppercase font-extrabold text-blue-700 tracking-wider">
              Une Solution Sur Mesure
            </h2>
            <p className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-950 mt-1">
              Pourquoi les directions d'écoles choisissent EduGestion ?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-slate-900 text-base">
                Zéro Impayé & Encaissements Simplifiés
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Suivi automatique des retards de paiement (7j, 30j, 60j) et relances directes sur WhatsApp et SMS en 1 clic. Reçus officiels avec QR Code instantanés.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-slate-900 text-base">
                Appel & Notes Directement sur Téléphone
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Les enseignants font l'appel en 30 secondes en début de cours depuis leur smartphone. Les parents sont prévenus automatiquement en cas d'absence.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-slate-900 text-base">
                Bulletins Officiels en 1 Clic
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calcul instantané des moyennes pondérées par coefficient, des classements et mentions. Génération automatique de bulletins PDF prêts à l'impression A4.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 : Modules Clés */}
      <section id="fonctionnalites" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs uppercase font-extrabold text-blue-700 tracking-wider">
              Fonctionnalités Exhaustives
            </h2>
            <p className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-950 mt-1">
              Tous les outils pour piloter votre établissement
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Users, title: 'Gestion des Élèves', desc: 'Matricule automatique, fiches médicales, historique et export Excel/PDF.' },
              { icon: Users, title: 'Espace Parents Multi-Enfants', desc: 'Un compte unique pour suivre tous ses enfants, notes et paiements.' },
              { icon: CreditCard, title: 'Paiements & Trésorerie', desc: 'Wave, Orange Money, Espèces avec reçus et rapprochement bancaire.' },
              { icon: Award, title: 'Notes & Bulletins', desc: 'Saisie simplifiée, moyennes automatiques, rangs et mentions d\'excellence.' },
              { icon: Clock, title: 'Absences & Retards', desc: 'Appel mobile en classe et notifications d\'absence instantanées aux parents.' },
              { icon: BookOpen, title: 'Emploi du Temps', desc: 'Planning hebdomadaire avec détection intelligente des conflits de salle.' },
              { icon: MessageSquare, title: 'WhatsApp & SMS', desc: 'Campagnes d\'information par classe ou globales sans quitter la plateforme.' },
              { icon: ShieldCheck, title: 'Multi-Tenant & Sécurisé', desc: 'Données protégées, sauvegardes quotidiennes et isolation complète.' },
            ].map((f, i) => (
              <div key={i} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-400 transition">
                <f.icon className="w-8 h-8 text-blue-600 mb-3" />
                <h4 className="font-heading font-bold text-slate-900 text-sm mb-1">{f.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 : Paiements Wave / OM */}
      <section id="paiements" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5" />
                Mobile Money Afrique
              </div>
              <h2 className="font-heading font-black text-3xl sm:text-4xl text-slate-950 leading-tight">
                Encaissez facilement avec <span className="text-blue-600">Wave</span> & <span className="text-orange-600">Orange Money</span>.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Fini les files d'attente à la rentrée et les risques liés à la manipulation d'espèces. Les parents règlent depuis leur téléphone en quelques clics. Votre trésorerie est mise à jour instantanément.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 font-semibold">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Rapprochement automatique élève / parent / classe
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Génération de reçu sécurisé avec QR Code infalsifiable
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Tableau de bord des impayés avec relances programmées
                </li>
              </ul>
            </div>

            {/* Visual simulation card */}
            <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
                <span className="text-slate-400">Encaissements du jour (Almadies)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">En direct</span>
              </div>
              <div className="text-2xl sm:text-3xl font-heading font-black text-emerald-400">
                1 450 000 FCFA
              </div>
              <div className="space-y-2 pt-2">
                <div className="p-3 bg-slate-800/80 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-200">Awa Diop (3ème A)</div>
                    <div className="text-[10px] text-slate-400">Wave • WAV-SN-928174</div>
                  </div>
                  <span className="font-bold text-emerald-400">+150 000 FCFA</span>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-200">Cheikh Ndiaye (Tle S2)</div>
                    <div className="text-[10px] text-slate-400">Orange Money • OM-SN-882190</div>
                  </div>
                  <span className="font-bold text-emerald-400">+300 000 FCFA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 : Tarifs en FCFA */}
      <section id="tarifs" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs uppercase font-extrabold text-blue-700 tracking-wider">
              Tarification Transparente
            </h2>
            <p className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-950 mt-1">
              Des forfaits adaptés à chaque taille d'établissement
            </p>
            <p className="text-xs text-slate-600 mt-2">
              Prix en Francs CFA (XOF / XAF). Sans engagement, 30 jours d'essai gratuit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((p, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-6 flex flex-col justify-between transition ${
                  p.popular 
                    ? 'bg-white border-2 border-blue-600 shadow-xl relative scale-105' 
                    : 'bg-white border border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                    Le Plus Populaire
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="font-heading font-black text-lg text-slate-900">{p.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{p.tagline}</p>
                  </div>

                  <div className="py-2">
                    <div className="font-heading font-black text-3xl text-slate-950">
                      {formatFCFA(p.monthly)}
                      <span className="text-xs font-semibold text-slate-500"> / mois</span>
                    </div>
                    <div className="text-[11px] font-bold text-blue-700 mt-0.5">{p.maxStudents}</div>
                  </div>

                  <ul className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-700">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <Link
                    href="/onboarding"
                    className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center transition ${
                      p.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/30'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    {p.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 : Témoignages */}
      <section id="temoignages" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs uppercase font-extrabold text-blue-700 tracking-wider">
              Témoignages
            </h2>
            <p className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-950 mt-1">
              Ils font confiance à EduGestion Africa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs text-slate-700 italic leading-relaxed">
                « Avant EduGestion, le suivi des scolarités et la relance des impayés nous prenaient des semaines. Aujourd'hui, avec les alertes WhatsApp et les paiements Wave, notre taux de recouvrement atteint 96% dès le premier mois. »
              </p>
              <div className="pt-2 border-t border-slate-200/80">
                <div className="font-heading font-bold text-slate-900 text-xs">M. Amadou Diallo</div>
                <div className="text-[10px] text-slate-500">Directeur Général • Dakar, Sénégal</div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs text-slate-700 italic leading-relaxed">
                « La génération des bulletins trimestriels prenait 5 jours aux professeurs. En un clic, les moyennes pondérées et les rangs sont calculés et imprimés. Une révolution pour notre collège ! »
              </p>
              <div className="pt-2 border-t border-slate-200/80">
                <div className="font-heading font-bold text-slate-900 text-xs">Mme Mariétou Koné</div>
                <div className="text-[10px] text-slate-500">Principale d'Établissement • Abidjan, Côte d'Ivoire</div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs text-slate-700 italic leading-relaxed">
                « En tant que parent de 3 enfants scolarisés au même endroit, je reçois leurs notes, devoirs et l'état des paiements directement sur mon téléphone. C'est simple, rapide et rassurant. »
              </p>
              <div className="pt-2 border-t border-slate-200/80">
                <div className="font-heading font-bold text-slate-900 text-xs">Mamadou Diop</div>
                <div className="text-[10px] text-slate-500">Parent d'Élèves • Mermoz, Dakar</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6 : FAQ */}
      <section id="faq" className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xs uppercase font-extrabold text-blue-700 tracking-wider">
              Questions Fréquentes
            </h2>
            <p className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-950 mt-1">
              Tout ce que vous devez savoir
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-heading font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-heading font-black text-3xl sm:text-4xl">
            Prêt à moderniser la gestion de votre école ?
          </h2>
          <p className="text-xs sm:text-sm text-blue-200 max-w-xl mx-auto leading-relaxed">
            Rejoignez dès aujourd'hui les écoles privées pionnières en Afrique. Configurez votre établissement en 5 minutes chrono.
          </p>
          <div className="pt-2">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-heading font-bold text-sm shadow-xl shadow-emerald-500/30 transition hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Créer mon école maintenant</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-heading font-bold text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>EduGestion Africa © 2024-2025</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Dakar • Abidjan • Bamako • Cotonou • Yaoundé</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
