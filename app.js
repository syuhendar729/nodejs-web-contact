/* === Latihan membuat web app ===  */
const express = require("express");
const ejs = require("ejs");
const app = express();
const port = 3000;
// -- validator --
const { body, validationResult } = require("express-validator");
const {
	loadContacts,
	detailContact,
	addContact,
	deleteContact,
	updateContact,
	findContact,
} = require("./utils/contact");
// -- flash message --
const session = require("express-session");
const path = require("path");
const { flash } = require("express-flash-message");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// -- flash middleware --
app.use(
	session({
		secret: "secret",
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7,
		},
	})
);
// -- apply express-flash-message middleware --
app.use(flash({ sessionKeyName: "flashMessage" }));

app.get("/", (req, res) => {
	res.render("index", {
		title: "Page Index",
		url: req.originalUrl,
	});
});

app.get("/about", (req, res) => {
	res.render("about", {
		title: "Page About",
		desc: "This page tell about me",
		url: req.originalUrl,
	});
});

// ### Aplikasi Contact ###

app.get("/contact", (req, res) => {
	res.render("contact", {
		title: "Page Contact",
		desc: "This page showing my list contact",
		url: req.originalUrl,
		contacts: loadContacts(),
	});
});

// == form tambah data ==
app.get("/contact/add", async (req, res) => {
	const messages = await req.consumeFlash("errors");
	// console.log(messages[0])
	res.render("add", {
		title: "Page Detail",
		url: req.originalUrl,
		messages: messages[0],
	});
});

// == proses tambah data ==
app.post(
	"/contact/add",
	body("nama")
		.custom((value) => findContact(value))
		.withMessage("Name already in use"),
	body("kelas").isInt().withMessage("Grade must be number"),
	body("email").isEmail().withMessage("Email not valid"),
	body("notelp").isMobilePhone("id-ID").withMessage("Phone number not valid"),
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.redirect("/contact/add");
			req.flash("errors", { errors: errors.array() });
		} else {
			addContact(req.body);
			res.redirect("/contact");
		}
	}
);

// == delete data ==
app.get("/contact/delete/:nama", (req, res) => {
	deleteContact(req.params.nama);
	res.redirect("/contact");
});

// == form edit data ==
app.get("/contact/edit/:nama", async (req, res) => {
	const contact = detailContact(req.params.nama);
	const messages = await req.consumeFlash("errors");
	res.render("edit", {
		title: "Page Detail",
		url: req.originalUrl,
		contact,
		messages: messages[0],
	});
});

// == proses update(edit) data ==
app.post(
	"/contact/update",
	body("nama")
		.custom((val, { req }) => {
			if (!findContact(val) && val !== req.body.namaLama) {
				return false;
			}
			return true;
		})
		.withMessage("Name already in use"),
	body("kelas").isInt().withMessage("Grade must be number"),
	body("email").isEmail().withMessage("Email not valid"),
	body("notelp").isMobilePhone("id-ID").withMessage("Phone number not valid"),
	(req, res) => {
		// console.log(req.body)
		// res.json(req.body)
		// res.redirect(`/contact`);
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.redirect(`/contact/edit/${req.body.namaLama}`);
			req.flash("errors", { errors: errors.array() });
		} else {
			updateContact(req.body);
			res.redirect(`/contact/${req.body.nama}`);
		}
	}
);

// == detail data ==
app.get("/contact/:nama", (req, res) => {
	const contact = detailContact(req.params.nama);
	res.render("detail", {
		title: "Page Detail",
		url: req.originalUrl,
		contact,
	});
});

app.use((req, res) => {
	res.send(`<h1>Sorry, page ${req.originalUrl} not found`);
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
