require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3000;

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.enable('trust proxy'); //

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));


app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

let urls = [];

app.post("/api/shorturl", urlencodedParser, (req, res, next) => {
  const { url } = req.body;
  regex = /^http(s)?\:\/\/.*/i;
  if (!regex.test(url)) {
    res.json({
      error: "invalid url"
    });
  } else {
    res.json({
      original_url: url,
      short_url: urls.length + 1
    });
    urls.push(url);
  }
  next();
});

app.get("/api/shorturl/:index", (req, res) => {
  const { index } = req.params;
  if (!isNaN(parseInt(index)) && urls.length <= parseInt(index)) {
    console.log(index, parseInt(index), urls[parseInt(index)-1]);
    let new_url = new URL( urls[ parseInt( index ) - 1 ] );
    res.redirect(new_url);
  } else {
    res.send({ error: "invalid shorturl "});
  }
});