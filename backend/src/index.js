const app = require('./app');
const config = require('./utils/config');

app.listen(config.port, () => {
    console.log(`App started at port ${config.port}`);
});
