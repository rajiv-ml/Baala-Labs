// src/lib/mock-data.ts
// Comprehensive mock dataset for the QualAI Dashboard

export type SessionType = 'KII' | 'FGD' | 'Survey';
export type SourceStatus = 'needs-verification' | 'ready-for-coding' | 'coded-verified';

export interface Source {
  id: string;
  title: string;
  type: SessionType;
  language: string;
  location: string;
  district: string;
  state: string;
  demographic: string;
  participantCount: number;
  baselineScore: number;
  respondentId: string;
  status: SourceStatus;
  duration: string;
  lastEdited: string;
  editedBy: string;
  dateCollected: string;
}

export interface Utterance {
  id: string;
  sourceId: string;
  speaker: string;
  speakerRole: 'facilitator' | 'respondent';
  speakerInitials: string;
  timestamp: string;
  timestampSeconds: number;
  originalText: string;
  transliteration?: string;
  englishTranslation: string;
  confidence: number;
  isLowConfidence: boolean;
  lowConfidenceReason?: string;
  isVerified: boolean;
  isEdited: boolean;
  codes: string[];
}

export interface Code {
  id: string;
  label: string;
  parentTheme: string;
  definition: string;
  count: number;
  underlineStyle: 'solid' | 'dashed' | 'dotted' | 'double' | 'thick' | 'wavy';
}

export interface Theme {
  id: string;
  label: string;
  codes: Code[];
  totalCount: number;
}

export interface CodeSuggestion {
  id: string;
  quote: string;
  sourceId: string;
  speaker: string;
  charOffset: string;
  suggestedCode: string;
  suggestedTheme: string;
  confidence: number;
  status: 'pending' | 'approved' | 'rejected';
  audioTimestamp: string;
  originalText: string;
}

export interface GlossaryTerm {
  id: string;
  devanagari: string;
  transliteration: string;
  englishRendering: string;
  note: string;
  language: string;
}

export interface QuoteBank {
  id: string;
  quote: string;
  speaker: string;
  speakerType: string;
  sourceId: string;
  district: string;
  demographic: string;
  theme: string;
  code: string;
  charOffset: string;
  audioTimestamp: string;
  baselineScore: number;
  originalText: string;
  isVerified: boolean;
}

// 6 Pre-seeded sources
export const sources: Source[] = [
  {
    id: 'FGD-01',
    title: 'Adolescent Girls Focus Group',
    type: 'FGD',
    language: 'Hindi / Bhojpuri',
    location: 'Sitamarhi, Bihar',
    district: 'Sitamarhi',
    state: 'Bihar',
    demographic: 'Adolescent Girls',
    participantCount: 6,
    baselineScore: 42,
    respondentId: 'RES-BH-001',
    status: 'coded-verified',
    duration: '00:32:10',
    lastEdited: '2 hours ago',
    editedBy: 'Dr. Priya Sharma',
    dateCollected: '2024-10-14',
  },
  {
    id: 'KII-02',
    title: 'ASHA Community Health Worker Interview',
    type: 'KII',
    language: 'Hindi / Mewari',
    location: 'Udaipur, Rajasthan',
    district: 'Udaipur',
    state: 'Rajasthan',
    demographic: 'ASHA Workers',
    participantCount: 1,
    baselineScore: 84,
    respondentId: 'RES-RJ-012',
    status: 'coded-verified',
    duration: '00:45:22',
    lastEdited: '1 day ago',
    editedBy: 'Anjali Mehra',
    dateCollected: '2024-10-16',
  },
  {
    id: 'FGD-03',
    title: 'Mothers & Caregivers Group',
    type: 'FGD',
    language: 'Marathi',
    location: 'Satara, Maharashtra',
    district: 'Satara',
    state: 'Maharashtra',
    demographic: 'Mothers',
    participantCount: 5,
    baselineScore: 58,
    respondentId: 'RES-MH-005',
    status: 'coded-verified',
    duration: '00:38:45',
    lastEdited: '3 days ago',
    editedBy: 'Dr. Priya Sharma',
    dateCollected: '2024-10-18',
  },
  {
    id: 'KII-04',
    title: 'Government School Teacher Interview',
    type: 'KII',
    language: 'Hindi',
    location: 'Sitamarhi, Bihar',
    district: 'Sitamarhi',
    state: 'Bihar',
    demographic: 'Teachers',
    participantCount: 1,
    baselineScore: 76,
    respondentId: 'RES-BH-034',
    status: 'ready-for-coding',
    duration: '00:28:30',
    lastEdited: '5 hours ago',
    editedBy: 'Rahul Verma',
    dateCollected: '2024-10-20',
  },
  {
    id: 'SURV-05',
    title: 'Open-Ended Post-Workshop Survey Batch',
    type: 'Survey',
    language: 'Hindi / English',
    location: 'Udaipur, Rajasthan',
    district: 'Udaipur',
    state: 'Rajasthan',
    demographic: 'Adolescent Girls',
    participantCount: 18,
    baselineScore: 69,
    respondentId: 'RES-RJ-050',
    status: 'coded-verified',
    duration: 'N/A',
    lastEdited: '12 hours ago',
    editedBy: 'Anjali Mehra',
    dateCollected: '2024-10-22',
  },
  {
    id: 'FGD-06',
    title: "Young Women's Self-Help Group",
    type: 'FGD',
    language: 'Hindi',
    location: 'Gaya, Bihar',
    district: 'Gaya',
    state: 'Bihar',
    demographic: 'Adolescent Girls',
    participantCount: 5,
    baselineScore: 51,
    respondentId: 'RES-BH-078',
    status: 'needs-verification',
    duration: '00:41:15',
    lastEdited: '6 hours ago',
    editedBy: 'Dr. Priya Sharma',
    dateCollected: '2024-10-25',
  },
];

// Glossary terms
export const glossaryTerms: GlossaryTerm[] = [
  { id: 'g1', devanagari: 'महावारी', transliteration: 'mahāvārī', englishRendering: 'menstruation', note: 'Standard Hindi term; preferred over colloquial alternatives in formal research', language: 'Hindi' },
  { id: 'g2', devanagari: 'पैड', transliteration: 'paiḍ', englishRendering: 'sanitary pad', note: 'Borrowed English word, widely understood in rural areas', language: 'Hindi' },
  { id: 'g3', devanagari: 'कपड़ा', transliteration: 'kapḍā', englishRendering: 'cloth (reusable pad)', note: 'Do not translate literally as "cloth" — contextually refers to reusable menstrual cloth/pad', language: 'Hindi' },
  { id: 'g4', devanagari: 'शर्म', transliteration: 'śarm', englishRendering: 'shame / stigma', note: 'Carries stronger social connotation than English "shame"; denotes internalized community norms', language: 'Hindi' },
  { id: 'g5', devanagari: 'साखी', transliteration: 'sākhī', englishRendering: 'peer educator / trusted companion', note: 'Baala program-specific term for trained peer educator; do not translate as "witness"', language: 'Hindi' },
  { id: 'g6', devanagari: 'दीदी', transliteration: 'dīdī', englishRendering: 'elder sister / ASHA worker', note: 'Respectful term for female community health worker; context-dependent', language: 'Hindi' },
  { id: 'g7', devanagari: 'मासिक पाळी', transliteration: 'māsik pāḷī', englishRendering: 'menstrual cycle', note: 'Standard Marathi term for menstruation; "पाळी" alone is commonly used colloquially', language: 'Marathi' },
  { id: 'g8', devanagari: 'अशुद्ध', transliteration: 'aśuddh', englishRendering: 'impure / ritually unclean', note: 'Do not translate literally — refers to cultural purity norms; flag as stigma-related', language: 'Hindi' },
  { id: 'g9', devanagari: 'सुखाना', transliteration: 'sukhānā', englishRendering: 'drying (of cloth pads)', note: 'Specifically refers to sun-drying reusable pads; privacy concerns are key research theme', language: 'Hindi' },
  { id: 'g10', devanagari: 'आँगनवाड़ी', transliteration: 'āṅganvāṛī', englishRendering: 'community childcare center', note: 'Government-run rural child development center; common distribution point for health supplies', language: 'Hindi' },
];

// FGD-01 Transcript utterances
export const fgd01Utterances: Utterance[] = [
  {
    id: 'u1', sourceId: 'FGD-01', speaker: 'Facilitator', speakerRole: 'facilitator', speakerInitials: 'FC',
    timestamp: '00:00:12', timestampSeconds: 12,
    originalText: 'तो सबसे पहले मैं जानना चाहूँगी कि जब आपको पहली बार महावारी हुई, तो आपको कैसा लगा? क्या आपको पहले से कोई जानकारी थी?',
    transliteration: 'To sabse pahle main jānna chāhūṅgī ki jab āpko pahlī bār mahāvārī huī, to āpko kaisā lagā? Kyā āpko pahle se koī jānkārī thī?',
    englishTranslation: 'So first I would like to know — when you had your first period, how did you feel? Did you have any prior information about it?',
    confidence: 97, isLowConfidence: false, isVerified: true, isEdited: false, codes: ['T1'],
  },
  {
    id: 'u2', sourceId: 'FGD-01', speaker: 'Respondent 1 (Sunita, 14)', speakerRole: 'respondent', speakerInitials: 'R1',
    timestamp: '00:00:38', timestampSeconds: 38,
    originalText: 'हमको तो बहुत डर लगा था। हमको लगा कि कोई बीमारी हो गई। माँ ने कहा कि ई सब लड़कियों को होता है, चुपचाप रहो, किसी को मत बताओ।',
    transliteration: 'Hamko to bahut ḍar lagā thā. Hamko lagā ki koī bīmārī ho gaī. Māṅ ne kahā ki ī sab laṛkiyon ko hotā hai, cupcāp raho, kisī ko mat batāo.',
    englishTranslation: 'I was very scared. I thought I had gotten some disease. My mother told me this happens to all girls — stay quiet, don\'t tell anyone.',
    confidence: 96, isLowConfidence: false, isVerified: true, isEdited: false, codes: ['T1', 'T3'],
  },
  {
    id: 'u3', sourceId: 'FGD-01', speaker: 'Respondent 2 (Meena, 15)', speakerRole: 'respondent', speakerInitials: 'R2',
    timestamp: '00:01:15', timestampSeconds: 75,
    originalText: 'हमरे गाँव में तो ई बात करना ही पाप समझते हैं। स्कूल में भी कोई नहीं बताया। जब हमको हुआ तो हम तीन दिन स्कूल नहीं गए।',
    transliteration: 'Hamre gāṅv meṅ to ī bāt karnā hī pāp samajhte haiṅ. Skūl meṅ bhī koī nahīṅ batāyā. Jab hamko huā to ham tīn din skūl nahīṅ gae.',
    englishTranslation: 'In our village, talking about this is considered sinful. Even at school nobody told us. When it happened to me, I didn\'t go to school for three days.',
    confidence: 94, isLowConfidence: false, isVerified: true, isEdited: false, codes: ['T1', 'T3'],
  },
  {
    id: 'u4', sourceId: 'FGD-01', speaker: 'Facilitator', speakerRole: 'facilitator', speakerInitials: 'FC',
    timestamp: '00:02:04', timestampSeconds: 124,
    originalText: 'स्कूल में जब महावारी होती है तो क्या दिक्कत होती है?',
    transliteration: 'Skūl meṅ jab mahāvārī hotī hai to kyā dikkat hotī hai?',
    englishTranslation: 'What difficulties do you face at school when you have your period?',
    confidence: 98, isLowConfidence: false, isVerified: true, isEdited: false, codes: [],
  },
  {
    id: 'u5', sourceId: 'FGD-01', speaker: 'Respondent 3 (Priya, 14)', speakerRole: 'respondent', speakerInitials: 'R3',
    timestamp: '00:02:22', timestampSeconds: 142,
    originalText: 'टॉयलेट में पानी नहीं होता, डस्टबिन नहीं है। कपड़ा बदलने की जगह नहीं मिलती। तो हम उन दिनों घर पर ही रह जाते हैं।',
    transliteration: 'Ṭāyleṭ meṅ pānī nahīṅ hotā, ḍasṭbin nahīṅ hai. Kapṛā badalne kī jagah nahīṅ miltī. To ham un dinon ghar par hī rah jāte haiṅ.',
    englishTranslation: 'There\'s no water in the toilets, no dustbin. There\'s no place to change cloth pads. So we just stay home on those days.',
    confidence: 95, isLowConfidence: false, isVerified: true, isEdited: false, codes: ['T1', 'T5'],
  },
  {
    id: 'u6', sourceId: 'FGD-01', speaker: 'Respondent 4 (Anjali, 16)', speakerRole: 'respondent', speakerInitials: 'R4',
    timestamp: '00:03:10', timestampSeconds: 190,
    originalText: 'हमरा भी ऐसे ही है... कभी-कभी कपड़ा में... [overlapping speech] ...सूखाने में बहुत शर्म लगती है क्योंकि सब देख लेते हैं।',
    transliteration: 'Hamrā bhī aise hī hai... kabhī-kabhī kapṛā meṅ... [overlapping speech] ...sukhāne meṅ bahut śarm lagtī hai kyoṅki sab dekh lete haiṅ.',
    englishTranslation: 'It\'s the same for me... sometimes with the cloth... [overlapping speech] ...drying it is very embarrassing because everyone can see.',
    confidence: 71, isLowConfidence: true, lowConfidenceReason: 'Overlapping speech / Local idiom',
    isVerified: false, isEdited: false, codes: ['T2', 'T3'],
  },
  {
    id: 'u7', sourceId: 'FGD-01', speaker: 'Respondent 1 (Sunita, 14)', speakerRole: 'respondent', speakerInitials: 'R1',
    timestamp: '00:03:48', timestampSeconds: 228,
    originalText: 'हाँ, और पैड तो बहुत महँगा है। दुकान पर जाने में भी शर्म लगती है। दुकानदार पुरुष होता है तो और भी।',
    transliteration: 'Hāṅ, aur paiḍ to bahut mahaṅgā hai. Dukān par jāne meṅ bhī śarm lagtī hai. Dukāndār puruṣ hotā hai to aur bhī.',
    englishTranslation: 'Yes, and pads are very expensive. Even going to the shop is embarrassing. If the shopkeeper is male, it\'s even worse.',
    confidence: 93, isLowConfidence: false, isVerified: true, isEdited: false, codes: ['T4', 'T3'],
  },
  {
    id: 'u8', sourceId: 'FGD-01', speaker: 'Facilitator', speakerRole: 'facilitator', speakerInitials: 'FC',
    timestamp: '00:04:18', timestampSeconds: 258,
    originalText: 'क्या बाला की साखी दीदी से कोई मदद मिली?',
    transliteration: 'Kyā Bālā kī sākhī dīdī se koī madad milī?',
    englishTranslation: 'Did you receive any help from Baala\'s peer educator?',
    confidence: 97, isLowConfidence: false, isVerified: true, isEdited: false, codes: [],
  },
  {
    id: 'u9', sourceId: 'FGD-01', speaker: 'Respondent 5 (Kavita, 15)', speakerRole: 'respondent', speakerInitials: 'R5',
    timestamp: '00:04:38', timestampSeconds: 278,
    originalText: 'साखी दीदी ने हमको सब समझाया — कि ई natural है, कोई बीमारी नहीं है। उन्होंने पैड कैसे इस्तेमाल करना है वो भी दिखाया। अब हमको डर नहीं लगता।',
    transliteration: 'Sākhī dīdī ne hamko sab samjhāyā — ki ī natural hai, koī bīmārī nahīṅ hai. Unhone paiḍ kaise istemāl karnā hai vo bhī dikhāyā. Ab hamko ḍar nahīṅ lagtā.',
    englishTranslation: 'The peer educator explained everything to us — that this is natural, not a disease. She also showed us how to use pads. Now we\'re not afraid anymore.',
    confidence: 95, isLowConfidence: false, isVerified: true, isEdited: false, codes: ['T6'],
  },
  {
    id: 'u10', sourceId: 'FGD-01', speaker: 'Respondent 2 (Meena, 15)', speakerRole: 'respondent', speakerInitials: 'R2',
    timestamp: '00:05:12', timestampSeconds: 312,
    originalText: 'हाँ, साखी दीदी से बात करना आसान लगता है। वो हमरी उम्र की हैं, हमरी बात समझती हैं। टीचर से बात करने में... [inaudible whisper] ...हिचकिचाहट होती है।',
    transliteration: 'Hāṅ, sākhī dīdī se bāt karnā āsān lagtā hai. Vo hamrī umr kī haiṅ, hamrī bāt samajhtī haiṅ. Ṭīchar se bāt karne meṅ... [inaudible whisper] ...hicakicāhaṭ hotī hai.',
    englishTranslation: 'Yes, talking to the peer educator feels easy. She\'s our age, she understands us. With teachers, there\'s... [inaudible whisper] ...hesitation.',
    confidence: 68, isLowConfidence: true, lowConfidenceReason: 'Inaudible whisper segment',
    isVerified: false, isEdited: false, codes: ['T6'],
  },
  {
    id: 'u11', sourceId: 'FGD-01', speaker: 'Respondent 6 (Rekha, 13)', speakerRole: 'respondent', speakerInitials: 'R6',
    timestamp: '00:05:48', timestampSeconds: 348,
    originalText: 'मेरी दादी कहती हैं कि महावारी में अचार छूने से अचार खराब हो जाता है। साखी दीदी ने बताया कि ऐसा कुछ नहीं होता — ये बस पुरानी बातें हैं।',
    transliteration: 'Merī dādī kahtī haiṅ ki mahāvārī meṅ acār chūne se acār kharāb ho jātā hai. Sākhī dīdī ne batāyā ki aisā kuch nahīṅ hotā — ye bas purānī bāteṅ haiṅ.',
    englishTranslation: 'My grandmother says touching pickles during periods spoils them. The peer educator told us nothing like that happens — these are just old beliefs.',
    confidence: 96, isLowConfidence: false, isVerified: true, isEdited: false, codes: ['T3', 'T6'],
  },
];

// Themes & Codes
export const themes: Theme[] = [
  {
    id: 'T1', label: 'School Absenteeism',
    totalCount: 14,
    codes: [
      { id: 'T1-a', label: 'Days missed per cycle', parentTheme: 'School Absenteeism', definition: 'Reported number of school days missed during menstruation', count: 8, underlineStyle: 'solid' },
      { id: 'T1-b', label: 'Fear of staining', parentTheme: 'School Absenteeism', definition: 'Anxiety about visible staining as reason for absence', count: 6, underlineStyle: 'solid' },
    ],
  },
  {
    id: 'T2', label: 'Wash & Drying Privacy',
    totalCount: 11,
    codes: [
      { id: 'T2-a', label: 'Lack of private drying space', parentTheme: 'Wash & Drying Privacy', definition: 'No secluded area for drying reusable cloth pads', count: 7, underlineStyle: 'dashed' },
      { id: 'T2-b', label: 'Inadequate washing facilities', parentTheme: 'Wash & Drying Privacy', definition: 'Insufficient water or soap for cleaning reusable pads', count: 4, underlineStyle: 'dashed' },
    ],
  },
  {
    id: 'T3', label: 'Community Stigma & Myths',
    totalCount: 16,
    codes: [
      { id: 'T3-a', label: 'Silence / secrecy norms', parentTheme: 'Community Stigma & Myths', definition: 'Social expectation to not discuss menstruation', count: 9, underlineStyle: 'dotted' },
      { id: 'T3-b', label: 'Purity / pollution beliefs', parentTheme: 'Community Stigma & Myths', definition: 'Cultural beliefs about ritual impurity during menstruation', count: 7, underlineStyle: 'dotted' },
    ],
  },
  {
    id: 'T4', label: 'Cost & Affordability',
    totalCount: 9,
    codes: [
      { id: 'T4-a', label: 'Pad cost barrier', parentTheme: 'Cost & Affordability', definition: 'Financial inability to purchase commercial pads regularly', count: 6, underlineStyle: 'double' },
      { id: 'T4-b', label: 'Preference for free distribution', parentTheme: 'Cost & Affordability', definition: 'Desire for subsidized or free pad programs', count: 3, underlineStyle: 'double' },
    ],
  },
  {
    id: 'T5', label: 'Water & Sanitation Infrastructure',
    totalCount: 8,
    codes: [
      { id: 'T5-a', label: 'No water in school toilets', parentTheme: 'Water & Sanitation Infrastructure', definition: 'Toilets lack running water for menstrual hygiene', count: 5, underlineStyle: 'thick' },
      { id: 'T5-b', label: 'No disposal bins', parentTheme: 'Water & Sanitation Infrastructure', definition: 'Absence of waste bins in school or community toilets', count: 3, underlineStyle: 'thick' },
    ],
  },
  {
    id: 'T6', label: 'Peer Educator Trust',
    totalCount: 12,
    codes: [
      { id: 'T6-a', label: 'Age-appropriate communication', parentTheme: 'Peer Educator Trust', definition: 'Peer educators\' ability to communicate in relatable terms', count: 7, underlineStyle: 'wavy' },
      { id: 'T6-b', label: 'Myth-busting effectiveness', parentTheme: 'Peer Educator Trust', definition: 'Success of peer educators in correcting misconceptions', count: 5, underlineStyle: 'wavy' },
    ],
  },
];

// Code suggestions for AI validation queue
export const codeSuggestions: CodeSuggestion[] = [
  {
    id: 'cs1', quote: 'My mother told me this happens to all girls — stay quiet, don\'t tell anyone.',
    sourceId: 'FGD-01', speaker: 'Respondent 1 (Sunita, 14)',
    charOffset: 'chars 142–218', suggestedCode: 'Silence / secrecy norms',
    suggestedTheme: 'Community Stigma & Myths', confidence: 94,
    status: 'pending', audioTimestamp: '00:00:38',
    originalText: 'माँ ने कहा कि ई सब लड़कियों को होता है, चुपचाप रहो, किसी को मत बताओ।',
  },
  {
    id: 'cs2', quote: 'There\'s no water in the toilets, no dustbin. There\'s no place to change cloth pads.',
    sourceId: 'FGD-01', speaker: 'Respondent 3 (Priya, 14)',
    charOffset: 'chars 356–442', suggestedCode: 'No water in school toilets',
    suggestedTheme: 'Water & Sanitation Infrastructure', confidence: 97,
    status: 'pending', audioTimestamp: '00:02:22',
    originalText: 'टॉयलेट में पानी नहीं होता, डस्टबिन नहीं है। कपड़ा बदलने की जगह नहीं मिलती।',
  },
  {
    id: 'cs3', quote: 'Pads are very expensive. Even going to the shop is embarrassing.',
    sourceId: 'FGD-01', speaker: 'Respondent 1 (Sunita, 14)',
    charOffset: 'chars 498–562', suggestedCode: 'Pad cost barrier',
    suggestedTheme: 'Cost & Affordability', confidence: 91,
    status: 'pending', audioTimestamp: '00:03:48',
    originalText: 'पैड तो बहुत महँगा है। दुकान पर जाने में भी शर्म लगती है।',
  },
  {
    id: 'cs4', quote: 'The peer educator explained everything to us — that this is natural, not a disease.',
    sourceId: 'FGD-01', speaker: 'Respondent 5 (Kavita, 15)',
    charOffset: 'chars 614–698', suggestedCode: 'Myth-busting effectiveness',
    suggestedTheme: 'Peer Educator Trust', confidence: 96,
    status: 'pending', audioTimestamp: '00:04:38',
    originalText: 'साखी दीदी ने हमको सब समझाया — कि ई natural है, कोई बीमारी नहीं है।',
  },
  {
    id: 'cs5', quote: 'Drying it is very embarrassing because everyone can see.',
    sourceId: 'FGD-01', speaker: 'Respondent 4 (Anjali, 16)',
    charOffset: 'chars 442–498', suggestedCode: 'Lack of private drying space',
    suggestedTheme: 'Wash & Drying Privacy', confidence: 89,
    status: 'pending', audioTimestamp: '00:03:10',
    originalText: 'सूखाने में बहुत शर्म लगती है क्योंकि सब देख लेते हैं।',
  },
  {
    id: 'cs6', quote: 'My grandmother says touching pickles during periods spoils them.',
    sourceId: 'FGD-01', speaker: 'Respondent 6 (Rekha, 13)',
    charOffset: 'chars 724–786', suggestedCode: 'Purity / pollution beliefs',
    suggestedTheme: 'Community Stigma & Myths', confidence: 98,
    status: 'pending', audioTimestamp: '00:05:48',
    originalText: 'दादी कहती हैं कि महावारी में अचार छूने से अचार खराब हो जाता है।',
  },
];

// Quote bank for reports
export const quoteBank: QuoteBank[] = [
  {
    id: 'q1', quote: 'I was very scared. I thought I had gotten some disease.',
    speaker: 'Respondent 1 (Sunita, 14)', speakerType: 'Adolescent Girl', sourceId: 'FGD-01',
    district: 'Sitamarhi', demographic: 'Adolescent Girls', theme: 'School Absenteeism',
    code: 'Fear of staining', charOffset: 'chars 82–142', audioTimestamp: '00:00:38',
    baselineScore: 42, originalText: 'हमको तो बहुत डर लगा था। हमको लगा कि कोई बीमारी हो गई।', isVerified: true,
  },
  {
    id: 'q2', quote: 'In our village, talking about this is considered sinful. Even at school nobody told us.',
    speaker: 'Respondent 2 (Meena, 15)', speakerType: 'Adolescent Girl', sourceId: 'FGD-01',
    district: 'Sitamarhi', demographic: 'Adolescent Girls', theme: 'Community Stigma & Myths',
    code: 'Silence / secrecy norms', charOffset: 'chars 218–356', audioTimestamp: '00:01:15',
    baselineScore: 42, originalText: 'हमरे गाँव में तो ई बात करना ही पाप समझते हैं। स्कूल में भी कोई नहीं बताया।', isVerified: true,
  },
  {
    id: 'q3', quote: 'There\'s no water in the toilets, no dustbin. So we just stay home on those days.',
    speaker: 'Respondent 3 (Priya, 14)', speakerType: 'Adolescent Girl', sourceId: 'FGD-01',
    district: 'Sitamarhi', demographic: 'Adolescent Girls', theme: 'Water & Sanitation Infrastructure',
    code: 'No water in school toilets', charOffset: 'chars 356–442', audioTimestamp: '00:02:22',
    baselineScore: 42, originalText: 'टॉयलेट में पानी नहीं होता, डस्टबिन नहीं है। तो हम उन दिनों घर पर ही रह जाते हैं।', isVerified: true,
  },
  {
    id: 'q4', quote: 'Drying the cloth pad is very embarrassing because everyone can see.',
    speaker: 'Respondent 4 (Anjali, 16)', speakerType: 'Adolescent Girl', sourceId: 'FGD-01',
    district: 'Sitamarhi', demographic: 'Adolescent Girls', theme: 'Wash & Drying Privacy',
    code: 'Lack of private drying space', charOffset: 'chars 442–498', audioTimestamp: '00:03:10',
    baselineScore: 42, originalText: 'सूखाने में बहुत शर्म लगती है क्योंकि सब देख लेते हैं।', isVerified: true,
  },
  {
    id: 'q5', quote: 'Pads are very expensive. Even going to the shop is embarrassing if the shopkeeper is male.',
    speaker: 'Respondent 1 (Sunita, 14)', speakerType: 'Adolescent Girl', sourceId: 'FGD-01',
    district: 'Sitamarhi', demographic: 'Adolescent Girls', theme: 'Cost & Affordability',
    code: 'Pad cost barrier', charOffset: 'chars 498–562', audioTimestamp: '00:03:48',
    baselineScore: 42, originalText: 'पैड तो बहुत महँगा है। दुकान पर जाने में भी शर्म लगती है।', isVerified: true,
  },
  {
    id: 'q6', quote: 'The peer educator explained everything — that this is natural, not a disease. Now we\'re not afraid anymore.',
    speaker: 'Respondent 5 (Kavita, 15)', speakerType: 'Adolescent Girl', sourceId: 'FGD-01',
    district: 'Sitamarhi', demographic: 'Adolescent Girls', theme: 'Peer Educator Trust',
    code: 'Myth-busting effectiveness', charOffset: 'chars 614–698', audioTimestamp: '00:04:38',
    baselineScore: 42, originalText: 'साखी दीदी ने हमको सब समझाया — कि ई natural है, कोई बीमारी नहीं है।', isVerified: true,
  },
  {
    id: 'q7', quote: 'Girls in rural areas need someone who speaks their language and understands their daily reality.',
    speaker: 'ASHA Worker (Kamla Devi)', speakerType: 'ASHA Worker', sourceId: 'KII-02',
    district: 'Udaipur', demographic: 'ASHA Workers', theme: 'Peer Educator Trust',
    code: 'Age-appropriate communication', charOffset: 'chars 102–196', audioTimestamp: '00:03:15',
    baselineScore: 84, originalText: 'ग्रामीण क्षेत्र की लड़कियों को ऐसा कोई चाहिए जो उनकी भाषा बोले और रोज़ की ज़िंदगी समझे।', isVerified: true,
  },
  {
    id: 'q8', quote: 'I see mothers also confused about hygiene. They pass the same myths to daughters.',
    speaker: 'ASHA Worker (Kamla Devi)', speakerType: 'ASHA Worker', sourceId: 'KII-02',
    district: 'Udaipur', demographic: 'ASHA Workers', theme: 'Community Stigma & Myths',
    code: 'Purity / pollution beliefs', charOffset: 'chars 310–398', audioTimestamp: '00:08:42',
    baselineScore: 84, originalText: 'माताओं को भी स्वच्छता के बारे में confusion है। वही myths बेटियों तक पहुँचती हैं।', isVerified: true,
  },
  {
    id: 'q9', quote: 'After the workshop, girls started coming to school even during their periods. That is the real change.',
    speaker: 'Teacher (Rajesh Kumar)', speakerType: 'Teacher', sourceId: 'KII-04',
    district: 'Sitamarhi', demographic: 'Teachers', theme: 'School Absenteeism',
    code: 'Days missed per cycle', charOffset: 'chars 156–252', audioTimestamp: '00:05:30',
    baselineScore: 76, originalText: 'वर्कशॉप के बाद लड़कियाँ महावारी में भी स्कूल आने लगीं। यही असली बदलाव है।', isVerified: true,
  },
  {
    id: 'q10', quote: 'We collect the used pads and throw them behind the house. There is nowhere else to put them.',
    speaker: 'Mother (Laxmi Bai)', speakerType: 'Mother', sourceId: 'FGD-03',
    district: 'Satara', demographic: 'Mothers', theme: 'Water & Sanitation Infrastructure',
    code: 'No disposal bins', charOffset: 'chars 204–298', audioTimestamp: '00:07:15',
    baselineScore: 58, originalText: 'वापरलेले पॅड गोळा करून घराच्या मागे टाकतो. दुसरीकडे टाकायला जागाच नाही.', isVerified: true,
  },
  {
    id: 'q11', quote: 'The reusable pads are good but drying them in the sun where others can see is a big problem.',
    speaker: 'SHG Member (Fatima, 22)', speakerType: 'Young Woman', sourceId: 'FGD-06',
    district: 'Gaya', demographic: 'Adolescent Girls', theme: 'Wash & Drying Privacy',
    code: 'Lack of private drying space', charOffset: 'chars 88–182', audioTimestamp: '00:04:55',
    baselineScore: 51, originalText: 'कपड़े वाले पैड अच्छे हैं पर धूप में सुखाना जहाँ सब देख सकें — ये बड़ी समस्या है।', isVerified: true,
  },
  {
    id: 'q12', quote: 'If pads cost even 5 rupees less, more families would buy them. Right now it is a luxury.',
    speaker: 'SHG Member (Nisha, 19)', speakerType: 'Young Woman', sourceId: 'FGD-06',
    district: 'Gaya', demographic: 'Adolescent Girls', theme: 'Cost & Affordability',
    code: 'Pad cost barrier', charOffset: 'chars 256–342', audioTimestamp: '00:09:20',
    baselineScore: 51, originalText: 'अगर पैड की कीमत 5 रुपये भी कम हो तो ज़्यादा परिवार खरीदेंगे। अभी ये luxury है।', isVerified: true,
  },
];

// Heatmap data: theme x district
export const heatmapData: Record<string, Record<string, number>> = {
  'School Absenteeism': { 'Sitamarhi': 6, 'Udaipur': 2, 'Satara': 3, 'Gaya': 3 },
  'Wash & Drying Privacy': { 'Sitamarhi': 3, 'Udaipur': 1, 'Satara': 2, 'Gaya': 5 },
  'Community Stigma & Myths': { 'Sitamarhi': 7, 'Udaipur': 3, 'Satara': 2, 'Gaya': 4 },
  'Cost & Affordability': { 'Sitamarhi': 2, 'Udaipur': 1, 'Satara': 3, 'Gaya': 3 },
  'Water & Sanitation Infrastructure': { 'Sitamarhi': 3, 'Udaipur': 1, 'Satara': 2, 'Gaya': 2 },
  'Peer Educator Trust': { 'Sitamarhi': 4, 'Udaipur': 3, 'Satara': 2, 'Gaya': 3 },
};

// Mixed methods chart data
export const mixedMethodsData = [
  { district: 'Sitamarhi', qualMentions: 25, baselineKnowledge: 42, padAdoption: 28 },
  { district: 'Udaipur', qualMentions: 11, baselineKnowledge: 69, padAdoption: 55 },
  { district: 'Satara', qualMentions: 14, baselineKnowledge: 58, padAdoption: 44 },
  { district: 'Gaya', qualMentions: 20, baselineKnowledge: 51, padAdoption: 32 },
];

// Network graph data
export const networkNodes = [
  { id: 'T1', label: 'School Absenteeism', type: 'core' as const, x: 300, y: 150 },
  { id: 'T2', label: 'Wash & Drying Privacy', type: 'core' as const, x: 550, y: 100 },
  { id: 'T3', label: 'Community Stigma & Myths', type: 'core' as const, x: 200, y: 350 },
  { id: 'T4', label: 'Cost & Affordability', type: 'core' as const, x: 500, y: 350 },
  { id: 'T5', label: 'Water & Sanitation', type: 'core' as const, x: 100, y: 200 },
  { id: 'T6', label: 'Peer Educator Trust', type: 'core' as const, x: 650, y: 250 },
  { id: 'T1-a', label: 'Days missed', type: 'sub' as const, x: 350, y: 50 },
  { id: 'T1-b', label: 'Fear of staining', type: 'sub' as const, x: 200, y: 80 },
  { id: 'T2-a', label: 'No drying space', type: 'sub' as const, x: 650, y: 40 },
  { id: 'T3-a', label: 'Silence norms', type: 'sub' as const, x: 80, y: 400 },
  { id: 'T3-b', label: 'Purity beliefs', type: 'sub' as const, x: 300, y: 420 },
  { id: 'T6-a', label: 'Age-appropriate', type: 'sub' as const, x: 750, y: 180 },
];

export const networkEdges = [
  { source: 'T1', target: 'T1-a', weight: 8 },
  { source: 'T1', target: 'T1-b', weight: 6 },
  { source: 'T2', target: 'T2-a', weight: 7 },
  { source: 'T3', target: 'T3-a', weight: 9 },
  { source: 'T3', target: 'T3-b', weight: 7 },
  { source: 'T6', target: 'T6-a', weight: 7 },
  { source: 'T1', target: 'T5', weight: 10, label: '10 co-occurrences' },
  { source: 'T2', target: 'T3', weight: 8, label: '8 co-occurrences' },
  { source: 'T5', target: 'T2', weight: 14, label: '14 co-occurrences' },
  { source: 'T3', target: 'T6', weight: 11, label: '11 co-occurrences' },
  { source: 'T4', target: 'T1', weight: 6, label: '6 co-occurrences' },
  { source: 'T4', target: 'T3', weight: 5, label: '5 co-occurrences' },
];

// Semantic search results
export const semanticSearchResults = [
  { quote: 'Drying the cloth pad is very embarrassing because everyone can see.', score: 0.96, sourceId: 'FGD-01', speaker: 'Respondent 4' },
  { quote: 'The reusable pads are good but drying them in the sun where others can see is a big problem.', score: 0.92, sourceId: 'FGD-06', speaker: 'SHG Member (Fatima)' },
  { quote: 'We collect the used pads and throw them behind the house. There is nowhere else to put them.', score: 0.84, sourceId: 'FGD-03', speaker: 'Mother (Laxmi Bai)' },
  { quote: 'There\'s no water in the toilets, no dustbin. There\'s no place to change cloth pads.', score: 0.81, sourceId: 'FGD-01', speaker: 'Respondent 3' },
  { quote: 'Girls need a private area to wash and dry pads. Without it, they go back to old cloth.', score: 0.78, sourceId: 'KII-02', speaker: 'ASHA Worker (Kamla Devi)' },
];

// Word cloud data
export const wordCloudData = [
  { word: 'menstruation', weight: 42 },
  { word: 'stigma', weight: 38 },
  { word: 'school', weight: 35 },
  { word: 'pad', weight: 32 },
  { word: 'privacy', weight: 28 },
  { word: 'drying', weight: 26 },
  { word: 'water', weight: 24 },
  { word: 'toilet', weight: 22 },
  { word: 'shame', weight: 20 },
  { word: 'peer educator', weight: 19 },
  { word: 'myths', weight: 18 },
  { word: 'cost', weight: 17 },
  { word: 'cloth', weight: 16 },
  { word: 'family', weight: 15 },
  { word: 'awareness', weight: 14 },
  { word: 'absenteeism', weight: 13 },
  { word: 'disposal', weight: 12 },
  { word: 'hygiene', weight: 11 },
  { word: 'workshop', weight: 10 },
  { word: 'community', weight: 9 },
];

