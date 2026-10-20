```javascript
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const client = new MongoClient('YOUR_MONGODB_CONNECTION_STRING');

async function start() {
    await client.connect();

    const db = client.db('libraryDB');
    const books = db.collection('books');

    // READ books from MongoDB
    app.get('/api/books', async (req, res) => {
        res.json(await books.find().toArray());
    });

    // CREATE book in MongoDB
    app.post('/api/books', async (req, res) => {
        const result = await books.insertOne(req.body);
        res.json({ _id: result.insertedId, ...req.body });
    });

    // UPDATE book in MongoDB
    app.put('/api/books/:id', async (req, res) => {
        await books.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        res.json({ success: true });
    });

    // DELETE book from MongoDB
    app.delete('/api/books/:id', async (req, res) => {
        await books.deleteOne({
            _id: new ObjectId(req.params.id)
        });
        res.json({ success: true });
    });

    app.listen(3000, () => {
        console.log('Server running at http://localhost:3000');
    });
}

start().catch(console.error);
```
