const mysql = require('mysql');

var pool = mysql.createPool({
	connectionLimit : 10,
	host            : 'classmysql.engr.oregonstate.edu',
	user            : 'cs340_chestlez', 	// replace YOURONID with your ONID u/n (what comes before @oregonstate.edu for your email/login credentials)
	password        : '5372',	// replace with your password -- if left as the default, it should be the last 4 digits of your student ID
	database        : 'cs340_chestlez'	// see comment for 'user' key above
});

module.exports.pool = pool;