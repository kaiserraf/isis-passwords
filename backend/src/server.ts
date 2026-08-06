import express from 'express';
import router from './router';

const PORT = process.env.PORT || '3000'
const app = express();

app.use(express.json());
app.use('/', router);

app.use('/', (_req, res) => {
    res.redirect('/html/login.html');
});

app.listen(PORT, () => {
    console.log(`running in http://localhost:${PORT}/`);
});