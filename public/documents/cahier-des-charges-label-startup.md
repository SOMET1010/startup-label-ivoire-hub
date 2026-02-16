# Cahier des Charges — Plateforme Digitale de Labellisation des Startups

**Projet :** Plateforme Label Startup Côte d'Ivoire  
**Maîtrise d'ouvrage :** Ministère de la Transition Numérique et de l'Innovation Technologique (MTNI)  
**Maîtrise d'œuvre :** ANSUT  
**Version :** 2.0 — Février 2026

---

## Table des matières

1. [Contexte et cadre légal](#1-contexte-et-cadre-légal)
2. [Objectifs stratégiques](#2-objectifs-stratégiques)
3. [Périmètre fonctionnel](#3-périmètre-fonctionnel)
4. [Architecture technique](#4-architecture-technique)
5. [Sécurité et conformité](#5-sécurité-et-conformité)
6. [Rôles et profils utilisateurs](#6-rôles-et-profils-utilisateurs)
7. [Exigences non-fonctionnelles](#7-exigences-non-fonctionnelles)
8. [Planning et jalons](#8-planning-et-jalons)
9. [Annexes](#9-annexes)

---

## 1. Contexte et cadre légal

### 1.1 Fondement juridique

La plateforme s'inscrit dans le cadre de la **Loi n°2023-901 du 23 novembre 2023** portant promotion des startups en Côte d'Ivoire. Cette loi établit le dispositif de labellisation officielle permettant aux startups numériques de bénéficier d'avantages fiscaux, d'un accès facilité aux marchés publics et d'un accompagnement structuré.

### 1.2 Acteurs institutionnels

| Acteur | Rôle |
|--------|------|
| **MTNI** | Tutelle politique, validation stratégique, présidence du comité de labellisation |
| **ANSUT** | Maîtrise d'œuvre technique, développement et hébergement de la plateforme |
| **Comité de labellisation** | Évaluation des candidatures, vote et décision collégiale |
| **SAE** | Structures d'Accompagnement à l'Entrepreneuriat — parrainage et suivi des startups |

### 1.3 Enjeux

- **Structuration** de l'écosystème startup national
- **Transparence** du processus de labellisation
- **Attractivité** pour les investisseurs nationaux et internationaux
- **Compétitivité** régionale de la Côte d'Ivoire en Afrique de l'Ouest

---

## 2. Objectifs stratégiques

### 2.1 Vision

Créer une plateforme numérique unique, fiable et accessible, servant de guichet central pour la labellisation, l'accompagnement et la valorisation des startups ivoiriennes.

### 2.2 Objectifs mesurables — Année 1

| Catégorie | Indicateur | Cible |
|-----------|------------|-------|
| **Adoption** | Taux de soumission en ligne | 100 % |
| | Taux d'activation comptes startup | > 80 % |
| | Taux d'utilisation espace labellisé | > 60 % |
| **Croissance** | Candidatures déposées | > 200 |
| | Startups labellisées | > 50 |
| | Visiteurs uniques portail public | > 10 000 |
| **Performance** | Délai moyen de décision | < 30 jours |
| | Taux de dossiers complets | > 70 % |
| | Disponibilité plateforme | > 99 % |
| **Satisfaction** | NPS startups | > 40 |
| | Taux de réclamations | < 5 % |

---

## 3. Périmètre fonctionnel

### 3.1 Portail public

Le portail constitue la vitrine officielle du programme Label Startup.

| Réf. | Fonctionnalité | Description | Statut |
|------|----------------|-------------|--------|
| PUB-01 | Page d'accueil institutionnelle | Présentation du programme, statistiques clés, avantages du label | ✅ Livré |
| PUB-02 | Critères d'éligibilité | Affichage détaillé des conditions requises pour postuler | ✅ Livré |
| PUB-03 | Quiz d'auto-évaluation | Questionnaire interactif permettant aux startups de vérifier leur éligibilité avant candidature | ✅ Livré |
| PUB-04 | Annuaire des startups labellisées | Répertoire filtrable par secteur, stade de développement et localisation | ✅ Livré |
| PUB-05 | Actualités et événements | Fil d'actualités avec catégorisation, carrousel éditorial, partage social | ✅ Livré |
| PUB-06 | FAQ et documentation | Base de connaissances structurée avec recherche intégrée | ✅ Livré |
| PUB-07 | Cadre juridique | Consultation des lois, décrets et arrêtés avec téléchargement PDF | ✅ Livré |
| PUB-08 | Présentation du comité | Composition, rôle et fonctionnement de la commission de labellisation | ✅ Livré |
| PUB-09 | Formulaire de contact | Envoi de messages avec notification email automatique | ✅ Livré |
| PUB-10 | Cartographie IA | Carte interactive des entreprises IA en Côte d'Ivoire | ✅ Livré |

### 3.2 Espace Startup

Espace personnel dédié aux porteurs de projets.

| Réf. | Fonctionnalité | Description | Statut |
|------|----------------|-------------|--------|
| STA-01 | Inscription et authentification | Création de compte avec vérification email, connexion sécurisée | ✅ Livré |
| STA-02 | Formulaire de candidature | Soumission multi-étapes (4 étapes) avec sauvegarde automatique du brouillon | ✅ Livré |
| STA-03 | Upload de documents | Téléversement sécurisé des pièces justificatives (RCCM, statuts, business plan, pitch deck, CV, attestation fiscale) | ✅ Livré |
| STA-04 | Suivi de candidature | Timeline visuelle du processus, statut en temps réel, historique des actions | ✅ Livré |
| STA-05 | Tableau de bord | Vue synthétique : statut, documents, actions requises, messages | ✅ Livré |
| STA-06 | Profil startup | Gestion des informations de la startup, logo, documents soumis | ✅ Livré |
| STA-07 | Espace labellisé | Accès réservé aux startups labellisées : ressources premium, opportunités, réseau, événements | ✅ Livré |
| STA-08 | Demande de renouvellement | Workflow de renouvellement du label avant expiration (rappels automatiques à 90, 60 et 30 jours) | ✅ Livré |
| STA-09 | Messagerie interne | Communication avec l'administration, réception de demandes de documents complémentaires | ✅ Livré |
| STA-10 | Coach IA | Assistant conversationnel pour guider la startup dans son parcours de labellisation | ✅ Livré |
| STA-11 | Notifications push | Alertes en temps réel sur l'avancement du dossier, les événements et les opportunités | ✅ Livré |

### 3.3 Espace Évaluateur

Interface dédiée aux membres du comité de labellisation.

| Réf. | Fonctionnalité | Description | Statut |
|------|----------------|-------------|--------|
| EVA-01 | Liste des candidatures | Tableau filtrable des dossiers assignés avec indicateurs de priorité | ✅ Livré |
| EVA-02 | Grille d'évaluation | Notation multi-critères : Innovation (5), Modèle économique (5), Impact (5), Équipe (5) — total sur 20 | ✅ Livré |
| EVA-03 | Consultation des documents | Accès sécurisé aux pièces justificatives avec journalisation des accès | ✅ Livré |
| EVA-04 | Système de vote | Vote favorable / défavorable avec calcul de quorum (3 votes minimum) | ✅ Livré |
| EVA-05 | Commentaires et discussions | Fil de discussion par candidature avec mentions, pièces jointes et réponses imbriquées | ✅ Livré |
| EVA-06 | Historique des évaluations | Journal complet des évaluations soumises avec scores et recommandations | ✅ Livré |
| EVA-07 | Synthèse décisionnelle | Résumé automatique des votes, score moyen, taux de confiance, recommandation calculée | ✅ Livré |

### 3.4 Espace Administrateur

Panneau de contrôle pour la gestion globale de la plateforme.

| Réf. | Fonctionnalité | Description | Statut |
|------|----------------|-------------|--------|
| ADM-01 | Dashboard KPIs temps réel | Indicateurs clés avec mise à jour en temps réel (Realtime) et graphiques interactifs | ✅ Livré |
| ADM-02 | Gestion des candidatures | Visualisation, filtrage, changement de statut, attribution aux évaluateurs | ✅ Livré |
| ADM-03 | Demande de documents | Envoi de demandes de pièces complémentaires avec notification automatique | ✅ Livré |
| ADM-04 | Gestion des utilisateurs | Liste des utilisateurs par rôle, statut et date d'inscription | ✅ Livré |
| ADM-05 | Logs d'audit | Traçabilité complète : actions, utilisateurs, horodatage, filtrage avancé, graphiques analytiques | ✅ Livré |
| ADM-06 | Statistiques de vote | Tableau de bord dédié : distribution des décisions, performance des évaluateurs, tendances temporelles | ✅ Livré |
| ADM-07 | Paramètres plateforme | Configuration dynamique : nom du ministère, contacts, emails, site web | ✅ Livré |
| ADM-08 | Gestion des documents légaux | Upload et gestion des lois, décrets, arrêtés avec stockage sécurisé | ✅ Livré |
| ADM-09 | Gestion du comité | Administration des membres du comité : photos, titres, organisations, ordre d'affichage | ✅ Livré |
| ADM-10 | Rapport de sécurité | Carte de santé sécurité : HIBP, RLS, authentification avec guide de remédiation | ✅ Livré |

### 3.5 Espace Structure d'Accompagnement (SAE)

Interface pour les incubateurs, accélérateurs et structures de soutien.

| Réf. | Fonctionnalité | Description | Statut |
|------|----------------|-------------|--------|
| SAE-01 | Profil structure | Gestion des informations : nom, description, secteurs, programmes, logo | ✅ Livré |
| SAE-02 | Startups accompagnées | Liste et suivi des startups rattachées à la structure | ✅ Livré |
| SAE-03 | Programmes | Gestion des programmes d'accompagnement actifs | ✅ Livré |
| SAE-04 | Tableau de bord | Statistiques d'activité et indicateurs de performance | ✅ Livré |

### 3.6 Espace Investisseur

Interface dédiée aux investisseurs pour découvrir et suivre les startups labellisées.

| Réf. | Fonctionnalité | Description | Statut |
|------|----------------|-------------|--------|
| INV-01 | Annuaire startups | Exploration filtrée des startups labellisées avec fiches détaillées | ✅ Livré |
| INV-02 | Marques d'intérêt | Expression et suivi des intérêts pour les startups | ✅ Livré |
| INV-03 | Profil investisseur | Gestion du profil : type, tickets, secteurs cibles, portefeuille | ✅ Livré |
| INV-04 | Messagerie | Communication directe avec les startups d'intérêt | ✅ Livré |
| INV-05 | Success stories | Témoignages et cas de réussite de l'écosystème | ✅ Livré |

### 3.7 Fonctionnalités transversales

| Réf. | Fonctionnalité | Description | Statut |
|------|----------------|-------------|--------|
| TRV-01 | Authentification multi-rôle | Système de rôles (admin, startup, evaluator, structure, investor) avec redirection contextuelle | ✅ Livré |
| TRV-02 | Notifications push (Web Push) | Service worker, enregistrement VAPID, envoi ciblé par rôle et événement | ✅ Livré |
| TRV-03 | Notifications email | Emails transactionnels pour les changements de statut, demandes de documents, décisions | ✅ Livré |
| TRV-04 | Messagerie interne | Système de messages entre startups et administration | ✅ Livré |
| TRV-05 | Coach IA | Assistant conversationnel propulsé par IA pour l'accompagnement des startups | ✅ Livré |
| TRV-06 | Internationalisation | Interface bilingue français / anglais avec détection automatique de la langue | ✅ Livré |
| TRV-07 | Mode sombre | Thème clair / sombre avec persistance des préférences utilisateur | ✅ Livré |
| TRV-08 | SEO et accessibilité | Balises méta, JSON-LD, sitemap, robots.txt, skip links, aria labels | ✅ Livré |
| TRV-09 | Newsletter | Inscription et gestion des abonnés à la newsletter de la plateforme | ✅ Livré |
| TRV-10 | Responsive design | Adaptation complète mobile, tablette et desktop | ✅ Livré |

---

## 4. Architecture technique

### 4.1 Stack technologique

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| **Frontend** | React 18 + TypeScript + Vite | Performance, typage, écosystème riche |
| **UI** | Tailwind CSS + shadcn/ui | Design system cohérent, composants accessibles |
| **État** | TanStack React Query | Cache intelligent, synchronisation serveur |
| **Animations** | Framer Motion | Animations fluides et déclaratives |
| **Cartographie** | Leaflet + React-Leaflet | Carte interactive open-source |
| **Backend** | Lovable Cloud (Supabase) | Base de données PostgreSQL, auth, stockage, fonctions edge |
| **IA** | Lovable AI (Gemini / GPT) | Coach IA sans clé API requise |

### 4.2 Schéma de la base de données

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│    profiles      │     │   applications    │     │   evaluations    │
│─────────────────│     │──────────────────│     │─────────────────│
│ user_id (PK)    │◄────│ user_id           │     │ evaluator_id    │
│ full_name       │     │ startup_id (FK)   │◄────│ application_id  │
│ email           │     │ status            │     │ innovation_score│
│ avatar_url      │     │ submitted_at      │     │ total_score     │
│ preferred_lang  │     │ reviewed_at       │     │ recommendation  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                              │
                              ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│    startups      │     │ voting_decisions  │     │   user_roles     │
│─────────────────│     │──────────────────│     │─────────────────│
│ id (PK)         │     │ application_id    │     │ user_id          │
│ name            │     │ final_decision    │     │ role (enum)      │
│ sector          │     │ quorum_reached    │     │ admin / startup  │
│ doc_rccm        │     │ approve_count     │     │ evaluator / SAE  │
│ doc_business_pl │     │ average_score     │     │ investor         │
│ label_granted_at│     │ decision_confid.  │     └─────────────────┘
└─────────────────┘     └──────────────────┘
```

### 4.3 Buckets de stockage

| Bucket | Usage | Accès |
|--------|-------|-------|
| `startup-documents` | Pièces justificatives des candidatures | Privé (RLS par user_id) |
| `legal-documents` | Lois, décrets, arrêtés officiels | Public en lecture |
| `committee-photos` | Photos des membres du comité | Public en lecture |

### 4.4 Fonctions Edge (Backend serverless)

| Fonction | Déclencheur | Description |
|----------|-------------|-------------|
| `check-user-role` | Authentification | Vérification du rôle utilisateur |
| `label-coach` | Chat IA | Réponses du coach IA via Lovable AI |
| `notify-application-status` | Changement de statut | Notification email et push |
| `notify-document-request` | Demande de document | Notification à la startup |
| `notify-voting-decision` | Décision de vote | Notification de la décision finale |
| `send-contact-email` | Formulaire de contact | Envoi d'email au support |
| `send-push-notification` | Événement système | Envoi de notification push Web |
| `renewal-reminders` | Cron (planifié) | Rappels automatiques de renouvellement |
| `startup-news` | Actualités | Agrégation d'actualités sectorielles |
| `register-push-subscription` | Inscription push | Enregistrement des souscriptions VAPID |

---

## 5. Sécurité et conformité

### 5.1 Mesures de sécurité implémentées

| Mesure | Description | Statut |
|--------|-------------|--------|
| **Row Level Security (RLS)** | Politiques de sécurité au niveau des lignes sur toutes les tables | ✅ Actif |
| **Authentification JWT** | Tokens signés avec expiration, refresh automatique | ✅ Actif |
| **Protection HIBP** | Vérification des mots de passe compromis via HaveIBeenPwned | ⚠️ À activer |
| **Journalisation des accès** | Traçabilité de tous les accès aux documents sensibles | ✅ Actif |
| **URLs signées** | Liens temporaires (5 min) pour les documents privés | ✅ Actif |
| **CORS** | Politique de même origine pour les fonctions edge | ✅ Actif |
| **Validation des entrées** | Schémas Zod côté client, contraintes PostgreSQL côté serveur | ✅ Actif |

### 5.2 Conformité

- **RGPD** : Consentement explicite, droit à la suppression, minimisation des données
- **Loi ivoirienne n°2013-450** : Protection des données à caractère personnel
- **Accessibilité WCAG 2.1 AA** : Navigation au clavier, lecteur d'écran, contrastes

---

## 6. Rôles et profils utilisateurs

| Rôle | Accès | Permissions clés |
|------|-------|-------------------|
| **Visiteur** | Portail public | Consultation, quiz, contact |
| **Startup** | Espace startup | Candidature, suivi, profil, espace labellisé |
| **Évaluateur** | Espace évaluation | Notation, vote, commentaires |
| **Administrateur** | Dashboard admin | Gestion complète, KPIs, audit, paramètres |
| **Structure (SAE)** | Espace structure | Suivi startups, programmes |
| **Investisseur** | Espace investisseur | Annuaire, intérêts, messagerie |

---

## 7. Exigences non-fonctionnelles

### 7.1 Performance

| Exigence | Cible |
|----------|-------|
| Temps de chargement initial | < 3 secondes |
| Time to Interactive (TTI) | < 5 secondes |
| Lighthouse Performance Score | > 85 |
| Capacité concurrent | > 500 utilisateurs simultanés |

### 7.2 Disponibilité

| Exigence | Cible |
|----------|-------|
| Uptime | > 99 % |
| RTO (Recovery Time Objective) | < 4 heures |
| RPO (Recovery Point Objective) | < 1 heure |
| Sauvegardes | Quotidiennes automatiques |

### 7.3 Compatibilité navigateurs

| Navigateur | Version minimum |
|------------|-----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Mobile (iOS/Android) | Dernières 2 versions |

---

## 8. Planning et jalons

```
Jan 2026    Fév 2026    Mar 2026    Avr 2026    Mai 2026    Juin 2026
    │           │           │           │           │           │
    ▼           ▼           ▼           ▼           ▼           ▼
┌───────┐ ┌─────────────────────────────────────┐ ┌───────┐ ┌───────┐
│Cadrage│ │        Sprints 1 à 6               │ │Recette│ │ Prod  │
│ 2 sem │ │      (12 semaines)                 │ │ 3 sem │ │ Go!   │
└───────┘ └─────────────────────────────────────┘ └───────┘ └───────┘
```

| Jalon | Date prévue | Livrable |
|-------|-------------|----------|
| Kick-off | Janvier 2026 - S3 | Lancement officiel, validation périmètre |
| MVP fonctionnel | Janvier 2026 - S4 | Plateforme opérationnelle avec tous les espaces |
| Intégration évaluateurs | Février 2026 | Système de vote et évaluation complet |
| Fonctionnalités avancées | Mars 2026 | Coach IA, notifications push, renouvellement |
| Recette utilisateurs | Avril 2026 | Tests d'acceptation, corrections |
| Mise en production | Fin avril 2026 | Déploiement et ouverture au public |
| Bilan | Juin 2026 | Rapport d'évaluation et recommandations |

### Évolutions futures (Phase 2+)

| Fonctionnalité | Priorité |
|----------------|----------|
| API publique RESTful | Moyenne |
| Application mobile native | Basse |
| Intégration avec les systèmes fiscaux | Haute |
| Tableau de bord analytique avancé | Moyenne |

---

## 9. Annexes

### A. Glossaire

| Terme | Définition |
|-------|------------|
| **ANSUT** | Agence Nationale du Service Universel des Télécommunications/TIC |
| **MTNI** | Ministère de la Transition Numérique et de l'Innovation Technologique |
| **SAE** | Structure d'Accompagnement à l'Entrepreneuriat |
| **RCCM** | Registre du Commerce et du Crédit Mobilier |
| **HIBP** | Have I Been Pwned — service de vérification de mots de passe compromis |
| **RLS** | Row Level Security — sécurité au niveau des lignes de la base de données |
| **VAPID** | Voluntary Application Server Identification — protocole pour les notifications push web |

### B. Documents de référence

1. Loi n°2023-901 du 23 novembre 2023 portant promotion des startups
2. Décret d'application sur la labellisation des startups
3. Cahier des Charges v2.0 — MTND/ANSUT
4. Charte graphique institutionnelle MTNI
5. [Kick-off Meeting](/documents/kickoff-meeting-label-startup.md)

### C. Contacts

| Fonction | Contact |
|----------|---------|
| Support technique | support@ivoirehub.ci |
| Questions métier | contact@mtni.gouv.ci |
| ANSUT | info@ansut.ci |

---

*Document généré le 16 février 2026*  
*Version 2.0*  
*Plateforme Ivoire Hub — Label Startup Côte d'Ivoire*
