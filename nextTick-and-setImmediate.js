// 在事件队列上的下一次迭代中执行
setImmediate(() => {
  console.log('setImmediate');
});

// 在事件队列下一次迭代之前，以及程序中当前运行的操作完成之后执行
process.nextTick(() => {
  console.log('nextTick');
});


// process.nextTick 总是比 setImmediate 先执行