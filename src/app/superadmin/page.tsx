'use client';

import React, { useState } from 'react';
import { DEMO_SUPER_ADMIN_STATS } from '@/lib/mock-data';
import { formatFCFA, formatCompactFCFA } from '@/lib/currency';
import { 
  ShieldCheck, School, Users, CreditCard, 
  TrendingUp, Globe, PlusCircle, Search, 
  AlertCircle, CheckCircle2, ChevronRight 
} from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminDashboardPage() {
  const stats = DEMO_SUPER_ADMIN_STATS;

  const [selectedCountry, setSelectedCountry] = useState('ALL');

  const schoolsList = [
    { id: '1', name: 'École Internationale du Sénégal', city: 'Dakar', country: 'Sénégal', students: 842, plan: 'PLAN PRO', price: 50000, status: 'ACTIF', renewalDate: '2025-09-01' },
    { id: '2', name: 'Groupe Scolaire Les Pépinières', city: 'Abidjan', country: 'Côte d\'Ivoire', students: 520, plan: 'PLAN BUSINESS', price: 25000, status: 'ACTIF', renewalDate: '2025-10-15' },
    { id: '3', name: 'Lycée Privé Soundiata Keïta', city: 'Bamako', country: 'Mali', students: 410, plan: 'PLAN BUSINESS', price: 25000, status: 'ACTIF', renewalDate: '2025-11-01' },
    { id: '4', name: 'Complexe Éducatif Nelson Mandela', city: 'Thiès', country: 'Sénégal', students: 290, plan: 'PLAN BUSINESS', price: 25000, status: 'ACTIF', renewalDate: '2025-08-30' },
    { id: '5', name: 'Institution Sainte Marie de Cotonou', city: 'Cotonou', country: 'Bénin', students: 180, plan: 'PLAN STARTER', price: 10000, status: 'ESSAI_GRATUIT', renewalDate: '2025-03-05' },
    { id: '6', name: 'Collège d\'Excellence Douala', city: 'Douala', country: 'Cameroun', students: 640, plan: 'PLAN PRO', price: 50000, status: 'ACTIF', renewalDate: '2025-12-01' },
  ];

  const filteredSchools = schoolsList.filter((s: any) => selectedCountry === 'ALL' || s.country === selectedCountry);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Super Admin Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-700 text-purple-300 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Console Super Administrateur SaaS Global</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            EduGestion Africa • Vue Macro SaaS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Supervision du parc d'établissements scolaires abonnés, revenus récurrents (MRR/ARR) et expansion Afrique
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/onboarding"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Déployer Nouvelle École</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* KPI SaaS Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* MRR */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
              <span>MRR (Revenu Mensuel)</span>
              <CreditCard className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="font-heading font-black text-2xl text-emerald-400">
                {formatFCFA(stats.mrrFCFA)}
              </div>
              <div className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18.5% ce mois-ci</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-700/80 text-[11px] text-slate-400">
              ARR Estimé : <strong className="text-white">{formatFCFA(stats.arrFCFA)}</strong>
            </div>
          </div>

          {/* Écoles Abonnées */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
              <span>Écoles Partenaires</span>
              <School className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="font-heading font-black text-2xl text-white">
                {stats.totalSchools} Écoles
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                42 Actives • 5 en Essai • 1 Expirée
              </div>
            </div>
            <div className="pt-2 border-t border-slate-700/80 text-[11px] text-slate-400">
              Taux de rétention : <strong className="text-emerald-400">97.8%</strong>
            </div>
          </div>

          {/* Élèves sous gestion */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
              <span>Élèves Actifs</span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="font-heading font-black text-2xl text-amber-400">
                {stats.totalStudents.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {stats.totalTeachers} enseignants connectés
              </div>
            </div>
            <div className="pt-2 border-t border-slate-700/80 text-[11px] text-slate-400">
              Moyenne : 384 élèves / établissement
            </div>
          </div>

          {/* Volume de Transactions Wave/OM */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
              <span>Volume Scolarités Géré</span>
              <Globe className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="font-heading font-black text-2xl text-purple-300">
                {formatCompactFCFA(stats.totalPaymentsVolumeFCFA)}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Wave, OM, Cash et Virements
              </div>
            </div>
            <div className="pt-2 border-t border-slate-700/80 text-[11px] text-slate-400">
              Sécurité et traçabilité 100%
            </div>
          </div>
        </div>

        {/* Schools Table */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-3xl overflow-hidden">
          <div className="p-5 border-b border-slate-700 flex items-center justify-between flex-wrap gap-3">
            <div className="font-heading font-bold text-base text-white">
              Établissements Clients ({filteredSchools.length})
            </div>

            {/* Country filter */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="text-xs font-bold bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL">Tous les pays d'Afrique</option>
              <option value="Sénégal">Sénégal</option>
              <option value="Côte d'Ivoire">Côte d'Ivoire</option>
              <option value="Mali">Mali</option>
              <option value="Bénin">Bénin</option>
              <option value="Cameroun">Cameroun</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/60 border-b border-slate-700 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Établissement</th>
                  <th className="p-4">Pays & Ville</th>
                  <th className="p-4 text-center">Élèves</th>
                  <th className="p-4">Abonnement SaaS</th>
                  <th className="p-4">Échéance</th>
                  <th className="p-4 text-center">Statut</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filteredSchools.map((school: any) => (
                  <tr key={school.id} className="hover:bg-slate-700/40 transition">
                    <td className="p-4 font-bold text-white">
                      {school.name}
                    </td>
                    <td className="p-4 text-slate-300">
                      {school.city}, {school.country}
                    </td>
                    <td className="p-4 text-center font-bold text-slate-200">
                      {school.students}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-purple-300">{school.plan}</span>
                      <div className="text-[10px] text-slate-400 font-medium">{formatFCFA(school.price)} / mois</div>
                    </td>
                    <td className="p-4 text-slate-400 font-mono text-[11px]">
                      {school.renewalDate}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        school.status === 'ACTIF' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {school.status === 'ACTIF' ? 'Actif' : 'Essai 30j'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href="/dashboard"
                        className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition inline-flex items-center gap-1"
                      >
                        <span>Ouvrir</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
