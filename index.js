const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

//middlewaire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tz5xn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)

async function run(){
    try{
        await client.connect();
        console.log('connected to db')
        const database = client.db('travelDb');
        const servicesCollection = database.collection('services');
        //Get All data
        app.get('/services', async(req, res) =>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        //Post api
        app.post('/services', async(req, res) =>{
            const service = req.body;
           console.log('hit the post', service)

            const result = await servicesCollection.insertOne(service)
            console.log(result)
            res.json(result)
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Running  server')
});

app.listen(port, ()=>{
    console.log('Running  port', port)
});