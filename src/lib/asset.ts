// Resolves a file in `public/` against the deploy base path (e.g. GitHub Pages subpath).
export const asset = (path: string) =>
  /^(https?:)?\/\//.test(path) || path.startsWith("data:")
    ? path
    : `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
