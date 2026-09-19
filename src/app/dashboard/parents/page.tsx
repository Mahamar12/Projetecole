'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Parent } from '@/types';
import { formatFCFA } from '@/lib/currency';
import { 
  Users, UserCheck, Phone, Smartphone, Mail, 
  MapPin, MessageSquare, Search, PlusCircle, CreditCard, ChevronRight 
} from 'lucide-react';
import Link from 'next/link';

export default function ParentsManagementPage() {
  const { parents } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParents = parents.filter((p: Parent) => 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm) ||
    p.children.some((c: any) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Responsables Légaux & Familles</span>
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900">
            Gestion des Parents ({parents.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Comptes uniques multi-enfants, coordonnées WhatsApp directes et suivi financier familial
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom de parent, téléphone ou nom d'enfant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Parents Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredParents.map((parent: Parent) => {
          const totalFamilyDue = parent.children.reduce((acc: number, c: any) => acc + c.feeBalance, 0);
          return (
            <div key={parent.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition">
              {/* Parent Info */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-heading font-black text-lg text-slate-900">
                    {parent.firstName} {parent.lastName}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium">{parent.profession || 'Responsable Légal'}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {parent.address}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Solde Famille</div>
                  <div className={`font-black text-sm ${totalFamilyDue > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {formatFCFA(totalFamilyDue)}
                  </div>
                </div>
              </div>

              {/* Direct Actions (WhatsApp & Call) */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <a
                  href={`https://wa.me/${parent.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs border border-emerald-200 transition"
                >
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:${parent.phone}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs border border-blue-200 transition"
                >
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>Appeler</span>
                </a>
              </div>

              {/* Linked Children List */}
              <div className="space-y-2 pt-2">
                <div className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
                  Enfants Rattachés ({parent.children.length})
                </div>
                <div className="space-y-1.5">
                  {parent.children.map((child: any) => (
                    <div
                      key={child.id}
                      className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={child.photo || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'}
                          alt={child.name}
                          className="w-7 h-7 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{child.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{child.matricule} • <span className="font-semibold text-blue-700">{child.className}</span></div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-slate-900 text-xs">Moy : {child.averageGrade?.toFixed(1) || '15.0'}/20</span>
                        <div className={`text-[10px] font-extrabold ${child.feeBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {child.feeBalance > 0 ? formatFCFA(child.feeBalance) : 'Soldé'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
