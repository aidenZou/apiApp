'use strict';

export default {
  // proxy_on: true, // 禁止直接通过 IP + 端口来访问
  // resource_on: false,    // 关闭静态资源处理的配置(代码部署在线上时，是用 nginx 来处理静态资源请求的，这时可以关闭 ThinkJS 里处理静态资源请求的功能来提高性能。)
  // cluster_on: true,  // 使用 cluster(开启 cluster 功能达到利用多核 CPU 来提升性能，提高并发处理能力。) 如果使用 PM2 来部署，并且开启了 cluster 模式，那么就无需在开启 ThinkJS 里的 cluster。
};
