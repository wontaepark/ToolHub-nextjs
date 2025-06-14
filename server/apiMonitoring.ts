// Comprehensive API monitoring and analytics system
import { weatherCache } from './cache';

interface APIMetrics {
  provider: string;
  requests: number;
  successes: number;
  failures: number;
  averageResponseTime: number;
  lastUsed: number;
  errorRate: number;
  dailyUsage: number;
  dailyLimit: number;
}

interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'critical';
  providers: APIMetrics[];
  cache: {
    hitRate: number;
    totalRequests: number;
    memoryUsage: number;
  };
  alerts: string[];
}

class APIMonitoringService {
  private metrics: Map<string, APIMetrics> = new Map();
  private responseTimesBuffer: Map<string, number[]> = new Map();
  private readonly BUFFER_SIZE = 100;

  recordRequest(provider: string, success: boolean, responseTime: number) {
    let metric = this.metrics.get(provider) || {
      provider,
      requests: 0,
      successes: 0,
      failures: 0,
      averageResponseTime: 0,
      lastUsed: Date.now(),
      errorRate: 0,
      dailyUsage: 0,
      dailyLimit: provider === 'AccuWeather' ? 50 : 1000
    };

    metric.requests++;
    metric.lastUsed = Date.now();

    if (success) {
      metric.successes++;
    } else {
      metric.failures++;
    }

    // Update response time buffer
    let times = this.responseTimesBuffer.get(provider) || [];
    times.push(responseTime);
    if (times.length > this.BUFFER_SIZE) {
      times = times.slice(-this.BUFFER_SIZE);
    }
    this.responseTimesBuffer.set(provider, times);

    // Calculate average response time
    metric.averageResponseTime = times.reduce((a, b) => a + b, 0) / times.length;
    
    // Calculate error rate
    metric.errorRate = (metric.failures / metric.requests) * 100;

    this.metrics.set(provider, metric);
  }

  getSystemHealth(): SystemHealth {
    const cacheStats = weatherCache.getStats();
    const providers = Array.from(this.metrics.values());
    const alerts: string[] = [];

    // Check for alerts
    providers.forEach(provider => {
      if (provider.errorRate > 50) {
        alerts.push(`High error rate for ${provider.provider}: ${provider.errorRate.toFixed(1)}%`);
      }
      if (provider.averageResponseTime > 5000) {
        alerts.push(`Slow response time for ${provider.provider}: ${provider.averageResponseTime.toFixed(0)}ms`);
      }
      if (provider.dailyUsage / provider.dailyLimit > 0.9) {
        alerts.push(`${provider.provider} approaching daily limit: ${provider.dailyUsage}/${provider.dailyLimit}`);
      }
    });

    // Determine overall health
    let overall: 'healthy' | 'degraded' | 'critical' = 'healthy';
    if (alerts.length > 0) {
      overall = alerts.some(alert => alert.includes('critical') || alert.includes('High error rate')) ? 'critical' : 'degraded';
    }

    const hitRate = (cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100 || 0;

    return {
      overall,
      providers,
      cache: {
        hitRate: Math.round(hitRate),
        totalRequests: cacheStats.hits + cacheStats.misses,
        memoryUsage: cacheStats.keys
      },
      alerts
    };
  }

  getProviderRecommendations(): Record<string, string> {
    const recommendations: Record<string, string> = {};
    
    this.metrics.forEach((metric, provider) => {
      if (metric.errorRate > 30) {
        recommendations[provider] = 'Consider disabling temporarily due to high error rate';
      } else if (metric.averageResponseTime > 3000) {
        recommendations[provider] = 'Increase cache TTL to reduce API calls';
      } else if (metric.dailyUsage / metric.dailyLimit > 0.8) {
        recommendations[provider] = 'Approaching daily limit - implement request throttling';
      } else if (metric.errorRate < 5 && metric.averageResponseTime < 1000) {
        recommendations[provider] = 'Performing optimally';
      }
    });

    return recommendations;
  }

  resetDailyStats() {
    this.metrics.forEach(metric => {
      metric.dailyUsage = 0;
    });
  }

  exportMetrics() {
    return {
      metrics: Array.from(this.metrics.values()),
      timestamp: new Date().toISOString(),
      systemHealth: this.getSystemHealth(),
      recommendations: this.getProviderRecommendations()
    };
  }
}

export const apiMonitoring = new APIMonitoringService();

// Auto-reset daily stats at midnight
setInterval(() => {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    apiMonitoring.resetDailyStats();
  }
}, 60000); // Check every minute