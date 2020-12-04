/**
 * @author Basit Raza
 * @link http://be.net/basit_raza Author Website
 * @since 2020-10-29
 */

/* ===========================   BUCKET-ALGORITHM FOR RATE LIMITER ============================= */
/* Rate limiter for websockets */
/* Algorithm type: Token Bucket */
/* In the token bucket algorithm, we simply keep a counter indicating how many tokens a user has left */

/* An example of bucket object
bucketObjectExample = {
  '<ip-address>':{
    'tokens' : 100,
    'clearFunction' : function ( ){
      setTimeout(()=>{
          if(bucket){
            delete bucket['<ip-address>']
          }
        },
        // Remove self after 30 seconds
        (new Date().getTime()+(30*1000)) - new Date().getTime())
    }
  }
}
*/
/* ============================================   END    ======================================= */


// The bucket will hold all of the tokens data
let bucket = {};


function checkAvailableTokens(ipAddress,tokens=100){
  try{
    if(!ipAddress || !bucket){
      throw 'ipAddress is of undefined';
    }
    let dataObject = bucket[ipAddress];
    if(dataObject && dataObject.tokens && dataObject.tokens>0){
      dataObject.tokens--;
      return true;
    }
    else if(dataObject) {
      if(dataObject.tokens <= 0){
        return new Error('You have consume your limit of max 100 connections in 1 minute, try again in sometime')
      }
      else {
        throw new Error ('No tokens in dataObject');
      }
    }
    else {
      addNewConnectionObject(ipAddress,tokens);
      return true;
    }
  }
  catch (e){
    console.log(e);
    return new Error('Something went wrong while checking remaining token');
  }
}

function addNewConnectionObject(ipAddress,tokens=100){
  let object = {
    'tokens' : tokens,
    'clearFunction' : (()=>{
      setTimeout(()=>{
          if(bucket){
            delete bucket[ipAddress]
          }
        },
        /* Remove self after 60 seconds*/
        (new Date().getTime()+(60*1000)) - new Date().getTime())
    })()
  }
  bucket[ipAddress] = object;
}

module.exports = {
  bucket,
  checkAvailableTokens
}
