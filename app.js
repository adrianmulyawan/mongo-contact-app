// # Import Packages
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const multer = require('multer');

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

app.listen(port, () => {
    console.info(`Mongo Contact App || Listening at http://localhost:${port}`);
});