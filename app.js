// # Import Packages
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const multer = require('multer');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const flash = require('connect-flash');
// Import Koneksi ke MongoDB
require('./utils/db');
// Import Model Contact 
const Contact = require('./model/contact');

// # Setup Express
// > Jalankan Express
const app = express();
// > Set Port Express
const port = 3000;

// # Setup Multer
const upload = multer();

// # Setup EJS 
// > Beritahu Express Untuk Menggunakan EJS (Set View Engine)
app.set('view engine', 'ejs');
// > Gunakan Express EJS Layout
// > Salah satu third-party middleware
app.use(expressLayouts);
// > Built-in Middleware (express.static)
app.use(express.static('public'));
// > Midlleware Menangkap Data Dari Inputan Form (url encoded)
// app.use(express.urlencoded({ extended: true }));
app.use(upload.array());

// # Setup Flash Message
app.use(cookieParser('secret'));
app.use(
    session({
        cookie: { maxAge: 6000 },
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);
app.use(flash());

// # Routing
// > Halaman Home 
app.get('/', (req, res) => {
	// > Gunakan Templating Engine EJS 
	const mahasiswa = [
		{
			nama: "Adrian Mulyawan",
			email: "adrianmulyawan666@gmail.com"
		},
		{
			nama: "Mandalika Ayusti",
			email: "manda.pumkins@gmail.com"
		},
		{
			nama: "Akbar Suseno",
			email: "akbarsuseno@gmail.com"
		},
	];

	// > Kita bisa kirim data kedalam halaman html-nya 
	// => dengan memberikan object di parameter ke-2 method res.render
	res.render('index', {
		layout: 'partials/main-layout',
		nama: 'Adrian Mulyawan',
		title: 'Home',
		mahasiswa: mahasiswa,
	});
});

// > Halaman About
app.get('/about', (req, res) => {
	// > Gunakan Templating Engine EJS 
	res.render('about', {
		layout: 'partials/main-layout',
		title: 'About',
	});
});

// > Halaman Contact
app.get('/contact', async (req, res) => {
	// Menampung seluruh contacts (from database)
	const contacts = await Contact.find();

	// Gunakan Templating Engine EJS 
	res.render('contact', {
		layout: 'partials/main-layout',
		title: 'Contact',
		contacts: contacts,
		msg: req.flash('msg'), // tangkap flash message
	});
});

app.listen(port, () => {
	console.info(`Mongo Contact App || Listening at http://localhost:${port}`);
});