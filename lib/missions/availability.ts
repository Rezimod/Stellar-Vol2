export interface MissionRequirements {
  min_altitude?: number;
  max_cloud_cover?: number;
  visible?: boolean;
  moon_phase?: string;
  moon_illumination_max?: number;
}

export interface MissionAvailability {
  available: boolean;
  reason: string;
  reasonKey: string;
}

export interface PlanetSnapshot {
  name: string;
  altitude: number;
  isVisible: boolean;
}

export function checkMissionAvailability(
  requirements: MissionRequirements | null,
  weather: { cloudCover: number } | null,
  planets: PlanetSnapshot[],
  targetObject: string,
  moonIllumination?: number,
  moonPhase?: string,
  isNight?: boolean,
): MissionAvailability {
  if (!requirements) {
    return { available: true, reason: 'Available Now', reasonKey: 'missions.availableNow' };
  }

  // Cloud cover check
  if (requirements.max_cloud_cover !== undefined && weather) {
    if (weather.cloudCover > requirements.max_cloud_cover) {
      return {
        available: false,
        reason: 'Waiting for Clear Sky',
        reasonKey: 'missions.waitingForClearSky',
      };
    }
  }

  // Moon phase check
  if (requirements.moon_phase === 'full' && moonPhase) {
    const phaseAngle = parseFloat(moonPhase);
    if (phaseAngle < 170 || phaseAngle > 190) {
      return {
        available: false,
        reason: 'Waiting for Moon Phase',
        reasonKey: 'missions.waitingForMoonPhase',
      };
    }
  }

  // Moon illumination max check
  if (requirements.moon_illumination_max !== undefined && moonIllumination !== undefined) {
    if (moonIllumination > requirements.moon_illumination_max) {
      return {
        available: false,
        reason: 'Waiting for Moon Phase',
        reasonKey: 'missions.waitingForMoonPhase',
      };
    }
  }

  // Planet visibility check
  const planetTargets = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'jupiter_moons'];
  const isPlanetMission = planetTargets.some(p => targetObject.toLowerCase().includes(p));

  if (isPlanetMission && requirements.visible) {
    const targetName = targetObject.replace('_moons', '').replace('_', ' ');
    const planet = planets.find(p => p.name.toLowerCase() === targetName.toLowerCase());
    if (planet) {
      if (!planet.isVisible) {
        return {
          available: false,
          reason: 'Object Below Horizon',
          reasonKey: 'missions.objectBelowHorizon',
        };
      }
      if (requirements.min_altitude !== undefined && planet.altitude < requirements.min_altitude) {
        return {
          available: false,
          reason: 'Object Below Horizon',
          reasonKey: 'missions.objectBelowHorizon',
        };
      }
    }
  }

  return { available: true, reason: 'Available Now', reasonKey: 'missions.availableNow' };
}
