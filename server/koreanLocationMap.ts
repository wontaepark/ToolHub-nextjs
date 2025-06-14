// Korean city mapping for accurate weather data retrieval
export const koreanCityMap: Record<string, { en: string; coords: { lat: number; lon: number } }> = {
  // Major cities
  '서울': { en: 'Seoul', coords: { lat: 37.5665, lon: 126.9780 } },
  '부산': { en: 'Busan', coords: { lat: 35.1796, lon: 129.0756 } },
  '인천': { en: 'Incheon', coords: { lat: 37.4563, lon: 126.7052 } },
  '대구': { en: 'Daegu', coords: { lat: 35.8714, lon: 128.6014 } },
  '대전': { en: 'Daejeon', coords: { lat: 36.3504, lon: 127.3845 } },
  '광주': { en: 'Gwangju', coords: { lat: 35.1595, lon: 126.8526 } },
  '울산': { en: 'Ulsan', coords: { lat: 35.5384, lon: 129.3114 } },
  '세종': { en: 'Sejong', coords: { lat: 36.4801, lon: 127.2890 } },
  
  // Gyeonggi Province
  '수원': { en: 'Suwon', coords: { lat: 37.2636, lon: 127.0286 } },
  '안산': { en: 'Ansan', coords: { lat: 37.3236, lon: 126.8219 } },
  '안양': { en: 'Anyang', coords: { lat: 37.3943, lon: 126.9568 } },
  '성남': { en: 'Seongnam', coords: { lat: 37.4449, lon: 127.1388 } },
  '고양': { en: 'Goyang', coords: { lat: 37.6564, lon: 126.8348 } },
  '용인': { en: 'Yongin', coords: { lat: 37.2411, lon: 127.1776 } },
  '부천': { en: 'Bucheon', coords: { lat: 37.4989, lon: 126.7831 } },
  '화성': { en: 'Hwaseong', coords: { lat: 37.1997, lon: 126.8308 } },
  '남양주': { en: 'Namyangju', coords: { lat: 37.6362, lon: 127.2167 } },
  '평택': { en: 'Pyeongtaek', coords: { lat: 36.9921, lon: 127.1127 } },
  
  // Gangwon Province
  '춘천': { en: 'Chuncheon', coords: { lat: 37.8813, lon: 127.7298 } },
  '원주': { en: 'Wonju', coords: { lat: 37.3422, lon: 127.9202 } },
  '강릉': { en: 'Gangneung', coords: { lat: 37.7519, lon: 128.8761 } },
  
  // Jeju
  '제주': { en: 'Jeju', coords: { lat: 33.4996, lon: 126.5312 } },
  '서귀포': { en: 'Seogwipo', coords: { lat: 33.2529, lon: 126.5600 } },
  
  // North/South regions with province prefix
  '경기 안산': { en: 'Ansan', coords: { lat: 37.3236, lon: 126.8219 } },
  '경기 수원': { en: 'Suwon', coords: { lat: 37.2636, lon: 127.0286 } },
  '경기 성남': { en: 'Seongnam', coords: { lat: 37.4449, lon: 127.1388 } },
  '경남 창원': { en: 'Changwon', coords: { lat: 35.2281, lon: 128.6811 } },
  '경북 포항': { en: 'Pohang', coords: { lat: 36.0190, lon: 129.3435 } },
  '전남 목포': { en: 'Mokpo', coords: { lat: 34.8118, lon: 126.3922 } },
  '전북 전주': { en: 'Jeonju', coords: { lat: 35.8242, lon: 127.1480 } },
  '충남 천안': { en: 'Cheonan', coords: { lat: 36.8151, lon: 127.1139 } },
  '충북 청주': { en: 'Cheongju', coords: { lat: 36.6424, lon: 127.4890 } }
};

export function isKoreanLocation(location: string): boolean {
  return /[가-힣]/.test(location) || koreanCityMap.hasOwnProperty(location);
}

export function normalizeKoreanCity(cityName: string): { en: string; coords: { lat: number; lon: number } } | null {
  // Direct match
  if (koreanCityMap[cityName]) {
    return koreanCityMap[cityName];
  }
  
  // Try partial matches for cities with province prefixes
  for (const [key, value] of Object.entries(koreanCityMap)) {
    if (key.includes(cityName) || cityName.includes(key.split(' ').pop() || '')) {
      return value;
    }
  }
  
  return null;
}

export function getKoreanCityEnglishName(koreanName: string): string | null {
  const normalized = normalizeKoreanCity(koreanName);
  return normalized ? normalized.en : null;
}

export function getKoreanCityCoordinates(koreanName: string): { lat: number; lon: number } | null {
  const normalized = normalizeKoreanCity(koreanName);
  return normalized ? normalized.coords : null;
}