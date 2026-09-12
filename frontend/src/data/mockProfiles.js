// Demo Personas for Quick Hackathon Showcase & Testing
export const DEMO_PERSONAS = [
  {
    id: "persona_1",
    name: "Ravi Kumar",
    iconName: "User",
    age: 26,
    phone: "9876543210",
    district: "Varanasi, UP",
    profile: {
      name: "Ravi Kumar",
      phone: "9876543210",
      district: "Varanasi, UP",
      education_level: "10th Grade",
      traditional_trade: "Tailoring & Garments",
      current_livelihood: "Local Garment Shop Helper",
      mobility_km: 10,
      preference: "Wage Employment (Job)",
      interests: "Computerized Sewing, Quality Inspection, Solar Tech"
    },
    sampleQuery: "I have studied up to 10th grade and I work as a tailor in a local shop. I want wage employment within 10 km.",
    hindiQuery: "मैंने 10वीं तक पढ़ाई की है और सिलाई का काम करता हूँ। मुझे 10 किमी के अंदर नौकरी चाहिए।"
  },
  {
    id: "persona_2",
    name: "Sunita Devi",
    iconName: "Zap",
    age: 24,
    phone: "9811122334",
    district: "Ranchi, Jharkhand",
    profile: {
      name: "Sunita Devi",
      phone: "9811122334",
      district: "Ranchi, Jharkhand",
      education_level: "12th Pass",
      traditional_trade: "Electrical & Technical",
      current_livelihood: "Apprentice",
      mobility_km: 25,
      preference: "Wage Employment (Job)",
      interests: "Solar Panel Technician, Rooftop Inverter Installation"
    },
    sampleQuery: "I passed 12th grade and am interested in Solar Panel technician job. I can travel up to 25 km.",
    hindiQuery: "मैं 12वीं पास हूँ और सोलर पैनल इंस्टॉलेशन सीखना चाहती हूँ। 25 किमी तक जा सकती हूँ।"
  },
  {
    id: "persona_3",
    name: "Anita Kumari",
    iconName: "Sparkles",
    age: 22,
    phone: "9456789012",
    district: "Patna, Bihar",
    profile: {
      name: "Anita Kumari",
      phone: "9456789012",
      district: "Patna, Bihar",
      education_level: "8th Pass",
      traditional_trade: "Beauty & Wellness",
      current_livelihood: "Home-based Parlour",
      mobility_km: 5,
      preference: "Self-Employment (Micro-enterprise)",
      interests: "Bridal Makeup, Salon Management, Herbal Cosmetics"
    },
    sampleQuery: "I studied till 8th grade and run a small home parlour. I want self-employment support in beauty therapy.",
    hindiQuery: "मैंने 8वीं तक पढ़ाई की है और घर पर ब्यूटी पार्लर चलाती हूँ। मुझे स्वरोजगार के लिए सहायता चाहिए।"
  },
  {
    id: "persona_4",
    name: "Mohan Lal",
    iconName: "Sprout",
    age: 35,
    phone: "9123456780",
    district: "Bhopal, MP",
    profile: {
      name: "Mohan Lal",
      phone: "9123456780",
      district: "Bhopal, MP",
      education_level: "5th Pass",
      traditional_trade: "Farming & Agriculture",
      current_livelihood: "Marginal Farmer",
      mobility_km: 15,
      preference: "Self-Employment (Micro-enterprise)",
      interests: "Organic Farming, Bio-fertilizers, Vermicompost"
    },
    sampleQuery: "I am a traditional farmer with 5th standard education. I want to learn organic farming and start a cooperative.",
    hindiQuery: "मैं 5वीं पास किसान हूँ। जैविक खेती (Organic Farming) सीखकर अपना काम बढ़ाना चाहता हूँ।"
  }
];

// Rich NSQF Packs Data with Skill Gap Analysis, Stipends, Modules & Centers
export const ENRICHED_NSQF_CATALOG = [
  {
    id: "nsqf_sewing_3",
    nsqf_pack_name: "Sewing Machine Operator",
    code: "AMH/Q0301",
    level: 3,
    sector: "Apparel, Made-Ups & Home Furnishing",
    duration: "300 Hours (3 Months)",
    matchScore: 96,
    badgeColor: "emerald",
    placementRate: "88%",
    skill_gap_analysis: "High match with tailoring background. Needs formal training on computerized single needle lockstitch machines, industrial quality checks, and safety ergonomics.",
    modules: [
      "Operating single needle industrial lockstitch machines",
      "Stitching components according to tech-pack",
      "Fabric defect identification & batch sorting",
      "Health, hygiene & industrial compliance"
    ],
    stipend: "₹1,500 / month (PM-AJAY Direct DBT)",
    toolkit_grant: "Free Industrial Tool Kit & Sewing Machine subsidy (up to ₹15,000)",
    job_roles: ["Sample Maker", "Assembly Line Tailor", "Quality Inspector"],
    avg_salary: "₹14,000 - ₹19,000 / month",
    hiring_partners: ["Raymond Ltd", "Shahi Exports", "Arvind Fashions", "Gokaldas Exports"],
    local_centers: [
      { name: "PM-AJAY Pradhan Mantri Kaushal Kendra (PMKK), City Center", distance: "4.2 km", phone: "+91 98765 43210", seats: 18, batch_date: "Starts 22 Sep 2026", timing: "09:30 AM - 01:30 PM" },
      { name: "Apparel Training & Design Centre (ATDC)", distance: "8.5 km", phone: "+91 98765 43211", seats: 12, batch_date: "Starts 28 Sep 2026", timing: "02:00 PM - 06:00 PM" },
      { name: "Rural Self Employment Training Institute (RSETI)", distance: "11.0 km", phone: "+91 98765 43212", seats: 25, batch_date: "Starts 01 Oct 2026", timing: "10:00 AM - 02:00 PM" }
    ]
  },
  {
    id: "nsqf_solar_4",
    nsqf_pack_name: "Solar Panel Installation Technician",
    code: "SGJ/Q0101",
    level: 4,
    sector: "Green Jobs & Renewable Energy",
    duration: "400 Hours (4 Months)",
    matchScore: 92,
    badgeColor: "amber",
    placementRate: "92%",
    skill_gap_analysis: "Technical aptitude present. Training required in rooftop PV civil mounting, DC inverter wiring, safety harness rigging, and grid sync protocols.",
    modules: [
      "Solar PV array site survey & shading analysis",
      "Mechanical structure installation on RCC & tin roofs",
      "Electrical junction box and micro-inverter wiring",
      "Testing, commissioning and grid export meters"
    ],
    stipend: "₹2,000 / month (Suryamitra Scheme + PM-AJAY)",
    toolkit_grant: "Complete Solar Multimeter & Safety Rigging Toolkit",
    job_roles: ["Rooftop Solar Technician", "O&M Service Engineer", "Field Assistant"],
    avg_salary: "₹18,000 - ₹26,000 / month",
    hiring_partners: ["Tata Power Solar", "Adani Green Energy", "Waaree Energies", "Havells India"],
    local_centers: [
      { name: "National Institute of Solar Energy Training Hub", distance: "6.8 km", phone: "+91 98111 22334", seats: 14, batch_date: "Starts 25 Sep 2026", timing: "09:00 AM - 01:00 PM" },
      { name: "District Industrial Training Institute (ITI) Campus", distance: "12.4 km", phone: "+91 98222 33445", seats: 20, batch_date: "Starts 05 Oct 2026", timing: "01:30 PM - 05:30 PM" }
    ]
  },
  {
    id: "nsqf_beauty_3",
    nsqf_pack_name: "Beauty Therapist & Cosmetologist",
    code: "BWS/Q0102",
    level: 3,
    sector: "Beauty & Wellness",
    duration: "360 Hours (3.5 Months)",
    matchScore: 94,
    badgeColor: "saffron",
    placementRate: "85%",
    skill_gap_analysis: "Solid traditional grasp of skin and hair grooming. Requires specialized training in hygienic skincare tools, bridal makeup styling, and salon business bookkeeping.",
    modules: [
      "Advanced skin analysis and facial treatments",
      "Depilation, threading and waxing ergonomics",
      "Hair styling, coloring and keratin therapies",
      "Micro-enterprise financial literacy & digital UPI"
    ],
    stipend: "₹1,500 / month (PM-AJAY Stipend)",
    toolkit_grant: "Full Professional Salon Starter Kit (Valued at ₹12,000)",
    job_roles: ["Certified Beauty Therapist", "Bridal Makeup Artist", "Salon Owner"],
    avg_salary: "₹15,000 - ₹25,000 / month",
    hiring_partners: ["VLCC Healthcare", "Urban Company", "Lakmé Salon", "Kaya Clinic"],
    local_centers: [
      { name: "Jan Shikshan Sansthan (JSS) Skill Center", distance: "3.1 km", phone: "+91 94567 89012", seats: 22, batch_date: "Starts 20 Sep 2026", timing: "10:00 AM - 02:00 PM" },
      { name: "MSME Beauty & Wellness Development Hub", distance: "7.0 km", phone: "+91 94567 89013", seats: 15, batch_date: "Starts 01 Oct 2026", timing: "02:30 PM - 06:30 PM" }
    ]
  },
  {
    id: "nsqf_organic_4",
    nsqf_pack_name: "Organic Grower & Bio-Fertilizer Producer",
    code: "AGR/Q1201",
    level: 4,
    sector: "Agriculture & Allied",
    duration: "250 Hours (2.5 Months)",
    matchScore: 90,
    badgeColor: "emerald",
    placementRate: "82%",
    skill_gap_analysis: "Farming base confirmed. Gap in NPOP certification standards, vermicomposting unit setup, pest management using botanical extracts, and FPO aggregation.",
    modules: [
      "Preparation of Jeevamrit and Bio-fertilizers",
      "Crop rotation and companion planting techniques",
      "Organic certification & soil testing compliance",
      "Direct-to-market linkage via e-NAM platform"
    ],
    stipend: "₹1,500 / month (PM-AJAY Skill Stipend)",
    toolkit_grant: "Soil Health Testing Kit + Vermicompost Bed Setup Grant",
    job_roles: ["Certified Organic Grower", "Bio-input Producer", "FPO Lead"],
    avg_salary: "₹16,000 - ₹30,000 / month",
    hiring_partners: ["ITC e-Choupal", "IFFCO Kisan", "Natureland Organics", "BigBasket Organic"],
    local_centers: [
      { name: "Krishi Vigyan Kendra (KVK) Regional Campus", distance: "9.5 km", phone: "+91 91234 56780", seats: 30, batch_date: "Starts 24 Sep 2026", timing: "08:30 AM - 12:30 PM" },
      { name: "National Centre of Organic Farming Training Unit", distance: "14.2 km", phone: "+91 91234 56781", seats: 16, batch_date: "Starts 03 Oct 2026", timing: "01:00 PM - 05:00 PM" }
    ]
  },
  {
    id: "nsqf_ev_4",
    nsqf_pack_name: "Electric Vehicle (EV) 2 & 3 Wheeler Service Technician",
    code: "ASC/Q1411",
    level: 4,
    sector: "Automotive & Electric Mobility",
    duration: "350 Hours (3.5 Months)",
    matchScore: 88,
    badgeColor: "amber",
    placementRate: "94%",
    skill_gap_analysis: "Opportunity in growing EV market. Covers Li-ion battery diagnostics, BLDC motor servicing, regenerative braking controllers, and high voltage safety.",
    modules: [
      "EV architecture, battery pack diagnostics & BMS",
      "BLDC hub motor and drivetrain troubleshooting",
      "Charging station connectors & DC-DC converter repair",
      "High-voltage PPE safety protocols & SOPs"
    ],
    stipend: "₹2,000 / month (PM-AJAY + FAME-II Skilling)",
    toolkit_grant: "Digital Multimeter + Insulated High Voltage Toolset",
    job_roles: ["EV Service Specialist", "Battery Testing Technician", "Fleet Maintenance Officer"],
    avg_salary: "₹18,000 - ₹28,000 / month",
    hiring_partners: ["Ola Electric", "Ather Energy", "Hero Electric", "TVS Motor"],
    local_centers: [
      { name: "Advanced Auto Technology Institute", distance: "5.5 km", phone: "+91 98333 44556", seats: 16, batch_date: "Starts 26 Sep 2026", timing: "10:00 AM - 02:00 PM" },
      { name: "State Skill Development Mission (SSDM) EV Lab", distance: "10.1 km", phone: "+91 98333 44557", seats: 20, batch_date: "Starts 08 Oct 2026", timing: "02:00 PM - 06:00 PM" }
    ]
  }
];

// Additional Related Skill Micro-Modules
export const RELATED_SKILL_MODULES = [
  {
    id: "micro_soft_skills",
    title: "Workplace Soft Skills & Hindi-English Communication",
    duration: "20 Hours",
    tag: "Employability",
    icon: "MessageSquare",
    benefit: "+15% Higher Interview Selection Rate"
  },
  {
    id: "micro_digital_upi",
    title: "Digital Financial Literacy, UPI & Mudra Loans",
    duration: "15 Hours",
    tag: "Finance",
    icon: "CreditCard",
    benefit: "Direct Bank Loan Eligibility & Fraud Safety"
  },
  {
    id: "micro_safety",
    title: "Industrial Safety, First Aid & OSH Compliance",
    duration: "15 Hours",
    tag: "Safety",
    icon: "ShieldCheck",
    benefit: "Mandatory for Factory Floor Certification"
  },
  {
    id: "micro_enterprise",
    title: "Micro-Enterprise Setup & Local Market Aggregation",
    duration: "25 Hours",
    tag: "Business",
    icon: "Briefcase",
    benefit: "Access to ₹50,000 PM-AJAY Subsidy Grant"
  }
];

// Indian Languages Supported - Clean single-language native representation
export const SUPPORTED_LANGUAGES = [
  { code: "hi", name: "हिन्दी", short: "HI" },
  { code: "en", name: "English", short: "EN" },
  { code: "bn", name: "বাংলা", short: "BN" },
  { code: "te", name: "తెలుగు", short: "TE" },
  { code: "ta", name: "தமிழ்", short: "TA" },
  { code: "mr", name: "मराठी", short: "MR" },
  { code: "gu", name: "ગુજરાતી", short: "GU" },
  { code: "kn", name: "ಕನ್ನಡ", short: "KN" }
];

// Quick Voice Prompts for instant testing with icon indicators
export const QUICK_PROMPTS = [
  {
    icon: "Scissors",
    label: "10th Pass + Tailoring (Wage)",
    text: "I have studied up to 10th grade and work as a tailor. I am looking for a wage job within 10 km.",
    hindi: "मैंने 10वीं तक पढ़ाई की है और सिलाई का काम करता हूँ। मुझे 10 किमी में नौकरी चाहिए।"
  },
  {
    icon: "Sun",
    label: "12th Pass + Solar Tech",
    text: "I passed 12th grade and want to get trained as a Solar Panel installation technician.",
    hindi: "मैं 12वीं पास हूँ और सोलर पैनल इंस्टॉलेशन का कोर्स करना चाहता हूँ।"
  },
  {
    icon: "Sparkles",
    label: "8th Pass + Beauty Care (Self-Emp)",
    text: "I completed 8th standard and have basic salon experience. I want self-employment support.",
    hindi: "मैंने 8वीं तक पढ़ाई की है और घर पर पार्लर चलाती हूँ। मुझे स्वरोजगार का काम चाहिए।"
  },
  {
    icon: "Sprout",
    label: "Farmer + Organic Cultivation",
    text: "I am a traditional farmer looking for training in organic growing and bio-fertilizer production.",
    hindi: "मैं एक किसान हूँ और जैविक खेती व खाद बनाने का कौशल सीखना चाहता हूँ।"
  }
];

// PM-AJAY Scheme Components
export const SCHEME_COMPONENTS = [
  {
    title: "Skill Development Training",
    subtitle: "Free NSQF-aligned training with ₹1,000–₹2,000/mo DBT stipend and certified assessment.",
    icon: "GraduationCap",
    tag: "100% Funded"
  },
  {
    title: "Income Generating Assistance",
    subtitle: "Financial subsidy up to ₹50,000 (or 50% of project cost) for individual micro-enterprises.",
    icon: "Coins",
    tag: "Grant Subsidy"
  },
  {
    title: "Free Modern Toolkits",
    subtitle: "Trade-specific toolkits (Sewing machine, Solar Multimeter, Parlour kits) distributed upon graduation.",
    icon: "Wrench",
    tag: "Physical Toolkit"
  },
  {
    title: "MUDRA & Stand-Up India Linkage",
    subtitle: "Collateral-free micro-credit bank linkage assistance for setting up scalable self-employment units.",
    icon: "Building2",
    tag: "Credit Guarantee"
  }
];
