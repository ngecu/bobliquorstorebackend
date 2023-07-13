import Event from '../models/eventModel.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Public
const createEvent = async (req, res) => {
  console.log("evenbts create")
  try {
    const event = new Event({
      name:"Sample Event",
      location:"Murang'a Town",
      description:"Sample Description",
    });
    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Public
const updateEvent = async (req, res) => {
  try {
    const { name, date, location, description } = req.body;
    const event = await Event.findById(req.params.id);
    if (event) {
      event.name = name;
      event.date = date;
      event.location = location;
      event.description = description;
      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Public
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      await event.remove();
      res.json({ message: 'Event removed' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
