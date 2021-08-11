const fs = require("fs");

// == cek folder data ==
const fdata = "./data";
const conjson = "./data/contacts.json";
if (!fs.existsSync(fdata)) {
	fs.mkdir(fdata, { recursive: true }, (err) => {
		if (err) throw err;
	});
}

if (!fs.existsSync(conjson)) {
	fs.writeFileSync(conjson, "[]", "utf8");
}

const loadContacts = () => {
	const contacts = fs.readFileSync(conjson, "utf8");
	return JSON.parse(contacts);
};

const simpanContacts = (contacts) => {
	fs.writeFileSync("./data/contacts.json", JSON.stringify(contacts), "utf8");
};

const detailContact = (nama) => {
	const contacts = loadContacts();
	const contact = contacts.find(
		(con) => con.nama.toLowerCase() === nama.toLowerCase()
	);
	return contact;
};

const addContact = (body) => {
	const contacts = loadContacts();
	contacts.push(body);
	simpanContacts(contacts);
};

const deleteContact = (nama) => {
	const contacts = loadContacts();
	const newContacts = contacts.filter((con) => con.nama != nama);
	simpanContacts(newContacts);
};

const updateContact = (contact) => {
	/* deleteContact(contact.namaLama)
	 * delete contact.namaLama
	 * addContact(contact) */

	const contacts = loadContacts();
	// -- temukan index contact lama --
	const indexContact = contacts.indexOf(
		contacts.find((con) => con.nama === contact.namaLama)
	);
	// -- timpa contact lama dengan contact baru --
	// contacts[indexContact] = contact // => cara biasa
	contacts.splice(indexContact, 1, contact); // => method splice
	simpanContacts(contacts);
};

const findContact = (nama) => {
	const contacts = loadContacts();
	const contact = contacts.find(
		(con) => con.nama.toLowerCase() === nama.toLowerCase()
	);
	if (contact) {
		return false;
	}
	return true
};

module.exports = {
	loadContacts,
	detailContact,
	addContact,
	deleteContact,
	updateContact,
	findContact,
};
