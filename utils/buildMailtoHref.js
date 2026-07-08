export const parameters = ["to", "cc", "bcc", "subject", "body"];

/**
 * Build a `mailto:` href from form values.
 *
 * Each non-empty parameter (except `to`, which becomes the address part) is
 * URI-encoded. Newlines are custom-encoded as `%0D%0A` because of mobile
 * gmail rendering: https://github.com/dawsbot/mailto/issues/36
 */
export const buildMailtoHref = (formValues = {}) => {
  const { to = "", ...rest } = formValues;
  const suffix = parameters
    .filter((key) => key !== "to")
    .filter((key) => typeof rest[key] === "string" && rest[key].length > 0)
    .map((key) => {
      const encodedValue = rest[key]
        .split("\n")
        .map((part) => encodeURIComponent(part))
        .join("%0D%0A");
      return key + "=" + encodedValue;
    })
    .join("&");
  return `mailto:${to}${suffix && `?${suffix}`}`;
};
