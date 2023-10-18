const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const PORT = 5000;
const app = express();

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server started at ${PORT}`));
  }
  catch (err) {
    console.log(err);
  }
}

start();