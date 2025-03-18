const axios = require('axios');

async function sendMail(user, receivermail) {
  const emailApi = process.env.ELASTIC_EMAIL_BASE_URL;
  const emailApiKey = process.env.ELASTIC_EMAIL_API_KEY;

  try {
    await axios({
      method: 'POST',
      url: `${emailApi}/emails/transactional`,
      data: JSON.stringify({
        Recipients: { To: [receivermail] },
        Content: {
          Subject: 'Diskors Password reset',
          TemplateName: 'diskors-reset-pass',
          From: `Diskors <${process.env.ELASTIC_EMAIL_DEFAULT_SENDER_EMAIL}>`,
          Merge: {
            otp: user.passwordResetToken,
            name: receivermail.split('@')[0],
          },
        },
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-ElasticEmail-ApiKey': `${emailApiKey}`,
      },
    })

  } catch (error) {
    console.error('send mail error', error);
    return error;
  }
};

module.exports = { sendMail };