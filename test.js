const express = require('express');

const app = express();

app.get('/', (req, res) => {
	res.send('Another port!');
});

app.listen(3004, () => console.log('server running listening to port 3004'));
