var express = require('express');
var router = express.Router();

// GET /flights/{flightNumber}
router.get('/', async (req, res, next) => {
  try {
    const {Flights} = req.db;
    const depart = (req.query.depart) ? req.query.depart : null;
    const dest = (req.query.destination) ? req.query.destination : null;
    // flight = null;
    
    if (depart && dest)
      flight = await Flights.findAll({where: {departure: depart, destination: dest}});
    else if (!depart && dest || depart && !dest)
      return res.status(400).send('Missing parameters');
    else
      flight = await Flights.findAll();

    if (req.accepts('html')) {
        return res.render('flight', {flight: flight});
    }
    return res.send(flight);
  } catch(err) {
    console.log(err)
    next(err);
  }
});

// GET /flights/{flightNumber}
router.get('/:flightNumber', async (req, res, next) => {
  try {
    const flightNumber = req.params.flightNumber;
    const {Flights} = req.db;
    const flight = await Flights.findOne({where: {flightNumber: flightNumber}});

    if (!flight) {
      if (req.accepts('html')) {
        return res.render('error', {
          message: 'Flight not found',
          error: {
            status: 404,
            stack: ''
          }
        });
      }
      return res.status(404).send({
          message: 'Vol ' + flightNumber + " existe pas"
      })
    }

    if (req.accepts('html')) {
        return res.render('flight', {flight: flight});
    }
    return res.send(flight);
  } catch(err) {
    next(err);
  }
});

// Créer un vol avec les données qui viennent dans le req.body
// POST /flights
router.post('/', async (req, res, next) => {
  try {
    const authorisationToken = req.get('Authorization');
    console.log(authorisationToken);

    if (!authorisationToken) {
      return res.status(401).send('Missing Authorization header');
    }

    if (authorisationToken !== 'Bearer toto') {
      return res.status(403).send("Vous n'êtes pas authorisé à executer cette action.");
    }

    const data = req.body;
    if (!data.flightNumber || !data.company || !data.departure || !data.destination || !data.date) {
      return res.status(400).send('Missing data');
    }

    const {Flights} = req.db;
    const flight = await Flights.findOne({where: {flightNumber: data.flightNumber}});

    if (flight) {
      return res.status(409).send('Il y a déjà un vol avec le flightNumber ' + data.flightNumber);
    }

    const newFlight = await Flights.create(data);
    return res.status(201).send(newFlight);
  } catch(err) {
    next(err);
  }
});

router.put('/:flightNumber', async (req, res, next) => {
  try {
    const authorisationToken = req.get('Authorization');
    console.log(authorisationToken);

    if (!authorisationToken) {
      return res.status(401).send('Missing Authorization header');
    }

    if (authorisationToken !== 'Bearer toto') {
      return res.status(403).send("Vous n'êtes pas authorisé à executer cette action.");
    }

    const {Flights} = req.db;
    const flightNumber = req.params.flightNumber;
    const flight = await Flights.findOne({where: {flightNumber: flightNumber}})
      if (!flight){
        return res.status(404).send('Flight not found');
      } 

    const data = req.body;
    if (!flightNumber || !data.status || !data.date) {
      return res.status(400).send('Missing data');
    }

    const date = Date.parse(data.date);
    if(isNaN(date))
      return res.status(400).send('Wrong date');
    
    if(data.status != "READY" && data.status != "CANCELED")
      return res.status(400).send('Wrong status, shoulde be "READY" or "CANCELED"');
    
    flight.update({status: data.status, date: data.date})

    return res.status(200).send(flight);
  } catch(err) {
    next(err);
  }
});

router.delete('/:flightNumber', async (req, res, next) => {
  try {
    const authorisationToken = req.get('Authorization');
    console.log(authorisationToken);

    if (!authorisationToken) {
      return res.status(401).send('Missing Authorization header');
    }

    if (authorisationToken !== 'Bearer toto') {
      return res.status(403).send("Vous n'êtes pas authorisé à executer cette action.");
    }
    
    const flightNumber = req.params.flightNumber;
    
    const {Flights} = req.db;
    const flight = await Flights.findOne({where: {flightNumber: flightNumber}})
    if (flight){
      flight.destroy()
    } else
      return res.status(404).send('Flight not found');

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;