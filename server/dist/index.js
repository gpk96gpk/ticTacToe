import express from 'express';
import { createServer } from 'node:http';
const app = express();
const server = createServer(app);
app.get('/', (req, res) => {
    res.sendFile(new URL('./index.html', import.meta.url).pathname);
});
server.listen(5173, () => {
    console.log('server running at http://localhost:5173');
});
