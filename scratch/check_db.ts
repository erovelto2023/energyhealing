import connectToDatabase from "../lib/db";
import Resource from "../lib/models/Resource";

async function check() {
    try {
        await connectToDatabase();
        const count = await Resource.countDocuments();
        console.log("Total Resources:", count);
        const resources = await Resource.find().limit(5);
        console.log("Sample Resources:", JSON.stringify(resources, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
    process.exit(0);
}

check();
