const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 4000;

// MiddleWare
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zaiok.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {

        // Connect to database
        await client.connect();
        console.log('database connected successfully.')

        const database = client.db("waves_photography")
        const productCollection = database.collection("products")
        const orderCollection = database.collection("orders")

        // Get Packages API
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })

        // // Add Packages API
        // app.post('/packages', async (req, res) => {
        //     const package = req.body;
        //     const result = await packageCollection.insertOne(package);
        //     res.json(result);
        // })

        // Get Single Package
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const package = await productCollection.findOne(query);
            res.json(package);
        })

        // Add Orders API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })

        // // Get Orders API
        // app.get('/orders', async (req, res) => {
        //     const cursor = orderCollection.find({});
        //     const orders = await cursor.toArray();
        //     res.send(orders);
        // })

        // // Get MyOrders API
        // app.post('/orders/email', async (req, res) => {
        //     const email = req.body.email;
        //     const query = { "email": email };
        //     const result = await orderCollection.find(query).toArray();
        //     res.json(result);
        // })

        // // Update Status
        // app.post('/orders/:id', async (req, res) => {
        //     const id = req.body.id;
        //     const status = req.body.status;

        //     const filter = { _id: ObjectId(id) };
        //     const options = { upsert: true };
        //     const updateStatus = {
        //         $set: {
        //             "status": status === "pending" ? "approve" : "pending"
        //         }
        //     };
        //     const result = await orderCollection.updateOne(filter, updateStatus, options);
        //     res.json(result);
        // })

        // // Delete Orders API
        // app.delete('/orders/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await orderCollection.deleteOne(query);
        //     res.json(result);
        // })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Waves Photography website node mongo server')
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})