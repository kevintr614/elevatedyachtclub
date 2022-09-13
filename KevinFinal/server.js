var https = require('https');
var fs = require('fs');
const path = require('path')
const { parse } = require('url');

const next = require('next')
const port = parseInt(process.env.PORT) || 443
//const dev = true;
const dev = process.env.NODE_ENV !== 'production'
//const app = next({ dev, dir: __dirname })
const app = next({ dev })
const handle = app.getRequestHandler()

var options = {
key: fs.readFileSync('/etc/letsencrypt/live/mint.underworldassassins.com/privkey.pem'),
cert: fs.readFileSync('/etc/letsencrypt/live/mint.underworldassassins.com/fullchain.pem'),
};

app.prepare().then(() => {
  https.createServer(options, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, err => {
    if (err) throw err
    console.log(`> Ready on port ${port}`)
  })
})
