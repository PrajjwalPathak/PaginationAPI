const userModel = require("../models/user");

// Pagination
const paginateUsers = async (req, res) => {
	const page = parseInt(req.query.page);
	const limit = parseInt(req.query.limit);
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;

	let pages = {};

	if (endIndex < (await userModel.countDocuments())) {
		pages.next = {
			page: page + 1,
			limit: limit,
		};
	}
	if (startIndex > 0) {
		pages.previous = {
			page: page - 1,
			limit: limit,
		};
	}
	try {
		results = await userModel.find().limit(limit).skip(startIndex);
		res.status(200).send({
			page_info: pages,
			data: results,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Search Filter
const searchUsers = async (req, res) => {
	try {
		const search = req.body.keyword;
		if (!search) {
			const searchResults = await userModel.find();
			res.status(200).send({
				success: true,
				message: "Results found",
				data: searchResults,
			});
		} else {
			const searchResults = await userModel.find({
				username: { $regex: ".*" + search + ".*" },
			});
			if (searchResults.length > 0) {
				res.status(200).send({
					success: true,
					message: "Results found",
					data: searchResults,
				});
			} else {
				res.status(200).send({
					success: true,
					message: "No results found",
				});
			}
		}
	} catch (error) {
		res.status(400).send({ success: false, message: error.message });
	}
};

module.exports = { paginateUsers, searchUsers };
