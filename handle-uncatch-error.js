process.on('uncaughtException', (err) => console.log('catched', err));

throw Error('1');
