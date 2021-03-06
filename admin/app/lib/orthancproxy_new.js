/* orthancproxy.js */
//require('dotenv').config();
const fs = require('fs');
const util = require("util");
const path = require('path');
const url = require('url');
const request = require('request-promise');
const exec = require('child_process').exec;
const express = require('express');
const app = express();

const userpass = process.env.ORTHANC_USER + ':' + process.env.ORTHANC_PASSWORD;
const currentDir = __dirname;
const publicDir = path.normalize(currentDir + '/../..');
const usrPreviewDir = publicDir + process.env.USRPREVIEW_DIR;
const usrArchiveDir = publicDir + process.env.USRARCHIVE_DIR;
const usrUploadDir = publicDir + process.env.USRUPLOAD_DIR;

const excludeColumn = { exclude: ['updatedAt', 'createdAt'] };

const runcommand = function (command) {
	return new Promise(function(resolve, reject) {
		log.info("Exec Command " + command);
		exec(command, (error, stdout, stderr) => {
			if(error === null) {
				resolve(`${stdout}`);
			} else {
				log.info('Error Exec => ' + error)
				reject(`${stderr}`);
			}
    });
		/*
		var proc = exec(command);

    var list = [];
    proc.stdout.setEncoding('utf8');

    proc.stdout.on('data', function (chunk) {
      list.push(chunk);
    });

    proc.stdout.on('end', function () {
      resolve(list.join());
    });
		*/
	});
}

const doLoadOrthancTarget = function(hospitalId, hostname){
	return new Promise(async function(resolve, reject) {
		//log.info('hostname => ' + hostname);
		if ((hostname === 'localhost') || (hostname.indexOf('192.168') >= 0)){
			let myCloud = {os: "docker-linux", ip: "202.28.68.28", httpport: "8042", dicomport: "4242", user: "demo", pass: "demo", portex : "8042", ipex: "202.28.68.28"};
			let localOrthanc = [{id: 0, Orthanc_Local: {}, Orthanc_Cloud: JSON.stringify(myCloud)}];
			resolve(localOrthanc[0]);
		} else {
			const orthancs = await Orthanc.findAll({ attributes: excludeColumn, where: {hospitalId: hospitalId}});
			if (orthancs.length > 0) {
				resolve(orthancs[0]);
			} else {
				reject({error: 'Not found your orthanc in database'});
			}
		}
	});
}

var db, Orthanc, log, auth, uti;

app.post('/find', function(req, res) {
	/*
	some bug never fixed
	hospitalId is undefinded
	*/
	let hospitalId = req.body.hospitalId;
	log.info('hospitalId =>' + hospitalId);
	if (hospitalId) {
		let rqBody = req.body.body;
		log.info('rqBody=>' + rqBody)
		doLoadOrthancTarget(hospitalId, req.hostname).then((orthanc) => {
			let username = req.body.username;
			let method = req.body.method;
			let cloud = JSON.parse(orthanc.Orthanc_Cloud)
			let orthancUrl = 'http://' + cloud.ip + ':' + cloud.httpport;
			/*
			var command;
			if (method.toLowerCase() == 'post') {
				command = 'curl -X POST --user ' + cloud.user + ':' + cloud.pass + ' -H "user: ' + cloud.user + '" -H "Content-Type: application/json" ' + orthancUrl + req.body.uri + ' -d \'' + rqBody + '\'';
			} else if (method.toLowerCase() == 'get') {
				command = 'curl -X GET --user ' + cloud.user + ':' + cloud.pass + ' ' + orthancUrl + req.body.uri + '?user=' + cloud.user;
			}

			log.info('Find Dicom with command >>', command);
			try {
				runcommand(command).then((stdout) => {
					let studyObj = JSON.parse(stdout);
					res.status(200).send(studyObj);
				});
			} catch (err) {
				log.error('Run command Error => '+ JSON.stringify(err));
				reject(err);
			}
			*/

			let rqParams = {
				method: method,
				auth:  {user: cloud.user, pass: cloud.pass},
				uri: orthancUrl + req.body.uri,
				body: JSON.parse(rqBody)
			}
			uti.proxyRequest(rqParams).then((proxyRes)=>{
				let orthancRes = JSON.parse(proxyRes.res.body);
				//log.info('orthancRes JSON => ' + JSON.stringify(orthancRes));
				res.status(200).send(orthancRes);
			});
		});
	} else {
		let orthancError = {error: 'Your hospitalId is incurrect. Please verify.'};
		log.error('Request Orthanc Error =>' + orthancError.error);
		res.status(500).send({status: {code: 500}, error:  + orthancError.error});
	}
});

app.get('/find', function(req, res) {
	hospitalId = req.body.hospitalId;
	doLoadOrthancTarget(hospitalId, req.hostname).then((orthanc) => {
		let rqBody = req.body.body;
		let username = req.body.username;
		let cloud = JSON.parse(orthanc.Orthanc_Cloud)
		let orthancUrl = 'http://' + cloud.ip + ':' + cloud.httpport;
		var command = 'curl -X GET --user ' + cloud.user + ':' + cloud.pass + ' -H "user: ' + cloud.user + ' ' + orthancUrl + req.body.uri;
		log.info('Find Dicom with command >>', command);
		runcommand(command).then((stdout) => {
			let studyObj = JSON.parse(stdout);
			res.status(200).send(studyObj);
		});
	});
});

app.post('/preview/(:instanceID)', function(req, res) {
	hospitalId = req.body.hospitalId;
	doLoadOrthancTarget(hospitalId, req.hostname).then((orthanc) => {
		var instanceID = req.params.instanceID;
		var username = req.body.username;
		var previewFileName = instanceID + '.png';
		let cloud = JSON.parse(orthanc.Orthanc_Cloud);
		let orthancUrl = 'http://' + cloud.ip + ':' + cloud.httpport;
		var command = 'curl --user ' + cloud.user + ':' + cloud.pass + ' -H "user: ' + cloud.user + '" ' + orthancUrl + '/instances/' + instanceID + '/preview > ' + usrPreviewDir + '/' + previewFileName;
		log.info('Open Dicom preview with command >>', command);
		runcommand(command).then((stdout) => {
			//res.redirect('/' + rootname + USRPREVIEW_PATH + '/' + previewFileName);
			let link = process.env.USRPREVIEW_PATH + '/' + previewFileName;
			res.status(200).send({preview: {link: link}});
		});
	});
});

app.post('/loadarchive/(:studyID)', function(req, res) {
	hospitalId = req.body.hospitalId;
	doLoadOrthancTarget(hospitalId, req.hostname).then((orthanc) => {
		var studyID = req.params.studyID;
		var username = req.body.username;
		var archiveFileName = studyID + '.zip';
		let cloud = JSON.parse(orthanc.Orthanc_Cloud);
		let orthancUrl = 'http://' + cloud.ip + ':' + cloud.httpport;
		var command = 'curl --user ' + cloud.user + ':' + cloud.pass + ' -H "user: ' + cloud.user + '" ' + orthancUrl + '/studies/' + studyID + '/archive > ' + usrArchiveDir + '/' + archiveFileName;
		log.info('Load Dicom achive with command >>', command);
		runcommand(command).then((stdout) => {
			let link = process.env.USRARCHIVE_PATH + '/' + archiveFileName;
			res.status(200).send({link: link});
		});
	});
});

app.post('/deletedicom/(:studyID)', function(req, res) {
	hospitalId = req.body.hospitalId;
	doLoadOrthancTarget(hospitalId, req.hostname).then((orthanc) => {
		var studyID = req.params.studyID;
		let cloud = JSON.parse(orthanc.Orthanc_Cloud);
		let orthancUrl = 'http://' + cloud.ip + ':' + cloud.httpport;
		var command = 'curl -X DELETE --user ' + cloud.user + ':' + cloud.pass + ' -H "user: ' + cloud.user + '" ' + orthancUrl + '/studies/' + studyID;
		log.info('Delete Dicom with command >>', command);
		runcommand(command).then((stdout) => {
			res.status(200).send({response: {message: stdout}});
		});
	});
});

app.get('/orthancexternalport', function(req, res) {
	let hospitalId = req.query.hospitalId;
	let hostname = req.hostname;
	doLoadOrthancTarget(hospitalId, hostname).then((orthanc) => {
		let cloud = JSON.parse(orthanc.Orthanc_Cloud);
		res.status(200).send({ip: cloud.ipex, port: cloud.portex});
	});
});

module.exports = ( dbconn, monitor ) => {
  db = dbconn;
  log = monitor;
  Orthanc = db.orthancs;
	uti = require('./mod/util.js')(log);
  return app;
}
