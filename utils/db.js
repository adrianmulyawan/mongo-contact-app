// # Import Package
const mongoose = require('mongoose');

// # Konek ke MongoDB 
mongoose.connect('mongodb://localhost:27017/adrian-db');

// Tambah Data Kedalam Table Contact
// const contact1 = new Contact({
// 	nama: "Mandalika Ayusti",
// 	email: "manda.pumkins@gmail.com",
// 	ponsel: "082154590559"
// });

// Simpan Data Kedalam Table Contact 
// contact1.save()
// 	.then((result) => console.info(result))
// 	.catch((error) => console.info(error));