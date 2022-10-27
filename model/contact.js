// # Import Package 
const mongoose = require('mongoose');

// # Membuat Schema 
// => Struktur DB: Table Contact
const Contact = mongoose.model('Contact', {
	nama: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	ponsel: {
		type: String,
		require: true,
	}
});

// Export Model 
module.exports = Contact;