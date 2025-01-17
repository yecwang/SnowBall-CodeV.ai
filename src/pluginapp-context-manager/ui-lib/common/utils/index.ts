import { TLocales } from "../type";

export function translate(key: string, language: 'en' | 'cn', locales: TLocales): string {
  const locale: { [key: string]: string } = locales[language];

  key = key.replace('@@@', '');

  return locale[key] || key;
}

export function convertImageSrc(filename: string, projectID: string, type: string): string {
  return `/api/image?filename=${filename}&projectID=${projectID}&type=${type}`;
}
