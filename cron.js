const CronJob = require('cron').CronJob;
const job = new CronJob(
  '*/5 * * * * *',
  () => {
    console.log('message');
  },
  null,
  true,
  'America/Los_Angeles'
);

// add callback 顺序是最后添加的最先执行
job.addCallback(() => {
  console.log('message callback2');
});

job.addCallback(() => {
  console.log('message callback');
});