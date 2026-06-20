/**
 * World Countries Database - Complete list of countries with flags and basic data
 * Designed for global geopolitical simulation - any country can be sanctioned
 */

export interface WorldCountry {
    id: string;
    name: string;
    flag: string;
    region: 'europe' | 'asia' | 'africa' | 'north_america' | 'south_america' | 'oceania' | 'middle_east';
    position: { lat: number; lng: number };
    influence: number;      // 0-100, global power
    stability: number;      // 0-100, internal stability
    economicPower: number;  // 0-100
    militaryPower: number;  // 0-100
    color: string;
    isGlobalHub?: boolean;  // [Refinement]
}

// Complete world countries database
export const worldCountries: WorldCountry[] = [
    // ============ EUROPE ============
    { id: 'albania', name: 'Albania', flag: '🇦🇱', region: 'europe', position: { lat: 41.1533, lng: 20.1683 }, influence: 15, stability: 65, economicPower: 20, militaryPower: 15, color: '#E41B17' },
    { id: 'andorra', name: 'Andorra', flag: '🇦🇩', region: 'europe', position: { lat: 42.5063, lng: 1.5218 }, influence: 5, stability: 95, economicPower: 30, militaryPower: 5, color: '#0000FF' },
    { id: 'austria', name: 'Austria', flag: '🇦🇹', region: 'europe', position: { lat: 47.5162, lng: 14.5501 }, influence: 35, stability: 90, economicPower: 60, militaryPower: 25, color: '#ED2939' },
    { id: 'belarus', name: 'Belarus', flag: '🇧🇾', region: 'europe', position: { lat: 53.9006, lng: 27.5590 }, influence: 20, stability: 55, economicPower: 25, militaryPower: 30, color: '#CF142B' },
    { id: 'belgium', name: 'Belgium', flag: '🇧🇪', region: 'europe', position: { lat: 50.5039, lng: 4.4699 }, influence: 40, stability: 85, economicPower: 65, militaryPower: 30, color: '#FDDA24' },
    { id: 'bosnia', name: 'Bosnia & Herzegovina', flag: '🇧🇦', region: 'europe', position: { lat: 43.9159, lng: 17.6791 }, influence: 12, stability: 55, economicPower: 18, militaryPower: 12, color: '#002395' },
    { id: 'bulgaria', name: 'Bulgaria', flag: '🇧🇬', region: 'europe', position: { lat: 42.7339, lng: 25.4858 }, influence: 22, stability: 70, economicPower: 30, militaryPower: 25, color: '#00966E' },
    { id: 'croatia', name: 'Croatia', flag: '🇭🇷', region: 'europe', position: { lat: 45.1, lng: 15.2 }, influence: 20, stability: 75, economicPower: 32, militaryPower: 22, color: '#FF0000' },
    { id: 'czech', name: 'Czech Republic', flag: '🇨🇿', region: 'europe', position: { lat: 49.8175, lng: 15.4730 }, influence: 28, stability: 85, economicPower: 50, militaryPower: 30, color: '#11457E' },
    { id: 'denmark', name: 'Denmark', flag: '🇩🇰', region: 'europe', position: { lat: 56.2639, lng: 9.5018 }, influence: 35, stability: 95, economicPower: 55, militaryPower: 30, color: '#C60C30' },
    { id: 'estonia', name: 'Estonia', flag: '🇪🇪', region: 'europe', position: { lat: 58.5953, lng: 25.0136 }, influence: 18, stability: 88, economicPower: 35, militaryPower: 20, color: '#4891D9' },
    { id: 'finland', name: 'Finland', flag: '🇫🇮', region: 'europe', position: { lat: 61.9241, lng: 25.7482 }, influence: 32, stability: 95, economicPower: 52, militaryPower: 35, color: '#003580' },
    { id: 'france', name: 'France', flag: '🇫🇷', region: 'europe', position: { lat: 48.8566, lng: 2.3522 }, influence: 70, stability: 80, economicPower: 75, militaryPower: 75, color: '#0055A4' },
    { id: 'germany', name: 'Germany', flag: '🇩🇪', region: 'europe', position: { lat: 52.5200, lng: 13.4050 }, influence: 75, stability: 90, economicPower: 85, militaryPower: 50, color: '#FFCC00', isGlobalHub: true },
    { id: 'greece', name: 'Greece', flag: '🇬🇷', region: 'europe', position: { lat: 37.9838, lng: 23.7275 }, influence: 30, stability: 65, economicPower: 35, militaryPower: 35, color: '#0D5EAF' },
    { id: 'hungary', name: 'Hungary', flag: '🇭🇺', region: 'europe', position: { lat: 47.1625, lng: 19.5033 }, influence: 25, stability: 70, economicPower: 40, militaryPower: 25, color: '#436F4D' },
    { id: 'iceland', name: 'Iceland', flag: '🇮🇸', region: 'europe', position: { lat: 64.9631, lng: -19.0208 }, influence: 15, stability: 98, economicPower: 40, militaryPower: 10, color: '#02529C' },
    { id: 'ireland', name: 'Ireland', flag: '🇮🇪', region: 'europe', position: { lat: 53.1424, lng: -7.6921 }, influence: 30, stability: 92, economicPower: 55, militaryPower: 15, color: '#169B62' },
    { id: 'italy', name: 'Italy', flag: '🇮🇹', region: 'europe', position: { lat: 41.9028, lng: 12.4964 }, influence: 55, stability: 70, economicPower: 65, militaryPower: 45, color: '#009246' },
    { id: 'latvia', name: 'Latvia', flag: '🇱🇻', region: 'europe', position: { lat: 56.8796, lng: 24.6032 }, influence: 15, stability: 82, economicPower: 30, militaryPower: 18, color: '#9E3039' },
    { id: 'lithuania', name: 'Lithuania', flag: '🇱🇹', region: 'europe', position: { lat: 55.1694, lng: 23.8813 }, influence: 18, stability: 85, economicPower: 35, militaryPower: 22, color: '#006A44' },
    { id: 'luxembourg', name: 'Luxembourg', flag: '🇱🇺', region: 'europe', position: { lat: 49.8153, lng: 6.1296 }, influence: 20, stability: 98, economicPower: 60, militaryPower: 8, color: '#00A1DE' },
    { id: 'malta', name: 'Malta', flag: '🇲🇹', region: 'europe', position: { lat: 35.9375, lng: 14.3754 }, influence: 10, stability: 88, economicPower: 30, militaryPower: 8, color: '#CE2027' },
    { id: 'moldova', name: 'Moldova', flag: '🇲🇩', region: 'europe', position: { lat: 47.4116, lng: 28.3699 }, influence: 10, stability: 50, economicPower: 15, militaryPower: 10, color: '#003DA5' },
    { id: 'monaco', name: 'Monaco', flag: '🇲🇨', region: 'europe', position: { lat: 43.7384, lng: 7.4246 }, influence: 8, stability: 98, economicPower: 50, militaryPower: 5, color: '#CE1126' },
    { id: 'montenegro', name: 'Montenegro', flag: '🇲🇪', region: 'europe', position: { lat: 42.7087, lng: 19.3744 }, influence: 10, stability: 70, economicPower: 18, militaryPower: 12, color: '#D4AF37' },
    { id: 'netherlands', name: 'Netherlands', flag: '🇳🇱', region: 'europe', position: { lat: 52.1326, lng: 5.2913 }, influence: 45, stability: 92, economicPower: 70, militaryPower: 35, color: '#FF6700' },
    { id: 'north_macedonia', name: 'North Macedonia', flag: '🇲🇰', region: 'europe', position: { lat: 41.5124, lng: 21.4254 }, influence: 12, stability: 65, economicPower: 18, militaryPower: 12, color: '#CE2027' },
    { id: 'norway', name: 'Norway', flag: '🇳🇴', region: 'europe', position: { lat: 60.4720, lng: 8.4689 }, influence: 40, stability: 98, economicPower: 65, militaryPower: 35, color: '#BA0C2F' },
    { id: 'poland', name: 'Poland', flag: '🇵🇱', region: 'europe', position: { lat: 51.9194, lng: 19.1451 }, influence: 45, stability: 82, economicPower: 55, militaryPower: 45, color: '#DC143C' },
    { id: 'portugal', name: 'Portugal', flag: '🇵🇹', region: 'europe', position: { lat: 39.3999, lng: -8.2245 }, influence: 30, stability: 85, economicPower: 40, militaryPower: 25, color: '#006600' },
    { id: 'romania', name: 'Romania', flag: '🇷🇴', region: 'europe', position: { lat: 45.9432, lng: 24.9668 }, influence: 28, stability: 72, economicPower: 38, militaryPower: 30, color: '#002B7F' },
    { id: 'russia', name: 'Russia', flag: '🇷🇺', region: 'europe', position: { lat: 55.7558, lng: 37.6173 }, influence: 85, stability: 75, economicPower: 60, militaryPower: 90, color: '#D52B1E', isGlobalHub: true },
    { id: 'serbia', name: 'Serbia', flag: '🇷🇸', region: 'europe', position: { lat: 44.0165, lng: 21.0059 }, influence: 20, stability: 65, economicPower: 28, militaryPower: 25, color: '#C6363C' },
    { id: 'slovakia', name: 'Slovakia', flag: '🇸🇰', region: 'europe', position: { lat: 48.6690, lng: 19.6990 }, influence: 22, stability: 78, economicPower: 38, militaryPower: 22, color: '#0B4EA2' },
    { id: 'slovenia', name: 'Slovenia', flag: '🇸🇮', region: 'europe', position: { lat: 46.1512, lng: 14.9955 }, influence: 18, stability: 88, economicPower: 42, militaryPower: 18, color: '#005DA4' },
    { id: 'spain', name: 'Spain', flag: '🇪🇸', region: 'europe', position: { lat: 40.4168, lng: -3.7038 }, influence: 50, stability: 75, economicPower: 58, militaryPower: 40, color: '#F1BF00' },
    { id: 'sweden', name: 'Sweden', flag: '🇸🇪', region: 'europe', position: { lat: 60.1282, lng: 18.6435 }, influence: 42, stability: 95, economicPower: 62, militaryPower: 38, color: '#006AA7' },
    { id: 'switzerland', name: 'Switzerland', flag: '🇨🇭', region: 'europe', position: { lat: 46.8182, lng: 8.2275 }, influence: 45, stability: 98, economicPower: 75, militaryPower: 25, color: '#FF0000' },
    { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', region: 'europe', position: { lat: 51.5074, lng: -0.1278 }, influence: 68, stability: 78, economicPower: 72, militaryPower: 70, color: '#00247D' },
    { id: 'san_marino', name: 'San Marino', flag: '🇸🇲', region: 'europe', position: { lat: 43.9424, lng: 12.4578 }, influence: 5, stability: 98, economicPower: 25, militaryPower: 5, color: '#00A1DE' },
    { id: 'vatican_city', name: 'Vatican City', flag: '🇻🇦', region: 'europe', position: { lat: 41.9029, lng: 12.4534 }, influence: 20, stability: 98, economicPower: 15, militaryPower: 5, color: '#FFD700' },
    { id: 'ukraine', name: 'Ukraine', flag: '🇺🇦', region: 'europe', position: { lat: 50.4501, lng: 30.5234 }, influence: 35, stability: 45, economicPower: 30, militaryPower: 55, color: '#005BBB' },

    // ============ ASIA ============
    { id: 'afghanistan', name: 'Afghanistan', flag: '🇦🇫', region: 'asia', position: { lat: 33.9391, lng: 67.7100 }, influence: 15, stability: 25, economicPower: 10, militaryPower: 25, color: '#000000' },
    { id: 'armenia', name: 'Armenia', flag: '🇦🇲', region: 'asia', position: { lat: 40.0691, lng: 45.0382 }, influence: 12, stability: 55, economicPower: 18, militaryPower: 20, color: '#D90012' },
    { id: 'azerbaijan', name: 'Azerbaijan', flag: '🇦🇿', region: 'asia', position: { lat: 40.1431, lng: 47.5769 }, influence: 25, stability: 65, economicPower: 35, militaryPower: 35, color: '#3F9F3F' },
    { id: 'bangladesh', name: 'Bangladesh', flag: '🇧🇩', region: 'asia', position: { lat: 23.6850, lng: 90.3563 }, influence: 28, stability: 60, economicPower: 32, militaryPower: 25, color: '#006A4E' },
    { id: 'bhutan', name: 'Bhutan', flag: '🇧🇹', region: 'asia', position: { lat: 27.5142, lng: 90.4336 }, influence: 8, stability: 85, economicPower: 12, militaryPower: 8, color: '#FF6319' },
    { id: 'brunei', name: 'Brunei', flag: '🇧🇳', region: 'asia', position: { lat: 4.5353, lng: 114.7277 }, influence: 15, stability: 88, economicPower: 45, militaryPower: 15, color: '#F7E017' },
    { id: 'cambodia', name: 'Cambodia', flag: '🇰🇭', region: 'asia', position: { lat: 12.5657, lng: 104.9910 }, influence: 15, stability: 55, economicPower: 20, militaryPower: 18, color: '#032EA1' },
    { id: 'china', name: 'China', flag: '🇨🇳', region: 'asia', position: { lat: 35.8617, lng: 104.1954 }, influence: 95, stability: 80, economicPower: 95, militaryPower: 88, color: '#DE2910', isGlobalHub: true },
    { id: 'georgia', name: 'Georgia', flag: '🇬🇪', region: 'asia', position: { lat: 42.3154, lng: 43.3569 }, influence: 15, stability: 58, economicPower: 22, militaryPower: 18, color: '#FF0000' },
    { id: 'india', name: 'India', flag: '🇮🇳', region: 'asia', position: { lat: 20.5937, lng: 78.9629 }, influence: 75, stability: 68, economicPower: 70, militaryPower: 72, color: '#FF9933' },
    { id: 'indonesia', name: 'Indonesia', flag: '🇮🇩', region: 'asia', position: { lat: -0.7893, lng: 113.9213 }, influence: 45, stability: 70, economicPower: 50, militaryPower: 40, color: '#CE1126' },
    { id: 'japan', name: 'Japan', flag: '🇯🇵', region: 'asia', position: { lat: 36.2048, lng: 138.2529 }, influence: 70, stability: 92, economicPower: 80, militaryPower: 55, color: '#BC002D' },
    { id: 'kazakhstan', name: 'Kazakhstan', flag: '🇰🇿', region: 'asia', position: { lat: 48.0196, lng: 66.9237 }, influence: 35, stability: 70, economicPower: 42, militaryPower: 35, color: '#00AFCA' },
    { id: 'kyrgyzstan', name: 'Kyrgyzstan', flag: '🇰🇬', region: 'asia', position: { lat: 41.2044, lng: 74.7661 }, influence: 12, stability: 55, economicPower: 15, militaryPower: 15, color: '#FF0000' },
    { id: 'laos', name: 'Laos', flag: '🇱🇦', region: 'asia', position: { lat: 19.8563, lng: 102.4955 }, influence: 12, stability: 65, economicPower: 15, militaryPower: 15, color: '#CE1126' },
    { id: 'malaysia', name: 'Malaysia', flag: '🇲🇾', region: 'asia', position: { lat: 4.2105, lng: 101.9758 }, influence: 38, stability: 75, economicPower: 52, militaryPower: 35, color: '#010066' },
    { id: 'maldives', name: 'Maldives', flag: '🇲🇻', region: 'asia', position: { lat: 3.2028, lng: 73.2207 }, influence: 8, stability: 70, economicPower: 20, militaryPower: 8, color: '#D21034' },
    { id: 'mongolia', name: 'Mongolia', flag: '🇲🇳', region: 'asia', position: { lat: 46.8625, lng: 103.8467 }, influence: 15, stability: 72, economicPower: 20, militaryPower: 18, color: '#DA2032' },
    { id: 'myanmar', name: 'Myanmar', flag: '🇲🇲', region: 'asia', position: { lat: 21.9162, lng: 95.9560 }, influence: 18, stability: 35, economicPower: 22, militaryPower: 30, color: '#FECB00' },
    { id: 'nepal', name: 'Nepal', flag: '🇳🇵', region: 'asia', position: { lat: 28.3949, lng: 84.1240 }, influence: 12, stability: 55, economicPower: 15, militaryPower: 15, color: '#DC143C' },
    { id: 'north_korea', name: 'North Korea', flag: '🇰🇵', region: 'asia', position: { lat: 40.3399, lng: 127.5101 }, influence: 25, stability: 68, economicPower: 15, militaryPower: 55, color: '#C40233' },
    { id: 'pakistan', name: 'Pakistan', flag: '🇵🇰', region: 'asia', position: { lat: 30.3753, lng: 69.3451 }, influence: 42, stability: 50, economicPower: 35, militaryPower: 55, color: '#006600' },
    { id: 'philippines', name: 'Philippines', flag: '🇵🇭', region: 'asia', position: { lat: 12.8797, lng: 121.7740 }, influence: 30, stability: 62, economicPower: 38, militaryPower: 28, color: '#0038A8' },
    { id: 'singapore', name: 'Singapore', flag: '🇸🇬', region: 'asia', position: { lat: 1.3521, lng: 103.8198 }, influence: 45, stability: 95, economicPower: 72, militaryPower: 35, color: '#ED2939' },
    { id: 'south_korea', name: 'South Korea', flag: '🇰🇷', region: 'asia', position: { lat: 35.9078, lng: 127.7669 }, influence: 55, stability: 85, economicPower: 70, militaryPower: 55, color: '#0047A0' },
    { id: 'sri_lanka', name: 'Sri Lanka', flag: '🇱🇰', region: 'asia', position: { lat: 7.8731, lng: 80.7718 }, influence: 18, stability: 50, economicPower: 22, militaryPower: 20, color: '#8D153A' },
    { id: 'taiwan', name: 'Taiwan', flag: '🇹🇼', region: 'asia', position: { lat: 23.6978, lng: 120.9605 }, influence: 45, stability: 85, economicPower: 65, militaryPower: 45, color: '#FE0000' },
    { id: 'tajikistan', name: 'Tajikistan', flag: '🇹🇯', region: 'asia', position: { lat: 38.8610, lng: 71.2761 }, influence: 10, stability: 55, economicPower: 12, militaryPower: 15, color: '#006600' },
    { id: 'thailand', name: 'Thailand', flag: '🇹🇭', region: 'asia', position: { lat: 15.8700, lng: 100.9925 }, influence: 38, stability: 65, economicPower: 48, militaryPower: 38, color: '#A51931' },
    { id: 'turkmenistan', name: 'Turkmenistan', flag: '🇹🇲', region: 'asia', position: { lat: 38.9697, lng: 59.5563 }, influence: 18, stability: 70, economicPower: 30, militaryPower: 20, color: '#00843D' },
    { id: 'uzbekistan', name: 'Uzbekistan', flag: '🇺🇿', region: 'asia', position: { lat: 41.3775, lng: 64.5853 }, influence: 22, stability: 68, economicPower: 28, militaryPower: 28, color: '#1EB53A' },
    { id: 'vietnam', name: 'Vietnam', flag: '🇻🇳', region: 'asia', position: { lat: 14.0583, lng: 108.2772 }, influence: 35, stability: 75, economicPower: 42, militaryPower: 38, color: '#DA251D' },

    // ============ MIDDLE EAST ============
    { id: 'bahrain', name: 'Bahrain', flag: '🇧🇭', region: 'middle_east', position: { lat: 26.0667, lng: 50.5577 }, influence: 22, stability: 72, economicPower: 42, militaryPower: 22, color: '#CE1126' },
    { id: 'cyprus', name: 'Cyprus', flag: '🇨🇾', region: 'middle_east', position: { lat: 35.1264, lng: 33.4299 }, influence: 18, stability: 75, economicPower: 35, militaryPower: 18, color: '#D57800' },
    { id: 'egypt', name: 'Egypt', flag: '🇪🇬', region: 'middle_east', position: { lat: 26.8206, lng: 30.8025 }, influence: 45, stability: 58, economicPower: 38, militaryPower: 50, color: '#CE1126' },
    { id: 'iran', name: 'Iran', flag: '🇮🇷', region: 'middle_east', position: { lat: 32.4279, lng: 53.6880 }, influence: 55, stability: 55, economicPower: 45, militaryPower: 60, color: '#239F40' },
    { id: 'iraq', name: 'Iraq', flag: '🇮🇶', region: 'middle_east', position: { lat: 33.2232, lng: 43.6793 }, influence: 32, stability: 40, economicPower: 35, militaryPower: 35, color: '#CE1126' },
    { id: 'israel', name: 'Israel', flag: '🇮🇱', region: 'middle_east', position: { lat: 31.0461, lng: 34.8516 }, influence: 55, stability: 72, economicPower: 60, militaryPower: 70, color: '#0038B8' },
    { id: 'jordan', name: 'Jordan', flag: '🇯🇴', region: 'middle_east', position: { lat: 30.5852, lng: 36.2384 }, influence: 22, stability: 68, economicPower: 28, militaryPower: 28, color: '#007A33' },
    { id: 'kuwait', name: 'Kuwait', flag: '🇰🇼', region: 'middle_east', position: { lat: 29.3117, lng: 47.4818 }, influence: 32, stability: 78, economicPower: 55, militaryPower: 28, color: '#007A33' },
    { id: 'lebanon', name: 'Lebanon', flag: '🇱🇧', region: 'middle_east', position: { lat: 33.8547, lng: 35.8623 }, influence: 18, stability: 35, economicPower: 22, militaryPower: 20, color: '#00A651' },
    { id: 'oman', name: 'Oman', flag: '🇴🇲', region: 'middle_east', position: { lat: 21.4735, lng: 55.9754 }, influence: 25, stability: 82, economicPower: 42, militaryPower: 28, color: '#DB161B' },
    { id: 'palestine', name: 'Palestine', flag: '🇵🇸', region: 'middle_east', position: { lat: 31.9522, lng: 35.2332 }, influence: 12, stability: 30, economicPower: 10, militaryPower: 12, color: '#006600' },
    { id: 'qatar', name: 'Qatar', flag: '🇶🇦', region: 'middle_east', position: { lat: 25.3548, lng: 51.1839 }, influence: 42, stability: 88, economicPower: 68, militaryPower: 30, color: '#8D1B3D' },
    { id: 'saudi_arabia', name: 'Saudi Arabia', flag: '🇸🇦', region: 'middle_east', position: { lat: 23.8859, lng: 45.0792 }, influence: 68, stability: 72, economicPower: 72, militaryPower: 55, color: '#006C35' },
    { id: 'syria', name: 'Syria', flag: '🇸🇾', region: 'middle_east', position: { lat: 34.8021, lng: 38.9968 }, influence: 18, stability: 25, economicPower: 15, militaryPower: 35, color: '#CE1126' },
    { id: 'turkey', name: 'Turkey', flag: '🇹🇷', region: 'middle_east', position: { lat: 38.9637, lng: 35.2433 }, influence: 55, stability: 65, economicPower: 50, militaryPower: 65, color: '#E30A17', isGlobalHub: true },
    { id: 'uae', name: 'UAE', flag: '🇦🇪', region: 'middle_east', position: { lat: 23.4241, lng: 53.8478 }, influence: 52, stability: 88, economicPower: 68, militaryPower: 45, color: '#00732F' },
    { id: 'yemen', name: 'Yemen', flag: '🇾🇪', region: 'middle_east', position: { lat: 15.5527, lng: 48.5164 }, influence: 12, stability: 20, economicPower: 10, militaryPower: 22, color: '#CE1126' },

    // ============ AFRICA ============
    { id: 'algeria', name: 'Algeria', flag: '🇩🇿', region: 'africa', position: { lat: 28.0339, lng: 1.6596 }, influence: 35, stability: 58, economicPower: 38, militaryPower: 42, color: '#006233' },
    { id: 'angola', name: 'Angola', flag: '🇦🇴', region: 'africa', position: { lat: -11.2027, lng: 17.8739 }, influence: 25, stability: 55, economicPower: 32, militaryPower: 28, color: '#CC092F' },
    { id: 'benin', name: 'Benin', flag: '🇧🇯', region: 'africa', position: { lat: 9.3077, lng: 2.3158 }, influence: 10, stability: 68, economicPower: 12, militaryPower: 10, color: '#008751' },
    { id: 'botswana', name: 'Botswana', flag: '🇧🇼', region: 'africa', position: { lat: -22.3285, lng: 24.6849 }, influence: 15, stability: 82, economicPower: 28, militaryPower: 15, color: '#75AADB' },
    { id: 'burkina_faso', name: 'Burkina Faso', flag: '🇧🇫', region: 'africa', position: { lat: 12.2383, lng: -1.5616 }, influence: 10, stability: 35, economicPower: 10, militaryPower: 12, color: '#009E49' },
    { id: 'burundi', name: 'Burundi', flag: '🇧🇮', region: 'africa', position: { lat: -3.3731, lng: 29.9189 }, influence: 8, stability: 40, economicPower: 8, militaryPower: 10, color: '#C8102E' },
    { id: 'cameroon', name: 'Cameroon', flag: '🇨🇲', region: 'africa', position: { lat: 7.3697, lng: 12.3547 }, influence: 18, stability: 52, economicPower: 22, militaryPower: 20, color: '#007A5E' },
    { id: 'chad', name: 'Chad', flag: '🇹🇩', region: 'africa', position: { lat: 15.4542, lng: 18.7322 }, influence: 12, stability: 35, economicPower: 12, militaryPower: 18, color: '#002664' },
    { id: 'drc', name: 'DR Congo', flag: '🇨🇩', region: 'africa', position: { lat: -4.0383, lng: 21.7587 }, influence: 22, stability: 30, economicPower: 18, militaryPower: 22, color: '#007FFF' },
    { id: 'cote_divoire', name: "Côte d'Ivoire", flag: '🇨🇮', region: 'africa', position: { lat: 7.5400, lng: -5.5471 }, influence: 18, stability: 58, economicPower: 25, militaryPower: 18, color: '#F77F00' },
    { id: 'ethiopia', name: 'Ethiopia', flag: '🇪🇹', region: 'africa', position: { lat: 9.1450, lng: 40.4897 }, influence: 28, stability: 42, economicPower: 25, militaryPower: 32, color: '#078930' },
    { id: 'gabon', name: 'Gabon', flag: '🇬🇦', region: 'africa', position: { lat: -0.8037, lng: 11.6094 }, influence: 12, stability: 65, economicPower: 25, militaryPower: 12, color: '#009E60' },
    { id: 'ghana', name: 'Ghana', flag: '🇬🇭', region: 'africa', position: { lat: 7.9465, lng: -1.0232 }, influence: 22, stability: 72, economicPower: 28, militaryPower: 18, color: '#006B3F' },
    { id: 'kenya', name: 'Kenya', flag: '🇰🇪', region: 'africa', position: { lat: -0.0236, lng: 37.9062 }, influence: 28, stability: 62, economicPower: 32, militaryPower: 28, color: '#006600' },
    { id: 'libya', name: 'Libya', flag: '🇱🇾', region: 'africa', position: { lat: 26.3351, lng: 17.2283 }, influence: 22, stability: 25, economicPower: 28, militaryPower: 25, color: '#000000' },
    { id: 'madagascar', name: 'Madagascar', flag: '🇲🇬', region: 'africa', position: { lat: -18.7669, lng: 46.8691 }, influence: 12, stability: 52, economicPower: 12, militaryPower: 10, color: '#007E3A' },
    { id: 'mali', name: 'Mali', flag: '🇲🇱', region: 'africa', position: { lat: 17.5707, lng: -3.9962 }, influence: 12, stability: 28, economicPower: 10, militaryPower: 15, color: '#14B53A' },
    { id: 'morocco', name: 'Morocco', flag: '🇲🇦', region: 'africa', position: { lat: 31.7917, lng: -7.0926 }, influence: 32, stability: 68, economicPower: 35, militaryPower: 35, color: '#C1272D' },
    { id: 'mozambique', name: 'Mozambique', flag: '🇲🇿', region: 'africa', position: { lat: -18.6657, lng: 35.5296 }, influence: 15, stability: 45, economicPower: 15, militaryPower: 18, color: '#007168' },
    { id: 'namibia', name: 'Namibia', flag: '🇳🇦', region: 'africa', position: { lat: -22.9576, lng: 18.4904 }, influence: 12, stability: 75, economicPower: 22, militaryPower: 12, color: '#003580' },
    { id: 'niger', name: 'Niger', flag: '🇳🇪', region: 'africa', position: { lat: 17.6078, lng: 8.0817 }, influence: 10, stability: 35, economicPower: 10, militaryPower: 12, color: '#E05206' },
    { id: 'nigeria', name: 'Nigeria', flag: '🇳🇬', region: 'africa', position: { lat: 9.0820, lng: 8.6753 }, influence: 42, stability: 48, economicPower: 45, militaryPower: 42, color: '#008751' },
    { id: 'rwanda', name: 'Rwanda', flag: '🇷🇼', region: 'africa', position: { lat: -1.9403, lng: 29.8739 }, influence: 15, stability: 72, economicPower: 18, militaryPower: 20, color: '#00A1DE' },
    { id: 'senegal', name: 'Senegal', flag: '🇸🇳', region: 'africa', position: { lat: 14.4974, lng: -14.4524 }, influence: 18, stability: 70, economicPower: 22, militaryPower: 18, color: '#00853F' },
    { id: 'central_african_republic', name: 'Central African Republic', flag: '🇨🇫', region: 'africa', position: { lat: 6.6111, lng: 20.9394 }, influence: 10, stability: 30, economicPower: 12, militaryPower: 15, color: '#00477E' },
    { id: 'congo_brazzaville', name: 'Congo (Republic)', flag: '🇨🇬', region: 'africa', position: { lat: -0.228021, lng: 15.827659 }, influence: 15, stability: 55, economicPower: 25, militaryPower: 18, color: '#009543' },
    { id: 'equatorial_guinea', name: 'Equatorial Guinea', flag: '🇬🇶', region: 'africa', position: { lat: 1.6508, lng: 10.2679 }, influence: 15, stability: 65, economicPower: 30, militaryPower: 15, color: '#319208' },
    { id: 'eritrea', name: 'Eritrea', flag: '🇪🇷', region: 'africa', position: { lat: 15.1794, lng: 39.7823 }, influence: 12, stability: 55, economicPower: 15, militaryPower: 35, color: '#319208' },
    { id: 'gambia', name: 'Gambia', flag: '🇬🇲', region: 'africa', position: { lat: 13.4432, lng: -15.3101 }, influence: 8, stability: 68, economicPower: 12, militaryPower: 8, color: '#CE1126' },
    { id: 'guinea_bissau', name: 'Guinea-Bissau', flag: '🇬🇼', region: 'africa', position: { lat: 11.8037, lng: -15.1804 }, influence: 8, stability: 62, economicPower: 10, militaryPower: 10, color: '#CE1126' },
    { id: 'liberia', name: 'Liberia', flag: '🇱🇷', region: 'africa', position: { lat: 6.4281, lng: -9.4295 }, influence: 12, stability: 55, economicPower: 15, militaryPower: 12, color: '#BF0A30' },
    { id: 'malawi', name: 'Malawi', flag: '🇲🇼', region: 'africa', position: { lat: -13.2543, lng: 34.3015 }, influence: 12, stability: 70, economicPower: 15, militaryPower: 12, color: '#D21034' },
    { id: 'sierra_leone', name: 'Sierra Leone', flag: '🇸🇱', region: 'africa', position: { lat: 8.4606, lng: -11.7799 }, influence: 10, stability: 55, economicPower: 15, militaryPower: 15, color: '#1EB53A' },
    { id: 'togo', name: 'Togo', flag: '🇹🇬', region: 'africa', position: { lat: 8.6195, lng: 0.8248 }, influence: 12, stability: 65, economicPower: 18, militaryPower: 12, color: '#006A4E' },
    { id: 'somalia', name: 'Somalia', flag: '🇸🇴', region: 'africa', position: { lat: 5.1521, lng: 46.1996 }, influence: 10, stability: 20, economicPower: 8, militaryPower: 15, color: '#4189DD' },
    { id: 'south_africa', name: 'South Africa', flag: '🇿🇦', region: 'africa', position: { lat: -30.5595, lng: 22.9375 }, influence: 48, stability: 58, economicPower: 50, militaryPower: 42, color: '#007749' },
    { id: 'south_sudan', name: 'South Sudan', flag: '🇸🇸', region: 'africa', position: { lat: 6.8770, lng: 31.3070 }, influence: 10, stability: 18, economicPower: 10, militaryPower: 15, color: '#078930' },
    { id: 'sudan', name: 'Sudan', flag: '🇸🇩', region: 'africa', position: { lat: 12.8628, lng: 30.2176 }, influence: 18, stability: 28, economicPower: 18, militaryPower: 25, color: '#D21034' },
    { id: 'tanzania', name: 'Tanzania', flag: '🇹🇿', region: 'africa', position: { lat: -6.3690, lng: 34.8888 }, influence: 22, stability: 68, economicPower: 25, militaryPower: 22, color: '#1EB53A' },
    { id: 'tunisia', name: 'Tunisia', flag: '🇹🇳', region: 'africa', position: { lat: 33.8869, lng: 9.5375 }, influence: 18, stability: 55, economicPower: 25, militaryPower: 22, color: '#E70013' },
    { id: 'uganda', name: 'Uganda', flag: '🇺🇬', region: 'africa', position: { lat: 1.3733, lng: 32.2903 }, influence: 18, stability: 55, economicPower: 20, militaryPower: 22, color: '#FCDC04' },
    { id: 'zambia', name: 'Zambia', flag: '🇿🇲', region: 'africa', position: { lat: -13.1339, lng: 27.8493 }, influence: 15, stability: 65, economicPower: 18, militaryPower: 15, color: '#198A00' },
    { id: 'zimbabwe', name: 'Zimbabwe', flag: '🇿🇼', region: 'africa', position: { lat: -19.0154, lng: 29.1549 }, influence: 15, stability: 42, economicPower: 15, militaryPower: 18, color: '#319208' },
    { id: 'cabo_verde', name: 'Cabo Verde', flag: '🇨🇻', region: 'africa', position: { lat: 16.0020, lng: -24.0131 }, influence: 10, stability: 85, economicPower: 15, militaryPower: 10, color: '#003893' },
    { id: 'comoros', name: 'Comoros', flag: '🇰🇲', region: 'africa', position: { lat: -11.6455, lng: 43.3333 }, influence: 8, stability: 60, economicPower: 10, militaryPower: 8, color: '#3D8E33' },
    { id: 'sao_tome_principe', name: 'São Tomé & Príncipe', flag: '🇸🇹', region: 'africa', position: { lat: 0.1864, lng: 6.6131 }, influence: 8, stability: 75, economicPower: 10, militaryPower: 8, color: '#12AD2B' },
    { id: 'seychelles', name: 'Seychelles', flag: '🇸🇨', region: 'africa', position: { lat: -4.6796, lng: 55.4920 }, influence: 12, stability: 88, economicPower: 25, militaryPower: 10, color: '#003D88' },
    { id: 'mauritius', name: 'Mauritius', flag: '🇲🇺', region: 'africa', position: { lat: -20.3484, lng: 57.5522 }, influence: 15, stability: 88, economicPower: 35, militaryPower: 12, color: '#EA1010' },

    // ============ NORTH AMERICA ============
    { id: 'canada', name: 'Canada', flag: '🇨🇦', region: 'north_america', position: { lat: 56.1304, lng: -106.3468 }, influence: 55, stability: 92, economicPower: 68, militaryPower: 45, color: '#FF0000' },
    { id: 'costa_rica', name: 'Costa Rica', flag: '🇨🇷', region: 'north_america', position: { lat: 9.7489, lng: -83.7534 }, influence: 18, stability: 85, economicPower: 28, militaryPower: 8, color: '#002B7F' },
    { id: 'cuba', name: 'Cuba', flag: '🇨🇺', region: 'north_america', position: { lat: 21.5218, lng: -77.7812 }, influence: 22, stability: 65, economicPower: 22, militaryPower: 25, color: '#002A8F' },
    { id: 'dominican_republic', name: 'Dominican Republic', flag: '🇩🇴', region: 'north_america', position: { lat: 18.7357, lng: -70.1627 }, influence: 15, stability: 68, economicPower: 28, militaryPower: 15, color: '#002D62' },
    { id: 'el_salvador', name: 'El Salvador', flag: '🇸🇻', region: 'north_america', position: { lat: 13.7942, lng: -88.8965 }, influence: 12, stability: 55, economicPower: 18, militaryPower: 15, color: '#0F47AF' },
    { id: 'guatemala', name: 'Guatemala', flag: '🇬🇹', region: 'north_america', position: { lat: 15.7835, lng: -90.2308 }, influence: 15, stability: 50, economicPower: 22, militaryPower: 18, color: '#4997D0' },
    { id: 'haiti', name: 'Haiti', flag: '🇭🇹', region: 'north_america', position: { lat: 18.9712, lng: -72.2852 }, influence: 10, stability: 25, economicPower: 10, militaryPower: 10, color: '#00209F' },
    { id: 'honduras', name: 'Honduras', flag: '🇭🇳', region: 'north_america', position: { lat: 15.2000, lng: -86.2419 }, influence: 12, stability: 48, economicPower: 15, militaryPower: 15, color: '#0F47AF' },
    { id: 'jamaica', name: 'Jamaica', flag: '🇯🇲', region: 'north_america', position: { lat: 18.1096, lng: -77.2975 }, influence: 15, stability: 68, economicPower: 22, militaryPower: 12, color: '#007749' },
    { id: 'mexico', name: 'Mexico', flag: '🇲🇽', region: 'north_america', position: { lat: 23.6345, lng: -102.5528 }, influence: 45, stability: 58, economicPower: 52, militaryPower: 42, color: '#006847' },
    { id: 'nicaragua', name: 'Nicaragua', flag: '🇳🇮', region: 'north_america', position: { lat: 12.8654, lng: -85.2072 }, influence: 12, stability: 48, economicPower: 15, militaryPower: 15, color: '#0067C6' },
    { id: 'panama', name: 'Panama', flag: '🇵🇦', region: 'north_america', position: { lat: 8.5380, lng: -80.7821 }, influence: 22, stability: 72, economicPower: 35, militaryPower: 12, color: '#DA121A' },
    { id: 'usa', name: 'United States', flag: '🇺🇸', region: 'north_america', position: { lat: 37.0902, lng: -95.7129 }, influence: 98, stability: 78, economicPower: 95, militaryPower: 98, color: '#3C3B6E', isGlobalHub: true },
    { id: 'antigua_barbuda', name: 'Antigua & Barbuda', flag: '🇦🇬', region: 'north_america', position: { lat: 17.0608, lng: -61.7964 }, influence: 10, stability: 80, economicPower: 22, militaryPower: 8, color: '#CE1126' },
    { id: 'bahamas', name: 'Bahamas', flag: '🇧🇸', region: 'north_america', position: { lat: 25.0343, lng: -77.3963 }, influence: 15, stability: 85, economicPower: 35, militaryPower: 10, color: '#00A9CE' },
    { id: 'barbados', name: 'Barbados', flag: '🇧🇧', region: 'north_america', position: { lat: 13.1939, lng: -59.5432 }, influence: 12, stability: 88, economicPower: 30, militaryPower: 8, color: '#00267F' },
    { id: 'belize', name: 'Belize', flag: '🇧🇿', region: 'north_america', position: { lat: 17.1899, lng: -88.4976 }, influence: 12, stability: 72, economicPower: 18, militaryPower: 10, color: '#171696' },
    { id: 'dominica', name: 'Dominica', flag: '🇩🇲', region: 'north_america', position: { lat: 15.4150, lng: -61.3710 }, influence: 8, stability: 78, economicPower: 12, militaryPower: 5, color: '#006B3F' },
    { id: 'grenada', name: 'Grenada', flag: '🇬🇩', region: 'north_america', position: { lat: 12.1165, lng: -61.6790 }, influence: 8, stability: 82, economicPower: 15, militaryPower: 5, color: '#CE1126' },
    { id: 'st_kitts_nevis', name: 'Saint Kitts & Nevis', flag: '🇰🇳', region: 'north_america', position: { lat: 17.3578, lng: -62.7830 }, influence: 8, stability: 85, economicPower: 18, militaryPower: 5, color: '#009E49' },
    { id: 'st_lucia', name: 'Saint Lucia', flag: '🇱🇨', region: 'north_america', position: { lat: 13.9094, lng: -60.9789 }, influence: 8, stability: 82, economicPower: 15, militaryPower: 5, color: '#66CCFF' },
    { id: 'st_vincent', name: 'Saint Vincent', flag: '🇻🇨', region: 'north_america', position: { lat: 12.9843, lng: -61.2872 }, influence: 8, stability: 80, economicPower: 12, militaryPower: 5, color: '#0072C6' },

    // ============ SOUTH AMERICA ============
    { id: 'argentina', name: 'Argentina', flag: '🇦🇷', region: 'south_america', position: { lat: -38.4161, lng: -63.6167 }, influence: 35, stability: 55, economicPower: 42, militaryPower: 32, color: '#75AADB' },
    { id: 'bolivia', name: 'Bolivia', flag: '🇧🇴', region: 'south_america', position: { lat: -16.2902, lng: -63.5887 }, influence: 15, stability: 52, economicPower: 18, militaryPower: 18, color: '#007934' },
    { id: 'brazil', name: 'Brazil', flag: '🇧🇷', region: 'south_america', position: { lat: -14.2350, lng: -51.9253 }, influence: 58, stability: 62, economicPower: 60, militaryPower: 48, color: '#009C3B' },
    { id: 'chile', name: 'Chile', flag: '🇨🇱', region: 'south_america', position: { lat: -35.6751, lng: -71.5430 }, influence: 32, stability: 75, economicPower: 42, militaryPower: 30, color: '#D52B1E' },
    { id: 'colombia', name: 'Colombia', flag: '🇨🇴', region: 'south_america', position: { lat: 4.5709, lng: -74.2973 }, influence: 32, stability: 55, economicPower: 38, militaryPower: 35, color: '#FCD116' },
    { id: 'ecuador', name: 'Ecuador', flag: '🇪🇨', region: 'south_america', position: { lat: -1.8312, lng: -78.1834 }, influence: 18, stability: 55, economicPower: 25, militaryPower: 22, color: '#FFD100' },
    { id: 'guyana', name: 'Guyana', flag: '🇬🇾', region: 'south_america', position: { lat: 4.8604, lng: -58.9302 }, influence: 12, stability: 62, economicPower: 18, militaryPower: 10, color: '#009E49' },
    { id: 'paraguay', name: 'Paraguay', flag: '🇵🇾', region: 'south_america', position: { lat: -23.4425, lng: -58.4438 }, influence: 12, stability: 62, economicPower: 18, militaryPower: 15, color: '#D52B1E' },
    { id: 'peru', name: 'Peru', flag: '🇵🇪', region: 'south_america', position: { lat: -9.1900, lng: -75.0152 }, influence: 28, stability: 55, economicPower: 35, militaryPower: 28, color: '#D91023' },
    { id: 'suriname', name: 'Suriname', flag: '🇸🇷', region: 'south_america', position: { lat: 3.9193, lng: -56.0278 }, influence: 8, stability: 58, economicPower: 12, militaryPower: 8, color: '#377E3F' },
    { id: 'uruguay', name: 'Uruguay', flag: '🇺🇾', region: 'south_america', position: { lat: -32.5228, lng: -55.7658 }, influence: 18, stability: 82, economicPower: 30, militaryPower: 18, color: '#0038A8' },
    { id: 'venezuela', name: 'Venezuela', flag: '🇻🇪', region: 'south_america', position: { lat: 6.4238, lng: -66.5897 }, influence: 25, stability: 35, economicPower: 28, militaryPower: 32, color: '#FFCC00' },

    // ============ OCEANIA ============
    { id: 'australia', name: 'Australia', flag: '🇦🇺', region: 'oceania', position: { lat: -25.2744, lng: 133.7751 }, influence: 52, stability: 90, economicPower: 65, militaryPower: 45, color: '#00008B' },
    { id: 'fiji', name: 'Fiji', flag: '🇫🇯', region: 'oceania', position: { lat: -17.7134, lng: 178.0650 }, influence: 10, stability: 68, economicPower: 15, militaryPower: 10, color: '#68BFE5' },
    { id: 'new_zealand', name: 'New Zealand', flag: '🇳🇿', region: 'oceania', position: { lat: -40.9006, lng: 174.8860 }, influence: 35, stability: 95, economicPower: 48, militaryPower: 25, color: '#00247D' },
    { id: 'papua_new_guinea', name: 'Papua New Guinea', flag: '🇵🇬', region: 'oceania', position: { lat: -6.3150, lng: 143.9555 }, influence: 12, stability: 52, economicPower: 15, militaryPower: 12, color: '#CE1126' },
    { id: 'kiribati', name: 'Kiribati', flag: '🇰🇮', region: 'oceania', position: { lat: -3.3704, lng: -168.7340 }, influence: 5, stability: 85, economicPower: 10, militaryPower: 2, color: '#CE1126' },
    { id: 'marshall_islands', name: 'Marshall Islands', flag: '🇲🇭', region: 'oceania', position: { lat: 7.1315, lng: 171.1845 }, influence: 5, stability: 88, economicPower: 12, militaryPower: 2, color: '#003893' },
    { id: 'micronesia', name: 'Micronesia', flag: '🇫🇲', region: 'oceania', position: { lat: 7.4256, lng: 150.5508 }, influence: 5, stability: 88, economicPower: 12, militaryPower: 2, color: '#6699FF' },
    { id: 'nauru', name: 'Nauru', flag: '🇳🇷', region: 'oceania', position: { lat: -0.5228, lng: 166.9315 }, influence: 5, stability: 82, economicPower: 10, militaryPower: 1, color: '#002A7E' },
    { id: 'palau', name: 'Palau', flag: '🇵🇼', region: 'oceania', position: { lat: 7.5150, lng: 134.5825 }, influence: 5, stability: 92, economicPower: 15, militaryPower: 2, color: '#4AADD6' },
    { id: 'samoa', name: 'Samoa', flag: '🇼🇸', region: 'oceania', position: { lat: -13.7590, lng: -172.1046 }, influence: 8, stability: 88, economicPower: 15, militaryPower: 5, color: '#002B7F' },
    { id: 'solomon_islands', name: 'Solomon Islands', flag: '🇸🇧', region: 'oceania', position: { lat: -9.6457, lng: 160.1562 }, influence: 10, stability: 68, economicPower: 12, militaryPower: 10, color: '#0051BA' },
    { id: 'tonga', name: 'Tonga', flag: '🇹🇴', region: 'oceania', position: { lat: -21.1790, lng: -175.1982 }, influence: 5, stability: 90, economicPower: 10, militaryPower: 5, color: '#C10000' },
    { id: 'tuvalu', name: 'Tuvalu', flag: '🇹🇻', region: 'oceania', position: { lat: -7.1095, lng: 177.6493 }, influence: 5, stability: 95, economicPower: 8, militaryPower: 1, color: '#008240' },
    { id: 'vanuatu', name: 'Vanuatu', flag: '🇻🇺', region: 'oceania', position: { lat: -15.3767, lng: 166.9592 }, influence: 8, stability: 82, economicPower: 15, militaryPower: 8, color: '#002B7F' },
];

// Helper to get country by ID
export function getWorldCountry(id: string): WorldCountry | undefined {
    return worldCountries.find(c => c.id === id);
}

// Helper to get countries by region
export function getCountriesByRegion(region: WorldCountry['region']): WorldCountry[] {
    return worldCountries.filter(c => c.region === region);
}

// Get all country flags as a map
export const countryFlags: Record<string, string> = Object.fromEntries(
    worldCountries.map(c => [c.id, c.flag])
);

// Total: 150+ countries covering all regions
