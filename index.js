const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kfnsc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('My_Kitchen').collection('services');
        const reviewCollection = client.db('My_Kitchen').collection('reviews');


        app.get('/homeService', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query).sort({ _id: -1 });
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = serviceCollection.find(query);
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });


        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { services: id };
            const cursor = reviewCollection.find(query).sort({ _id: -1 });
            const review = await cursor.toArray();
            res.send(review);
        });





        app.get('/reviews', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }

            const cursor = reviewCollection.find(query).sort({ _id: -1 });
            const review = await cursor.toArray();
            res.send(review);
        });


        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        });

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })


        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const message = req.body.message
            console.log(message)
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: {
                    message: message
                }
            }
            const result = await reviewCollection.updateOne(query, updatedDoc);
            res.send(result);
        })

        // app.post('/orders', async (req, res) => {
        //     const order = req.body;
        //     const result = await orderCollection.insertOne(order);
        //     res.send(result);
        // });




    }
    finally {

    }

}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('jAWAD kitchen server is running')
})

app.listen(port, () => {
    console.log(`jAWAD kitchen server running on ${port}`);
})