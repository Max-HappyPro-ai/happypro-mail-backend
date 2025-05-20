import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { name, email, message, type } = req.body;

  if (!name || !email || !type) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }

  let toEmail;
  switch (type) {
    case 'contact':
      toEmail = 'happypro.france@gmail.com';
      break;
    case 'candidature':
      toEmail = 'happypro.france@gmail.com';
      break;
    case 'newsletter':
      toEmail = 'happypro.france@gmail.com';
      break;
    default:
      return res.status(400).json({ error: 'Type invalide' });
  }

  try {
    await resend.emails.send({
      from: 'HappyPro <happypro.france@gmail.com>',
      to: toEmail,
      subject: `Nouvelle ${type} de ${name}`,
      html: `
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong> ${message || '(pas de message)'}</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
