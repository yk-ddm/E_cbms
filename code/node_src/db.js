/*
	由于操作mysql代码层面有规律，操作步骤类似，
	可以通过封装的方式做出一个通用的api,方便我们使用
*/
//封装操作数据库的通用api
//加载mysql驱动
const mysql = require('mysql');

//导出通用方法
exports.base = (sql,data,callback) => {
	const connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : 'root',
		database : 'E_cbms'
	});

	connection.connect();

	connection.query(sql,data,(err,results,fields) => {
		if(err) throw err;
		callback(results);//这样使用的原因是数据库的操作也是异步的
	});

	connection.end();
}
