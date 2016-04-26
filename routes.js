'use strict';

var proxy = require('koa-proxy')
var fs = require('co-fs')
var each = require('co-each')
var path = require('path')
var stable = require("stable")

module.exports = function(router, app) {
    // 静态页面列表
    // 只显示根目录html文件，链接后面的说明从<title>标签抓取
    router.get('/', function*() {
        var viewDir = './src',
            nodes = yield fs.readdir(path.resolve(__dirname, viewDir)),
            html = [],
            list = [],
            content,
            title,
            style = yield fs.readFile(path.resolve(__dirname, './src/css/index.css'), 'utf-8')

        html.push('<html><head><title>文件列表</title><style type="text/css">' + style + '</style></head><body class="typo">')
        html.push('<ul>')
        yield each(nodes, function*(node) {
            if(/\.html$/.test(node)) {
                content = yield fs.readFile(path.resolve(__dirname, viewDir, node), 'utf-8')
                title = content.match(/<title>(.*)<\/title>/)
                title = (title && title[1]) || ''
                list.push('<li><a href="' + node + '">' + node + '</a> ' + title + '</li>')
            }
        })
        list = stable(list)
        html.push(list.join(''))
        html.push('<ul/></html>')
        this.body = html.join('')
    })

    // 从文件读取测试数据，测试数据都放到mock目录
    // 可以通过this.query读取get参数，对测试数据逻辑处理
    // http://localhost:4001/api/list/test
    // http://localhost:4001/api/list/test?limit=10
    // router.get('/api/list/test', function*() {
    //     var query = this.query || {};
    //     var offset = query.offset || 0;
    //     var limit = query.limit || 0;
    //     var list = require(path.resolve(__dirname, './mock/listtest'));
    //     var diff = limit - list.length;

    //     if(diff <= 0) {
    //         this.body = {code: 0, data: list.slice(offset, limit)};
    //     } else {
    //         var arr = list.slice(0, list.length);
    //         var i = 0;

    //         while(diff--) arr.push(arr[i++]);

    //         this.body = {code: 0, data: arr};
    //     }
    // });

    // 通过代理模拟站外接口
    // http://localhost:4001/api/proxy/test 代理 http://news.qq.com/zt2015/JPX_UK/index.htm?tu_biz=1.114.1.0
    //router.get('/api/proxy/test', proxy({url: '/zt2015/JPX_UK/index.htm?tu_biz=1.114.1.0', host: 'http://news.qq.com'}));

    // 设置 cookie
    // app.use(function*(next) {
    //     this.header.cookie = 'token=2000000.60000.browserbrowserbrowserbrowserbrow.420620.1459839312.98a35de2bb70e2eae16f53a26c7c58a390a984b7; token_console=9.1459835387.ae2acdc1657123619130bd2862d69eb744dd855a; username=%E5%A4%96%E9%83%A8%E6%B5%8B%E8%AF%95'
    //     // this.header.cookie = 'token=1.1.abcdabcdabcdabcdabcdabcdabcdabcd.10000001.1456313070.e45c251050df3e0252162a31a8632511bbb8a6eb; username=%E5%A4%96%E9%83%A8%E6%B5%8B%E8%AF%95'
    //     yield next
    // })

    // 代理接口
    // app.use(proxy({
    //   host:  'https://shitaosdk.com',
    //   match: /^\/(material|subaccount|user)\//
    // }));

    // app.use(proxy({
    //   host:  'https://client.shitaosdk.com',
    //   match: /^\/(draw|vote)\//
    // }));
};
