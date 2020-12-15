import { exec } from "child_process";
import * as _ from "lodash";
import * as fs from "fs";
import request from "request";
import * as bluebird from "bluebird";
import config from "config";

const statPromise = bluebird.promisify(fs.stat, fs);

const commonHelp = {
    /**
     * 通过node.js执行一段命令行脚本，并以promise的形式返回信息
     * @param  {String}   cmd 脚本命名
     * @return {Primise}      执行脚本后脚本返回的信息
     */
    execPromise(cmd) {
        return new Promise((resolve, reject) => {
            exec(cmd, (err, stdout, stderr) => {
                if (err) {
                    console.error("命令行错误：", cmd, stderr);
                    reject(stderr);
                } else {
                    resolve(stdout);
                }
            })
        });
    },
    /**
     * 设置单个JSON文件
     * @param  {String}   url  文件的url
     */
    getJsonFile(url) {
        return new Promise((resolve, reject) => {
            fs.readFile(url, 'utf-8', function (err, data) {
                try {
                    resolve(JSON.parse(data));
                } catch (err) {
                    reject(err);
                }
            });
        });
    },
    /**
     * 设置单个JSON文件
     * @param  {String}   url  文件的url
     * @param  {Any}   data 文件的内容
     */
    setJsonFile(url, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(url, JSON.stringify(data, null, '    '), {
                encoding: 'utf-8'
            }, function () {
                resolve(true);
            });
        });
    },

    /**
     * 批量读取JSON文件
     * @param  {Array<String>}   urlArr
     * @return {Promise}   
     */
    getJsonFileList(urlArr) {
        let promiseArr = _.map(urlArr, (val, index) => this.getJsonFile(urlArr[index]));
        return Promise.all(promiseArr);
    },

    /**
     * 批量设置JSON文件
     * @param  {Array<Object>}   dataArr [ {url: '……', data: ……} ]
     * @return {Promise}   
     */
    setJsonFileList(dataArr) {
        let promiseArr = _.map(dataArr, (val, index) => this.setJsonFile(val.url, val.data));
        return Promise.all(promiseArr);
    },

    isExisFile(path) {
        try {
            fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK);
            return true;
        } catch (err) {
            return false;
        }
    },
    isExisPath(path) {
        return statPromise(path);
    },
    copyFile(originUrl, targetUrl) {
        fs.copyFileSync(originUrl, targetUrl);
    },
    async errHandle(func) {
        let result;
        try {
            let data = await func() || "success!"
            result = {
                status: 0,
                data,
            };
        } catch (error) {
            result = {
                status: 1,
                errstr: error.toString(),
            };
        }
        return result;
    },

    /**
     * 向飞书发送消息
     * @param {*} param0 
     */
    postMessageToLark({message}){

    }
};

export default commonHelp