export const rControl = /[\u0000-\u001f]/g;
export const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'\u201c\u201d\u2018\u2019<>,.?/]+/g;
export const rCombining = /[\u0300-\u036F]/g;

export const slugify = (str: string): string =>
  str
    .normalize("NFKD")
    .replace(rCombining, "")
    .replace(rControl, "")
    .replace(rSpecial, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/^(\d)/, "_$1")
    .toLowerCase();

export interface Section {
  n: number | null;
  title: string;
  clean: string;
  file: string;
  slug: string;
  children: { title: string; slug: string }[];
  body: string[];
}

export const stripNumber = (title: string): string => title.replace(/^\d+\.\s*/, "");

export const stripEmoji = (title: string): string =>
  title.replace(/^[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\s]+/u, "");

export const cleanHeading = (title: string): string =>
  stripEmoji(stripNumber(title)).replace(/\s+$/, "");
