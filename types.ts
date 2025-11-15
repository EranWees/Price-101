export enum Page {
  Welcome,
  Home,
  Services,
  About,
  Photography,
  Reels,
  Portraits,
  // Add Dashboard and SmartLight to the Page enum
  Dashboard,
  SmartLight,
}

// Add Device interface for use in Dashboard component
export interface Device {
  id: string;
  name: string;
  details: string;
  icon: string;
  on: boolean;
  page: Page;
}

export interface PhotographyOrder {
  peopleCount: '1-2' | '3-7';
  normalPictures: number;
  expressPictures: {
    '24hrs': number;
    '12hrs': number;
    '6hrs': number;
  };
}

export interface ReelsOrder {
  basic: boolean;
  standard: boolean;
  premium: boolean;
}

export interface PortraitsOrder {
  a3: { quantity: number };
  a2: { quantity: number };
  a1: { quantity: number };
  a0: { quantity: number };
}
