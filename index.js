const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')

const RegOwnerController = require('./src/controller/RegOwnerController.js');
const RegDogController = require('./src/controller/RegDogController.js');
const ErrorController = require('./src/controller/ErrorController.js');
const LogOwnerController = require('./src/controller/LogOwnerController.js');
const DashboardController = require('./src/controller/DashboardController.js');

const app = express()
app.use(express.json())
const PORT = 3333
const HOST = 'localhost'

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: 'kyno-secret',
    resave: false,
    saveUninitialized: true
}))

app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})


app.post('/register', RegOwnerController.registerOwner);

app.get('/login', LogOwnerController.getLogOwnerPage);
app.post('/login', LogOwnerController.loginOwner);

app.get('/add-dog', RegDogController.getAddDogPage);
app.get('/api/breeds', RegDogController.getBreeds);
app.post('/add-dog', RegDogController.registerDog);

app.get('/dashboard', DashboardController.getDashboardPage)
app.get('/api/owner-info', DashboardController.getOwnerInfo)
app.get('/api/owner-dogs', DashboardController.getOwnerDogs);
app.get('/api/exhibitions', DashboardController.getExhibitions);


app.get('/error/403', ErrorController.handle403);
app.get('/error/500', ErrorController.handle500);
app.use(ErrorController.handle404);

app.listen(PORT, () => console.info(`Listening on port http://${HOST}:${PORT}`))
