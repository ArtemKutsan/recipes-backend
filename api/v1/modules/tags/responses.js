export function toTagResponse(tag) {
  const plainTag = tag.toJSON();

  return {
    id: plainTag.id,
    title: plainTag.title,
    slug: plainTag.slug,
  };
}
