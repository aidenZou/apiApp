/**
 * Created by aidenZou on 16/4/2.
 */

import request from "request";

let get = (url) => {
  let fn = think.promisify(request.get);
  return fn({
    url: url,
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) Chrome/47.0.2526.111 Safari/537.36"
    }
  });
};

export default {
  get: get
};
