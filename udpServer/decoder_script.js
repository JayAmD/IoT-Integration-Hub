const fs = require('fs');
const path = require('path');
const cbor = require('cbor');

const filePath = path.join(__dirname, 'data.bin');

function decodeCbor() {
    try {
        if (!fs.existsSync(filePath)) {
            console.error(`File not found: ${filePath}`);
            return;
        }

        const buffer = fs.readFileSync(filePath);
        
        console.log("===============================");
        console.log(`Read ${buffer.length} bytes from data.bin`);
        console.log("===============================\n");

        console.log("--- HEX DUMP ---");
        console.log(buffer.toString('hex'));
        console.log("\n===============================\n");

        console.log("--- CBOR DECODING ATTEMPT ---");
        try {
            // Check if the file contains hex string instead of raw binary
            const text = buffer.toString('utf8').trim();
            const compact = text.replace(/\s+/g, '');
            let payload = buffer;
            
            if (/^[0-9a-fA-F]+$/.test(compact) && compact.length % 2 === 0) {
                console.log("Detected Hex string, converting to buffer...");
                payload = Buffer.from(compact, 'hex');
            }

            const decoded = cbor.decodeAllSync(payload);
            console.log("Success! Data is valid CBOR:");
            console.dir(decoded, { depth: null });
            
            const outputPath = path.join(__dirname, 'decoded_output.json');
            fs.writeFileSync(outputPath, JSON.stringify(decoded, null, 2));
            console.log(`\nSaved decoded JSON to ${outputPath}`);
            
        } catch (e) {
            console.log("Could not decode as CBOR.");
            console.log("Error details:", e.message);
        }

    } catch (err) {
        console.error("Failed to read the file:", err.message);
    }
}

decodeCbor();
