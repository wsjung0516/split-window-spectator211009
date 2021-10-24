const ajaxData = (url: string) => {
  let prom = new Promise(function (resolve, reject) {
    if (!!XMLHttpRequest) {
      let request = new XMLHttpRequest();
      request.timeout = 5000;
      request.onreadystatechange = function () {
        if (request.readyState == 4) {
          if (request.status == 200) {
            // console.log('request.response', request.response); // should be a blob
            resolve(request.response);
          } else if (request.responseText != "") {
            // console.log(request.responseText);
            reject({
              readyState: request.response,
              status: this.status
            });

          }
        } else if (request.readyState == 2) {
          if (request.status == 200) {
            request.responseType = "blob";
          } else {
            request.responseType = "text";
          }
        }
      };
      request.open("GET", url, true);
      request.send();
    }
  });
  return prom;
};
var _stop: boolean;
var cachedInstance: any;

async function getCarouselImage({data}: any) {
  let res1, sData;
  const rData = data.body;
  let tUrl: string;
  // console.log('--------------- cornerstone')
  if (rData) {
    for (let i = 0; i < rData.length; i++) {
      try {
        res1 = await ajaxData(rData[i].url);
        sData = {
          imageId: i,
          url: rData[i].url,
          blob: res1,
          category: data.category
        }
      } catch (e) {
        sData = {
          url: rData[i].url,
          blob: e,
        }
      }
      // console.log('indx', i, rData[i].url)
      postMessage(sData,data.origin);
      await checkIfImageCached( rData[i].url, i);

      await sleep(50);
    }
  }
};




addEventListener('message', async (e) => {
  let actionResult;

  if (e.data.msg === 'download') {
    var instances = e.data.body;
    if (instances.length > 0) {
      actionResult = await getCarouselImage(e);
    };
  } else if (e.data.msg === 'stop') {
    _stop = true;
  } else if (e.data.msg === 'completeCachedImage') {
    cachedInstance = e.data.body;
    // console.log('-----------onmessage --- cached Instance 1', cachedInstance);
  }

/*
  let res1, sData;
  const rData = data.body;
  let tUrl: string;
  if (rData) {
    for (let i = 0; i < rData.length; i++) {
      try {
        res1 = await ajaxData(rData[i].url);
        sData = {
          imageId: i,
          url: rData[i].url,
          blob: res1,
          category: data.category
        }

      } catch (e) {
        sData = {
          url: rData[i].url,
          blob: e,
        }
      }
      // console.log('indx', i, rData[i].url)
      postMessage(sData,data.origin);
      await sleep(50);

    }
  }
*/
});

function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function checkIfImageCached(instances: any, i: number){
  return new Promise(resolve => {
    for( let j=0; j <= 1500;j++  ) {
      setTimeout(()=>{
        if( instances === cachedInstance) {
          // console.log('-----*****-- cachedInstance 1',instances[i], i,j, cachedInstance)
          cachedInstance = '';
          resolve(j)
          j = 1500;
        }
      },j * 10)
    }
  })
}
