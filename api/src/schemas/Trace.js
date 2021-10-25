const mongoose = require('../utils/mongoose');

const itemSchema = mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  content: { type: String, required: false },
})

const traceSchema = mongoose.Schema({
  title: { type: String, required: true },
  session: { type: String, required: true },
  date: { type: String, required: true },
  items: [itemSchema]
}, { collection: 'traces' });

const Trace = mongoose.model('Trace', traceSchema);

module.exports = Trace;
