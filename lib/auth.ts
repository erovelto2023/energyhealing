import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function validateAdmin() {
    const { userId } = await auth();
    
    if (!userId) {
        return null;
    }

    const user = await currentUser();
    if (!user) return null;

    // Check publicMetadata for admin role
    const isAdmin = user.publicMetadata?.role === 'admin';
    
    // Fallback: Check if the user's email matches a known admin email
    // This is useful for initial setup before metadata is set.
    const adminEmails = [process.env.EMAIL_TO, 'erove@example.com']; // Example admin email
    const userEmail = user.emailAddresses[0]?.emailAddress;
    
    const isEmailAdmin = userEmail && adminEmails.includes(userEmail);

    if (!isAdmin && !isEmailAdmin) {
        return null;
    }

    return user;
}

export async function protectAdmin() {
    const user = await validateAdmin();
    if (!user) {
        redirect('/');
    }
    return user;
}
