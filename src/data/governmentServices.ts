
import { GovernmentService } from '@/types';

export const GOVERNMENT_SERVICES: GovernmentService[] = [
  // Documents
  {
    id: 'aadhaar',
    name: 'Aadhaar Card',
    description: 'Apply for new Aadhaar card or update existing one',
    category: 'documents',
    icon: '🆔',
    url: 'https://uidai.gov.in/',
  },
  {
    id: 'pan-card',
    name: 'PAN Card',
    description: 'Apply for Permanent Account Number card',
    category: 'documents',
    icon: '💳',
    url: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
  },
  {
    id: 'passport',
    name: 'Passport',
    description: 'Apply for Indian passport',
    category: 'documents',
    icon: '📘',
    url: 'https://www.passportindia.gov.in/',
  },
  {
    id: 'ration-card',
    name: 'Ration Card',
    description: 'Apply for ration card for subsidized food grains',
    category: 'documents',
    icon: '🍚',
    url: 'https://nfsa.gov.in/',
  },

  // Utilities
  {
    id: 'electricity-bill',
    name: 'Electricity Bill',
    description: 'View and pay electricity bills online',
    category: 'utilities',
    icon: '⚡',
    url: 'https://www.bijlimitra.com/',
  },
  {
    id: 'water-bill',
    name: 'Water Bill',
    description: 'View and pay water bills online',
    category: 'utilities',
    icon: '💧',
    url: 'https://jal.gov.in/',
  },
  {
    id: 'gas-connection',
    name: 'Gas Connection',
    description: 'Apply for new LPG gas connection',
    category: 'utilities',
    icon: '🔥',
    url: 'https://www.iocl.com/',
  },
  {
    id: 'property-tax',
    name: 'Property Tax',
    description: 'Pay property tax online',
    category: 'utilities',
    icon: '🏠',
    url: 'https://property.gov.in/',
  },

  // Health
  {
    id: 'health-card',
    name: 'Health Card',
    description: 'Apply for Ayushman Bharat health card',
    category: 'health',
    icon: '🏥',
    url: 'https://beneficiary.nha.gov.in/',
  },
  {
    id: 'vaccination',
    name: 'Vaccination',
    description: 'Book vaccination appointments',
    category: 'health',
    icon: '💉',
    url: 'https://www.cowin.gov.in/',
  },
  {
    id: 'health-insurance',
    name: 'Health Insurance',
    description: 'Apply for government health insurance schemes',
    category: 'health',
    icon: '🛡️',
    url: 'https://www.pmjay.gov.in/',
  },
  {
    id: 'medical-certificate',
    name: 'Medical Certificate',
    description: 'Apply for medical certificates and fitness documents',
    category: 'health',
    icon: '📋',
    url: 'https://esanjeevaniopd.in/',
  },

  // Education
  {
    id: 'scholarship',
    name: 'Scholarships',
    description: 'Apply for educational scholarships',
    category: 'education',
    icon: '🎓',
    url: 'https://scholarships.gov.in/',
  },
  {
    id: 'school-admission',
    name: 'School Admission',
    description: 'Apply for government school admissions',
    category: 'education',
    icon: '🏫',
    url: 'https://schooleducation.gov.in/',
  },
  {
    id: 'mid-day-meal',
    name: 'Mid Day Meal',
    description: 'Register for mid day meal scheme',
    category: 'education',
    icon: '🍱',
    url: 'https://mdm.gov.in/',
  },
  {
    id: 'student-loan',
    name: 'Student Loan',
    description: 'Apply for educational loans',
    category: 'education',
    icon: '💰',
    url: 'https://www.education.gov.in/',
  },

  // Grievance
  {
    id: 'pgms',
    name: 'Public Grievances',
    description: 'File complaints and grievances online',
    category: 'grievance',
    icon: '📝',
    url: 'https://pgportal.gov.in/',
  },
  {
    id: 'police-complaint',
    name: 'Police Complaint',
    description: 'File police complaints online',
    category: 'grievance',
    icon: '👮',
    url: 'https://cybercrime.gov.in/',
  },
  {
    id: 'consumer-complaint',
    name: 'Consumer Complaint',
    description: 'File consumer grievances',
    category: 'grievance',
    icon: '🛒',
    url: 'https://consumerhelpline.gov.in/',
  },
];
