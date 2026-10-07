import sanitizeHtml from "sanitize-html";

export function sanitizeArticleHtml(dirtyHtml: string): string {
  return sanitizeHtml(dirtyHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "code",
      "pre",
      "figure",
      "figcaption",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "width", "height", "class"],
      a: ["href", "name", "target", "rel"],
      div: ["class"],
      span: ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}
