const express = require('express');
const app = express();
const config = require("./config.js")
const PORT = config.port || 10000;
const HOSTURL = config.hostUrl
const { getDocs, addDoc, collection } = require('firebase/firestore');
const { db } = require('./firebase.js');

app.use(express.json());

app.post('/webhook', async (req, res) => {
    try {
        const payload = req.body;
        const timestamp = new Date().toISOString();
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

// Endpoint just for testing purpose. 
// app.get('/users', async (req, res) => {
//     try {
//         const users = await getDocs(collection(db, 'users'));
//         const UsersList = [];

//         if (users.empty) {
//             res.status(400).send('No Users found');
//         } else {
//             users.forEach((doc) => {
//                 const userData = {
//                     id: doc.id,
//                     ...doc.data()
//                 }
//                 UsersList.push(userData);
//             });

//             res.status(200).send(UsersList);
//         }
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// })

app.listen(PORT, () => {
    console.log(`Server is live @ ${HOSTURL}`);
});