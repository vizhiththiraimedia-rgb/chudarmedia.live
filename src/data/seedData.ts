import {
  Article,
  Category,
  BreakingNews,
  User,
  Advertisement,
  RssSource,
  LiveStreamConfig,
  SiteSettings,
  Comment,
  MediaItem,
  VideoTrailer
} from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'all', nameTa: 'முகப்பு', nameEn: 'Home', slug: 'home', order: 1 },
  { id: 'kollywood', nameTa: 'தமிழ் சினிமா', nameEn: 'Kollywood', slug: 'kollywood', order: 2 },
  { id: 'reviews', nameTa: 'விமர்சனங்கள்', nameEn: 'Movie Reviews', slug: 'reviews', order: 3 },
  { id: 'sri-lankan-cinema', nameTa: 'இலங்கை சினிமா', nameEn: 'Sri Lankan Cinema', slug: 'sri-lankan-cinema', order: 4 },
  { id: 'indian-cinema', nameTa: 'இந்திய சினிமா', nameEn: 'Indian Cinema', slug: 'indian-cinema', order: 5 },
  { id: 'world-cinema', nameTa: 'உலக சினிமா', nameEn: 'World Cinema', slug: 'world-cinema', order: 6 },
  { id: 'sinhala-cinema', nameTa: 'சிங்கள சினிமா', nameEn: 'Sinhala Cinema', slug: 'sinhala-cinema', order: 7 },
  { id: 'interviews', nameTa: 'நேர்காணல்கள்', nameEn: 'Interviews', slug: 'interviews', order: 8 },
  { id: 'gossips', nameTa: 'கிசுகிசு & வைரல்', nameEn: 'Gossips & Viral', slug: 'gossips', order: 9 },
  { id: 'trailers', nameTa: 'டிரெய்லர்கள் & பாடல்கள்', nameEn: 'Trailers & Teasers', slug: 'trailers', order: 10 },
  { id: 'gallery', nameTa: 'கேலரி (Photos)', nameEn: 'Gallery', slug: 'gallery', order: 11 },
  { id: 'box-office', nameTa: 'பாக்ஸ் ஆபீஸ்', nameEn: 'Box Office', slug: 'box-office', order: 12 },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-1',
    name: 'முனைவர் க. இளங்கோவன்',
    email: 'elango@chudarmedia.com',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    bio: 'பிரதம ஆசிரியர் - சினிமா ஆய்வாளர் மற்றும் மூத்த திரை விமர்சகர்.',
    location: 'கொழும்பு & சென்னை',
    active: true,
    articlesCount: 164
  },
  {
    id: 'user-2',
    name: 'மதிவதனி செந்தில்நாதன்',
    email: 'mathi@chudarmedia.com',
    role: 'editor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    bio: 'திரை விமர்சகர் மற்றும் சர்வதேச சினிமா நிருபர்.',
    location: 'யாழ்ப்பாணம்',
    active: true,
    articlesCount: 112
  },
  {
    id: 'user-3',
    name: 'ரமேஷ் கார்த்திக்',
    email: 'ramesh@chudarmedia.com',
    role: 'journalist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    bio: 'கோலிவுட் மற்றும் பாலிவுட் பாக்ஸ் ஆபீஸ் நிருபர்.',
    location: 'சென்னை',
    active: true,
    articlesCount: 85
  },
  {
    id: 'user-4',
    name: 'சரோஜா தர்ஷன்',
    email: 'saroja@chudarmedia.com',
    role: 'reporter',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
    bio: 'செலிபிரிட்டி நேர்காணல்கள் மற்றும் சினிமா நிகழ்வுகள் நிருபர்.',
    location: 'கொழும்பு',
    active: true,
    articlesCount: 42
  }
];

export const INITIAL_BREAKING_NEWS: BreakingNews[] = [
  {
    id: 'break-1',
    headlineTa: 'தளபதி விஜய் - வெற்றிமாறன் இணையும் பிரம்மாண்ட பான்-இந்திய திரைப்படத்தின் அதிகாரப்பூர்வ அறிவிப்பு வெளியானது!',
    headlineEn: 'Thalapathy Vijay and Vetrimaaran mega Pan-Indian project officially announced!',
    articleId: 'art-1',
    active: true,
    priority: 1,
    createdAt: '2026-09-28T10:15:00Z'
  },
  {
    id: 'break-2',
    headlineTa: 'ஈழத்து கலைஞர்களின் கூட்டு உருவாக்கத்தில் உருவான ‘கடலோரக் கனவுகள்’ சர்வதேச திரைப்பட விழாவில் தங்க மகுடம் வென்றது!',
    headlineEn: 'Sri Lankan Tamil film wins Golden Crown at prestigious International Film Festival',
    articleId: 'art-2',
    active: true,
    priority: 2,
    createdAt: '2026-09-28T11:30:00Z'
  },
  {
    id: 'break-3',
    headlineTa: 'உலக சினிமா பாக்ஸ் ஆபீஸ்: ‘அவதார் 3’ முதல் வார வசூல் உலகளவில் $850 மில்லியன் டாலர்களை கடந்து சாதனை!',
    headlineEn: 'Avatar 3 crushes global box office with $850 Million in opening week',
    articleId: 'art-3',
    active: true,
    priority: 3,
    createdAt: '2026-09-28T12:00:00Z'
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'தளபதி விஜய் - வெற்றிமாறன் கூட்டணியில் புதிய பான்-இந்தியப் படம்: அனிருத் இசையமைப்பில் அதிரடி அறிவிப்பு!',
    titleEn: 'Thalapathy Vijay Teams Up With Vetrimaaran for Landmark Pan-Indian Action Epic',
    subtitle: 'தமிழ் சினிமாவின் உச்ச நட்சத்திரமும் தேசிய விருது பெற்ற முன்னணி இயக்குநரும் இணையும் மெகா பட்ஜெட் திரைப்படம்.',
    subtitleEn: 'Anirudh Ravichander to compose music for the dream collaboration.',
    slug: 'thalapathy-vijay-vetrimaaran-pan-indian-movie-announced',
    categoryId: 'kollywood',
    summary: 'தமிழ் சினிமா வரலாற்றில் ரசிகர்கள் நீண்ட நாட்களாக ஆவலுடன் எதிர்பார்த்த தளபதி விஜய் மற்றும் இயக்குநர் வெற்றிமாறன் இணையும் புதிய மெகா திரைப்படத்தின் அதிகாரப்பூர்வ ஃபர்ஸ்ட் லுக் போஸ்டர் இன்று மாலை வெளியாகி இணையத்தை அதிர வைத்துள்ளது.',
    summaryEn: 'The much awaited collaboration between Thalapathy Vijay and director Vetrimaaran was officially announced with music by Anirudh Ravichander.',
    content: `
      <p>தமிழ் திரையுலகின் உச்ச நட்சத்திரமான தளபதி விஜய் மற்றும் தேசிய விருது பெற்ற படைப்பாளி வெற்றிமாறன் இருவரும் முதல்முறையாக ஒரு பிரம்மாண்ட புதிய திரைப்படத்திற்காக கைகோர்த்துள்ளனர். இந்நிகழ்வை தயாரிப்பு நிறுவனம் இன்று அதிகாரப்பூர்வமாக போஸ்டர் வெளியிட்டு உறுதி செய்துள்ளது.</p>
      
      <h3>அனிருத்தின் ஆவேச இசை</h3>
      <p>இப்படத்திற்கு ராக்ஸ்டார் அனிருத் ரவிச்சந்தர் இசையமைக்கிறார். மேலும், இந்தியாவின் முன்னணி ஒளிப்பதிவாளர்கள் மற்றும் ஹாலிவுட் சண்டைக் கலைஞர்கள் இப்படத்தில் பணியாற்றுகின்றனர். படப்பிடிப்பு சென்னை, மதுரை மற்றும் கொழும்பு ஆகிய இடங்களில் நடைபெற திட்டமிடப்பட்டுள்ளது.</p>
      
      <blockquote>
        "எப்போதுமே நல்ல கதைகளும் வலுவான கதாபாத்திரங்களும் இணையும் போது அது திரையில் ஒரு புதிய சரித்திரத்தை உருவாக்கும். விஜய் சாருடன் இணையும் இந்த பயணம் மிகவும் சிறப்பானதாக அமையும்." 
        <br />— இயக்குநர் வெற்றிமாறன்
      </blockquote>

      <p>இத்திரைப்படம் தமிழ், தெலுங்கு, இந்தி, மலையாளம் மற்றும் கன்னடம் என 5 மொழிகளில் பான்-இந்திய அளவில் உலகமெங்கும் சுமார் 10,000 திரையரங்குகளில் வெளியாகவுள்ளது.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'திரைப்படத்தின் பிரம்மாண்ட அறிவிப்பு போஸ்டர் வெளியீட்டு விழா',
    photographerCredit: 'சுடர் சினிமா பிரிவு / தயாரிப்பு நிறுவனம்',
    authorId: 'user-3',
    authorName: 'ரமேஷ் கார்த்திக்',
    authorRole: 'கோலிவுட் சிறப்பு நிருபர்',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    location: 'சென்னை, தமிழ்நாடு',
    status: 'published',
    publishedAt: '2026-09-28T09:30:00Z',
    updatedAt: '2026-09-28T10:45:00Z',
    isBreaking: true,
    isFeatured: true,
    isTrending: true,
    editorPick: true,
    allowComments: true,
    viewCount: 42800,
    shareCount: 4890,
    tags: ['தளபதிவிஜய்', 'வெற்றிமாறன்', 'அனிருத்', 'தமிழ்சினிமா', 'Kollywood'],
    seoTitle: 'தளபதி விஜய் - வெற்றிமாறன் புதிய படம் | Chudar Media Cinema',
    seoDescription: 'விஜய் வெற்றிமாறன் கூட்டணி அதிகாரப்பூர்வ அறிவிப்பு மற்றும் ஃபர்ஸ்ட் லுக் விவரங்கள்.'
  },
  {
    id: 'art-2',
    title: 'விமர்சனம்: ‘மண்ணின் மைந்தன்’ – ஈழத்து வாழ்வியலை நெஞ்சைத் தொடும் வண்ணம் விவரித்த உணர்வுப்பூர்வமான திரைப்படம்!',
    titleEn: 'Movie Review: Mannin Mainthan - A Heart-Wrenching Masterpiece of Eelam Soil',
    subtitle: 'யாழ்ப்பாணம், மன்னார் மற்றும் வவுனியா களப் பின்னணியில் உருவான சர்வதேச தரத்திலான சினிமா.',
    subtitleEn: 'Powerful screenplay, evocative camera work and unforgettable performances.',
    slug: 'movie-review-mannin-mainthan-eelam-tamil-cinema',
    categoryId: 'reviews',
    rating: 4.5,
    movieVerdict: 'பிளாக்பஸ்டர் கலைப்படைப்பு (Must Watch)',
    director: 'ஜெயசீலன் தர்மரத்தினம்',
    cast: 'சுதர்ஷன், தாரணி, கஜன், நிர்மலா',
    musicDirector: 'சந்தோஷ் நாராயணன் & பிரதீப் குமார்',
    summary: 'ஈழத்து மக்களின் நிலம் சார்ந்த வாழ்வியல் போராட்டங்களையும், புலம்பெயர் வலியையும் உயிர்ப்புடன் பதிவு செய்திருக்கும் ‘மண்ணின் மைந்தன்’ திரைப்படம் ரசிகர்களையும் விமர்சகர்களையும் மெய்சிலிர்க்க வைத்துள்ளது.',
    summaryEn: 'Mannin Mainthan stands tall as one of the finest cinematic explorations of home, longing and resilience.',
    content: `
      <p>ஈழத் தமிழ் சினிமா சர்வதேச அரங்கில் தலைநிமிர்ந்து நிற்கக்கூடிய அற்புதமான கலைப்படைப்பாக வெளிவந்துள்ளது ‘மண்ணின் மைந்தன்’. இயக்குநர் ஜெயசீலன் தர்மரத்தினம் மண்ணின் மணத்தையும் மக்களின் உண்மையான உணர்வுகளையும் திரைமொழியாக்கியுள்ளார்.</p>

      <h3>கதைக்களம் & நடிப்பு</h3>
      <p>மன்னார் கடற்கரை கிராமத்தில் வாழும் ஒரு சாதாரண மீனவ குடும்பத்தின் மூன்று தலைமுறை வாழ்க்கையை படம் பேசுகிறது. கதையின் நாயகனாக வரும் சுதர்ஷன் தனது கண்களாலேயே வலியை கடத்தி அப்ளாஸ் அள்ளுகிறார். தாயாக நடித்திருக்கும் நிர்மலாவின் நடிப்பு நெஞ்சை உலுக்குகிறது.</p>

      <blockquote>
        "எங்கட நிலம் என்பது வெறும் மணல் துகள்கள் அல்ல, அது எங்கள் முன்னோர்களின் மூச்சுக் காற்று!"
        <br />— படத்தில் வரும் அழுத்தமான வசனம்
      </blockquote>

      <h3>இசை & ஒளிப்பதிவு</h3>
      <p>சந்தோஷ் நாராயணன் மற்றும் பிரதீப் குமாரின் பின்னணி இசை படத்திற்கு மிகப்பெரிய பலம். மன்னாரின் உவர்நிலக் காட்சிகளும், யாழ்ப்பாணத்து பழைய வீடுகளும் சர்வதேச தரத்திலான ஒளிப்பதிவில் திரையில் மிளிர்கின்றன.</p>

      <p><strong>தீர்ப்பு:</strong> தமிழ் சினிமா ரசிகர்கள் அனைவரும் திரையரங்கில் தவறாமல் பார்த்து கொண்டாட வேண்டிய உன்னதமான படைப்பு!</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=1200&q=80',
    imageCaption: '‘மண்ணின் மைந்தன்’ திரைப்படத்தின் முக்கியக் காட்சி',
    photographerCredit: 'ஈழத்து கலைக்கூடம் / சுடர் மீடியா',
    authorId: 'user-2',
    authorName: 'மதிவதனி செந்தில்நாதன்',
    authorRole: 'மூத்த திரை விமர்சகர்',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    location: 'யாழ்ப்பாணம் & கொழும்பு',
    status: 'published',
    publishedAt: '2026-09-28T08:15:00Z',
    updatedAt: '2026-09-28T11:00:00Z',
    isBreaking: false,
    isFeatured: true,
    isTrending: true,
    editorPick: true,
    allowComments: true,
    viewCount: 38400,
    shareCount: 2950,
    tags: ['விமர்சனம்', 'இலங்கைசினிமா', 'ஈழத்தமிழ்சினிமா', 'MovieReview'],
    seoTitle: 'மண்ணின் மைந்தன் திரைப்பட விமர்சனம் | Chudar Media Review',
    seoDescription: 'ஈழத்து திரைப்படமான மண்ணின் மைந்தன் முழுமையான திரை விமர்சனம் மற்றும் ரேட்டிங்.'
  },
  {
    id: 'art-3',
    title: 'இலங்கை சிங்கள சினிமாவின் நவீன அலை: சர்வதேச விழாக்களில் விருதுகளை குவிக்கும் பிரசன்ன விதானகேவின் புதிய படைப்பு',
    titleEn: 'Prasanna Vithanage New Sinhala Masterpiece Wins Big at Berlin Film Festival',
    subtitle: 'சிங்கள மற்றும் தமிழ் கலாச்சார பரிமாற்றத்தை மையமாகக் கொண்ட ‘சஹோதரயா’ திரைப்படத்திற்கு சர்வதேச பாராட்டு.',
    subtitleEn: 'New film explores island reconciliation through deeply humane cinematic lens.',
    slug: 'prasanna-vithanage-new-sinhala-movie-berlin-festival-award',
    categoryId: 'sinhala-cinema',
    summary: 'இலங்கையின் முன்னணி இயக்குநர் பிரசன்ன விதானகே இயக்கியுள்ள புதிய சிங்களத் திரைப்படம் பெர்லின் சர்வதேச திரைப்பட விழாவில் நடுவர் மன்றத்தின் சிறப்பு விருதை வென்றுள்ளது.',
    summaryEn: 'Veteran director Prasanna Vithanage has earned critical acclaim in Berlin for his latest film addressing reconciliation and shared humanity.',
    content: `
      <p>இலங்கை சினிமாவின் சர்வதேச முகமாக விளங்கும் இயக்குநர் பிரசன்ன விதானகேவின் புதிய திரைப்படமான ‘சஹோதரயா’ (சகோதரன்) ஜெர்மனியின் பெர்லின் நகரில் நடைபெற்ற சர்வதேச திரைப்பட விழாவில் உலக பிரீமியர் செய்யப்பட்டு பெரும் வரவேற்பை பெற்றது.</p>
      
      <p>இப்படத்தில் சிங்கள மற்றும் தமிழ் நடிகர்கள் இணைந்து நடித்துள்ளனர். தெற்கு மற்றும் வடக்கு மக்களின் ஆழமான உளவியல் பிணைப்பை நேர்மையுடன் பதிவு செய்திருப்பதாக சர்வதேச விமர்சகர்கள் புகழ்ந்துள்ளனர்.</p>

      <blockquote>
        "சினிமா மனித இதயங்களை இணைக்கும் பாலம். இன, மொழி எல்லைகளைக் கடந்து மனித நேயத்தைப் பேசுவதே எனது கலைப்பணி."
        <br />— பிரசன்ன விதானகே
      </blockquote>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'பெர்லின் திரைப்பட விழாவில் விருதுடன் இயக்குநர் மற்றும் படக்குழு',
    photographerCredit: 'Berlin Film Festival Press / சுடர் சினிமா',
    authorId: 'user-1',
    authorName: 'முனைவர் க. இளங்கோவன்',
    authorRole: 'பிரதம ஆசிரியர்',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    location: 'கொழும்பு & பெர்லின்',
    status: 'published',
    publishedAt: '2026-09-28T07:00:00Z',
    updatedAt: '2026-09-28T09:20:00Z',
    isBreaking: false,
    isFeatured: true,
    isTrending: false,
    editorPick: true,
    allowComments: true,
    viewCount: 19400,
    shareCount: 1430,
    tags: ['சிங்களசினிமா', 'இலங்கை', 'பிரசன்னவிதானகே', 'SinhalaCinema'],
    seoTitle: 'பிரசன்ன விதானகே புதிய படம் பெர்லின் விருது | Chudar Cinema',
    seoDescription: 'சிங்கள சினிமா சர்வதேச அரங்கில் பெற்ற வெற்றி குறித்த சிறப்புப் பார்வை.'
  },
  {
    id: 'art-4',
    title: 'நேர்காணல்: “சினிமாவில் கதாநாயகிகள் வெறும் பொம்மைகள் அல்ல” – நயன்தாராவின் அதிரடி பேட்டி!',
    titleEn: 'Exclusive Interview: "Actresses Are Not Mere Showpieces" - Nayanthara Fiery Talk',
    subtitle: 'லேடி சூப்பர்ஸ்டார் நயன்தாரா தனது 20 வருட திரைப்பயண அனுபவங்கள் மற்றும் புதிய படங்கள் குறித்து சுடர் மீடியாவுக்கு பிரத்யேக பேட்டி.',
    subtitleEn: 'Lady Superstar candidly discusses gender parity, women-led cinema, and future projects.',
    slug: 'nayanthara-exclusive-interview-chudar-media',
    categoryId: 'interviews',
    summary: 'தென்னிந்திய சினிமாவின் லேடி சூப்பர்ஸ்டார் நயன்தாரா தனது சினிமாப் பயணம், பெண் கதாபாத்திரங்களின் முக்கியத்துவம் மற்றும் எதிர்வரும் பான்-இந்தியப் படங்கள் குறித்து சுடர் மீடியா வாசகர்களுடன் மனம் திறந்து பேசியுள்ளார்.',
    summaryEn: 'Nayanthara shares behind-the-scenes thoughts on balancing stardom, demanding substantive roles, and championing female-led scripts.',
    content: `
      <p>இருபது ஆண்டுகளுக்கும் மேலாக தென்னிந்திய சினிமாவின் அசைக்க முடியாத ராணியாக வலம் வரும் நயன்தாரா, சுடர் மீடியாவுக்கு அளித்த பிரத்யேக சிறப்பு நேர்காணலில் பல சுவாரஸ்யமான தகவல்களைப் பகிர்ந்து கொண்டார்.</p>

      <p><strong>கேள்வி:</strong> நாயகிகளை மையமாகக் கொண்ட படங்கள் இப்போது அதிகம் வெற்றி பெறுகிறதே, இந்த மாற்றத்தை எப்படி பார்க்கிறீர்கள்?</p>
      <p><strong>நயன்தாரா:</strong> "ரசிகர்கள் இப்போது மிகவும் புத்திசாலிகள். வெறும் கவர்ச்சி நடனங்களை மட்டும் பார்க்க அவர்கள் தியேட்டருக்கு வருவதில்லை. கதை வலுவாகவும் கதாபாத்திரம் உயிர்ப்போடும் இருந்தால் கதாநாயகி படங்களையும் மிகப்பெரிய பிளாக்பஸ்டர் ஆக்குவார்கள் என்பதற்கு எனது படங்களே சாட்சி."</p>

      <blockquote>
        "என்னை முடக்க நினைத்த பல தருணங்களை எனது உழைப்பின் மூலமே வெற்றியாக மாற்றினேன். தன்னம்பிக்கைதான் பெண்களின் மிகப்பெரிய பலம்."
      </blockquote>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'நயன்தாரா சிறப்பு நேர்காணல் புகைப்படம்',
    photographerCredit: 'சுடர் சினிமா ஸ்பெஷல்',
    authorId: 'user-4',
    authorName: 'சரோஜா தர்ஷன்',
    authorRole: 'பிரத்யேக நிருபர்',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
    location: 'சென்னை & கொழும்பு',
    status: 'published',
    publishedAt: '2026-09-28T06:30:00Z',
    updatedAt: '2026-09-28T06:30:00Z',
    isBreaking: false,
    isFeatured: true,
    isTrending: true,
    editorPick: false,
    allowComments: true,
    viewCount: 54100,
    shareCount: 6240,
    tags: ['நயன்தாரா', 'நேர்காணல்', 'தமிழ்சினிமா', 'Nayanthara', 'Interview'],
    seoTitle: 'நயன்தாரா சிறப்பு நேர்காணல் | Chudar Media Cinema',
    seoDescription: 'லேடி சூப்பர்ஸ்டார் நயன்தாராவின் மனம்திறந்த பிரத்யேக சினிமா பேட்டி.'
  },
  {
    id: 'art-5',
    title: 'பாக்ஸ் ஆபீஸ் ரிப்போர்ட்: ‘விடாமுயற்சி’ முதல் வார உலகளாவிய வசூல் ரூ. 280 கோடிகளைத் தாண்டியது!',
    titleEn: 'Box Office Report: Ajith Kumar Vidaamuyarchi Crosses Rs 280 Crores Worldwide in Week 1',
    subtitle: 'வெளிநாடுகளில் வசூல் மழை பொழியும் ஏகே-வின் ஆக்ஷன் த்ரில்லர்: திரையரங்குகள் ஹவுஸ்புல்.',
    subtitleEn: 'Ajith Kumar action thriller shatters overseas records in Malaysia, UK, Singapore, and Sri Lanka.',
    slug: 'vidaamuyarchi-box-office-collection-crosses-280-crores',
    categoryId: 'box-office',
    summary: 'மகிழ் திருமேனி இயக்கத்தில் அஜித் குமார் நடித்துள்ள ‘விடாமுயற்சி’ திரைப்படம் முதல் வாரத்தில் உலகளவில் ரூ. 280 கோடிக்கும் மேல் வசூலித்து புதிய சாதனை படைத்துள்ளது.',
    summaryEn: 'Vidaamuyarchi achieves phenomenal global theatrical returns with packed shows across Tamil Nadu and global diaspora markets.',
    content: `
      <p>அஜித் குமாரின் நடிப்பில் பிரம்மாண்டமாக வெளியான ‘விடாமுயற்சி’ திரைப்படம் உலகளாவிய பாக்ஸ் ஆபீஸில் மிகப்பெரிய வசூல் வேட்டையை நிகழ்த்தி வருகிறது. முதல் 7 நாட்களில் தமிழகத்தில் மட்டும் ரூ. 140 கோடிகளையும், வெளிநாடுகளில் ரூ. 140 கோடிகளையும் வசூலித்துள்ளது.</p>
      <p>குறிப்பாக இலங்கை, மலேசியா, லண்டன், பிரான்ஸ் மற்றும் கனடா நாடுகளில் அஜித் படங்களிலேயே மிகவேகமாக வசூல் செய்த படமாக இது உருவெடுத்துள்ளது.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'திரையரங்குகளில் கொண்டாடும் ரசிகர்கள்',
    photographerCredit: 'சுடர் பாக்ஸ் ஆபீஸ் டிராக்கர்',
    authorId: 'user-3',
    authorName: 'ரமேஷ் கார்த்திக்',
    authorRole: 'பாக்ஸ் ஆபீஸ் நிருபர்',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    location: 'சென்னை',
    status: 'published',
    publishedAt: '2026-09-28T05:45:00Z',
    updatedAt: '2026-09-28T08:00:00Z',
    isBreaking: false,
    isFeatured: false,
    isTrending: true,
    editorPick: true,
    allowComments: true,
    viewCount: 68900,
    shareCount: 8400,
    tags: ['அஜித்குமார்', 'விடாமுயற்சி', 'பாக்ஸ்ஆபீஸ்', 'BoxOffice', 'Ajith'],
    seoTitle: 'விடாமுயற்சி பாக்ஸ் ஆபீஸ் வசூல் ரிப்போர்ட் | Chudar Media',
    seoDescription: 'அஜித் குமார் நடித்துள்ள விடாமுயற்சி படத்தின் முதல் வார உலகளாவிய வசூல் நிலவரம்.'
  },
  {
    id: 'art-6',
    title: 'கிசுகிசு: நட்சத்திர ஜோடியின் ரகசிய திருமண நிச்சயதார்த்தம்? சமூக வலைத்தளங்களில் வைரலாகும் புகைப்படங்கள்!',
    titleEn: 'Celebrity Gossip: Secret Engagement for Top Star Couple in London?',
    subtitle: 'ரசிகர்களின் வாழ்த்து மழையும், அதிகாரப்பூர்வ அறிவிப்பு குறித்த எதிர்பார்ப்பும்.',
    subtitleEn: 'Viral photos fuel romance speculation among fans and industry insiders.',
    slug: 'star-couple-secret-engagement-gossip-london',
    categoryId: 'gossips',
    summary: 'கோலிவுட்டின் முன்னணி காதல் ஜோடி லண்டனில் தங்களது குடும்பத்தினர் முன்னிலையில் ரகசியமாக மோதிரம் மாற்றிக் கொண்டதாக சினிமா வட்டாரங்களில் பரபரப்பான கிசுகிசு பரவி வருகிறது.',
    summaryEn: 'Intense rumors swirl around a hush-hush engagement of popular Kollywood icons during a private European getaway.',
    content: `
      <p>திரையுலகில் பல ஆண்டுகளாக நெருங்கிய நண்பர்களாக பழகி வந்த முன்னணி நடிகர் மற்றும் நடிகை சமீபத்தில் ஐரோப்பிய சுற்றுலா சென்றிருந்த போது ரகசியமாக நிச்சயதார்த்தம் செய்து கொண்டதாக தகவல்கள் கசிந்துள்ளன.</p>
      <p>இருதரப்பு குடும்பத்தினரும் அடுத்த ஆண்டு தொடக்கத்தில் சென்னையில் பிரம்மாண்ட திருமண வரவேற்பு நிகழ்ச்சி நடத்த திட்டமிட்டுள்ளதாக நம்பத்தகுந்த வட்டாரங்கள் தெரிவிக்கின்றன.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'சமூக வலைத்தளங்களில் பகிரப்பட்டு வரும் வைரல் காட்சி',
    photographerCredit: 'வைரல் சினிமா நெட்வொர்க்',
    authorId: 'user-4',
    authorName: 'சரோஜா தர்ஷன்',
    authorRole: 'செய்தியாளர்',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
    location: 'சென்னை & லண்டன்',
    status: 'published',
    publishedAt: '2026-09-28T04:20:00Z',
    updatedAt: '2026-09-28T06:00:00Z',
    isBreaking: false,
    isFeatured: false,
    isTrending: true,
    editorPick: false,
    allowComments: true,
    viewCount: 71200,
    shareCount: 9120,
    tags: ['கிசுகிசு', 'வைரல்', 'திருமணம்', 'Gossip', 'ViralNews'],
    seoTitle: 'சினிமா கிசுகிசு நட்சத்திர திருமணம் | Chudar Media',
    seoDescription: 'கோலிவுட் நட்சத்திர ஜோடியின் ரகசிய நிச்சயதார்த்தம் பற்றிய சூடான தகவல்கள்.'
  },
  {
    id: 'art-7',
    title: 'டிரெய்லர் பார்வை: கமல் ஹாசன் - மணிரத்னம் கூட்டணியின் ‘தக் லைஃப்’ ஆக்ஷன் டிரெய்லர் யூடியூபில் 25 மில்லியன் பார்வைகள்!',
    titleEn: 'Trailer Review: Kamal Haasan - Mani Ratnam Thug Life Explodes With 25M Views',
    subtitle: 'நாயக்கன் படத்திற்குப் பிறகு 38 ஆண்டுகள் கழித்து இணைந்த வரலாற்று கூட்டணி.',
    subtitleEn: 'Mani Ratnam visual poetic violence meets Kamal Haasan volcanic screen presence.',
    slug: 'kamal-haasan-mani-ratnam-thug-life-trailer-records',
    categoryId: 'trailers',
    videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    summary: 'கமல் ஹாசன் மற்றும் மணிரத்னம் கூட்டணியில் உருவாகியுள்ள ‘தக் லைஃப்’ படத்தின் அனல் பறக்கும் ஆக்ஷன் டிரெய்லர் வெளியாகி 24 மணி நேரத்தில் 25 மில்லியன் பார்வைகளைக் கடந்து சாதனை படைத்துள்ளது.',
    summaryEn: 'The pulse-pounding trailer of Thug Life showcases unprecedented action choreography and AR Rahman soul-stirring score.',
    content: `
      <p>இந்திய சினிமாவின் ஆகச்சிறந்த காம்போவான கமல்ஹாசன் மற்றும் மணிரத்னம் இணையும் ‘தக் லைஃப்’ திரைப்படத்தின் டிரெய்லர் நேற்று மாலை வெளியானது. ஏ.ஆர். ரஹ்மானின் மிரட்டலான இசை, உலகநாயகனின் பலவிதமான கெட்டப்புகள் மற்றும் சிலிர்ப்பூட்டும் வசனங்கள் ரசிகர்களை பிரமிப்பில் ஆழ்த்தியுள்ளன.</p>
      <p>சிலம்பரசன் டிஆரின் மாஸ் என்ட்ரி டிரெய்லரின் மிகப்பெரிய ஹைலைட்டாக அமைந்துள்ளது.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=1200&q=80',
    imageCaption: '‘தக் லைஃப்’ டிரெய்லர் காட்சி',
    photographerCredit: 'ராஜ் கமல் பிலிம்ஸ் / மெட்ராஸ் டாக்கீஸ்',
    authorId: 'user-3',
    authorName: 'ரமேஷ் கார்த்திக்',
    authorRole: 'செய்தி ஆசிரியர்',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    location: 'சென்னை',
    status: 'published',
    publishedAt: '2026-09-27T16:00:00Z',
    updatedAt: '2026-09-28T03:00:00Z',
    isBreaking: false,
    isFeatured: false,
    isTrending: true,
    editorPick: true,
    allowComments: true,
    viewCount: 48900,
    shareCount: 5200,
    tags: ['கமல்ஹாசன்', 'மணிரத்னம்', 'தக்லைஃப்', 'டிரெய்லர்', 'ThugLife'],
    seoTitle: 'தக் லைஃப் டிரெய்லர் பார்வை | Chudar Media Cinema',
    seoDescription: 'கமல்ஹாசன் மணிரத்னம் தக் லைஃப் டிரெய்லர் சாதனை மற்றும் முழு விவரம்.'
  },
  {
    id: 'art-8',
    title: 'விமர்சனம்: ஹாலிவுட் சை-ஃபை பிரம்மாண்டம் ‘டூன்: பகுதி 3’ (Dune 3) – சினிமா ரசிகர்களுக்கு ஒரு மாயாஜால அனுபவம்!',
    titleEn: 'Hollywood Review: Dune Part 3 Delivers an Unparalleled Cinematic Marvel',
    subtitle: 'டெனிஸ் வில்லெனுவின் இயக்கத்தில் பிரமிக்க வைக்கும் விஷுவல் மேஜிக்.',
    subtitleEn: 'Timothée Chalamet and Zendaya lead a visually transcendent sci-fi spectacle.',
    slug: 'hollywood-movie-review-dune-part-3',
    categoryId: 'world-cinema',
    rating: 4.8,
    movieVerdict: 'வரலாற்று சாதனைத் திரைப்படம் (Masterpiece)',
    director: 'Denis Villeneuve',
    cast: 'Timothée Chalamet, Zendaya, Florence Pugh, Javier Bardem',
    musicDirector: 'Hans Zimmer',
    summary: 'ஹாலிவுட்டின் தலைசிறந்த இயக்குநரான டெனிஸ் வில்லெனு இயக்கத்தில் உருவான ‘டூன்: பகுதி 3’ திரைப்படம் சர்வதேச ரசிகர்களை பிரம்மிப்பில் ஆழ்த்தியுள்ளது. ஹான்ஸ் ஜிம்மரின் இசை படத்திற்கு ஆன்மாவாக அமைந்துள்ளது.',
    summaryEn: 'Dune Part 3 caps off a legendary trilogy with visual grandeur and profound emotional intensity.',
    content: `
      <p>ஹாலிவுட்டின் அறிவியல் புனைகதை திரைப்பட வரலாற்றில் பொன்னெழுத்துக்களால் பொறிக்கப்பட வேண்டிய படமாக ‘டூன்: பகுதி 3’ வெளிவந்துள்ளது. அராக்கிஸ் பாலைவனத்தின் மணல் திட்டுக்களும் பிரம்மாண்ட புழுக்களும் ஐமேக்ஸ் திரையில் பார்க்கும்போது கண்களுக்கு விருந்தாகின்றன.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'டூன் 3 திரைப்படத்தின் உலக பிரீமியர் காட்சி',
    photographerCredit: 'Warner Bros / சுடர் சினிமா',
    authorId: 'user-2',
    authorName: 'மதிவதனி செந்தில்நாதன்',
    authorRole: 'செய்தி ஆசிரியர்',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    location: 'லாஸ் ஏஞ்சல்ஸ் & லண்டன்',
    status: 'published',
    publishedAt: '2026-09-27T14:30:00Z',
    updatedAt: '2026-09-27T14:30:00Z',
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    editorPick: false,
    allowComments: true,
    viewCount: 31200,
    shareCount: 1980,
    tags: ['ஹாலிவுட்', 'உலகசினிமா', 'டூன்3', 'Hollywood', 'Dune'],
    seoTitle: 'டூன் 3 ஹாலிவுட் சினிமா விமர்சனம் | Chudar Media',
    seoDescription: 'டெனிஸ் வில்லெனுவின் டூன் 3 முழு திரைப்பட விமர்சனம்.'
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comm-1',
    articleId: 'art-1',
    authorName: 'செல்வகுமார் கார்த்திகேயன்',
    authorEmail: 'selva@cinema.com',
    content: 'விஜய் - வெற்றிமாறன் கூட்டணி தமிழ் சினிமாவின் பாக்ஸ் ஆபீஸ் சாதனைகளை நிச்சயமாக தகர்க்கும்! அனிருத் இசையமைப்பு கூடுதல் போனஸ்.',
    status: 'approved',
    createdAt: '2026-09-28T11:20:00Z',
    likes: 84
  },
  {
    id: 'comm-2',
    articleId: 'art-2',
    authorName: 'தினேஷ் பிரபாகரன் (யாழ்ப்பாணம்)',
    authorEmail: 'dinesh@jaffna.com',
    content: 'மண்ணின் மைந்தன் படம் பார்த்து கண்களில் கண்ணீரே வந்துவிட்டது. ஈழத்து சினிமா இந்த அளவுக்கு உயர்ந்திருப்பது பெருமையாக இருக்கிறது!',
    status: 'approved',
    createdAt: '2026-09-28T12:05:00Z',
    likes: 62
  },
  {
    id: 'comm-3',
    articleId: 'art-5',
    authorName: 'அருண் குமார் (சென்னை)',
    authorEmail: 'arun@chennai.com',
    content: 'ஏகே-வின் விடாமுயற்சி பாக்ஸ் ஆபீஸ் ரெக்கார்டுகளை சுக்குநூறாக உடைத்தெறிந்துள்ளது. திரையரங்குகளில் அனல் பறக்கிறது!',
    status: 'approved',
    createdAt: '2026-09-28T10:45:00Z',
    likes: 45
  }
];

export const INITIAL_ADS: Advertisement[] = [
  {
    id: 'ad-1',
    title: 'தளபதி விஜய் பான்-இந்திய திரைப்படம் – திரையரங்குகளில் உலகளாவிய முன்பதிவு தொடக்கம்!',
    placement: 'home_top',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    targetUrl: 'https://chudarmedia.com/movies/booking',
    active: true,
    impressions: 98500,
    clicks: 4840,
    startDate: '2026-09-01',
    endDate: '2026-10-31',
    clientName: 'Lyca Productions & Sun Pictures'
  },
  {
    id: 'ad-2',
    title: 'விடாமுயற்சி – இலங்கை & தமிழக திரையரங்கு டிக்கெட்டுகள் முன்பதிவு செய்க',
    placement: 'home_sidebar',
    imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80',
    targetUrl: 'https://chudarmedia.com/movies/tickets',
    active: true,
    impressions: 62400,
    clicks: 2960,
    startDate: '2026-09-10',
    endDate: '2026-10-15',
    clientName: 'EAP Theatres & AGS Cinemas'
  },
  {
    id: 'ad-3',
    title: 'சுடர் சினிமா பிரீமியம்: விளம்பரமில்லா விமர்சனங்கள் & விஐபி நேர்காணல்கள்',
    placement: 'article_inline',
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
    targetUrl: 'https://chudarmedia.com/subscribe',
    active: true,
    impressions: 41900,
    clicks: 1810,
    startDate: '2026-08-01',
    endDate: '2026-12-31',
    clientName: 'Chudar Cinema VIP'
  }
];

export const INITIAL_RSS_SOURCES: RssSource[] = [
  {
    id: 'rss-1',
    name: 'கோலிவுட் சினிமா பிரத்யேக செய்திகள்',
    url: 'https://www.cineulagam.com/rss/news',
    categoryId: 'kollywood',
    language: 'ta',
    active: true,
    lastFetched: '2026-09-28T09:00:00Z'
  },
  {
    id: 'rss-2',
    name: 'Behindwoods Tamil Cinema',
    url: 'https://www.behindwoods.com/tamil-movies-cinema-news/rss.xml',
    categoryId: 'kollywood',
    language: 'ta',
    active: true,
    lastFetched: '2026-09-28T08:30:00Z'
  },
  {
    id: 'rss-3',
    name: 'Indiaglitz Tamil Movies',
    url: 'https://www.indiaglitz.com/tamil-cinema-news-rss',
    categoryId: 'kollywood',
    language: 'ta',
    active: true,
    lastFetched: '2026-09-28T10:00:00Z'
  }
];

export const INITIAL_LIVE_STREAM: LiveStreamConfig = {
  id: 'stream-main',
  title: 'சுடர் சினிமா டிவி நேரலை (CHUDAR CINEMA TV LIVE)',
  description: 'கோலிவுட், ஈழத்து சினிமா, சிங்கள சினிமா மற்றும் ஹாலிவுட் சினிமா செய்திகள், விமர்சனங்கள் மற்றும் பிரத்யேக நேர்காணல்கள் 24 மணி நேரமும்!',
  streamType: 'youtube',
  streamUrl: 'https://www.youtube.com/embed/live_stream?channel=UCChudarCinemaLive',
  isLive: true,
  currentProgram: 'சினிமா ரவுண்ட்-அப்: இந்த வார புதிய ரிலீஸ்கள் & பாக்ஸ் ஆபீஸ்',
  presenter: 'ரமேஷ் கார்த்திக் & சரோஜா தர்ஷன்',
  schedule: [
    { time: '09:00 - 10:30', title: 'காலைச் சினிமா மலர்: புதிய டிரெய்லர்கள்', host: 'சரோஜா தர்ஷன்', category: 'டிரெய்லர்' },
    { time: '12:00 - 13:00', title: 'சினிமா கிசுகிசு & சோஷியல் மீடியா ட்ரெண்டிங்', host: 'ரமேஷ் கார்த்திக்', category: 'கிசுகிசு' },
    { time: '16:00 - 17:30', title: 'வெள்ளித்திரை விமர்சனம்: இந்த வார படங்கள்', host: 'மதிவதனி செந்தில்நாதன்', category: 'விமர்சனம்' },
    { time: '19:00 - 20:30', title: 'பிரைம் டைம் செலிபிரிட்டி நேர்காணல்', host: 'முனைவர் க. இளங்கோவன்', category: 'நேர்காணல்' },
    { time: '21:00 - 22:00', title: 'பாக்ஸ் ஆபீஸ் வசூல் வேட்டை சிறப்புப் பார்வை', host: 'ரமேஷ் கார்த்திக்', category: 'பாக்ஸ் ஆபீஸ்' }
  ]
};

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  brandName: 'CHUDAR MEDIA',
  brandNameTa: 'சுடர் மீடியா சினிமா',
  tagline: 'சினிமாவின் ஒளி... ரசிகர்களின் குரல்!',
  taglineEn: 'The Pulse of Tamil & Global Cinema!',
  logoUrl: '', // Can be customized by the user in admin panel
  editorInChief: 'முனைவர் க. இளங்கோவன்',
  contactEmail: 'cinema@chudarmedia.com',
  contactPhone: '+94 11 234 5678 / +91 44 8765 4321',
  address: 'சுடர் மீடியா பிலிம் சிட்டி ஹவுஸ், காலி வீதி, கொழும்பு 03 | வடபழனி, சென்னை 600026',
  socialLinks: {
    facebook: 'https://facebook.com/chudarmedia',
    twitter: 'https://x.com/chudarmedia',
    youtube: 'https://youtube.com/@chudarmedia',
    whatsapp: 'https://whatsapp.com/channel/chudarmedia',
    telegram: 'https://t.me/chudarmedia',
    instagram: 'https://instagram.com/chudarmedia'
  },
  liveTvEnabled: true,
  commentsRequireApproval: true,
  firebaseConnected: false
};

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'med-1',
    url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    title: 'Thalapathy Vijay Movie Poster Stills',
    altText: 'Tamil cinema hero action movie stills',
    caption: 'தளபதி விஜய் புதிய பட அறிவிப்பு போஸ்டர்',
    fileType: 'image',
    size: '1.8 MB',
    folder: 'Kollywood',
    uploadedAt: '2026-09-28'
  },
  {
    id: 'med-2',
    url: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=1200&q=80',
    title: 'Mannin Mainthan Eelam Cinema Stills',
    altText: 'Sri Lankan Tamil cinema production stills',
    caption: 'மண்ணின் மைந்தன் திரைப்படக் காட்சி',
    fileType: 'image',
    size: '1.4 MB',
    folder: 'Sri Lankan Cinema',
    uploadedAt: '2026-09-28'
  },
  {
    id: 'med-3',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    title: 'Nayanthara Photoshoot Glamour Stills',
    altText: 'Nayanthara portrait celebrity photo',
    caption: 'நயன்தாரா பிரத்யேக நேர்காணல் புகைப்படங்கள்',
    fileType: 'image',
    size: '2.1 MB',
    folder: 'Celebrity Photos',
    uploadedAt: '2026-09-27'
  }
];

export const INITIAL_VIDEO_TRAILERS: VideoTrailer[] = [
  {
    id: 'vid-1',
    title: 'கமல் ஹாசன் - மணிரத்னம் ‘தக் லைஃப்’ அதிகாரப்பூர்வ அதிரடி டிரெய்லர்',
    titleEn: 'Kamal Haasan - Mani Ratnam Thug Life Official Action Trailer',
    duration: '02:45',
    thumbnail: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=800&q=80',
    embedId: 'dQw4w9WgXcQ',
    category: 'டிரெய்லர்',
    order: 1
  },
  {
    id: 'vid-2',
    title: 'விடாமுயற்சி படப்பிடிப்பு சுவாரசியங்கள்: அனிருத் பிரத்யேக பேட்டி',
    titleEn: 'Anirudh Exclusive Talk on Vidaamuyarchi BGM & Songs',
    duration: '08:20',
    thumbnail: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    embedId: 'dQw4w9WgXcQ',
    category: 'வீடியோ பேட்டி',
    order: 2
  },
  {
    id: 'vid-3',
    title: 'ஈழத்து கலைப்படைப்பு ‘மண்ணின் மைந்தன்’ டீசர் மற்றும் பாடல் வெளியீடு',
    titleEn: 'Mannin Mainthan Official Teaser & Soundtrack Launch',
    duration: '03:15',
    thumbnail: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=800&q=80',
    embedId: 'dQw4w9WgXcQ',
    category: 'டீசர்',
    order: 3
  }
];
