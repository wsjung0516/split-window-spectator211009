import {seriesAjaxData} from "../../app/utils/ajaxComm";

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
        res1 = await seriesAjaxData(rData[i].url);
        sData = {
          imageId: rData[i].id,
          url: rData[i].url,
          blob: res1,
          category: data.category,
          title: rData[i].title
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
