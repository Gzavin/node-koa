import * as _ from "lodash";
import commonHelper from "./common-helper.js";
import config from "config";


export default class JsonConfig {
    _dataAll = null;
    constructor({
        name,
        idProp,
        fileUrl
    }) {
        this.fileUrl = fileUrl;
        this.name = name;
        this.idProp = idProp;
    }

    get idList() {
        return _.map(this.getDataAll(), item => item[this.idProp]);
    }

    async getDataAll() {
        if (!this._dataAll) {
            this._dataAll = await commonHelper.getJsonFile(this.fileUrl);
        }
        return this._dataAll;
    }

    async setDataAll(dataAll) {
        if (dataAll !== this._dataAll) {
            this._dataAll = dataAll
        }
        await commonHelper.setJsonFile(this.fileUrl, this._dataAll);
    }


    /**
     * 增加 一个配置文件的item信息，默认增加到第一条
     * @param  {String}   options.fileUrl 更改文件的url
     * @param  {String}   options.idProp  定位更改item的key的属性值
     * @param  { Any  }   options.idVal   定位更改的item的key的值
     * @param  { Any  }   options.data    更改的item的内容
     */
    async addConfigItem(data, type) {
        let idVal = data[this.idProp];
        let dataAll = await this.getDataAll();
        let curData = dataAll;

        if (type && type != 'normal') {
            let index = dataAll.findIndex(item => item.name == type);
            curData = dataAll[index].value;
        }
        let isRepeatKey = curData.find(dataItem => dataItem[this.idProp] === idVal) ? true : false;
        if (isRepeatKey) {
            await Promise.reject(`关键字${idVal}已经存在，请更换`);
        } else {
            curData.unshift(data);
            await this.setDataAll(dataAll);
        }
    }

    modifyConfigItem(data, type) {
        return this._modifyOrDelItem(data, false, type);
    }

    deleteConfigItem(data, type) {
        return this._modifyOrDelItem(data, true, type);
    }

    /**
     * 修改 / 删除 一个配置文件的item信息，若data为undefined则表示删除
     * @param  {String}   options.fileUrl 更改文件的url
     * @param  {String}   options.idProp  定位更改item的key的属性值
     * @param  { Any  }   options.idVal   定位更改的item的key的值
     * @param  { Any  }   options.data    更改的item的内容
     * @return {Promise}                  
     */
    async _modifyOrDelItem(data, isDel, type) {
        let idVal = data[this.idProp];
        let dataAll = await this.getDataAll();
        let curData = dataAll;

        if (type && type != 'normal') {
            let index = dataAll.findIndex(item => item.name == type);
            curData = dataAll[index].value;

        }

        if (this.idProp == 'serverName' && !isDel && data.config == 'custom') {
            let fileUrl = config.get('path.defineConfPlace') + data[this.idProp] + '.conf';
            let isExist = commonHelper.isExisFile(fileUrl);
            if (!isExist) {
                commonHelper.copyFile(this.defaultFileUrl, fileUrl);
            }
            let targetfile = config.get('path.defineConfPlace') + data[this.idProp] + '.js';
            commonHelper.setDefineFile(fileUrl, targetfile);
        }


        let targetIdx = curData.findIndex(dataItem => dataItem[this.idProp] === idVal);
        if (targetIdx < 0) {
            return false;
        }
        if (isDel) {
            curData.splice(targetIdx, 1);
        } else {
            curData.splice(targetIdx, 1, data);
        }
        await this.setDataAll(dataAll);

        if (type) {
            let file = this.fileUrl.match(/.*\/(.*)\.conf/)[1];
            let targetfile = config.get('path.defineConfPlace') + file + '.js';

            commonHelper.setDefineFile(this.fileUrl, targetfile);
        }
    }
}