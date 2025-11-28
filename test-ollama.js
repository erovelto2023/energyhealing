
async function test() {
    try {
        console.log('Connecting to Ollama...');
        const res = await fetch('http://31.97.146.3:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'deepseek-r1:latest',
                prompt: 'hi',
                stream: true
            })
        });

        console.log('Status:', res.status);
        if (!res.ok) {
            console.log('Error:', await res.text());
        } else {
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
