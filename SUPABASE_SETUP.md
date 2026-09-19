# ⚡ Integration Fullstack Supabase - EduGestion Africa

La plateforme **EduGestion Africa** (`Projetecole`) est désormais configurée pour fonctionner avec **Supabase** (PostgreSQL, Auth, RLS, Storage et Realtime).

---

## 📁 Fichiers Créés & Modifiés

1. **[`supabase/schema.sql`](file:///c:/Users/group/Desktop/Mohamed/Projetecole/supabase/schema.sql)** :
   - Contient le schéma SQL PostgreSQL complet (Tables Écoles, Élèves, Parents, Enseignants, Frais, Paiements, Notes, Absences, Sécurité RLS).

2. **[`supabase/seed.sql`](file:///c:/Users/group/Desktop/Mohamed/Projetecole/supabase/seed.sql)** :
   - Jeu de données d'essai (École Internationale du Sénégal, Élèves, Classes, Paiements en **Franc CFA** via Wave/Orange Money).

3. **[`src/lib/supabase/client.ts`](file:///c:/Users/group/Desktop/Mohamed/Projetecole/src/lib/supabase/client.ts)** :
   - Client Supabase pour les composantes React (Browser).

4. **[`src/lib/supabase/server.ts`](file:///c:/Users/group/Desktop/Mohamed/Projetecole/src/lib/supabase/server.ts)** :
   - Client Supabase SSR pour Next.js App Router (Server Components & Server Actions).

5. **[`src/lib/supabase/services.ts`](file:///c:/Users/group/Desktop/Mohamed/Projetecole/src/lib/supabase/services.ts)** :
   - Couche d'API de services Supabase (CRUD Élèves, Encaissements Wave/OM, Gestion des Notes & Absences, Authentification).

---

## 🚀 Étapes de Déploiement du Schéma sur Supabase

### Étape 1 : Obtenir vos clés Supabase
1. Rendez-vous sur votre dashboard [Supabase](https://supabase.com/dashboard).
2. Sélectionnez ou créez votre projet.
3. Dans **Project Settings -> API**, copiez :
   - `Project URL`
   - `anon public key`
   - `service_role secret key`

### Étape 2 : Mettre à jour le fichier `.env`
Ouvrez le fichier [`.env`](file:///c:/Users/group/Desktop/Mohamed/Projetecole/.env) de `Projetecole` et renseignez les valeurs :

```env
NEXT_PUBLIC_SUPABASE_URL="https://votre-projet.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="votre_anon_key_ici"
SUPABASE_SERVICE_ROLE_KEY="votre_service_role_key_ici"
```

### Étape 3 : Exécuter le Schéma SQL
1. Sur votre tableau de bord Supabase, allez dans l'onglet **SQL Editor** (`Editor SQL`).
2. Ouvrez le fichier [`supabase/schema.sql`](file:///c:/Users/group/Desktop/Mohamed/Projetecole/supabase/schema.sql) de votre projet, copiez l'intégralité du code et collez-le dans le SQL Editor.
3. Cliquez sur **Run** pour créer automatiquement toutes les tables et politiques RLS.
4. *(Optionnel)* Copiez le contenu de [`supabase/seed.sql`](file:///c:/Users/group/Desktop/Mohamed/Projetecole/supabase/seed.sql) et exécutez-le pour insérer des données de test (Élèves, Paiements Wave/OM).

---

## 💻 Exemples d'Utilisation des Services Supabase

```typescript
import { studentService, paymentService } from '@/lib/supabase/services';

// 1. Récupérer tous les élèves
const students = await studentService.getAll();

// 2. Enregistrer un paiement Wave / Orange Money en Franc CFA
const newPayment = await paymentService.recordPayment({
  student_id: 'e1111111-1111-1111-1111-111111111111',
  amount: 50000,
  method: 'WAVE',
  receipt_number: 'REC-2024-005',
  transaction_ref: 'WAV-SN-99881',
  note: 'Paiement scolarité via Supabase'
});
```
