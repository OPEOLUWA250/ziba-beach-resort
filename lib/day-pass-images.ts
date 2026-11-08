/**
 * Photos for day-pass add-on experiences. Names come from the admin, so
 * they're matched on keywords (most specific first) rather than exact names;
 * anything unmatched gets a general beach photo, so a new add-on never shows
 * up without a picture.
 *
 * Photos are the resort's own, from public/experience-ziba (several taken
 * from the Experiences page on zibabeachresort.com).
 */
const RULES: [RegExp, string][] = [
  [/paint.*pool|pool.*paint|floating snack/i, "/experience-ziba/paint-and-chill-pool.jpg"],
  [/paint.*(child|kid)|(child|kid).*paint/i, "/experience-ziba/paint-and-chill-kids.jpg"],
  [/paint|canvas|tote/i, "/experience-ziba/paint-and-chill.jpg"],
  [/kid.*massage|child.*massage/i, "/experience-ziba/spa.jpg"],
  [/deep tissue/i, "/experience-ziba/massages.jpg"],
  [/massage|spa/i, "/experience-ziba/spa-2.jpg"],
  [/picnic/i, "/experience-ziba/beach-side-picnic.jpg"],
  [/lunch|dinner|dining|group meal/i, "/experience-ziba/family-beach-dining.jpg"],
  [/horse/i, "/experience-ziba/horse-riding.jpg"],
  [/quad/i, "/experience-ziba/quad-bike.jpg"],
  [/breakfast/i, "/experience-ziba/floating-breakfast.jpg"],
  [/movie|cinema/i, "/experience-ziba/floating-movie.jpg"],
  [/hand ?cast/i, "/experience-ziba/handcasting.jpg"],
  [/kite/i, "/experience-ziba/kite-flying.jpg"],
  [/flying dress|photo|shoot/i, "/experience-ziba/flying-dress.jpg"],
];

export const DEFAULT_ADD_ON_IMAGE = "/day-experience.jpg";

export function addOnImage(name: string): string {
  return RULES.find(([re]) => re.test(name))?.[1] ?? DEFAULT_ADD_ON_IMAGE;
}
