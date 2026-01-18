
import { useState, useEffect, useCallback } from 'react';

export type Brand = 'ivoirehub' | 'ansut';

const BRAND_STORAGE_KEY = 'ivoire-hub-brand';
const DEFAULT_BRAND: Brand = 'ivoirehub';

export function useBrand() {
  const [brand, setBrandState] = useState<Brand>(DEFAULT_BRAND);

  const setBrand = useCallback((newBrand: Brand) => {
    document.documentElement.setAttribute('data-brand', newBrand);
    localStorage.setItem(BRAND_STORAGE_KEY, newBrand);
    setBrandState(newBrand);
  }, []);

  useEffect(() => {
    // Initialize brand from localStorage or default
    const savedBrand = localStorage.getItem(BRAND_STORAGE_KEY) as Brand | null;
    const initialBrand = savedBrand && ['ivoirehub', 'ansut'].includes(savedBrand) 
      ? savedBrand 
      : DEFAULT_BRAND;
    
    document.documentElement.setAttribute('data-brand', initialBrand);
    setBrandState(initialBrand);
  }, []);

  const toggleBrand = useCallback(() => {
    const newBrand: Brand = brand === 'ivoirehub' ? 'ansut' : 'ivoirehub';
    setBrand(newBrand);
  }, [brand, setBrand]);

  const brandInfo = {
    ivoirehub: {
      name: 'Ivoire Hub',
      description: 'Startup friendly, warm green & gold theme',
      primaryColor: '#0E6B3D',
      accentColor: '#F57C00',
    },
    ansut: {
      name: 'ANSUT / État',
      description: 'Institutional, formal blue & orange theme',
      primaryColor: '#0B5FA6',
      accentColor: '#F57C00',
    },
  };

  return {
    brand,
    setBrand,
    toggleBrand,
    brandInfo: brandInfo[brand],
    allBrands: brandInfo,
  };
}
