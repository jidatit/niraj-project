const express = require('express');
const app = express();
const PORT = 4000;

app.use(express.json());

app.post('/webhook', (req, res) => {
    const payload = req.body;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Received webhook payload:`, payload);
    res.status(200).send('Webhook received successfully');
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});