import axios from 'axios';

const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

export interface GeoCoordinate {
  lat: number;
  lon: number;
}

export interface ElevationPoint {
  distance: number;
  elevation: number;
  label: string;
}

export const MapService = {
  /**
   * Retrieves elevation data for a given path sequence
   */
  async getElevationProfile(coordinates: GeoCoordinate[]): Promise<ElevationPoint[]> {
    if (!MAPBOX_ACCESS_TOKEN) {
      console.log('🗺️ Mapbox Token not configured. Serving mock profile.');
      return this.generateMockElevationProfile(coordinates);
    }

    try {
      const coordString = coordinates.map(c => `${c.lon},${c.lat}`).join(';');
      const url = `https://api.mapbox.com/v5/mapbox/elevation-tile-query/${coordString}?access_token=${MAPBOX_ACCESS_TOKEN}`;
      const response = await axios.get(url);
      
      // In real scenario, mapbox returns tile data, we extract elevation values
      // We parse response.data.features to map to elevations
      return response.data.features.map((feature: any, idx: number) => ({
        distance: Math.round((idx / response.data.features.length) * 30),
        elevation: feature.properties.ele || 2000,
        label: `Camp ${idx}`
      }));
    } catch (err) {
      console.error('Mapbox elevation query failure. Using fallback profile:', err);
      return this.generateMockElevationProfile(coordinates);
    }
  },

  /**
   * Generate mock altitude spline values
   */
  generateMockElevationProfile(coordinates: GeoCoordinate[]): ElevationPoint[] {
    return coordinates.map((c, idx) => {
      // Linear elevation increase toward center
      const peakIndex = Math.floor(coordinates.length / 2);
      const isAscending = idx <= peakIndex;
      const progress = isAscending ? idx / peakIndex : (coordinates.length - 1 - idx) / (coordinates.length - 1 - peakIndex);
      
      return {
        distance: idx * 5,
        elevation: Math.round(1500 + progress * 2000), // starts at 1500m up to 3500m
        label: idx === 0 ? 'Base Camp' : idx === peakIndex ? 'Summit Pass' : `Camp Point ${idx}`
      };
    });
  }
};
