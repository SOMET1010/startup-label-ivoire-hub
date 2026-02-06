

# Enrichissement de la plateforme : Cadre juridique, Comite de labellisation et Configuration dynamique

## Constat

L'analyse du code revele trois manquements importants :

1. **Aucune page ne presente le cadre juridique** : la Loi n 2023-901 du 23 novembre 2023 est mentionnee dans le cahier des charges (`kickoff-meeting-label-startup.md`) mais n'apparait nulle part sur le site public. Il n'y a aucun moyen de telecharger la loi ni les decrets d'application.

2. **Aucune presentation du comite de labellisation** : les evaluateurs/membres du comite sont mentionnes dans le processus mais jamais presentes publiquement.

3. **Le nom du ministere est faux et code en dur** a 4 endroits :
   - `Footer.tsx` (ligne 186) : "Ministere de la Communication et de l'Economie Numerique"
   - `MentionsLegales.tsx` (lignes 23-24, 27, 34)
   - `Confidentialite.tsx` (ligne 27)
   - `jsonld.ts` : pas de reference au ministere mais devrait en avoir

   Le nom correct est : **Ministere de la Transition Numerique et de l'Innovation Technologique**

---

## Solution proposee

### A. Table de configuration `platform_settings` (parametrage dynamique)

Creer une table dans la base de donnees pour stocker les informations institutionnelles parametrables, afin qu'un admin puisse les modifier sans toucher au code.

Donnees stockees :
- Nom du ministere
- Acronyme du ministere
- Nom du ministre (directeur de publication)
- Adresse
- Telephone
- Email de contact
- URL du site du ministere
- Nom de la plateforme

**Politique RLS** : lecture publique, ecriture reservee aux admins.

### B. Nouvelle page `/cadre-juridique` (Cadre legal)

Une page publique dediee qui presentera :

**Section 1 -- La Loi**
- Titre complet de la loi (Loi n 2023-901 du 23 novembre 2023 portant promotion des startups)
- Resume des principaux articles
- Bouton de telechargement du PDF de la loi

**Section 2 -- Decrets d'application**
- Liste des decrets avec dates, numeros et descriptions
- Boutons de telechargement pour chaque decret (si disponibles)
- Indication "A paraitre" si pas encore publies

**Section 3 -- Textes complementaires**
- Arretes ministeriels et circulaires eventuels

Les textes juridiques seront stockes dans une table `legal_documents` en base de donnees (titre, description, type, URL du fichier dans le storage, date de publication, numero officiel). Les admins pourront ajouter/modifier ces documents.

### C. Nouvelle page `/comite` (Comite de labellisation)

Une page publique qui presentera :

**Section 1 -- Presentation du comite**
- Role et mission du comite
- Composition reglementaire (selon la loi)
- Fonctionnement (quorum, deliberation)

**Section 2 -- Membres du comite**
- Liste des membres avec photo, nom, titre/fonction, organisme
- Possibilite de distinguer president, vice-president, membres

Les membres seront stockes dans une table `committee_members` en base (nom, titre, organisation, photo URL, role dans le comite, ordre d'affichage, statut actif/inactif). Modifiable par les admins.

### D. Hook `usePlatformSettings` et remplacement des valeurs en dur

Un hook React qui charge les parametres de la table `platform_settings` et les rend disponibles partout dans l'application. Les composants suivants seront mis a jour :
- `Footer.tsx` : nom du ministere dynamique
- `MentionsLegales.tsx` : toutes les references au ministere
- `Confidentialite.tsx` : reference au ministere
- `jsonld.ts` : organisation name

### E. Navigation mise a jour

Ajouter les nouvelles pages dans :
- La Navbar (sous-menu "Labellisation" : Cadre juridique, Criteres, Comite, Postuler)
- Le Footer (section Informations)
- Le fichier de navigation centralise `navigation.ts`
- Les traductions i18n

---

## Fichiers impactes

| Fichier | Action | Description |
|---|---|---|
| Migration SQL | Creer | Tables `platform_settings`, `legal_documents`, `committee_members` + RLS + donnees initiales |
| `src/hooks/usePlatformSettings.ts` | Creer | Hook pour charger les parametres dynamiques |
| `src/pages/CadreJuridique.tsx` | Creer | Page cadre legal avec telechargement |
| `src/pages/Comite.tsx` | Creer | Page presentation du comite |
| `src/components/Footer.tsx` | Modifier | Nom du ministere dynamique |
| `src/pages/MentionsLegales.tsx` | Modifier | References au ministere dynamiques |
| `src/pages/Confidentialite.tsx` | Modifier | Reference au ministere dynamique |
| `src/lib/seo/jsonld.ts` | Modifier | Organisation dynamique |
| `src/App.tsx` | Modifier | Ajouter routes `/cadre-juridique` et `/comite` |
| `src/components/Navbar.tsx` | Modifier | Sous-menu labellisation enrichi |
| `src/lib/constants/navigation.ts` | Modifier | Nouveaux liens |
| `src/i18n/locales/fr/pages.json` | Modifier | Traductions FR pour les nouvelles pages |
| `src/i18n/locales/en/pages.json` | Modifier | Traductions EN |
| `src/i18n/locales/fr/common.json` | Modifier | Nouveaux liens de navigation |
| `src/i18n/locales/en/common.json` | Modifier | Nouveaux liens de navigation |

---

## Detail technique

### Table `platform_settings`

```text
key (text, PK)  |  value (text)  |  updated_at  |  updated_by
```

Donnees initiales inserees :
- `ministry_name` = "Ministere de la Transition Numerique et de l'Innovation Technologique"
- `ministry_acronym` = "MTNI"
- `minister_title` = "Ministre de la Transition Numerique et de l'Innovation Technologique"
- `ministry_address` = "Abidjan, Plateau, Cote d'Ivoire"
- `ministry_phone` = "+225 27 22 XX XX XX"
- `ministry_email` = "contact@mtni.gouv.ci"
- `ministry_website` = "https://www.mtni.gouv.ci"
- `platform_name` = "Ivoire Hub"
- `platform_email` = "contact@ivoirehub.ci"

### Table `legal_documents`

```text
id | title | description | document_type | official_number
file_url | external_url | published_date | display_order | is_active
created_at | updated_at
```

Types : `law`, `decree`, `order`, `circular`

### Table `committee_members`

```text
id | full_name | title | organization | photo_url
role_in_committee | bio | display_order | is_active
created_at | updated_at
```

Roles : `president`, `vice_president`, `member`, `secretary`

### RLS pour les 3 tables

- Lecture : publique (tout le monde peut voir)
- Ecriture : admins uniquement (`has_role(auth.uid(), 'admin')`)

---

## Securite

- Les fichiers PDF des lois seront stockes dans un bucket de stockage `legal-documents` (pas en base de donnees)
- Seule l'URL du fichier est stockee en base
- Les photos des membres du comite iront dans un bucket `committee-photos`
- RLS strictes : seuls les admins peuvent modifier les donnees
- Lecture publique necessaire car ces informations sont institutionnelles

## Ordre d'implementation

1. Migration base de donnees (tables + RLS + donnees initiales)
2. Hook `usePlatformSettings`
3. Remplacement des valeurs en dur (Footer, MentionsLegales, Confidentialite)
4. Page `/cadre-juridique`
5. Page `/comite`
6. Mise a jour navigation (Navbar, routes, traductions)

