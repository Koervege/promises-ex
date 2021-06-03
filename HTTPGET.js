async function getUsernames(threshold) {
  const https = require('https')
  
  let parsedDataPage1 = [];
  let parsedDataPage2 = [];

  try {
    const promise1 = new Promise((resolve, reject) => {
      https.get('https://jsonmock.hackerrank.com/api/article_users?page=1', res => {
        
        let data = '';
        res.on('data', (chunk) => {
            data+=chunk
        })
        
        res.on('end', () => {
          parsedDataPage1 = JSON.parse(data).data.filter(e => e.submitted > threshold).map(e => e.username)
        })
      }).on('close', () => {
        resolve(parsedDataPage1)
      })
    });
  
    const promise2 = new Promise((resolve, reject) => {
      https.get('https://jsonmock.hackerrank.com/api/article_users?page=2', res => {
        
        let data = '';
        res.on('data', (chunk) => {
            data+=chunk
        })
        
        res.on('end', () => {
          parsedDataPage2 = JSON.parse(data).data.filter(e => e.submitted > threshold).map(e => e.username)
        })

      }).on('close', () => {
        resolve(parsedDataPage1)
      })
    })
  
    return Promise.all([promise1, promise2]).then(() => parsedDataPage1.concat(parsedDataPage2))

  } catch(e) {
    console.info(e)
  };
};

getUsernames(300).then(data => console.log(data))
