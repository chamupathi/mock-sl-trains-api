const trains = [];

const stations = require('../../stations.json');

stations.forEach((s) => {
	try {
		const trainsFromStation = require(`./stations/${s.id}`);
		trains.push(...trainsFromStation);
	} catch (e) {
		// console.error(e)
	}
});

module.exports = trains;
