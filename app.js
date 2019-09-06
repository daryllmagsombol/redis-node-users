const express =  require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const redis = require('redis')

const port = 3000

const app = express();

let client = redis.createClient()

client.on('connect', ()=>{
    console.log('Redis connected')
})

let hey = client ? : 'r'
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use (bodyParser.json());
app.use (bodyParser.urlencoded({extended: false}));

app.use(methodOverride('_method'));

app.get ('/', (req, res, next)=> {
    res.render('searchusers')
})

app.post('/user/search', (req, res, next)=> {
    let id = req.body.id

    client.hgetall(id, (err, obj)=>{
        console.log('get')
        if (!obj) return res.render('searchusers', {error: 'User doesn\'t exists'})
        obj.id = id
        res.render('details', { user: obj })
    })
})

app.listen(port, ()=>{
    console.log('Server started on port ' + port)
})