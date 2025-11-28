import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { BookingRequest } from '@/lib/models'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
    try {
        await dbConnect()

        const body = await req.json()
        const { name, email, phone, service, message } = body

        // Validation
        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Save to Database
        const booking = await BookingRequest.create({
            name,
            email,
            phone,
            service,
            message
        })

        // Send Email
        // Note: This requires SMTP environment variables to be set
        try {
            if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: parseInt(process.env.SMTP_PORT || '587'),
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                })

                await transporter.sendMail({
                    from: `"Kathleen Heals Website" <${process.env.SMTP_USER}>`,
                    to: "erovelto@outlook.com",
                    subject: `New Healing Session Request from ${name}`,
                    text: `
Name: ${name}
Email: ${email}
Phone: ${phone || 'N/A'}
Service Interest: ${service || 'General'}

Message:
${message}
                    `,
                    html: `
<h2>New Healing Session Request</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone:</strong> ${phone || 'N/A'}</p>
<p><strong>Service Interest:</strong> ${service || 'General'}</p>
<br>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
                    `,
                })
                console.log('Email notification sent successfully')
            } else {
                console.log('Email skipped: SMTP credentials not configured')
            }
        } catch (emailError) {
            console.error('Failed to send email notification:', emailError)
            // We don't fail the request if email fails, as long as DB save worked
        }

        return NextResponse.json({ success: true, booking }, { status: 201 })
    } catch (error) {
        console.error('Error submitting contact form:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
