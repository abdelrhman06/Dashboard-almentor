const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./public/css/js/db');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
            return;
        }

        if (results.length > 0) {
            const userCodeEncoded = encodeURIComponent(results[0].user_code);
            const reportUrl = `https://app.powerbi.com/reportEmbed?reportId=6160f7d0-1a2c-4c16-93f9-777affaff7dc&autoAuth=true&ctid=7c8a10fe-0cc0-43ce-b212-100d961a4e38&$filter=Coord-Dimension/COORD-CODE eq '${userCodeEncoded}'&filterPaneEnabled=false`;

            res.redirect(reportUrl);
        } else {
            res.status(401).send('Invalid username or password.');
        }
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
