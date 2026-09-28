import React from 'react';
import { ShieldCheck, Mail, Phone, MapPin, Award, CheckCircle, ArrowLeft } from 'lucide-react';
import { SiteSettings } from '../types';

interface StaticPagesProps {
  pageType: 'about' | 'editorial-policy' | 'advertise' | 'contact' | 'privacy' | 'terms';
  siteSettings: SiteSettings;
  onBack: () => void;
  language: 'ta' | 'en';
}

export const StaticPages: React.FC<StaticPagesProps> = ({
  pageType,
  siteSettings,
  onBack,
  language
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-[#C8102E] transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>முகப்புக்குத் திரும்புக (Back to Home)</span>
      </button>

      {/* Page Content Switcher */}
      {pageType === 'about' && (
        <div className="bg-white border border-neutral-200 p-6 sm:p-10 rounded-sm">
          <div className="flex items-center gap-2 text-[#C8102E] font-bold text-xs uppercase tracking-wider mb-2">
            <Award className="w-4 h-4" />
            <span>சுடர் மீடியா அறிமுகம்</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-tamil text-neutral-900 mb-6">
            எங்களைப் பற்றி (About Chudar Media)
          </h1>

          <div className="space-y-4 text-sm sm:text-base text-neutral-700 leading-relaxed">
            <p className="font-medium text-lg text-neutral-900">
              "உண்மையின் ஒளி... மக்களின் குரல்!" என்ற உயரிய தாரக மந்திரத்துடன் உருவான சர்வதேச தமிழ் செய்தி இணையத்தளமே சுடர் மீடியா (CHUDAR MEDIA).
            </p>
            <p>
              இலங்கை, தமிழ்நாடு, இந்தியா மற்றும் உலகம் முழுவதும் பரந்து வாழும் தமிழ் மக்களுக்கு நடுநிலையான, துல்லியமான, பக்கச்சார்பற்ற செய்திகளையும் ஆழமான கள ஆய்வுகளையும் 24 மணி நேரமும் வழங்குவதே எமது முதன்மையான நோக்கமாகும்.
            </p>
            <h3 className="text-lg font-bold text-neutral-900 pt-4">எமது கொள்கைகள்:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>துல்லியமும் சரிபார்ப்பும்:</strong> வதந்திகளுக்கு இடமளிக்காமல் நம்பகமான ஆதாரங்களுடன் கூடிய செய்திகளை மட்டுமே வெளியிடுதல்.</li>
              <li><strong>மக்களின் குரல்:</strong> விளிம்புநிலை மக்களின் பிரச்சினைகள், வாழ்வியல் சவால்கள் மற்றும் உரிமைகளுக்காக சமரசமின்றி ஒலித்தல்.</li>
              <li><strong>நவீன தொழில்நுட்பப் பயன்பாடு:</strong> அதிநவீன டிஜிட்டல் தளம், மொபைல் பயன்பாடு மற்றும் நேரலை வீடியோ தரம்.</li>
            </ul>
          </div>
        </div>
      )}

      {pageType === 'editorial-policy' && (
        <div className="bg-white border border-neutral-200 p-6 sm:p-10 rounded-sm">
          <div className="flex items-center gap-2 text-[#C8102E] font-bold text-xs uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>ஊடக நெறிமுறைகள்</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-tamil text-neutral-900 mb-6">
            ஆசிரியர் கொள்கை & ஊடக தர்மம் (Editorial Charter)
          </h1>

          <div className="space-y-4 text-sm sm:text-base text-neutral-700 leading-relaxed">
            <p>
              சுடர் மீடியா சர்வதேச பத்திரிகைச் சட்டங்கள், ஊடக அறநெறி கோட்பாடுகள் மற்றும் மனித உரிமைகள் பிரகடனங்களை முழுமையாக மதித்து இயங்குகிறது.
            </p>
            <div className="p-4 bg-neutral-50 border-l-4 border-[#C8102E] rounded-r-sm">
              <h4 className="font-bold text-neutral-900 mb-1">உண்மை சரிபார்ப்பு (Fact Checking):</h4>
              <p className="text-sm">
                எந்தவொரு முக்கிய செய்தியும் குறைந்தபட்சம் இரண்டு நம்பகமான முதன்மை ஆதாரங்கள் மூலம் சரிபார்க்கப்பட்ட பின்னரே ஆசிரியர் குழுவால் பிரசுரிக்க அனுமதிக்கப்படும்.
              </p>
            </div>
            <div className="p-4 bg-neutral-50 border-l-4 border-neutral-800 rounded-r-sm">
              <h4 className="font-bold text-neutral-900 mb-1">பிழை திருத்தக் கொள்கை (Correction Policy):</h4>
              <p className="text-sm">
                செய்திகளில் பிழைகள் அல்லது தவறுதலான தகவல்கள் கண்டறியப்பட்டால், வெளிப்படையாக திருத்தம் செய்யப்பட்டு வாசகர்களுக்கு தெரியப்படுத்தப்படும்.
              </p>
            </div>
            <div className="p-4 bg-neutral-50 border-l-4 border-amber-600 rounded-r-sm">
              <h4 className="font-bold text-neutral-900 mb-1">படைப்பாற்றல் & பதிப்புரிமை (Copyright):</h4>
              <p className="text-sm">
                அனைத்து புகைப்படங்கள், வீடியோக்கள் மற்றும் மூலத் தகவல்களுக்கான உரிய நிருபர் மற்றும் நிறுவன உரிமங்கள் வெளிப்படையாக குறிப்பிடப்படுகின்றன.
              </p>
            </div>
          </div>
        </div>
      )}

      {pageType === 'advertise' && (
        <div className="bg-white border border-neutral-200 p-6 sm:p-10 rounded-sm">
          <div className="flex items-center gap-2 text-[#C8102E] font-bold text-xs uppercase tracking-wider mb-2">
            <span>வணிக வாய்ப்புகள்</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-tamil text-neutral-900 mb-4">
            சுடர் மீடியாவில் விளம்பரம் செய்ய (Advertise With Us)
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-6">
            இலங்கை, தமிழ்நாடு மற்றும் சர்வதேச தமிழ் வாடிக்கையாளர்களை ஒரே இடத்தில் சென்றடைய சுடர் மீடியா உங்களின் சிறந்த டிஜிட்டல் விளம்பர கூட்டாளி.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded text-center">
              <div className="text-2xl font-black font-mono text-[#C8102E]">500,000+</div>
              <div className="text-xs font-semibold text-neutral-700 mt-1">மாதாந்திர வாசகர்கள்</div>
            </div>
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded text-center">
              <div className="text-2xl font-black font-mono text-neutral-900">45+</div>
              <div className="text-xs font-semibold text-neutral-700 mt-1">நாடுகளில் உலகளாவிய வாசகர்கள்</div>
            </div>
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded text-center">
              <div className="text-2xl font-black font-mono text-[#C8102E]">88%</div>
              <div className="text-xs font-semibold text-neutral-700 mt-1">மொபைல் பயன்பாட்டு ஈடுபாடு</div>
            </div>
          </div>

          <div className="bg-neutral-50 p-6 rounded border border-neutral-200">
            <h3 className="font-bold text-base text-neutral-900 mb-2">விளம்பர முன்பதிவு தொடர்பு:</h3>
            <p className="text-sm text-neutral-600 mb-4">
              தனிப்பயனாக்கப்பட்ட விளம்பரப் பதாகைகள் (Top Leaderboard, Sidebar Rectangle, Sponsored Articles, Video Pre-roll) பற்றிய கட்டண விபரங்களுக்கு எமது வணிகப் பிரிவை தொடர்பு கொள்ளவும்:
            </p>
            <div className="flex flex-col gap-2 text-sm font-medium">
              <div>மின்னஞ்சல்: <a href="mailto:ads@chudarmedia.com" className="text-[#C8102E] underline">ads@chudarmedia.com</a></div>
              <div>தொலைபேசி (இலங்கை): +94 11 234 5678</div>
              <div>தொலைபேசி (இந்தியா): +91 44 8765 4321</div>
            </div>
          </div>
        </div>
      )}

      {pageType === 'contact' && (
        <div className="bg-white border border-neutral-200 p-6 sm:p-10 rounded-sm">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-tamil text-neutral-900 mb-6">
            எங்களைத் தொடர்பு கொள்ள (Contact Chudar Media)
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 text-sm text-neutral-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C8102E] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-neutral-900">பிரதான அலுவலக முகவரிகள்:</h4>
                  <p className="text-neutral-600 mt-1">{siteSettings.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#C8102E] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-neutral-900">மின்னஞ்சல் தொடர்புகள்:</h4>
                  <p className="text-neutral-600 mt-1">
                    செய்திப் பிரிவு: news@chudarmedia.com<br />
                    ஆசிரியர்: editor@chudarmedia.com<br />
                    விளம்பரங்கள்: ads@chudarmedia.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#C8102E] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-neutral-900">தொலைபேசி எண்கள்:</h4>
                  <p className="text-neutral-600 mt-1">{siteSettings.contactPhone}</p>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="bg-neutral-50 p-5 rounded border border-neutral-200">
              <h3 className="font-bold text-sm text-neutral-900 mb-3">செய்தி அல்லது தகவல் அனுப்ப</h3>
              <form onSubmit={(e) => { e.preventDefault(); alert('உங்கள் செய்தி ஆசிரியர் குழுவுக்கு அனுப்பப்பட்டது. நன்றி!'); }} className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">பெயர்</label>
                  <input required type="text" placeholder="உங்கள் பெயர்" className="w-full p-2 border border-neutral-300 rounded bg-white" />
                </div>
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">மின்னஞ்சல்</label>
                  <input required type="email" placeholder="email@example.com" className="w-full p-2 border border-neutral-300 rounded bg-white" />
                </div>
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">செய்தி / குறிப்பு</label>
                  <textarea required rows={3} placeholder="செய்தி குறிப்பு விவரம்..." className="w-full p-2 border border-neutral-300 rounded bg-white" />
                </div>
                <button type="submit" className="w-full py-2 bg-[#C8102E] text-white font-bold rounded cursor-pointer hover:bg-[#a50d25]">
                  செய்தியை அனுப்புக
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {(pageType === 'privacy' || pageType === 'terms') && (
        <div className="bg-white border border-neutral-200 p-6 sm:p-10 rounded-sm">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-tamil text-neutral-900 mb-4">
            {pageType === 'privacy' ? 'தனியுரிமைக் கொள்கை (Privacy Policy)' : 'விதிமுறைகளும் நிபந்தனைகளும் (Terms of Service)'}
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-4">
            சுடர் மீடியா வாசகர்களின் தனிப்பட்ட தரவுகளின் பாதுகாப்பை உறுதிப்படுத்துகிறது. இணையதளத்தைப் பயன்படுத்தும் போது சேகரிக்கப்படும் தொழில்நுட்ப விவரங்கள் (Cookies, Analytics) வாசகர் அனுபவத்தை மேம்படுத்த மட்டுமே பயன்படுத்தப்படுகின்றன.
          </p>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            எங்கள் இணையதளத்தில் உள்ள அனைத்து செய்திப் படைப்புகளும் பதிப்புரிமை சட்டத்திற்கு உட்பட்டவை. முன் அனுமதியின்றி வணிக ரீதியாக மறுபிரசுரம் செய்வது தடை செய்யப்பட்டுள்ளது.
          </p>
        </div>
      )}
    </div>
  );
};
