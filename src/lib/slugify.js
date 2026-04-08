import slugify from 'slugify';

export function generateSlug(title, existingSlugs = []) {
  let slug = slugify(title, { lower: true, strict: true });
  const baseSlug = slug;
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
