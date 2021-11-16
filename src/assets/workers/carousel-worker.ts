import {axiosCommData} from "../../app/utils/axiosComm";

var _stop: boolean;
var cachedInstance: any;

async function getCarouselImage({data}: any) {
  let res1, sData;
  const rData = data.body;
  let tUrl: string;
  if (rData) {
    for (let i = 0; i < rData.length; i++) {
        await axiosCommData(rData[i].url)
          .then( async (res1: any) => {
            // console.log('----res1', res1)
            sData = {
              imageId: rData[i].id,
              url: rData[i].url,
              blob: res1.data,
              category: data.category,
              title: rData[i].title
            }
            postMessage(sData,data.origin);
            await checkIfImageCached( rData[i].url, i);

            await sleep(50);

          }).catch( async (e) => {
            sData = {
              url: rData[i].url,
              blob: e,
            }
            postMessage(sData,data.origin);
            await checkIfImageCached( rData[i].url, i);

            await sleep(50);

          })
    }
  }
}


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
