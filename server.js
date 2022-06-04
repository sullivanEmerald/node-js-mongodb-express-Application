const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()

const connectionstring = 'mongodb+srv://sullivan_emerald:chigozie33513140@cluster0.7ug7y.mongodb.net/?retryWrites=true&w=majority'

// MongoClient.connect(connectionstring, (err, client) => {
//     if(err) return console.log(err)
//     console.log('connected to the database')
// })

MongoClient.connect(connectionstring, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')

    // intializing the EJS (embedded javascript)

    // fectching data from the database
    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(express.static('public')) 
    app.use(bodyParser.json())

    // rendering hmtl and converting our database object to an array of objects
    app.get('/', (req, res) => {
        quotesCollection.find().toArray()
        .then(results => {
            res.render('index.ejs', {quotes: results})
        })
        .catch(error => console.log(error))
        

        // formerly was using the index.htm
        // res.sendFile(__dirname + 'index.html')
    })


    // processing the form
    app.post('/quotes', (req, res) => {
        quotesCollection.insertOne(req.body)
        .then(result => {
            console.log(result)
            res.redirect('/')
        })
        .catch(error => console.log(error))
    })

    app.put('/quotes', (req, res) => {
        quotesCollection.findOneAndUpdate(
            {name : 'sullivan'},
            {
                $set: {
                    name: req.body.name,
                    quote: req.body.quote
                }
            },
            {
                upsert: true
            }
        )

        .then(result => {
            console.log(result)
            res.json('Success')
        })
        .catch(error => console.error(error))
    })

    app.delete('/quotes', (req, res) => {
        quotesCollection.deleteOne(
            {name: req.body.name},

        )

        .then(result => {
            if(result.deletedCount === 0){
                return res.json('No quote to delete')
            }
            res.json(`Deleted Sullivan's quote`)
        })
        .catch(error => console.error(error))
    })

    
    app.listen(3000, () => {
        console.log('listening to port 3000')
    })
  })
  .catch(error => console.error(error))









