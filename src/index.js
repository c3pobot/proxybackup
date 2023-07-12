'use strict'
const log = require('./logger')
let logLevel = process.env.LOG_LEVEL || log.Level.INFO;
log.setLevel(logLevel);
const WORKER_TYPE = process.env.WORKER_TYPE || 'backup'
const StartBackup = require('./backup')
const StartRestore = require('./restore')
if(WORKER_TYPE === 'restore'){
  StartRestore()
}else{
  StartBackup()
}
