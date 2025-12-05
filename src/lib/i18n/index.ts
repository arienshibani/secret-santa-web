import { writable, derived, get } from 'svelte/store';
import type { Language } from '../utils/types';
import en from './locales/en.json';
import nb from './locales/nb.json';
import nn from './locales/nn.json';

const translations = {
	en,
	nb,
	nn
};

const detectLanguage = (): Language => {
	if (typeof window === 'undefined') return 'en';
	
	const stored = localStorage.getItem('language') as Language | null;
	if (stored && (stored === 'en' || stored === 'nb' || stored === 'nn')) {
		return stored;
	}
	
	const browserLang = navigator.language.toLowerCase();
	if (browserLang.startsWith('nn')) return 'nn';
	if (browserLang.startsWith('nb') || browserLang.startsWith('no')) return 'nb';
	return 'en';
};

export const currentLanguage = writable<Language>(detectLanguage());

currentLanguage.subscribe((lang) => {
	if (typeof window !== 'undefined') {
		localStorage.setItem('language', lang);
	}
});

const getTranslation = (lang: Language, key: string): string => {
	const keys = key.split('.');
	let value: any = translations[lang];
	
	for (const k of keys) {
		value = value?.[k];
	}
	
	if (typeof value !== 'string') {
		// Fallback to English
		let fallback: any = translations.en;
		for (const k of keys) {
			fallback = fallback?.[k];
		}
		value = typeof fallback === 'string' ? fallback : key;
	}
	
	return value;
};

export const t = derived(currentLanguage, ($lang) => {
	return (key: string, params?: Record<string, string>): string => {
		let value = getTranslation($lang, key);
		
		if (params) {
			value = value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
				return params[paramKey] || match;
			});
		}
		
		return value;
	};
});

