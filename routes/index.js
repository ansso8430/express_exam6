const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
	/*
	const data = {
		addCss : ["main1", "main2", "main/main3"], 
		addScript : ["script1", "script2", "main/script3"], 
    };
	*/
	return res.render("main/index");
});

router.post("/upload", (req, res) => {

	return res.send("");
});

module.exports = router;