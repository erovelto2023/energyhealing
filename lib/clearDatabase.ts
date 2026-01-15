import mongoose from 'mongoose';
import connectToDatabase from './db';
import Product from './models/Product';
import GlossaryTerm from './models/GlossaryTerm';
import Niche from './models/Niche';
import PendingReview from './models/PendingReview';
import Subscriber from './models/Subscriber';

async function clearDatabase() {
    try {
        console.log('Connecting to database...');
        await connectToDatabase();

        console.log('Clearing Products...');
        await Product.deleteMany({});

        console.log('Clearing Glossary Terms...');
        await GlossaryTerm.deleteMany({});

        console.log('Clearing Niches...');
        await Niche.deleteMany({});

        console.log('Clearing Pending Reviews...');
        await PendingReview.deleteMany({});

        console.log('Clearing Subscribers...');
        await Subscriber.deleteMany({});

        console.log('✅ Database cleared successfully!');

        // Close connection
        await mongoose.connection.close();
        console.log('Database connection closed.');

    } catch (error) {
        console.error('❌ Error clearing database:', error);
        process.exit(1);
    }
}

clearDatabase();
