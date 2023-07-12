'use strict'
const log = require('./logger')
const path = require('path')
const s3 = require('./s3')
const zipdir = require('zip-dir');
const getTimeStamp = ()=>{
  try{
    let date = new Date()
    let year = data.getFullYear(), month = date.getMonth() + 1, day = date.getDate(), hour = date.getHours(), minutes = data.getMinutes(), seconds = data.getSeconds()
    return year+'_'+month.toString().padStart(2, '0')+'_'+day.toString().padStart(2, '0')+'_'+hour.toString().padStart(2, '0')+'_'+minutes.toString().padStart(2, '0')+'_'+seconds.toString().padStart(2, '0')
  }catch(e){
    throw(e)
  }
}
const getBackupFile = ()=>{
  return new Promise(resolve, reject)=>{
    try{
      zipdir(path.join(baseDir, 'data'), function (err, buffer) {
        if(err) reject(err)
        resolve(buffer?.toString('base64'))
      });
    }catch(e){
      reject(e)
    }
  }
}
const backUp = async()=>{
  try{
    let fileName
    let file = await getBackupFile()
    if(file){
      fileName = getTimeStamp()
    }
    if(fileName && file){
      let status = await s3.push('proxy/'+fileName+'.zip', file)
      if(!status.ETag) throw('Error updloading proxy backup file...')
    }
    log.debug('uploaded file '+fileName+'.zip...')
    setTimeout(backUp, 30 * 60 * 1000)
  }catch(e){
    log.error(e)
    setTimeout(backUp, 10000)
  }
}

module.exports = ()=>{
  backup()
}
