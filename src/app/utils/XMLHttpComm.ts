export const XMLHttpComm = (url: string) => {
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
      request.open("GET", url += '?' + (new Date()).getTime(), true);
      // request.setRequestHeader("Cache-Control", "no-cache");
      request.send();
    }
  });
  return prom;
};

/*
import axios from "axios";

export const XMLHttpComm = async (url: string) => {

  return await axios.get(url += '?' + (new Date()).getTime(), {responseType: 'blob'} );
}
*/

