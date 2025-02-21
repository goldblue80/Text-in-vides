const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Fake AI Video Generation API
app.post('/generate', async (req, res) => {
    try {
        let body = [];
        req.on('data', chunk => body.push(chunk));
        req.on('end', () => {
            body = JSON.parse(Buffer.concat(body).toString());
            if (!body.prompt) return res.status(400).json({ error: "Prompt is required" });

            console.log("Generating video for:", body.prompt);
            const fakeVideoUrl = "/sample.mp4"; // Replace with real AI processing

            res.json({ video_url: fakeVideoUrl });
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Serve HTML
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Video Generator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f4f4f4;
            padding: 20px;
        }
        input, button {
            margin: 10px;
            padding: 10px;
            font-size: 16px;
        }
        video {
            width: 80%;
            margin-top: 20px;
            display: none;
        }
        .loading {
            display: none;
            font-size: 18px;
            color: blue;
        }
        .error {
            color: red;
            font-size: 16px;
        }
    </style>
    <script defer>
        async function generateVideo() {
            let prompt = document.getElementById("prompt").value;
            let videoPlayer = document.getElementById("videoPlayer");
            let loading = document.getElementById("loading");
            let errorMsg = document.getElementById("errorMsg");

            if (!prompt.trim()) {
                errorMsg.innerText = "Please enter a valid prompt!";
                return;
            }

            errorMsg.innerText = "";
            loading.style.display = "block";
            videoPlayer.style.display = "none";

            try {
                let response = await fetch('/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt })
                });

                let data = await response.json();
                if (!data.video_url) throw new Error("Failed to generate video");

                videoPlayer.src = data.video_url;
                videoPlayer.style.display = "block";
                videoPlayer.play();
            } catch (error) {
                errorMsg.innerText = "Error: " + error.message;
            } finally {
                loading.style.display = "none";
            }
        }
    </script>
</head>
<body>
    <h1>AI Video Generator</h1>
    <input type="text" id="prompt" placeholder="Enter prompt...">
    <button onclick="generateVideo()">Generate</button>
    <p id="loading" class="loading">Generating video... Please wait.</p>
    <p id="errorMsg" class="error"></p>
    <video id="videoPlayer" controls></video>
</body>
</html>`);
});

// Start Server
app.listen(PORT, () => {
    console.log(\`Server running at http://localhost:\${PORT}\`);
});
