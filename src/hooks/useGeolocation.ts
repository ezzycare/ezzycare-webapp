/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { general } from '@/enums';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { useCallback, useEffect, useState } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  permissionGranted: boolean;
  permissionDenied: boolean;
  error: string | null;
}

const readStoredLocation = (): {
  latitude: number | null;
  longitude: number | null;
} => {
  try {
    const stored = localStorage.getItem(general.USER_LOCATION);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.latitude != null && parsed.longitude != null) {
        return { latitude: parsed.latitude, longitude: parsed.longitude };
      }
    }
  } catch {
    // ignore parse errors
  }
  return { latitude: null, longitude: null };
};

const writeStoredLocation = (latitude: number, longitude: number) => {
  try {
    localStorage.setItem(
      general.USER_LOCATION,
      JSON.stringify({ latitude, longitude })
    );
  } catch {
    // ignore storage errors
  }
};

const clearStoredLocation = () => {
  try {
    localStorage.removeItem(general.USER_LOCATION);
  } catch {
    // ignore
  }
};

const getUserFallbackLocation = (
  user: AuthStore['user']
): { latitude: number | null; longitude: number | null } => {
  const userLat = user?.latitude ?? user?.currentLatitude ?? null;
  const userLng = user?.longitude ?? user?.currentLongitude ?? null;
  return { latitude: userLat, longitude: userLng };
};

export const useGeolocation = () => {
  const user = useAuthStore((state: AuthStore) => state.user);

  const [state, setState] = useState<GeolocationState>(() => {
    const stored = readStoredLocation();
    if (stored.latitude != null && stored.longitude != null) {
      return {
        ...stored,
        permissionGranted: true,
        permissionDenied: false,
        error: null,
      };
    }

    const fallback = getUserFallbackLocation(user);

    if (fallback.latitude != null && fallback.longitude != null) {
      return {
        ...fallback,
        permissionGranted: false,
        permissionDenied: false,
        error: null,
      };
    }

    return {
      latitude: null,
      longitude: null,
      permissionGranted: false,
      permissionDenied: false,
      error: null,
    };
  });

  useEffect(() => {
    const stored = readStoredLocation();
    if (stored.latitude != null && stored.longitude != null) return;

    const fallback = getUserFallbackLocation(user);

    if (fallback.latitude != null && fallback.longitude != null) {
      setState((prev) => {
        if (prev.permissionGranted) return prev;
        if (
          prev.latitude === fallback.latitude &&
          prev.longitude === fallback.longitude
        )
          return prev;
        return {
          ...prev,
          latitude: fallback.latitude,
          longitude: fallback.longitude,
        };
      });
    }
  }, [user]);

  const requestPermission = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by this browser',
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        writeStoredLocation(latitude, longitude);
        setState({
          latitude,
          longitude,
          permissionGranted: true,
          permissionDenied: false,
          error: null,
        });
      },
      (err) => {
        const fallback = getUserFallbackLocation(user);

        setState((prev) => ({
          latitude: prev.latitude ?? fallback.latitude,
          longitude: prev.longitude ?? fallback.longitude,
          permissionGranted: false,
          permissionDenied: err.code === err.PERMISSION_DENIED,
          error: err.message,
        }));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, [user]);

  const clearLocation = useCallback(() => {
    clearStoredLocation();
    setState({
      latitude: null,
      longitude: null,
      permissionGranted: false,
      permissionDenied: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    hasLocation: state.latitude != null && state.longitude != null,
    requestPermission,
    clearLocation,
  };
};
