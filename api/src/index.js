const express = require("express");
const bodyParser = require('body-parser');
const multer = require('multer');
const Trace = require('./schemas/Trace')

const app = express();
const upload = multer();

const generateSessionId = (length) => {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

const generateTraceId = (length) => {
    return generateSessionId(length)
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Content-Type", "application/json");
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.array()); 
app.use(express.static('public'));

app.get("/getNewSessionId", async (req, res) => {
    res.send(generateSessionId(6))
});

app.get("/getSessionItems/:sessionId", async (req, res) => {
    if (!req.params.sessionId) {
        return res.status(500).send()
    }
    Trace.find().where({ session: req.params.sessionId }).then((result, err) => {
        if (err) {
            return res.status(500).send()
        }
        res.json(result)
    })
});

app.post("/item/:sessionId", async (req, res) => {
    console.log('HERE : ', req.params.sessionId)
    Trace.create({ session: req.params.sessionId, date: Date.now(), title: 'Default title', items: [] }, (err, item) => {
        if (err) {
            return res.status(500).send()
        }
        return res.status(200).json(item)
    })
});

app.post("/item/:sessionId/:traceId", async (req, res) => {
    Trace.findOneAndUpdate({ _id: req.params.traceId, session: req.params.sessionId }, {  "$push": { "items": { title: req.body.title, content: req.body.content, date: req.body.date } }  }, (err, item) => {
        if (err) {
            return res.status(500).send()
        }
        return res.status(200).json(item)
    })
});

/*
app.delete("/item/:sessionId/:itemId", async (req, res) => {
    Memo.remove({ _id: req.params.itemId, session: req.params.sessionId }, (err) => {
        if (err) {
            return res.status(500).send()
        }
        return res.send()
    })
});

app.put("/item/:sessionId/:itemId/color/:color", async (req, res) => {
    console.log('COLOR: ', req.params.color)
    Memo.findOneAndUpdate({ _id: req.params.itemId, session: req.params.sessionId }, { color: req.params.color }, (err) => {
        if (err) {
            return res.status(500).send()
        }
        return res.send()
    })
});
*/

app.listen(process.env.PORT, function() {
  console.log(`API v.1.0.1 listening on port ${process.env.PORT}!`);
});
