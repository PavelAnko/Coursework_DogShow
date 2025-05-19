const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')

const regToExhibitionRoutes = require('./src/api/routes/regToExhibitionRoutes.js');
const dashboardRoutes = require('./src/api/routes/dashboardRoutes.js');
const dogRoutes = require('./src/api/routes/dogRoutes.js');
const adminRoutes = require('./src/api/routes/adminRoutes/adminRoutes.js');
const registerRoutes = require('./src/api/routes/registrationRoutes.js');
const logInRoutes = require('./src/api/routes/logInRoutes.js');
const errorRoutes = require('./src/api/routes/errorRoutes.js');
const ErrorController = require('./src/api/controller/ErrorController.js');

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

// AdminController.createAdministrator();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})  

app.get('/api/owner-sesion', (req, res) => {
    const ownerExists = req.session.owner ? true : false;
    res.json({ ownerExists }); 
});

app.use('/dashboard/reg-exhibirions', regToExhibitionRoutes)
app.use('/dashboard', dashboardRoutes)
app.use('/dog', dogRoutes)
app.use('/admin', adminRoutes)
app.use('/register', registerRoutes)
app.use('/login', logInRoutes)

app.use(ErrorController.handle404);
app.use('/error', errorRoutes)

app.listen(PORT, () => console.info(`Listening on port http://${HOST}:${PORT}`))
