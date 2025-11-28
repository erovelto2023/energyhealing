
async function test() {
    try {
        console.log('Fetching...');
        const res = await fetch('http://localhost:3000/api/blog/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                primaryKeyword: 'test',
                tone: 'conversational',
                length: '500'
            })
        });

        console.log('Status:', res.status);
        if (!res.ok) {
            const text = await res.text();
            console.log('Error body length:', text.length);
            const fs = require('fs');
            fs.writeFileSync('error.html', text);
        } else {
            console.log('Success! Stream started.');
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                process.stdout.write(decoder.decode(value));
            }
        }
    } catch (e) {
        console.error('Fetch error:', e);
    }
}
test();
