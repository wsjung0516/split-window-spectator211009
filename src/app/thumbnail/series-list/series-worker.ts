const seriesAjaxData = (url: string) => {
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

addEventListener('message', async ({data}) => {
  let res1, sData;
  const rData = data.body;
  let tUrl: string;
  if (rData) {
    for (let i = 0; i < rData.length; i++) {
      try {
        res1 = await seriesAjaxData(rData[i].url);
        sData = {
          seriesId: i,
          url: rData[i].url,
          blob: res1,
          category: rData[i].category
        }

      } catch (e) {
        sData = {
          url: rData[i].url,
          blob: e,
        }
      }
      // console.log('indx', i, rData[i].url)
      postMessage(sData,data.origin);
      await sleep2(50);

    }
  }
});

function sleep2(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
