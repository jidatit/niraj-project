const express = require('express');
const app = express();
const CORS = require('cors')
const config = require("./config.js")
const PORT = config.port || 10000;
const HOSTURL = config.hostUrl
const { getDocs, addDoc, collection } = require('firebase/firestore');
const { db } = require('./firebase.js');
const fetch = require('node-fetch');

app.use(CORS())
app.use(express.json());

app.post('/webhook', async (req, res) => {
    try {
        const payload = req.body;
        const timestamp = new Date().toISOString();
        console.log("New Record:");
        console.log(`[${timestamp}] Received webhook payload:`, payload);
        await addDoc(collection(db, 'cms_quotes'), payload);
        res.status(201).send('Quote from CMS added into db successfully!');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.get('/get_quotes', async (req, res) => {
    try {
        const quotes = await getDocs(collection(db, 'cms_quotes'));
        const QuotesList = [];

        if (quotes.empty) {
            res.status(400).send('No Quotes found');
        } else {
            quotes.forEach((doc) => {
                const quoteData = {
                    id: doc.id,
                    ...doc.data()
                }
                QuotesList.push(quoteData);
            });

            res.status(200).send(QuotesList);
        }
    } catch (error) {
        res.send(400).send(error.message)
    }
})

app.post('/contact_info', async (req, res) => {
    try {
        const { email } = req.body;

        const response = await fetch(`https://jgi-holdings.clientdynamics.com/api/Contacts/list?search_criteria=email&search_value=${email}`, {
            method: 'GET',
            headers: {
                'X-API-Key': '8ee0c18932f2b248f9ef43879ee54b665d82409b',
                'X-Agency-Id': '7447270375',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const ContactId = data.results[0]?.ContactId || null

        if (ContactId !== null) {
            res.status(200).json({ status: 200, "ContactId": ContactId });
        }
        else {
            res.status(200).json({ status: 400, message: "No ContactId found." })
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: error.message });
    }
});

app.post('/policy_info', async (req, res) => {
    try {
        const { ContactId } = req.body;

        const response = await fetch(`https://jgi-holdings.clientdynamics.com/api/Policies/list?search_criteria=ContactId&search_value=${ContactId}`, {
            method: 'GET',
            headers: {
                'X-API-Key': '8ee0c18932f2b248f9ef43879ee54b665d82409b',
                'X-Agency-Id': '7447270375',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.num_records === 0) {
            res.status(200).json({ status: 400, message: "No Policy Data Found.", policyData: null })
        }
        else {
            res.status(200).json({ status: 200, policyData: data.results })
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is live @ ${HOSTURL}`);
});