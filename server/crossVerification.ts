// Cross-verification system for weather data accuracy
import { WeatherData } from './weatherProviders';

interface VerificationResult {
  verified: boolean;
  confidence: 'high' | 'medium' | 'low';
  discrepancies: string[];
  sources: string[];
  recommendation: string;
}

export class WeatherVerification {
  private static readonly TEMP_THRESHOLD = 5; // Celsius
  private static readonly HUMIDITY_THRESHOLD = 20; // Percentage
  private static readonly PRESSURE_THRESHOLD = 20; // hPa

  static crossVerify(primaryData: WeatherData, secondaryData?: WeatherData): VerificationResult {
    if (!secondaryData) {
      return {
        verified: true,
        confidence: 'medium',
        discrepancies: [],
        sources: [primaryData.source || 'Unknown'],
        recommendation: 'Single source verification'
      };
    }

    const discrepancies: string[] = [];
    const sources = [primaryData.source || 'Unknown', secondaryData.source || 'Unknown'];

    // Temperature verification
    const tempDiff = Math.abs(primaryData.current.temp - secondaryData.current.temp);
    if (tempDiff > this.TEMP_THRESHOLD) {
      discrepancies.push(`Temperature difference: ${tempDiff.toFixed(1)}°C`);
    }

    // Humidity verification
    const humidityDiff = Math.abs(primaryData.current.humidity - secondaryData.current.humidity);
    if (humidityDiff > this.HUMIDITY_THRESHOLD) {
      discrepancies.push(`Humidity difference: ${humidityDiff}%`);
    }

    // Pressure verification
    const pressureDiff = Math.abs(primaryData.current.pressure - secondaryData.current.pressure);
    if (pressureDiff > this.PRESSURE_THRESHOLD) {
      discrepancies.push(`Pressure difference: ${pressureDiff} hPa`);
    }

    // Weather condition verification
    if (primaryData.current.weather.main !== secondaryData.current.weather.main) {
      discrepancies.push(`Weather condition mismatch: ${primaryData.current.weather.main} vs ${secondaryData.current.weather.main}`);
    }

    // Determine confidence level
    let confidence: 'high' | 'medium' | 'low';
    if (discrepancies.length === 0) {
      confidence = 'high';
    } else if (discrepancies.length <= 2) {
      confidence = 'medium';
    } else {
      confidence = 'low';
    }

    const verified = discrepancies.length <= 2;
    const recommendation = this.getRecommendation(discrepancies.length, sources);

    return {
      verified,
      confidence,
      discrepancies,
      sources,
      recommendation
    };
  }

  private static getRecommendation(discrepancyCount: number, sources: string[]): string {
    if (discrepancyCount === 0) {
      return `Data verified across ${sources.join(' and ')}`;
    } else if (discrepancyCount <= 2) {
      return `Minor discrepancies found - data generally reliable`;
    } else {
      return `Significant discrepancies detected - consider alternative sources`;
    }
  }

  static selectBestData(dataA: WeatherData, dataB: WeatherData): WeatherData {
    // Prioritize data from more reliable sources
    const reliability = {
      'OpenWeatherMap': 3,
      'AccuWeather': 2,
      'WeatherAPI': 1,
      'KMA_API': 4 // Korean Meteorological Administration for Korean locations
    };

    const reliabilityA = reliability[dataA.source as keyof typeof reliability] || 0;
    const reliabilityB = reliability[dataB.source as keyof typeof reliability] || 0;

    // For Korean locations, prefer KMA_API if available
    if (dataA.location.country === 'KR' && dataA.source === 'KMA_API') return dataA;
    if (dataB.location.country === 'KR' && dataB.source === 'KMA_API') return dataB;

    // Otherwise, use reliability scoring
    return reliabilityA >= reliabilityB ? dataA : dataB;
  }

  static enhanceWithMetadata(data: WeatherData, verification: VerificationResult): WeatherData {
    return {
      ...data,
      verification: {
        confidence: verification.confidence,
        verified: verification.verified,
        sources: verification.sources,
        cross_checked: verification.sources.length > 1
      }
    };
  }
}