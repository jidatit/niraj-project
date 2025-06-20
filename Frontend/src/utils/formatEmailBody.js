export function formatEmailBody(body, logoUrl, logoPosition) {
  if (!logoUrl) return body; // If no logo URL, return body as is

  const logoElement = `<img src="${logoUrl}" alt="Logo" style="max-width: 200px; display: block; margin: 10px 0;">`;
  const bodyParagraphs = body.split("\n").map((p) => `<p>${p}</p>`);

  let formattedBody;
  switch (logoPosition) {
    case "top":
      formattedBody = `${logoElement}${bodyParagraphs.join("")}`;
      break;
    case "bottom":
      formattedBody = `${bodyParagraphs.join("")}${logoElement}`;
      break;
    case "after-greeting":
      formattedBody = `${bodyParagraphs[0]}${logoElement}${bodyParagraphs
        .slice(1)
        .join("")}`;
      break;
    case "before-signature":
      const signatureIndex =
        bodyParagraphs.length - 2 >= 0
          ? bodyParagraphs.length - 2
          : bodyParagraphs.length - 1;
      formattedBody = `${bodyParagraphs
        .slice(0, signatureIndex)
        .join("")}${logoElement}${bodyParagraphs
        .slice(signatureIndex)
        .join("")}`;
      break;
    default:
      formattedBody = `${logoElement}${bodyParagraphs.join("")}`;
  }

  return formattedBody;
}
