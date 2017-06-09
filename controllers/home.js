/**
 * GET /
 * Home page.
 */


exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};


exports.gettest = (req, res) => {
  if (req.app.locals.sp.isOpen()) {
    console.log('Sending Serial');
    const msg = req.body.data;
    const buffer = new Buffer(8);
    buffer[0] = 0x02;
    buffer[1] = 0x00;
    buffer[2] = 0x00;
    buffer[3] = 0x00;
    buffer[4] = 0x00;
    buffer[5] = 0xFF;
    buffer[6] = 0xFF;
    buffer[7] = 0x0A;



    req.app.locals.sp.on('data', (data) => {
      console.log(`Serial: ${data}`);
      if (data.includes('set to')) {
        const buffer2 = new Buffer(3);
        buffer2[0] = 0x00;
        buffer2[1] = 0x05;
        buffer2[2] = 0x0A;

        console.log('Sending commit');
        req.app.locals.sp.write(buffer2, (err, result) => {
          if (err) {
            console.log(`Error while sending message : ${err}`);
          }
          if (result) {
            console.log(`Response received after sending message : ${result}`);
          }
        });
      }
    });


    res.render('home', {
      title: 'Home'
    });
  }
};
