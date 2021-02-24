/*
 * 作者： 杨金涛
 * 用途： 通过nodeJs访问MongoDB
 * 备注： 中间件
 */

var express = require('express');
var app = express();


// 连接 MongoDB
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://127.0.0.1:27017';

 // 解决跨域
app.all('*', function(req, res, next) {
 	res.header("Access-Control-Allow-Origin", "*");
 	res.header("Access-Control-Allow-Headers", "X-Requested-With");
 	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
 	res.header("X-Powered-By", ' 3.2.1 ');
 	res.header("Content-Type", "application/json;charset=utf-8");
 	next();
 });

// 测试接口（get方法）
app.get('/text', function(req, res){
	res.send({
		a: '这是一个测试接口'
	});
});

// 获得数据库中的数据
app.get('/search_data', function(req, res){

	// 连接数据库
	MongoClient.connect(DB_CONN_STR, function(err, db){
		var _dbo = db.db('abcxx');
		var _collection = _dbo.collection('first');

		_collection.find().toArray(function(err, result){
			if(err) throw err;
			res.send(result);

			// 关闭数据库
			db.close();
		});
	});
});

// 插入数据
app.get('/insert_data', function(req, res){

	// 得到从vue中提交的内容
	console.log(req.query);
	var _msgObj = req.query;

	// 连接数据库
	MongoClient.connect(DB_CONN_STR, function(err, db){

		var _dbo = db.db('abcxx');
		var _collection = _dbo.collection('first');

		_collection.insertOne(_msgObj, function(err, result){
			if(err) throw err;
			console.log('插入数据成功!');
			res.end();

			// 关闭数据库
			db.close();
		});
	});
});

// 删除数据
app.get('/del_data', function(req, res){

	// 得到从vue中提交的内容
	// console.log(req.query);

	// 这里需要使用_id的字符串的内容
	var _idString = req.query._id;

	// 生成一个 MongoDB 的 ID 对象
	var _ObjectID = require('mongodb').ObjectID;
	var _ObjId = _ObjectID.createFromHexString(_idString);

	// 连接数据库
	MongoClient.connect(DB_CONN_STR, function(err, db){

		var _dbo = db.db('abcxx');
		var _collection = _dbo.collection('first');

		_collection.remove({"_id":_ObjId}, function(err, result){
			if(err) throw err;
			console.log('删除数据成功!');
			res.end();

			// 关闭数据库
			db.close();
		});
	});
});

// 搜索
app.get('/find_data', function(req, res){
	// 得到提交的内容
	// console.log(req.query._txt);
	var _txt = req.query._txt;

	// 连接数据库
	MongoClient.connect(DB_CONN_STR, function(err, db){

		var _dbo = db.db('abcxx');
		var _collection = _dbo.collection('first');

		_collection.findOne({"txt": _txt}, function(err, result){
			if(err) throw err;
			res.send(result);

			// 关闭数据库
			db.close();
		});
	});
});

// 根据id查找
app.get('/find_id', function(req, res){
	var _idString = req.query._id;
	// console.log( _idString );

	// 生成一个 MongoDB 的 ID 对象
	var _ObjectID = require('mongodb').ObjectID;
	var _findObjId = _ObjectID.createFromHexString(_idString);

	// 连接数据库
	MongoClient.connect(DB_CONN_STR, function(err, db){

		var _dbo = db.db('abcxx');
		var _collection = _dbo.collection('first');

		_collection.findOne({"_id": _findObjId}, function(err, result){
			if(err) throw err;
			res.send(result);

			// 关闭数据库
			db.close();
		});
	});
});

// 根据id修改留言内容
app.get('/save_id', function(req, res){

	var _saveObj = req.query;
	// console.log( _saveObj );
	var _id = _saveObj._id;

	// 生成一个 MongoDB 的 ID 对象
	var _ObjectID = require('mongodb').ObjectID;
	var _saveObjId = _ObjectID.createFromHexString(_id);

	// 连接数据库
	MongoClient.connect(DB_CONN_STR, function(err, db){

		var _dbo = db.db('abcxx');
		var _collection = _dbo.collection('first');

		_collection.save({
			"_id" : _saveObjId,
			"txt" : _saveObj.txt,
			"msg" : _saveObj.msg
			}, function(err, result){
				if(err) throw err;
				console.log("根据id更新数据，成功!");
				res.end();

				// 关闭数据库
				db.close();
			});
	});
});

app.listen(9090, function(){
	console.log('9090, 中间件,已经运行!');
});
