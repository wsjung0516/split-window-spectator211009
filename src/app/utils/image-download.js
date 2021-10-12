function ajax(url) {
  let prom = new Promise(function (resolve, reject) {
    if (!!XMLHttpRequest) {
      let xhttp = new XMLHttpRequest();
      xhttp.timeout = 5000;

      xhttp.onload = function () {
        //console.log('DONE', this.status, this.readyState, this.responseText);
        if (this.readyState == 4 && (this.status == 200)) {
          resolve(this.responseText);
        }
        reject({
          readyState: this.readyState,
          status: this.status
        });
      };

      xhttp.timeout = function () {
        //console.log('DONE', this.status, this.readyState, this.responseText);
        reject({
          readyState: this.readyState,
          status: this.status
        });
      };

      xhttp.open("GET", url, true);
      xhttp.send();
    }
  });
  return prom;
};

async function getInstanceImage(seriesId, instanceUrlPrefix, instances) {
  let ajaxArr = [];

  for (let i = 0; i < instances.length; i++) {
    try {
      var url = instanceUrlPrefix + instances[i];
      // console.log('[ct-image-downloader.js] url: '+url);
      let res = await ajax(url).catch(function (e) {
        throw new Error(e);
      });

      var updateProgress;
      if (i % 20 == 0 || (instances.length - i) == 1) {
        updateProgress = true;
      } else {
        updateProgress = false;
      }

      ajaxArr[i] = {
        msg: 'instance',
        seriesId: seriesId,
        body: res,
        imageId: instances[i],
        updateProgress: updateProgress
      }
    } catch (e) {
      ajaxArr[i] = {
        msg: 'error',
        seriesId: seriesId,
        body: e.stack || 'Error',
        imageId: instances[i],
        err: true,
        updateProgress: updateProgress
      }
    }

    //console.log('[ct-image-downloader.js] return: '+JSON.stringify(ajaxArr[i]));

    postMessage(ajaxArr[i]);

    if (stop == true) {
      console.log('[worker][getInstanceImage] stop downloading...');
      break;
    }

    await sleep(30); // PACS 부하를 줄이기 위해 sleep 추가
  }

  var msg = {
    msg: 'complete',
    seriesId: seriesId
  }

  postMessage(msg);

  return ajaxArr;
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadCtImages(seriesId, instanceUrlPrefix, instances) {
  let mdArr = await getInstanceImage(seriesId, instanceUrlPrefix, instances);
  return mdArr;
};

onmessage = async function (e) {
  let actionResult;
  // trigger activity based on action
  // console.log('[ct-image-downloader.js] instances: '+JSON.stringify(e.data));

  if (e.data.msg == 'download') {
    var instances = e.data.data;
    if (instances.length > 0) {
      actionResult = await downloadCtImages(e.data.seriesId, e.data.instanceUrlPrefix, instances);
    };
  } else if (e.data.msg == 'stop') {
    stop = true;
  }
};

stop = false;
