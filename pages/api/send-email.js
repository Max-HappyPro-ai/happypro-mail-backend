import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { type, ...formData } = req.body;

  if (!type || !formData.email) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }

  // Définir l’adresse de destination selon le type
  const toEmail = 'happypro.france@gmail.com'; // Tu peux adapter si besoin

  // Générer dynamiquement le contenu HTML avec toutes les données reçues
  const htmlContent = Object.entries(formData)
    .map(([key, value]) => {
      const cleanKey = key.charAt(0).toUpperCase() + key.slice(1);
      return `<p><strong>${cleanKey} :</strong> ${value || '(vide)'}</p>`;
    })
    .join('\n');

  try {
    await resend.emails.send({
      from: 'HappyPro <happypro.france@gmail.com>',
      to: toEmail,
      subject: `Nouvelle demande : ${type}`,
      html: htmlContent,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erreur Resend :', error);
    return res.status(500).json({ error: 'Erreur lors de l’envoi de l’email' });
  }
}
