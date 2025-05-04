export function getVerificationEmail({
  verificationToken,
  url,
}: {
  verificationToken: string;
  url: string;
}) {
  return {
    subject: "Verifica tu cuenta",
    text: `Tu código de verificación es: ${verificationToken}\nO haz clic en: ${url}`,
    html: `
      <p>Tu código de verificación es:</p>
      <h2>${verificationToken}</h2>
      <p>O haz clic en el siguiente enlace:</p>
      <a href="${url}">${url}</a>
    `,
  };
}
