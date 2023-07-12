'use strict'
const fetch = require('node-fetch')
const path = require('path')
const S3_BUCKET = process.env.S3_BUCKET
const S3_API_URI = process.env.S3_API_URI
const apiRequest = async(uri, body, method = 'GET')=>{
  try{
    let payload = { method: method, timeout: 30000, compress: true, headers: {}}
    if(body){
      payload.body = JSON.stringify(body)
      payload.headers['Content-Type'] = 'application/json'
    }
    let res = await fetch(path.join(S3_API_URI, uri), { method: 'GET', timeout: 30000, compress: true})
    return await parseResponse(res)
  }catch(e){
    if(e.message){
      throw(e.name+' '+e.message+' '+e.type)
    }else{
      throw(e)
    }
  }
}
const parseResponse = async(res)=>{
  try{
    if(!res) return
    if(res.status?.toString().startsWith(4)) throw('s3api fetch error')
    if(!res.status?.toString().startsWith(2)) return
    let body
    if (res.headers?.get('Content-Type')?.includes('application/json')) body = await res.json()
    if (res.headers?.get('Content-Type')?.includes('image/png')){
      body = await res.arrayBuffer()
      body = Buffer.from(body)
    }
    if(!body) body = res.status
    return body
  }catch(e){
    throw(e)
  }
}
module.exports.list = async(prefix)=>{
  try{
    if(!S3_BUCKET) throw('Missing object storage info...')
    let uri = 'list?Bucket='+S3_BUCKET
    if(prefix) uri += '&Prefix='+prefix
    return await apiRequest(uri)
  }catch(e){
    throw(e);
  }
}
module.exports.get = async(file)=>{
  try{
    if(!S3_BUCKET || !file) throw('Missing object storage info...')
    return await apiRequest('get?Bucket='+S3_BUCKET+'&Key='+file)
  }catch(e){
    throw(e);
  }
}
module.expots.push = async(key, file)=>{
  try{
    if(!S3_API_URI || !S3_BUCKET || !key || !file) throw('Missing object storage info...')
    let body = { Key: key, Bucket: S3_BUCKET, Body: file, Convert: 'base64'}
    payload.body = JSON.stringify(body)
    return await apiRequest('put', body, 'POST')
  }catch(e){
    throw(e);
  }
}
