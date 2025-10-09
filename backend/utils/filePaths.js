const buildBaseUrl = (req) => `${req.protocol}://${req.get("host")}`;

const isAbsoluteUrl = (value = "") => /^https?:\/\//i.test(value);

const toAbsoluteUrl = (req, value) => {
  if (!value) return value;
  if (isAbsoluteUrl(value)) return value;

  const baseUrl = buildBaseUrl(req);
  const normalizedPath = value.startsWith("/") ? value : `/${value}`;
  return `${baseUrl}${normalizedPath}`;
};

const withAbsoluteUploads = (req, content) => {
  if (typeof content !== "string" || !content.includes("/uploads/")) {
    return content;
  }

  const baseUrl = buildBaseUrl(req);

  return content.replace(
    /src=(["'])(\/uploads\/)/g,
    (match, quote, pathStart) => `src=${quote}${baseUrl}${pathStart}`
  );
};

module.exports = {
  toAbsoluteUrl,
  withAbsoluteUploads,
};
