import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendBookingNotification = async (bookingData: any) => {
    // If email config is missing, log a warning but don't crash
    if (!process.env.EMAIL_USER || !process.env.EMAIL_TO) {
        console.warn('Email notification skipped: EMAIL_USER or EMAIL_TO not configured in .env');
        return;
    }

    const { name, email, phone, service, bookingDate, bookingTime, message } = bookingData;

    const mailOptions = {
        from: `"Kathleen Heals System" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `✨ New Booking Request: ${name}`,
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #059669; border-bottom: 2px solid #ecfdf5; padding-bottom: 10px;">New Session Request</h2>
        
        <div style="margin-top: 20px;">
          <p><strong>Client Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Service:</strong> ${service || 'General Healing'}</p>
        </div>

        <div style="margin-top: 20px; padding: 15px; background-color: #f8fafc; border-radius: 8px;">
          <p style="margin: 0; font-weight: bold; color: #475569;">Requested Slot:</p>
          <p style="margin: 5px 0 0 0; font-size: 1.1em; color: #0f172a;">
            ${bookingDate} at ${bookingTime || 'TBD'} PST
          </p>
        </div>

        <div style="margin-top: 20px;">
          <p style="font-weight: bold; color: #475569;">Client Message:</p>
          <p style="font-style: italic; color: #334155; white-space: pre-wrap;">${message}</p>
        </div>

        <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 0.8em; color: #94a3b8;">
          <p>This is an automated notification from Kathleen Heals.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/bookings" style="color: #059669; text-decoration: none; font-weight: bold;">View in Dashboard &rarr;</a>
        </div>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Notification email sent to ${process.env.EMAIL_TO}`);
    } catch (error) {
        console.error('Error sending notification email:', error);
    }
};
