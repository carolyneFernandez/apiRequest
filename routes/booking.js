var express = require('express');
var router = express.Router();

/* GET booking listing. */
router.get('/', async (req, res, next) => {
  try {
    const {Booking} = req.db;

    const passengerName = req.query.passengerName;
    
    if (passengerName === "") {
      return res.status(400).send('Parameter is empty')
    } else if (passengerName !== undefined) {
      let reservations = await Booking.findAll({where: {passengerName: passengerName}});
      return res.send(reservations);
    } else {
      let reservations = await Booking.findAll();
      return res.send(reservations);
    }

  } catch (err) {
    next(err);
  }
});

router.get('/:bookingNumber', async(req, res, next) => {
  try {
    const {Booking} = req.db;

    const bookingNumber = req.params.bookingNumber;

    const booking = await Booking.findOne({
      where: { bookingNumber: bookingNumber }
    });

    if (!booking) {
      return res.status(404).send('Booking ' + bookingNumber + " doesnt exist");
    }

    return res.send(booking);


  } catch (err) {
    next(err);
  }
})

/* POST booking. */
router.post('/', async(req, res, next) => {
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
    console.log(data)
    if (!data.bookingNumber || !data.seatNumber || !data.class || !data.flight || !data.passengerName) {
      return res.status(400).send('Missing data');
    }
    const { Booking, Flights } = req.db;

    const flight = await Flights.findOne({
      where: { flightNumber: data.flight}
    })

    if (!flight) {
      return res.status(404).send('This flight does not exists');
    }

    const booking = await Booking.findOne({where: {bookingNumber: data.bookingNumber}});

    if (booking) {
      return res.status(409).send('Il y a déjà une réservation avec le bookingNumber ' + data.bookingNumber);
    }

    const newBooking = await Booking.create(data);
    return res.status(201).send(newBooking);

  } catch (err) {
    next(err);
  }
})

/* PUT booking. */
router.put('/:bookingNumber', async(req, res, next) => {
  try {

    const authorisationToken = req.get('Authorization');
    console.log(authorisationToken);

    if (!authorisationToken) {
      return res.status(401).send('Missing Authorization header');
    }

    if (authorisationToken !== 'Bearer toto') {
      return res.status(403).send("Vous n'êtes pas authorisé à executer cette action.");
    }

    const bookingNumber = req.params.bookingNumber;
    const data = req.body;
    if (!bookingNumber || !data.seatNumber || !data.class) {
      return res.status(400).send('Missing data');
    }

    const { Booking } = req.db;
    const booking = await Booking.findOne({
      where: { bookingNumber: bookingNumber}
    });

    if (booking) {
      const updatedBooking = await booking.update({
        seatNumber: data.seatNumber,
        class: data.class
      });
      return res.send(updatedBooking);
    } else {
      return res.status(404).send('No booking with the ' + bookingNumber + ' number');
    }

  } catch (err) {
    next(err);
  }
})

/* DELETE booking. */
router.delete('/:bookingNumber', async(req, res, next) => {
  try {
    
    const authorisationToken = req.get('Authorization');
    console.log(authorisationToken);

    if (!authorisationToken) {
      return res.status(401).send('Missing Authorization header');
    }

    if (authorisationToken !== 'Bearer toto') {
      return res.status(403).send("Vous n'êtes pas authorisé à executer cette action.");
    }
    
    const { Booking } = req.db;

    const bookingNumber = req.params.bookingNumber;
    const booking = await Booking.findOne({
      where: { bookingNumber: bookingNumber }
    });

    if (booking) {
      booking.destroy();
      return res.status(200).send('Booking deleted');
    } else {
      return res.status(404).send('No booking with the ' + bookingNumber + ' number');
    }
  } catch (err) {
    next(err);
  }
})

module.exports = router;