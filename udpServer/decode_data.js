const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'dataWHeader6.5.bin');

function decodeData() {
    try {
        // Read the raw binary data
        const buffer = fs.readFileSync(filePath);

        console.log("===============================");
        console.log(`Read ${buffer.length} bytes from data.bin`);
        console.log("===============================\n");

        console.log("--- HEX DUMP ---");
        console.log(buffer.toString('hex'));
        console.log("\n===============================\n");

        console.log("--- TEXT (UTF-8) ---");
        const textData = buffer.toString('utf8');
        console.log(textData);
        console.log("\n===============================\n");

        console.log("--- JSON PARSING ---");
        try {
            // Check if there are trailing null bytes or newlines affecting the parse
            const trimmedText = textData.trim().replace(/\0/g, '');
            const jsonData = JSON.parse(trimmedText);
            console.log("Success! Data is valid JSON:");
            console.log(JSON.stringify(jsonData, null, 2));
        } catch (e) {
            console.log("Could not parse as JSON. The data might not be JSON, or it might be corrupted.");
            console.log("Error details:", e.message);
        }

        // Check if it might have been corrupted by a text editor (UTF-8 replacement characters)
        if (buffer.indexOf(Buffer.from([0xef, 0xbf, 0xbd])) !== -1) {
            console.warn("\n===============================");
            console.warn("WARNING: Detected UTF-8 replacement characters (EF BF BD)!");
            console.warn("This strongly suggests the binary file was corrupted by being saved in a text editor.");
            console.warn("===============================");
        }

    } catch (err) {
        if (err.code === 'ENOENT') {
            console.error(`File not found: ${filePath}`);
        } else {
            console.error("Failed to read the file:", err.message);
        }
    }
}

decodeData();
