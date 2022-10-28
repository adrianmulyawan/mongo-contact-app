// # Import Packages
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const multer = require('multer');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const flash = require('connect-flash');
const { body, validationResult, check } = require('express-validator');
const methodOverride = require('method-override');
// Import Koneksi ke MongoDB
require('./utils/db');
// Import Model Contact 
const Contact = require('./model/contact');

// # Setup Express
// > Jalankan Express
const app = express();
// > Set Port Express
const port = 3000;

// # Setup Method Override
app.use(methodOverride('_method'));

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
// => Halaman Utama Contact
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

// => Halaman Tambah Data Contact 
app.get('/contact/add', (req,res) => {
	res.render('add-contact', {
		layout: 'partials/main-layout',
		title: 'Add New Contact',
	})
});
// => Proses Tambah Data Contact
app.post('/contact', [
	// Validation => using express-validator
	// > Custom Validation
	body('nama').custom(async (value) => {
		const duplicate = await Contact.findOne({ nama: value });
		if (duplicate) {
				throw new Error('Nama Kontak Telah Terdaftar');
		}
		return true;
	}),
	// > Validation Email
	check('email', 'Email Tidak Valid').isEmail(),
	// > Validation Phone Number
	check('ponsel', 'No Handphone Tidak Valid').isMobilePhone('id-ID'),
], (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// return res.status(400).json({ errors: error.array() });
		res.render('add-contact', {
			layout: 'partials/main-layout',
			title: 'Add New Contact',
			errors: errors.array(),
		});
	} else {
		// req.body => mengambil data dari inputan form
		Contact.insertMany(req.body, (error, result) => {
			// Kirim flash message
			req.flash('msg', 'Data Kontak Berhasil Ditambahkan');

			// Setelah berhasil simpan data kontak kita redirect
			// redirect kehalaman /contact
			res.redirect('/contact');
		});
	}
});

// => Proses Hapus Data Contact
app.delete('/contact/:nama', (req, res) => {
	// res.send(req.body);
	// console.info(req.params.nama);
	Contact.deleteOne({ nama: req.params.nama }).then((result) => {
		// Kirim flash message
		req.flash('msg', 'Data Kontak Berhasil Dihapus');

		// Setelah berhasil simpan data kontak kita redirect
		// redirect kehalaman /contact
		res.redirect('/contact');
	});
});

// => Route Untuk Halaman Edit Data
app.get('/contact/edit/:nama', async (req,res) => {
	// Cari Data Kontak
	const contact = await Contact.findOne({ nama: req.params.nama });

	res.render('edit-contact', {
		layout: 'partials/main-layout',
		title: 'Edit Contact',
		contact: contact,
	});
});
// => Route Proses Untuk Update Data
app.put('/contact/update', [
		// Validation => using express-validator
		// > Custom Validation
		body('nama').custom( async (value, { req }) => {
			const duplicate = await Contact.findOne({ nama: value });
			console.info(duplicate);
			if (value !== req.body.oldNama && duplicate) {
				throw new Error('Nama Kontak Telah Terdaftar');
			}
			return true;
		}),
		// > Validation Email
		check('email', 'Email Tidak Valid').isEmail(),
		// > Validation Phone Number
		check('ponsel', 'No Handphone Tidak Valid').isMobilePhone('id-ID'),
	], (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// return res.status(400).json({ errors: error.array() });
		res.render('edit-contact', {
			layout: 'partials/main-layout',
			title: 'Edit Contact',
			errors: errors.array(),
			contact: req.body,
		});
	} else {
		// req.body => mengambil data dari inputan form
		Contact.updateOne(
			{ _id: req.body._id }, 
			{
				$set: {
					nama: req.body.nama,
					email: req.body.email,
					ponsel: req.body.ponsel,
				},
			},
		).then((result) => {
			// Kirim flash message
			req.flash('msg', 'Data Kontak Berhasil Diubah');

			// Setelah berhasil simpan data kontak kita redirect
			// redirect kehalaman /contact
			res.redirect('/contact');
		});
	}
});

// => Halaman Detail Contact
app.get('/contact/:nama', async (req, res) => {
	// const contact = findContact(req.params.nama);
	const contact = await Contact.findOne({ nama: req.params.nama });

	res.render('detail',{
		layout: 'partials/main-layout',
		title: 'Detail Contact',
		contact,
	});
});

app.listen(port, () => {
	console.info(`Mongo Contact App || Listening at http://localhost:${port}`);
});