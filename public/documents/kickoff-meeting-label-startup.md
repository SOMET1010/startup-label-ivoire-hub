# Kick-off Meeting - Plateforme Digitale de Labellisation

**Projet :** Lancement du projet de développement de la plateforme de labellisation  
**Source :** Cahier des Charges v2.0 - MTND/ANSUT  
**Date :** Janvier 2026

---

## Ordre du Jour

1. Contexte et Enjeux
2. Objectifs du Projet & KPIs
3. Périmètre Fonctionnel
4. Approche Méthodologique
5. Parties Prenantes Clés
6. Gouvernance et Organisation
7. Planning Macro
8. Budget et Ressources
9. Risques et Contraintes Majeurs
10. Communication et Reporting
11. Prérequis pour la Réussite
12. Prochaines Étapes

---

## 1. Contexte et Enjeux

Ce projet s'inscrit dans le cadre de la **Loi n°2023-901 du 23 novembre 2023** portant promotion des startups en Côte d'Ivoire.

L'**Agence Nationale du Service Universel des Télécommunications/TIC (ANSUT)**, dans le cadre de sa mission de digitalisation et d'extension du Service Universel aux usages numériques, a développé et mis à disposition du **Ministère de la Transition Numérique et de la Digitalisation (MTND)** une plateforme digitale unique de labellisation et d'accompagnement des startups numériques.

### Enjeux Stratégiques

| Enjeu | Description |
|-------|-------------|
| **Modernisation** | Transformation digitale du processus de labellisation |
| **Structuration** | Organisation et qualification de l'écosystème startup national |
| **Compétitivité** | Renforcement de la position de la Côte d'Ivoire en Afrique de l'Ouest |
| **Simplification** | Allègement des démarches administratives pour les startups |
| **Valorisation** | Reconnaissance du rôle des Structures d'Accompagnement à l'Entrepreneuriat (SAE) |

---

## 2. Objectifs du Projet & KPIs

### 2.1 Objectifs Stratégiques

- Digitaliser 100% du processus de labellisation
- Réduire les délais de traitement des demandes
- Améliorer la transparence et la traçabilité
- Créer un écosystème numérique intégré

### 2.2 KPIs Année 1

#### Adoption
| Indicateur | Cible |
|------------|-------|
| Taux de soumission en ligne | 100% |
| Taux d'activation comptes startup | > 80% |
| Taux d'utilisation espace labellisé | > 60% |

#### Croissance
| Indicateur | Cible |
|------------|-------|
| Nombre de candidatures déposées | > 200 |
| Startups labellisées | > 50 |
| Visiteurs uniques portail public | > 10 000 |

#### Performance
| Indicateur | Cible |
|------------|-------|
| Délai moyen de décision | < 30 jours |
| Taux de dossiers complets | > 70% |
| Disponibilité plateforme | > 99% |

#### Satisfaction
| Indicateur | Cible |
|------------|-------|
| NPS startups | > 40 |
| Taux de réclamations | < 5% |

---

## 3. Périmètre Fonctionnel

### 3.1 MVP (Minimum Viable Product) - Actuel

#### Portail Public
- ✅ Page d'accueil institutionnelle
- ✅ Présentation des critères d'éligibilité
- ✅ Quiz d'auto-évaluation
- ✅ Annuaire des startups labellisées
- ✅ Actualités et événements
- ✅ FAQ et documentation

#### Espace Startup
- ✅ Inscription et authentification
- ✅ Formulaire de candidature multi-étapes
- ✅ Upload de documents justificatifs
- ✅ Suivi du statut de candidature
- ✅ Tableau de bord personnalisé
- ✅ Espace labellisé (ressources, opportunités, réseau)
- ✅ Demande de renouvellement

#### Espace Évaluateur
- ✅ Liste des candidatures à évaluer
- ✅ Grille d'évaluation multi-critères
- ✅ Système de vote et quorum
- ✅ Commentaires et discussions
- ✅ Historique des évaluations

#### Espace Administrateur
- ✅ Dashboard avec KPIs temps réel
- ✅ Gestion des candidatures
- ✅ Demande de documents complémentaires
- ✅ Logs d'audit et traçabilité
- ✅ Statistiques de vote

#### Fonctionnalités Transverses
- ✅ Notifications push automatiques
- ✅ Notifications email
- ✅ Système de messagerie interne
- ✅ Coach IA pour accompagnement

### 3.2 Évolutions Futures (Phase 2+)

| Fonctionnalité | Priorité | Sprint Cible |
|----------------|----------|--------------|
| Intégration SAE | Haute | S7-S8 |
| API publique | Moyenne | S9-S10 |
| Renouvellement automatisé | Haute | S5-S6 |
| Tableau de bord investisseurs | Moyenne | S11-S12 |
| Application mobile | Basse | Phase 3 |

---

## 4. Approche Méthodologique

### 4.1 Méthodologie Agile

```
┌─────────────────────────────────────────────────────────────┐
│                     CYCLE AGILE                              │
├─────────────────────────────────────────────────────────────┤
│  Sprint Planning → Développement → Review → Rétrospective   │
│       (J1)           (2 sem)        (J14)      (J14)        │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Principes Directeurs

1. **Sprints de 2 semaines** - Cycles courts pour feedback rapide
2. **Livraisons incrémentales** - Valeur livrée à chaque sprint
3. **Démos bi-hebdomadaires** - Validation continue avec les parties prenantes
4. **Intégration continue** - Tests automatisés et déploiement continu
5. **Boucles de feedback** - Amélioration continue basée sur les retours utilisateurs

### 4.3 Outils et Pratiques

| Pratique | Outil/Méthode |
|----------|---------------|
| Gestion de projet | Tableau Kanban |
| Versioning | Git/GitHub |
| CI/CD | Déploiement automatisé |
| Tests | Tests unitaires + E2E |
| Documentation | Markdown + Notion |

---

## 5. Parties Prenantes Clés

### 5.1 Matrice des Parties Prenantes

| Rôle | Entité | Responsabilité | Niveau d'implication |
|------|--------|----------------|---------------------|
| **Sponsor** | MTND | Validation stratégique, Budget | Décisionnel |
| **Maîtrise d'ouvrage** | ANSUT | Pilotage opérationnel, Recette | Élevé |
| **Utilisateurs finaux** | Startups | Candidatures, Feedback | Élevé |
| **Évaluateurs** | Commission | Évaluation des dossiers | Moyen |
| **Partenaires** | SAE, Investisseurs | Écosystème, Accompagnement | Variable |

### 5.2 Contacts Clés

| Fonction | Nom | Email | Téléphone |
|----------|-----|-------|-----------|
| Chef de projet MTND | [À définir] | - | - |
| Responsable technique ANSUT | [À définir] | - | - |
| Product Owner | [À définir] | - | - |
| Scrum Master | [À définir] | - | - |

---

## 6. Gouvernance et Organisation

### 6.1 Instances de Gouvernance

```
                    ┌─────────────────┐
                    │     COPIL       │
                    │  (Mensuel)      │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
    ┌─────────▼─────────┐ ┌──▼───────────┐ ┌▼────────────────┐
    │  Sprint Review    │ │ Point Opé.   │ │ Comité Technique │
    │  (Bi-hebdo)       │ │ (Hebdo)      │ │ (Ad hoc)         │
    └───────────────────┘ └──────────────┘ └──────────────────┘
```

### 6.2 Détail des Instances

| Instance | Fréquence | Participants | Objectifs |
|----------|-----------|--------------|-----------|
| **COPIL** | Mensuel | MTND, ANSUT, Direction | Arbitrages stratégiques, Budget, Go/No-Go |
| **Sprint Review** | Bi-hebdo | Équipe projet, PO, Utilisateurs clés | Démo, Validation des livrables |
| **Point Opérationnel** | Hebdo | Équipe technique | Suivi avancement, Déblocages |
| **Comité Technique** | Ad hoc | Experts techniques | Arbitrages techniques, Architecture |

---

## 7. Planning Macro

### 7.1 Vue d'Ensemble

```
Jan 2026    Fév 2026    Mar 2026    Avr 2026    Mai 2026    Juin 2026
    │           │           │           │           │           │
    ▼           ▼           ▼           ▼           ▼           ▼
┌───────┐ ┌─────────────────────────────────────┐ ┌───────┐ ┌───────┐
│Cadrage│ │        Sprints 1 à 6               │ │Recette│ │ Prod  │
│ 2 sem │ │      (12 semaines)                 │ │ 3 sem │ │ Go!   │
└───────┘ └─────────────────────────────────────┘ └───────┘ └───────┘
```

### 7.2 Jalons Clés

| Jalon | Date | Livrable |
|-------|------|----------|
| J1 - Kick-off | Sem 3 Janvier | Lancement officiel |
| J2 - MVP Validé | Sem 4 Janvier | Plateforme fonctionnelle |
| J3 - Sprint 3 | Fin Février | Intégration évaluateurs |
| J4 - Sprint 6 | Fin Mars | Fonctionnalités avancées |
| J5 - Recette | Mi-Avril | Tests utilisateurs |
| J6 - Go-Live | Fin Avril | Mise en production |
| J7 - Bilan | Juin | Rapport d'évaluation |

---

## 8. Budget et Ressources

### 8.1 Estimation Budgétaire

| Poste | Description | Estimation |
|-------|-------------|------------|
| **Infrastructure Cloud** | Hébergement, CDN, Stockage | À définir |
| **Équipe Développement** | Développeurs, DevOps | À définir |
| **UX/UI Design** | Maquettes, Tests utilisateurs | À définir |
| **Sécurité** | Audits, Certifications | À définir |
| **Formation** | Formation utilisateurs, Documentation | À définir |
| **Accompagnement** | Support post-déploiement | À définir |

### 8.2 Ressources Humaines

| Profil | ETP | Durée |
|--------|-----|-------|
| Chef de projet | 1 | 6 mois |
| Développeur Full-Stack | 2 | 6 mois |
| UX Designer | 0.5 | 4 mois |
| DevOps | 0.5 | 6 mois |
| Testeur QA | 0.5 | 3 mois |

---

## 9. Risques et Contraintes Majeurs

### 9.1 Matrice des Risques

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| **Résistance au changement** | Élevé | Moyen | Formation, Communication, Champions |
| **Indisponibilité évaluateurs** | Élevé | Moyen | Planification anticipée, Suppléants |
| **Qualité des données** | Moyen | Élevé | Validation en temps réel, Guide utilisateur |
| **Sécurité/Cyberattaques** | Critique | Faible | Audit sécurité, WAF, Monitoring |
| **Pics de charge** | Moyen | Moyen | Auto-scaling, Tests de charge |
| **Évolutions réglementaires** | Moyen | Faible | Veille juridique, Architecture modulaire |

### 9.2 Contraintes Identifiées

1. **Délai serré** - Mise en production attendue en 4-5 mois
2. **Budget contraint** - Optimisation des ressources nécessaire
3. **Disponibilité des experts métier** - Coordination avec les agendas MTND/ANSUT
4. **Conformité RGPD** - Protection des données personnelles des startups

---

## 10. Communication et Reporting

### 10.1 Plan de Communication

| Type | Fréquence | Canal | Destinataires |
|------|-----------|-------|---------------|
| **Rapport d'avancement** | Hebdomadaire | Email + Dashboard | COPIL, Équipe projet |
| **Newsletter projet** | Mensuelle | Email | Toutes les parties prenantes |
| **Alertes critiques** | Temps réel | SMS/Email | Chef de projet, Sponsors |
| **Comptes-rendus** | Post-réunion | Document partagé | Participants |

### 10.2 Indicateurs de Suivi

- Vélocité de l'équipe (story points/sprint)
- Taux d'avancement des US
- Nombre de bugs ouverts/résolus
- Satisfaction utilisateurs (NPS)
- Couverture de tests

---

## 11. Prérequis pour la Réussite

### 11.1 Prérequis Organisationnels

- [ ] **Engagement fort du MTND** - Sponsorship visible et actif
- [ ] **Commission d'évaluation constituée** - Évaluateurs identifiés et formés
- [ ] **Disponibilité des experts métier** - Planning dédié

### 11.2 Prérequis Techniques

- [ ] **Environnements configurés** - Développement, Staging, Production
- [ ] **Accès aux systèmes** - APIs, Bases de données, Services tiers
- [ ] **Données de test** - Jeux de données réalistes

### 11.3 Prérequis Documentaires

- [ ] **Charte graphique** - Identité visuelle MTND/ANSUT
- [ ] **Contenus validés** - Textes légaux, CGU, Politique de confidentialité
- [ ] **Procédures métier** - Workflow de labellisation documenté

---

## 12. Prochaines Étapes

### 12.1 Actions Immédiates (Semaine 1-2)

| Action | Responsable | Échéance | Statut |
|--------|-------------|----------|--------|
| Valider le périmètre MVP | PO + MTND | J+3 | 🟡 En cours |
| Constituer commission pilote | MTND | J+7 | 🔴 À faire |
| Finaliser jeux de test | Équipe technique | J+10 | 🔴 À faire |
| Valider charte graphique | UX + MTND | J+7 | 🔴 À faire |
| Configurer accès techniques | DevOps | J+5 | 🟡 En cours |

### 12.2 Prochaines Réunions

| Réunion | Date | Objectif |
|---------|------|----------|
| Sprint Planning 1 | [À définir] | Planification du premier sprint |
| Formation évaluateurs | [À définir] | Prise en main de l'espace évaluateur |
| COPIL #1 | [À définir] | Validation Go/No-Go sprint 1 |

---

## Annexes

### A. Glossaire

| Terme | Définition |
|-------|------------|
| **ANSUT** | Agence Nationale du Service Universel des Télécommunications/TIC |
| **MTND** | Ministère de la Transition Numérique et de la Digitalisation |
| **SAE** | Structure d'Accompagnement à l'Entrepreneuriat |
| **MVP** | Minimum Viable Product (Produit Minimum Viable) |
| **COPIL** | Comité de Pilotage |
| **PO** | Product Owner |
| **US** | User Story |
| **NPS** | Net Promoter Score |

### B. Documents de Référence

1. Loi n°2023-901 du 23 novembre 2023
2. Cahier des Charges v2.0 - MTND/ANSUT
3. Décret d'application sur la labellisation des startups
4. Charte graphique MTND/ANSUT

### C. Contacts Utiles

- **Support technique** : support@label-startup.ci
- **Questions métier** : contact@mtnd.gouv.ci
- **ANSUT** : info@ansut.ci

---

*Document généré le 19 janvier 2026*  
*Version 1.0*  
*Plateforme Label Startup Côte d'Ivoire*
