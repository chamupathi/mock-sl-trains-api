const express = require('express');
const cors = require('cors');
const moment = require('moment');
const stations = require('../data/stations.json');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
	res.send('hello from firebase');
});

app.get('/stations', (req, res) => {
	res.json(stations).send(200);
});

app.get('/stations/:id', (req, res) => {
	const id = req.params.id;

	const stationIndex = stations.findIndex(
		(s) => s.id.toString() === id.toString()
	);

	if (stationIndex < 0) {
		res.send(404);
		return;
	}

	res.json(stations[stationIndex]).send(200);
});
const WEEKDAY_TO_DAY = {
	0: 'SUNDAY',
	1: 'MONDAY',
	2: 'TUESDAY',
	3: 'WEDNSDAY',
	4: 'THURSDAY',
	5: 'FRIDAY',
	6: 'SATURDAY',
};
const getDate = (searchDate) => {
	if (!searchDate) {
		return { date: moment(), err: false };
	}

	const splidDateArr = searchDate.split('-');
	if (splidDateArr.length !== 3) {
		return { date: null, err: true };
	}

	// const m = moment([splidDateArr[0], splidDateArr[1], splidDateArr[2]], true);
	const m = moment(searchDate, 'YYYY-MM-DD', true);

	if (!m.isValid()) {
		return { date: null, err: true };
	}

	return { date: m, err: false };
};
app.get('/trains', (req, res) => {
	console.log(req.query);
	const { startStaion, endStation, searchDate } = req.query;

	if (!startStaion || !endStation) {
		res.sendStatus(400);
		return;
	}

	const { date, err } = getDate(searchDate);
	if (err) {
		res.sendStatus(400);
		return;
	}

	// commenting out for now
	// const weekDay = date.weekday();
	// const weekDayStr = WEEKDAY_TO_DAY[weekDay];

	// const trains = require(`../data/trains/${weekDayStr}`);
	// console.log(trains);

	// const filterdTrains = trains.filter(
	// 	(t) => t?.endStation?.toString() === endStation.toString()
	// );

	let trains = [];
	try {
		const t = require(`../stations/${startStaion}/${startStaion}-${endStation}.json`);
		trains.push(...t);
	} catch (error) {
		console.error(error);
		res.sendStatus(404);
		return;
	}

	const filterdTrains = [...trains];

	const data = {
		SUCCESS: filterdTrains?.length > 0,
		MESSAGE: `${filterdTrains?.length} Results Found`,
		QUERY: {},
		NOFRESULTS: 1,
		RESULTS: {
			directTrains: [...filterdTrains],
		},
	};

	// res.status(200);
	res.json(data);
});

module.exports = app;
