import { AICompany } from "@/types/aiCompany";

export const aiCompanies: AICompany[] = [
  {
    id: 1,
    name: "Ivoire AI Labs",
    logo: "/placeholder.svg",
    description: "Centre de recherche et développement en intelligence artificielle, spécialisé dans le traitement du langage naturel pour les langues africaines.",
    sector: "Recherche & Développement",
    specialization: "NLP",
    founded: 2020,
    location: "Abidjan",
    coordinates: { lat: 5.3600, lng: -4.0083 },
    employees: "15-50",
    website: "https://ivoireailabs.ci",
    isLabeled: true,
    services: ["Traduction automatique", "Analyse de sentiments", "Chatbots"],
    history: {
      story: "Fondé en 2020 par une équipe de chercheurs passionnés, Ivoire AI Labs s'est donné pour mission de rendre l'intelligence artificielle accessible aux langues africaines. Notre parcours a débuté avec un projet de traduction automatique pour le français ivoirien, et s'est rapidement étendu à d'autres langues locales.",
      milestones: [
        { year: 2020, title: "Création de l'entreprise", description: "Lancement officiel avec une équipe de 5 chercheurs" },
        { year: 2021, title: "Premier modèle NLP", description: "Développement du premier modèle de traduction français-baoulé" },
        { year: 2022, title: "Labellisation nationale", description: "Obtention du label Entreprise Innovante de Côte d'Ivoire" },
        { year: 2023, title: "Expansion régionale", description: "Ouverture de partenariats avec 5 pays d'Afrique de l'Ouest" }
      ]
    },
    team: [
      {
        name: "Dr. Aminata Koné",
        role: "CEO & Fondatrice",
        photo: "/placeholder.svg",
        linkedin: "https://linkedin.com/in/aminata-kone",
        bio: "Docteure en Intelligence Artificielle, spécialisée en NLP. 15 ans d'expérience dans la recherche."
      },
      {
        name: "Kouassi N'Guessan",
        role: "CTO",
        photo: "/placeholder.svg",
        linkedin: "https://linkedin.com/in/kouassi-nguessan",
        bio: "Ingénieur en machine learning, expert en traitement du langage naturel pour langues africaines."
      },
      {
        name: "Marie Bamba",
        role: "Responsable R&D",
        photo: "/placeholder.svg",
        bio: "Chercheuse en linguistique computationnelle, spécialiste des langues mandé."
      }
    ],
    projects: [
      {
        title: "Traducteur Multi-Langues Africaines",
        description: "Plateforme de traduction automatique supportant 12 langues africaines avec une précision de 92%",
        year: 2022,
        client: "Ministère de l'Éducation Nationale",
        technologies: ["Transformers", "PyTorch", "TensorFlow", "FastAPI"],
        image: "/placeholder.svg",
        results: "Plus de 100,000 traductions effectuées, déployé dans 200 écoles"
      },
      {
        title: "Assistant Vocal en Baoulé",
        description: "Premier assistant vocal conversationnel en langue baoulé pour services administratifs",
        year: 2023,
        client: "Administration Publique CI",
        technologies: ["Speech Recognition", "NLP", "React", "Node.js"],
        image: "/placeholder.svg",
        results: "Réduction de 40% du temps de traitement des demandes citoyennes"
      }
    ],
    contact: {
      address: "Zone 4, Rue des Jardins, Marcory, Abidjan, Côte d'Ivoire",
      phone: "+225 27 21 25 36 48",
      email: "contact@ivoireailabs.ci",
      socialMedia: {
        linkedin: "https://linkedin.com/company/ivoire-ai-labs",
        twitter: "https://twitter.com/ivoireailabs",
        facebook: "https://facebook.com/ivoireailabs"
      }
    },
    certifications: ["Label Entreprise Innovante CI", "ISO 27001", "Certification IA Responsable"],
    partners: ["Orange Digital Center", "Université Félix Houphouët-Boigny", "Google AI"],
    keyStats: {
      growth: "+150%",
      projectsCompleted: 12,
      revenue: "Non communiqué"
    }
  },
  {
    id: 2,
    name: "AgriSmart CI",
    logo: "/placeholder.svg",
    description: "Solutions d'IA pour l'agriculture intelligente : prédiction des récoltes, détection des maladies des cultures et optimisation des ressources.",
    sector: "AgriTech",
    specialization: "Computer Vision",
    founded: 2021,
    location: "Yamoussoukro",
    coordinates: { lat: 6.8276, lng: -5.2893 },
    employees: "10-25",
    website: "https://agrismart.ci",
    isLabeled: true,
    services: ["Analyse d'images satellitaires", "Prédiction météo", "Conseil personnalisé"],
    history: {
      story: "AgriSmart CI est née de la volonté de moderniser l'agriculture ivoirienne grâce à l'intelligence artificielle. Notre équipe combine expertise agricole et compétences techniques pour aider les agriculteurs à optimiser leurs rendements.",
      milestones: [
        { year: 2021, title: "Lancement", description: "Création de l'entreprise avec un focus sur la détection des maladies du cacao" },
        { year: 2022, title: "Premier déploiement", description: "Installation dans 50 exploitations de cacao" },
        { year: 2023, title: "Prix Innovation AgriTech", description: "Reconnaissance au Salon International de l'Agriculture d'Abidjan" }
      ]
    },
    team: [
      {
        name: "Ibrahim Touré",
        role: "CEO",
        photo: "/placeholder.svg",
        linkedin: "https://linkedin.com/in/ibrahim-toure",
        bio: "Ingénieur agronome et data scientist, passionné par l'innovation agricole."
      },
      {
        name: "Fatou Diallo",
        role: "Responsable Computer Vision",
        photo: "/placeholder.svg",
        bio: "Experte en vision par ordinateur appliquée à l'agriculture de précision."
      }
    ],
    projects: [
      {
        title: "Système de Détection Précoce des Maladies du Cacao",
        description: "Application mobile utilisant la vision par ordinateur pour identifier les maladies du cacao en temps réel",
        year: 2022,
        client: "Coopératives Agricoles de l'Ouest",
        technologies: ["TensorFlow", "Keras", "React Native", "AWS"],
        image: "/placeholder.svg",
        results: "Détection précoce augmentant les rendements de 35%, utilisé par 500+ agriculteurs"
      }
    ],
    contact: {
      address: "Quartier Habitat, Boulevard Giscard d'Estaing, Yamoussoukro",
      phone: "+225 27 30 64 85 20",
      email: "info@agrismart.ci",
      socialMedia: {
        linkedin: "https://linkedin.com/company/agrismart-ci",
        facebook: "https://facebook.com/agrismartci"
      }
    },
    certifications: ["Label AgriTech Innovation"],
    partners: ["ANADER", "Conseil du Café-Cacao"],
    keyStats: {
      growth: "+200%",
      projectsCompleted: 8
    }
  },
  {
    id: 3,
    name: "MedTech AI",
    logo: "/placeholder.svg",
    description: "Intelligence artificielle appliquée à la santé : diagnostic assisté par IA, analyse d'imagerie médicale et prédiction de maladies.",
    sector: "HealthTech",
    specialization: "Medical AI",
    founded: 2022,
    location: "Abidjan",
    coordinates: { lat: 5.3600, lng: -4.0083 },
    employees: "25-50",
    website: "https://medtechai.ci",
    isLabeled: true,
    services: ["Diagnostic par imagerie", "Prédiction de risques", "Télémédecine"],
    history: {
      story: "MedTech AI révolutionne l'accès aux soins de santé en Côte d'Ivoire grâce à l'IA. Notre mission est de démocratiser le diagnostic médical de pointe.",
      milestones: [
        { year: 2022, title: "Fondation", description: "Création avec le soutien du CHU de Cocody" },
        { year: 2023, title: "Certification médicale", description: "Obtention de l'agrément du Ministère de la Santé" }
      ]
    },
    team: [
      {
        name: "Dr. Pascal Yao",
        role: "Directeur Médical",
        photo: "/placeholder.svg",
        linkedin: "https://linkedin.com/in/pascal-yao",
        bio: "Médecin radiologue, pionnier de l'IA médicale en Afrique de l'Ouest."
      }
    ],
    projects: [
      {
        title: "Assistant Radiologie IA",
        description: "Système d'aide au diagnostic radiologique pour détecter les anomalies pulmonaires",
        year: 2023,
        client: "CHU de Cocody",
        technologies: ["Deep Learning", "Python", "DICOM", "Vue.js"],
        image: "/placeholder.svg",
        results: "Réduction de 50% du temps de diagnostic, 95% de précision"
      }
    ],
    contact: {
      address: "Cocody II Plateaux, Abidjan",
      phone: "+225 27 22 48 96 30",
      email: "contact@medtechai.ci",
      socialMedia: {
        linkedin: "https://linkedin.com/company/medtech-ai"
      }
    },
    certifications: ["Agrément Ministère Santé", "ISO 13485"],
    partners: ["CHU Cocody", "Institut Pasteur"],
    keyStats: {
      growth: "+120%",
      projectsCompleted: 5
    }
  },
  {
    id: 4,
    name: "FinPredict",
    logo: "/placeholder.svg",
    description: "Solutions d'IA pour la finance : scoring de crédit, détection de fraude et prédiction de risques financiers adaptés au marché africain.",
    sector: "FinTech",
    specialization: "Machine Learning",
    founded: 2021,
    location: "Abidjan",
    coordinates: { lat: 5.3600, lng: -4.0083 },
    employees: "20-40",
    website: "https://finpredict.ci",
    isLabeled: false,
    services: ["Scoring crédit", "Anti-fraude", "Analyse prédictive"],
    contact: {
      address: "Plateau, Avenue Marchand, Abidjan",
      phone: "+225 27 20 33 44 55",
      email: "info@finpredict.ci",
      socialMedia: {}
    }
  },
  {
    id: 5,
    name: "EduBot CI",
    logo: "/placeholder.svg",
    description: "Plateforme éducative utilisant l'IA pour personnaliser l'apprentissage et fournir du tutorat intelligent aux étudiants.",
    sector: "EdTech",
    specialization: "NLP & Adaptive Learning",
    founded: 2020,
    location: "Bouaké",
    coordinates: { lat: 7.6944, lng: -5.0319 },
    employees: "15-30",
    website: "https://edubot.ci",
    isLabeled: true,
    services: ["Tutorat intelligent", "Évaluation adaptative", "Recommandations personnalisées"],
    contact: {
      address: "Centre-ville, Bouaké",
      phone: "+225 27 31 75 82 90",
      email: "contact@edubot.ci",
      socialMedia: {}
    }
  },
  {
    id: 6,
    name: "VisionTech Africa",
    logo: "/placeholder.svg",
    description: "Spécialiste de la vision par ordinateur pour la surveillance, la sécurité et l'analyse vidéo en temps réel.",
    sector: "Security & Surveillance",
    specialization: "Computer Vision",
    founded: 2019,
    location: "Abidjan",
    coordinates: { lat: 5.3600, lng: -4.0083 },
    employees: "30-60",
    website: "https://visiontech.ci",
    isLabeled: false,
    services: ["Reconnaissance faciale", "Détection d'objets", "Analyse comportementale"],
    contact: {
      address: "Zone Industrielle, Yopougon, Abidjan",
      phone: "+225 27 23 59 67 42",
      email: "info@visiontech.ci",
      socialMedia: {}
    }
  },
  {
    id: 7,
    name: "DataMind CI",
    logo: "/placeholder.svg",
    description: "Cabinet de conseil en data science et IA, accompagnant les entreprises dans leur transformation numérique.",
    sector: "Conseil & Services",
    specialization: "Data Science",
    founded: 2021,
    location: "Abidjan",
    coordinates: { lat: 5.3600, lng: -4.0083 },
    employees: "10-20",
    website: "https://datamind.ci",
    isLabeled: true,
    services: ["Audit data", "Formation IA", "Développement sur mesure"],
    contact: {
      address: "Cocody Riviera, Abidjan",
      phone: "+225 27 22 51 73 88",
      email: "hello@datamind.ci",
      socialMedia: {}
    }
  },
  {
    id: 8,
    name: "SmartCity Ivoire",
    logo: "/placeholder.svg",
    description: "Solutions IoT et IA pour la gestion intelligente des villes : trafic, énergie, déchets et services urbains.",
    sector: "Smart City",
    specialization: "IoT & AI",
    founded: 2020,
    location: "Yamoussoukro",
    coordinates: { lat: 6.8276, lng: -5.2893 },
    employees: "20-35",
    website: "https://smartcity.ci",
    isLabeled: false,
    services: ["Gestion du trafic", "Smart lighting", "Gestion des déchets"],
    contact: {
      address: "Cité Administrative, Yamoussoukro",
      phone: "+225 27 30 72 93 15",
      email: "contact@smartcity.ci",
      socialMedia: {}
    }
  }
];
