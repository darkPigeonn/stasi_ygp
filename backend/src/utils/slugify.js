const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
};

const generateUniqueSlug = async (Model, baseSlug) => {
  let slug = slugify(baseSlug);
  let count = 0;
  let exists = await Model.findOne({ where: { slug } });

  while (exists) {
    count++;
    slug = `${slugify(baseSlug)}-${count}`;
    exists = await Model.findOne({ where: { slug } });
  }

  return slug;
};

module.exports = { slugify, generateUniqueSlug };
