const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./router/router');

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());
app.use(router);

app.listen(3636, () => {
	console.log('服务器运行在端口 3636');
}) 