const express = require('express');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const { Server } = require('socket.io')
const cookieParser = require('cookie-parser')
const multer = require('multer');



const MONGODB_CONNECT = `mongodb+srv://carlosalfredogomez:MongoAtlas423@ecommerce.d3n3mjn.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(MONGODB_CONNECT)
  .then(() => console.log('Conexión exitosa a la base de datos'))
  .catch((error) => {
    if (error) {
      console.log('Error al conectarse a la base de datos', error.message)
    }
  })

const app = express()

app.use(cookieParser('secretkey'))

app.use(session({

  store: MongoStore.create({
    mongoUrl:MONGODB_CONNECT,
    ttl:90000

  }),
  secret: 'secretSession',
  resave: true,
  saveUninitialized: true
}));




// Middleware para el manejo de JSON y datos enviados por formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// Configuración handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploader/img');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const uploader = multer({ storage: storage });

// Seteo de forma estática la carpeta public
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');


// Crear el servidor HTTP
const httpServer = app.listen(8080, () => {
  console.log(`Servidor express escuchando en el puerto 8080`);
});
// Crear el objeto `io` para la comunicación en tiempo real
const io = new Server(httpServer);

// Implementación de enrutadores

const sessionRouter = require('./routers/sessionRouter');
const productsRouter = require('./routers/productsRouter');
const cartsRouter = require('./routers/cartsRouter');
const viewsRouter = require('./routers/viewsRouter');

// Rutas base de enrutadores
app.use('/api/sessions',sessionRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Ruta de health check
app.get('/healthCheck', (req, res) => {
    res.json({
        status: 'running',
        date: new Date(),
    });
});

module.exports = io