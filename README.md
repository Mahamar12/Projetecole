# 🏫 EduGestion Africa — Plateforme SaaS de Gestion Scolaire Multi-Écoles

> *"Une école mieux organisée, des parents mieux informés."*

**EduGestion Africa** est une solution SaaS tout-en-un de nouvelle génération conçue spécifiquement pour les établissements d'enseignement privés en Afrique francophone (Sénégal, Côte d'Ivoire, Mali, Bénin, Togo, Cameroun, Guinée, etc.).

---

## 🌟 Points Forts & Fonctionnalités Clés

### 1. Architecture Multi-Tenant Stricte
- Cloisonnement étanche des données de chaque établissement via clé `schoolId` indexée.
- Support multi-pays (Sénégal, CI, Mali, Bénin, Cameroun) et devises en **Franc CFA (XOF / XAF)**.

### 2. Gestion Complète des 6 Rôles Utilisateurs
- **Super Admin SaaS** : Pilotage du parc d'écoles, suivi du MRR/ARR, gestion des abonnements (Starter 10k, Business 25k, Pro 50k FCFA).
- **Directeur d'Établissement** : Tableau de bord 360°, statistiques financières en temps réel, indicateurs de présence et moyennes.
- **Secrétaire** : Admissions, inscriptions, génération automatique des matricules et certificats de scolarité.
- **Comptable** : Encaissement de scolarités, reçus avec QR Code infalsifiable, gestion avancée des impayés et relances automatiques.
- **Enseignant (Mobile-First)** : Appel tactile rapide en classe (P/A/R/J), saisie des notes avec calculs pondérés automatiques, publication de devoirs.
- **Parent d'Élèves (Multi-Enfants)** : Compte unique pour suivre tous ses enfants, consultation des devoirs et notes, paiement direct Wave / Orange Money, téléchargement des bulletins.

### 3. Encaissements Mobiles & Reçus Sécurisés
- Prise en charge native des paiements mobiles africains : **Wave**, **Orange Money**, **Free Money**, Espèces et Virements.
- Émission instantanée de reçus de caisse certifiés avec numéro de transaction et code QR de vérification.
- Gestion des impayés par tranches d'ancienneté (7 jours, 30 jours, 60 jours, 90+ jours) avec relances WhatsApp et SMS en 1 clic.

### 4. Pédagogie & Bulletins Scolaires Officiels
- Système de notation sur 20 avec coefficients modulables selon le cycle (Préscolaire, Élémentaire, Collège, Lycée).
- Calcul automatique des moyennes de matière, moyennes générales et classements (rangs).
- Générateur de **Bulletins Scolaires Officiels conformes aux normes ministérielles** avec mise en page A4 prête à l'impression.

---

## 🏗️ Structure & Arborescence du Projet

```
Projetecole/
├── prisma/
│   └── schema.prisma              # Modèle de données PostgreSQL complet (30+ tables)
├── public/
│   └── manifest.json              # Configuration PWA pour mobile
├── src/
│   ├── app/
│   │   ├── (landing)/             # Landing page professionnelle
│   │   ├── onboarding/            # Wizard en 10 étapes de création d'école
│   │   ├── dashboard/             # Espace Directeur & Administration
│   │   │   ├── students/          # Gestion complète des élèves (CRUD, matricule, fiche)
│   │   │   ├── parents/           # Gestion des parents & multi-enfants
│   │   │   ├── teachers/          # Gestion des enseignants & affectations
│   │   │   ├── classes/           # Classes, niveaux et coefficients
│   │   │   ├── enrollments/       # Inscriptions & admissions
│   │   │   ├── fees/              # Grille tarifaire & échéanciers par tranche
│   │   │   ├── payments/          # Journal des encaissements & reçus PDF
│   │   │   ├── overdue/           # Gestion des impayés & relances WhatsApp/SMS
│   │   │   ├── grades/            # Saisie des notes & calculs de moyenne
│   │   │   ├── report-cards/      # Générateur de bulletins scolaires A4
│   │   │   ├── attendance/        # Appel en classe mobile en 1 clic
│   │   │   ├── timetable/         # Emploi du temps interactif
│   │   │   ├── homework/          # Cahier de texte & devoirs
│   │   │   ├── communication/     # Messagerie WhatsApp & SMS
│   │   │   ├── documents/         # Bibliothèque de certificats de scolarité
│   │   │   ├── reports/           # Rapports & exports Excel/PDF
│   │   │   ├── ai-assistant/      # Assistant IA contextuel
│   │   │   └── settings/          # Paramètres école & passerelles Wave/OM
│   │   ├── portal-parent/         # Espace optimisé parent multi-enfants
│   │   ├── portal-teacher/        # Espace mobile enseignant (appel rapide)
│   │   └── superadmin/            # Dashboard Super Admin SaaS (MRR / ARR)
│   ├── components/
│   │   ├── layout/                # Sidebar, TopBar, Switcher de rôle démo
│   │   ├── payments/              # Modales d'encaissement Mobile Money
│   │   ├── documents/             # Reçus sécurisés & Bulletins imprimables
│   │   └── modals/                # Modales d'inscription & relances impayés
│   ├── context/
│   │   └── AppContext.tsx         # Gestion d'état temps réel & multi-rôles
│   ├── lib/
│   │   ├── currency.ts            # Formateurs FCFA (XOF/XAF)
│   │   ├── grading.ts             # Algorithmes de calcul moyennes et mentions
│   │   └── mock-data.ts           # Jeu de données réaliste (École Inter. du Sénégal)
│   └── types/
│       └── index.ts               # Types TypeScript complets
└── package.json
```

---

## 🚀 Installation & Démarrage Local

### Prérequis
- **Node.js** >= 18.x
- **npm** >= 9.x

### Étapes d'installation

```bash
# 1. Cloner le projet et accéder au dossier
cd Projetecole

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env

# 4. Lancer le serveur de développement
npm run dev
```

L'application est immédiatement accessible à l'adresse : **`http://localhost:3000`**

---

## 🧪 Guide de Test du Mode Démo Multi-Rôles

Une barre supérieure interactive permet de basculer instantanément entre tous les profils utilisateurs :
1. **Directeur (Admin)** : Accédez au tableau de bord 360°, aux KPI financiers et à la gestion des élèves.
2. **Comptable** : Enregistrez un versement Wave/OM et imprimez le reçu officiel.
3. **Enseignant** : Faites l'appel en 1 clic sur mobile.
4. **Parent** : Consultez les notes de la fratrie et testez le bouton de paiement.
5. **Super Admin SaaS** : Analysez les métriques SaaS globales (MRR, ARR, Écoles clientes).

---

## 📄 Licence
Propriété d'EduGestion Africa. Tous droits réservés.
