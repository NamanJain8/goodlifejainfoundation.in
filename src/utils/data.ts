import { TimelineItem, Tool, Resource, GalleryItem, Testimonial, NavItem } from '../types';

// Navigation Data
export const navigationItems: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About Brahmi', href: '#about' },
  {
    label: 'Tools',
    href: '#tools',
    children: [
      { label: 'Translator', href: '#translator' },
      { label: 'Multi Keyboard', href: '#keyboard' },
      { label: 'Learning Game', href: '#game' },
      { label: 'Image Editor', href: '#editor' },
    ],
  },
  { label: 'Resources', href: '#resources' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

// Spiritual Content in Hindi
export const spiritualContent = {
  guidance: {
    hindi: 'श्रुताराधक सन्त क्षुल्लक श्री प्रज्ञांशसागर जी गुरुदेव',
    brahmi: '𑀰𑁆𑀭𑀼𑀢𑀸𑀭𑀥𑀓 𑀲𑀁𑀢 𑀓𑁆𑀱𑀼𑀮𑁆𑀮𑀓 𑀰𑁆𑀭𑀻 𑀧𑁆𑀭𑀚𑁆𑀜𑀸𑀦𑀰𑀲𑀸𑀕𑀭 𑀚𑀻 ��𑀼𑀭𑀼𑀤𑁂𑀯'
  },
  foundation: {
    english: 'Good Life Jain Foundation',
    hindi: 'गुड लाइफ जैन फाउंडेशन',
    brahmi: '𑀕𑀼𑀟 𑀮𑀸𑀇𑀨 𑀚𑁃𑀦 𑀨𑀸𑀉𑀁𑀟𑁂𑀰𑀦'
  },
  brahmiScript: {
    english: 'Brahmi Script',
    hindi: 'ब्राह्मी लिपि',
    brahmi: '𑀩𑁆𑀭𑀸𑀳𑁆𑀫𑀻 𑀮𑀺𑀧𑀺'
  },
  adinath: {
    english: 'Adinath Bhagwan Rishabhdev Ji',
    hindi: 'आदिनाथ भगवान ऋषभदेव जी',
    brahmi: '𑀆𑀤𑀺𑀦𑀸𑀣 𑀪𑀕𑀯𑀸𑀦 𑀬𑀱𑀪𑀤𑁂𑀯 𑀚𑀻'
  },
  daughters: {
    brahmi: {
      english: 'Brahmi',
      hindi: 'ब्राह्मी',
      brahmi: '𑀩𑁆𑀭𑀸𑀳𑁆𑀫𑀻'
    },
    sundari: {
      english: 'Sundari',
      hindi: 'सुंदरी',
      brahmi: '𑀲𑀼𑀁𑀤𑀭𑀻'
    }
  },
  greetings: {
    namaskaar: {
      english: 'Namaskaar',
      hindi: 'नमस्कार',
      brahmi: '𑀦𑀫𑀲𑁆𑀓𑀸𑀭'
    },
    jayJinendra: {
      english: 'Jai Jinendra',
      hindi: 'जय जिनेन्द्र',
      brahmi: '𑀚𑀬 𑀚𑀺𑀦𑁂𑀦𑁆𑀤𑁆𑀭'
    },
    ahimsa: {
      english: 'Ahimsa',
      hindi: 'अहिंसा',
      brahmi: '𑀅𑀳𑀺𑀁𑀲𑀸'
    },
    dharma: {
      english: 'Dharma',
      hindi: 'धर्म',
      brahmi: '𑀥𑀭𑁆𑀫'
    },
    moksha: {
      english: 'Moksha',
      hindi: 'मोक्ष',
      brahmi: '𑀫𑁄𑀓𑁆𑀱'
    },
    shanti: {
      english: 'Shanti',
      hindi: 'शांति',
      brahmi: '𑀰𑀸𑀁𑀢𑀺'
    }
  },
  jainTerms: {
    tirthankar: {
      english: 'Tirthankar',
      hindi: 'तीर्थंकर',
      brahmi: '𑀢𑀻𑀭𑁆𑀣𑀁𑀓𑀭'
    },
    siddha: {
      english: 'Siddha',
      hindi: 'सिद्ध',
      brahmi: '𑀲𑀺𑀤𑁆𑀥'
    },
    acharya: {
      english: 'Acharya',
      hindi: 'आचार्य',
      brahmi: '𑀆𑀘𑀸𑀭𑁆𑀬'
    },
    upadhyay: {
      english: 'Upadhyay',
      hindi: 'उपाध्याय',
      brahmi: '𑀉𑀧𑀸𑀥𑁆𑀬𑀸𑀬'
    },
    muni: {
      english: 'Muni',
      hindi: 'मुनि',
      brahmi: '𑀫𑀼𑀦𑀺'
    },
    sant: {
      english: 'Sant',
      hindi: 'संत',
      brahmi: '𑀲𑀁𑀢'
    }
  }
};

// Timeline Data
export const timelineData: TimelineItem[] = [
  {
    id: 1,
    title: 'The Six Karmas',
    description: `At the end of the Bhogabhumi era, when the Kalpavriksha deprived people of their desires and temptations; they sought help from the fourteenth Kulakara king, Nabhirayaji. He directed them to his son, Rishabhadeva, who possessed the tri-knowledge (Mati, Shrut, and Avadhi Jnana).
    
    Rishabhadeva introduced the practice of the six karmas — Asi (weapons), Masi, Krishi (agriculture), Vidya (education), Vanijya (trade), and Shilpa (art/craft). These practices significantly improved the quality of life for the people.`,
    image: '/assets/story/01_six_karmas.png',
  },
  {
    id: 2,
    title: "Women's Education Initiative",
    description: 'Among the six actions, Vidya (education) stands out as the most profound, expansive, and impactful. Rishabhdev, valuing its significance, taught Vidya not only to his 101 sons but also to his two daughters, treating them as equals to their brothers. As the Adi Vidhata (the First Preceptor), he emphasized to the public: "Unless women are educated, the next generation cannot be educated." Though challenging at first, his words were accepted as a royal decree. True to his teachings, Maharaj Rishabhdev Ji began this transformative initiative with his own daughters.',
    image: '/assets/story/02_womens_education.png',
  },
  {
    id: 3,
    title: 'Brahmi and Sundari',
    description: 'King Rishabhdev called upon his daughters, Brahmi and Sundari, as they approached adulthood and explained the vital role of education in one\'s life. He emphasized that an educated person is revered as a guide in society, while one without education is likened to an animal. Recognising the value of learning, Brahmi and Sundari, with great humility, requested their father to grant them the gift of knowledge and education. They aspired to enrich not only their own lives but also the lives of their loved ones through this wisdom.',
    image: '/assets/story/03_requesting_education.png',
  },
  {
    id: 4,
    title: 'The Teaching Begins',
    description: 'Recognizing his daughters\' enthusiasm and readiness for education, King Rishabhdev began teaching them from an auspicious Nakshatra muhurat. To his elder daughter, Brahmi, he imparted the gift of Akshar Vidya (alphabetical knowledge) by seating her on his right side. To Sundari, seated on his left, he bestowed Ank Vidya (numerical knowledge).',
    image: '/assets/story/04_teaching_begins.png',
  },
  {
    id: 5,
    title: 'The Era of Bhog Bhoomi',
    description: 'Bhogabhumi existed until the third era, during which ten types of essential life items were effortlessly available to humans through the Kalpavriksha (wish-fulfilling trees). In this land, beings would obtain their desires simply by contemplating before these trees, without need for any effort. During this time, there were no friendships, relationships, or social connections of any kind.',
    image: '/assets/story/05_bhog_bhoomi.png',
  },
  {
    id: 6,
    title: 'Language and Script',
    description: 'Language serves as a means to express emotions and thoughts, while the art of writing language is known as a \'script\'. By the end of the third period, language had developed—specifically, the Prakrit language, regarded as the language of nature. In contrast, a refined and cultured language is known as Sanskrit. During this time, interaction occurred through Prakrit, but the language lacked a written form. Recognising this limitation, King Rishabhdev addressed it by teaching Lipi Vidya (the art of writing) to his elder daughter, Brahmi.',
    image: '/assets/story/06_language_vs_script.png',
  },
  {
    id: 7,
    title: 'Scripts and Languages',
    description: 'Every language has its own script. For example, languages like Sanskrit, Apabhramsha, Hindi, and Pali use the Devanagari script, the English language uses the Roman script, and Punjabi is written in Gurmukhi. Thus, distinct languages typically have their own dedicated scripts. While it is possible to write any language using any script — for instance, ॥श्री आदिनाथाय नमः॥ in Devanagari script can be transliterated into the Roman script as Shri Adinathaya Namah — such writing is neither complete nor standard. To achieve accuracy and correctness, the script specific to a language must be used.',
    image: '/assets/story/07_scripts_languages.png',
  },
  {
    id: 8,
    title: 'The Origin of Brahmi Script',
    description: 'The natural language of human beings is called the Prakrit language. Its script was taught by King Rishabhdev to his daughter Brahmi, who then passed it onto others. For this reason, the script of the Prakrit language came to be known as Brahmi. King Rishabhdev taught Brahmi the art of writing by sitting on the right side, which is why 99% of the world\'s scripts are written from left to right. As the first script of this Avasarpini period, Brahmi has influenced all scripts that followed. A detailed study of these scripts reveals that they all stem from the Brahmi script.',
    image: '/assets/story/08_origin_brahmi.png',
  },
];

// Tools Data
export const toolsData: Tool[] = [
  {
    id: 'translator',
    title: 'Translator',
    description: 'Convert any text into Brahmi script with just a click. Bridge the gap between modern communication and ancient writing systems.',
    icon: 'Languages',
    isWidget: true,
  },
  {
    id: 'keyboard',
    title: 'Multi Keyboard',
    description: 'Type in Hindi or English and automatically convert to Brahmi script with our advanced multi-language keyboard.',
    icon: 'Keyboard',
    link: 'https://samayjain24.github.io/Multilingual_Keyboard/',
  },
  {
    id: 'game',
    title: 'Learning Game',
    description: 'Interactive games designed for children and youth to acquire knowledge of Brahmi script through fun and engaging activities.',
    icon: 'Gamepad2',
    link: 'https://samayjain24.github.io/Translator_BrahmiLipi/game/index.html',
  },
  {
    id: 'editor',
    title: 'Image Editor',
    description: 'Transform your text into beautiful images with Brahmi script. Create stunning visuals for social sharing and preservation.',
    icon: 'Edit',
  },
];

// Resources Data
export const resourcesData: Resource[] = [
  {
    id: 'scriptures',
    title: 'Jain Granth',
    description: 'Access complete collection of Digambar Jain Agam scriptures and religious texts in PDF format for study and devotion.',
    icon: 'Book',
    link: 'https://drive.google.com/drive/folders/1L8JgG3JcvxrYbckpyLqfNTh5zFVkhqN0?sort=13&direction=a',
  },
  {
    id: 'dictionary',
    title: 'Jain Dictionary',
    description: 'Comprehensive digital collection of Jain terms and meanings from JainKosh - the largest repository of Jain scriptures and knowledge.',
    icon: 'Search',
    link: 'https://www.jainkosh.org/wiki/Jain_dictionary',
  },
  {
    id: 'pilgrimage',
    title: 'Digambar Jain Teerth',
    description: 'Explore sacred Jain pilgrimage sites and temples across India. Discover spiritual destinations for your holy journey.',
    icon: 'MapPin',
    link: 'https://www.vitragvani.com/tirth-darshan/digamber.aspx',
  },
];

// Gallery Data
export const galleryData: GalleryItem[] = [
  {
    id: '1',
    title: 'Sacred Journey',
    category: 'Pilgrimage',
    image: '/assets/gallery/1.jpeg',
    alt: 'Sacred Journey 1',
  },
  {
    id: '2',
    title: 'Temple Visit',
    category: 'Worship',
    image: '/assets/gallery/2.jpeg',
    alt: 'Sacred Journey 2',
  },
  {
    id: '3',
    title: 'Community Gathering',
    category: 'Events',
    image: '/assets/gallery/3.jpeg',
    alt: 'Sacred Journey 3',
  },
  {
    id: '4',
    title: 'Scripture Study',
    category: 'Education',
    image: '/assets/gallery/4.jpeg',
    alt: 'Sacred Journey 4',
  },
  {
    id: '5',
    title: 'Ancient Manuscripts',
    category: 'Heritage',
    image: '/assets/gallery/5.jpeg',
    alt: 'Sacred Journey 5',
  },
  {
    id: '6',
    title: 'Spiritual Learning',
    category: 'Wisdom',
    image: '/assets/gallery/6.jpeg',
    alt: 'Sacred Journey 6',
  },
];

// Testimonials Data
export const testimonialsData: Testimonial[] = [
  {
    id: '1',
    name: 'Ketan Jain',
    role: 'Director, Uneecops Technologies Ltd',
    content: 'Molestiae incidunt consequatur quis ipsa autem nam sit enim magni. Voluptas tempore rem. Explicabo a quaerat sint autem dolore ducimus ut consequatur neque. Nisi dolores quaerat fuga rem nihil nostrum. Laudantium quia consequatur molestias delectus culpa.',
    avatar: '/assets/avatars/ketan.jpg',
  },
  {
    id: '2',
    name: 'Piyush Jain',
    role: 'Director, Uneecops Technologies Ltd',
    content: 'Excepturi nam cupiditate culpa doloremque deleniti repellat. Veniam quos repellat voluptas animi adipisci. Nisi eaque consequatur. Voluptatem dignissimos ut ducimus accusantium perspiciatis. Quasi voluptas eius distinctio. Atque eos maxime.',
    avatar: '/assets/avatars/piyush.jpg',
  },
];

// Social Media Links
export const socialLinks = {
  facebook: 'https://www.facebook.com/share/aytFEk9LmPVULqta/',
  playStore: 'https://play.google.com/store/apps/details?id=com.goodlife.bramhi',
  instagram: 'https://www.instagram.com/pragyanshsagar_/profilecard/?igsh=MXNrdmp2d2xvc2t1Zw==',
  youtube: 'https://youtube.com/@shrutaaraadhak_sant_pragyansh?si=WRQFhGioeCg7SeZL',
};

// Video URL
export const heroVideoUrl = 'https://player.vimeo.com/video/1025487433?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479';

// Contact Information
export const contactInfo = {
  email: 'goodlifejainfoundation@gmail.com',
  guidanceHindi: spiritualContent.guidance.hindi,
  guidanceBrahmi: spiritualContent.guidance.brahmi,
};

// Brahmi Translation Mappings
export const brahmiMapping: { [key: string]: string } = {
  // Vowels
  'अ': '𑀅', 'आ': '𑀆', 'इ': '𑀇', 'ई': '𑀈', 'उ': '𑀉', 'ऊ': '𑀊',
  'ऋ': '𑀋', 'ॠ': '𑀌', 'ऌ': '𑀍', 'ॡ': '𑀎', 'ए': '𑀏', 'ऐ': '𑀐',
  'ओ': '𑀑', 'औ': '𑀒',

  // Consonants
  'क': '𑀓', 'ख': '𑀔', 'ग': '𑀕', 'घ': '𑀖', 'ङ': '𑀗',
  'च': '𑀘', 'छ': '𑀙', 'ज': '𑀚', 'झ': '𑀛', 'ञ': '𑀜',
  'ट': '𑀝', 'ठ': '𑀞', 'ड': '𑀟', 'ढ': '𑀠', 'ण': '𑀡',
  'त': '𑀢', 'थ': '𑀣', 'द': '𑀤', 'ध': '𑀥', 'न': '𑀦',
  'प': '𑀧', 'फ': '𑀨', 'ब': '𑀩', 'भ': '𑀪', 'म': '𑀫',
  'य': '𑀬', 'र': '𑀭', 'ल': '𑀮', 'व': '𑀯',
  'श': '𑀰', 'ष': '𑀱', 'स': '𑀲', 'ह': '𑀳',

  // Vowel signs (matras)
  'ा': '𑀸', 'ि': '𑀺', 'ी': '𑀻', 'ु': '𑀼', 'ू': '𑀽',
  'ृ': '𑀾', 'ॄ': '𑀿', 'ॢ': '𑁀', 'ॣ': '𑁁', 'े': '𑁂', 'ै': '𑁃',
  'ो': '𑁄', 'ौ': '𑁅',

  // Other signs
  'ं': '𑀁', 'ः': '𑀂', '्': '𑁆', 'ँ': '𑀀',

  // Numbers
  '०': '𑁦', '१': '𑁧', '२': '𑁨', '३': '𑁩', '४': '𑁪',
  '५': '𑁫', '६': '𑁬', '७': '𑁭', '८': '𑁮', '९': '𑁯',

  // Punctuation
  '।': '𑁇', '॥': '𑁈',

  // Space and common symbols
  ' ': ' ', '\n': '\n', '\t': '\t'
};

// English to Brahmi transliteration mapping
export const englishToBrahmi: { [key: string]: string } = {
  'a': '𑀅', 'aa': '𑀆', 'i': '𑀇', 'ii': '𑀈', 'u': '𑀉', 'uu': '𑀊',
  'e': '𑀏', 'o': '𑀑',
  'ka': '𑀓', 'kha': '𑀔', 'ga': '𑀕', 'gha': '𑀖', 'nga': '𑀗',
  'cha': '𑀘', 'chha': '𑀙', 'ja': '𑀚', 'jha': '𑀛', 'nya': '𑀜',
  'ta': '𑀝', 'tha': '𑀞', 'da': '𑀟', 'dha': '𑀠', 'na': '𑀡',
  'pa': '𑀧', 'pha': '𑀨', 'ba': '𑀩', 'bha': '𑀪', 'ma': '𑀫',
  'ya': '𑀬', 'ra': '𑀭', 'la': '𑀮', 'va': '𑀯',
  'sha': '𑀰', 'sa': '𑀲', 'ha': '𑀳',
  'k': '𑀓𑁆', 'g': '5��', 'c': '8𑁆', 'j': '𑀚𑁆', 't': '𑀢𑁆', 
  'd': '𑀤𑁆', 'n': '𑀦𑁆', 'p': '𑀧𑁆', 'b': '𑀩𑁆', 'm': '𑀫𑁆',
  'y': '𑀬𑁆', 'r': '𑀭𑁆', 'l': '𑀮𑁆', 'v': '𑀯𑁆', 's': '����', 'h': '𑀳𑁆'
}; 