const User = require("../models/User");

async function seedUser() {
	// Seed Admin
	{
		let newUser = new User();

		newUser.role = 1;
		newUser.email = "admin@gmail.com";
		newUser.userName = "admin";
		newUser.firstName = "admin";
		newUser.lastName = "admin";
		newUser.status = 0;
		newUser.setPassword("1234");

		await newUser.save();
	}
	// Seed User
	{
		let newUser = new User();

		newUser.email = "user@gmail.com";
		newUser.userName = "user";
		newUser.firstName = "firstName";
		newUser.lastName = "lastName";
		newUser.status = 0;
		newUser.setPassword("1234");

		await newUser.save();
	}

	console.log("Default Users Seeded");
}

module.exports = seedUser;
