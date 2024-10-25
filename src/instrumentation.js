
export async function register() {
    if(process.env.NEXT_RUNTIME === 'nodejs') {
        const votifier = require("votifier")(process.cwd() + '/votifier_keys/private.pem');

        votifier.on('vote', (vote) => {
            console.log(`Received vote from ${vote.serviceName} at ${vote.timestamp}`);
        });
    }
}