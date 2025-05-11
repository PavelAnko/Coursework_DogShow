const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')

const RegOwnerController = require('./src/controller/RegOwnerController.js');
const RegDogController = require('./src/controller/RegDogController.js');
const ErrorController = require('./src/controller/ErrorController.js');
const LogOwnerController = require('./src/controller/LogOwnerController.js');
const DashboardController = require('./src/controller/DashboardController.js');
const RegToExhibition = require('./src/controller/RegToExhibition.js');
const AdminController = require('./src/controller/adminController/AdminController.js');

const app = express()
// const router = express.Router();
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
app.delete('/api/delete-dog/:dogId', DashboardController.deleteDog);
app.post('/logout', DashboardController.logout);
app.get('/api/dog-achievements/:dogId', DashboardController.getDogAchievementsById)

app.get('/dashboard/reg-exhibirions', RegToExhibition.getRegisterDogFormToExhibition);
app.post('/dashboard/reg-exhibirions', RegToExhibition.registerDogToExhibition);
app.get('/api/owner-registrations', RegToExhibition.getExhibitionRegistrations)
app.get('/dashboard/available-exhibitions/:dogId', RegToExhibition.getAvailableExhibitionsForDog);

app.get('/admin', AdminController.getAdminLogInPage)
app.post('/admin', AdminController.loginAdmin);
app.get('/admin/dashboard', AdminController.getAdminDashboardPage)
app.get('/api/all-owners', AdminController.getAllOwners)
app.get('/api/owner-dogs/:ownerId', AdminController.getOwnerDogsById)
app.get('/api/dog-achievements', AdminController.getAllDogsAchievements)
app.get('/api/dog-exhibition/:dogId', AdminController.getDogExhibitionById)
app.post('/admin/dashboard-achievement', AdminController.postDogAchievement)
app.post('/admin/removing-dog-exhibition', AdminController.removingDogFromExhibition)
app.get('/api/exhibitions-categories', AdminController.getAllExhibitionsCategories)
app.post('/admin/dashboard-exhibition', AdminController.postExhibitionsByAdmin)

app.get('/error/403', ErrorController.handle403);
app.get('/error/500', ErrorController.handle500);
app.use(ErrorController.handle404);

app.listen(PORT, () => console.info(`Listening on port http://${HOST}:${PORT}`))
