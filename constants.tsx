
import React from 'react';
import { ViewportType, ViewportConfig } from './types';

export const VIEWPORTS: Record<ViewportType, ViewportConfig> = {
  mobile: { width: 390, height: 844, scale: 0.9, name: 'iPhone 14 Pro' },
  tablet: { width: 1024, height: 768, scale: 0.8, name: 'iPad' },
  desktop: { width: 1440, height: 900, scale: 0.7, name: 'Desktop' },
  tv: { width: 1920, height: 1080, scale: 0.5, name: 'TV 4K' },
};

export const ACCENT_COLOR = '#3b82f6'; // Blue 500
