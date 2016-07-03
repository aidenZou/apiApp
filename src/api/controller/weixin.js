'use strict';

/**
 * 搜狗微信公众号搜索相关
 * Created by aidenZou on 16/7/3.
 */
import Base from './base';

import api from '../../util/request';
import cheerio from 'cheerio';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction() {
    //auto render template file index_index.html
    return this.json({});
  }

  async queryAction() {
    // let url = 'http://m.baidu.com';
    let url = 'http://weixin.sogou.com/weixin?type=2&query=%E7%A7%91%E6%8A%80&ie=utf8&_sug_=n&_sug_type_=';

    let source = await think.cache(url, () => {
      return api.get(url)
        .then(function (data) {
          // logger.error(data.body);
          return data.body;
        });
    });

    let $ = cheerio.load(source);

    let resultArr = [];
    $('.wrap .results .wx-rb').each((index, item) => {
      let $item = $(item);
      let resultObj = {
        title: $item.find('h4').text(),
        profile: $item.find('p').text(),  // 简介
        link: $item.find('a').attr('href'),
        pic: $item.find('img').attr('src'),
        wxName: $item.find('.wx-name').attr('title'),
        wxLink: $item.find('.wx-name').attr('href'),
        time: $item.find('.time').text()
      };
      resultArr.push(resultObj);
    })
    return this.json(resultArr);
  }

  async _get(url) {
    let source = await think.cache(url, () => {
      return api.get(url)
        .then(function (data) {
          return data.body;
        });
    });
    let $ = cheerio.load(source);

    let resultArr = [];

    $('li').each((index, item) => {
      let $item = $(item);
      let resultObj = {
        title: $item.find('h4 a').text(),
        profile: $item.find('.wx-news-info').text(),  // 简介
        count: $item.find('.s-p').text(),
        link: $item.find('.wx-img-box a').attr('href'),
        pic: $item.find('.wx-img-box img').attr('src'),
        wxName: $item.find('.pos-wxrw p').eq(1).attr('title'),
        wxLink: $item.find('.pos-wxrw a').attr('href'),
        wxImg: $item.find('.pos-wxrw p').eq(0).find('img').attr('src'),
        time: $item.find('bb').attr('v')
      };
      resultArr.push(resultObj);
    });
    // console.log(resultArr);
    return resultArr
  }

  /**
   * 文章分类
   *
   * type: 文章类型
   * /api/weixin/group        所有分类
   * /api/weixin/group?type=0 当前分类
   *
   * @returns {*}
   */
  async groupAction() {
    let items = [{name: '热门'}, {name: '推荐'}, {name: '段子手'}];
    const type = parseInt(this.get('type') || -1);

    if (isNaN(type) || type < -1 || type >= items.length) {
      return this.fail('参数错误');
    }

    if (type !== -1) {
      items = [items[type]];
    }

    let index = type > -1 ? type : 0;

    for (let item of items) {
      let url = `http://weixin.sogou.com/pcindex/pc/pc_${index}/pc_${index}.html`;
      // console.log(url);
      let resultArr = await this._get(url);
      item.item = resultArr;
      index++;
    }
    return this.json(items);
  }

}
