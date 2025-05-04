export function getPasswordResetEmail({ url }: { url: string }) {
  return {
    subject: "Restablece tu contraseña",
    text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${url}`,
    html: `
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${url}">${url}</a>
    `,
  };
}
