// Using native fetch

async function run() {
    try {
        // We expect 401 if auth is working, or 500 if it crashes
        const response = await fetch('http://localhost:3000/api/admin/bookings', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Script Error:', error);
    }
}

run();
