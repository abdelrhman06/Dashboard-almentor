const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// إنشاء اتصال بقاعدة البيانات
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // اسم المستخدم الخاص بقاعدة البيانات
    password: '', // كلمة المرور الخاصة بقاعدة البيانات
    database: 'login_system' // اسم قاعدة البيانات
});

// الاتصال بقاعدة البيانات
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// إنشاء تطبيق Express
const app = express();

// استخدام body-parser لتفسير بيانات POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// تقديم الملفات الثابتة (CSS, JS, HTML) من مجلد public
app.use(express.static(path.join(__dirname, 'public')));

// تقديم صفحة تسجيل الدخول
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// معالجة تسجيل الدخول
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // التحقق من اسم المستخدم وكلمة المرور في قاعدة البيانات
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
            return;
        }

        if (results.length > 0) {
            // في حال نجاح تسجيل الدخول
            const userCodeEncoded = encodeURIComponent(results[0].user_code);
            const reportUrl = `https://app.powerbi.com/reportEmbed?reportId=6160f7d0-1a2c-4c16-93f9-777affaff7dc&autoAuth=true&ctid=7c8a10fe-0cc0-43ce-b212-100d961a4e38&$filter=Coord-Dimension/COORD-CODE eq '${userCodeEncoded}'&filterPaneEnabled=false`;

            res.redirect(reportUrl);
        } else {
            // في حال فشل تسجيل الدخول
            res.status(401).send('Invalid username or password.');
        }
    });
});

// تشغيل السيرفر
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
