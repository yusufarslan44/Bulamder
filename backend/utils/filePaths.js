const buildBaseUrl = (req) => {
  const envBase =
    process.env.PUBLIC_BASE_URL || process.env.APP_BASE_URL || "";
  if (envBase) {
    return envBase.replace(/\/$/, "");
  }

  const forwardedHost = req.get("x-forwarded-host");
  const forwardedProto = req.get("x-forwarded-proto");
  const protocol = forwardedProto || req.protocol;
  const host = forwardedHost || req.get("host");

  return `${protocol}://${host}`;
};

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
