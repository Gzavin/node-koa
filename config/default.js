// In default.js
// using defer functions is optional. See example and docs below.
var defer = require('config/defer').deferConfig;

module.exports = {
	"path": {
		// mc-web项目的相对路径，用于执行本地的国际化文件同步功能
		// 联调平台的数据以文件格式储存，文件所存在的文件夹
		"fileDatabase": "../file-database/",
		// 上传的暂存文件夹
		"uploadFolder": "./.cache",
		// 联调平台的代码存放的位置
		"codePlace": "../code-works",
		// 联调平台生成的nginx配置文件存放的文件夹
		"nginxConfPlace": "../nginx-conf/",
		// 生成的nginx的配置
		"nginxConfTpl": "./template/nginx-conf-tpl",
		// 后端api配置文件的文件路径
		"backendConf": defer( function() { return this.path.fileDatabase + "backendEnv.conf" }),
		// 联调环境文件的文件路径
		"devConf": defer( function() { return this.path.fileDatabase + "devEnv.conf" }),
		// 前端仓库配置文件的文件路径
		"repositoryConf": defer( function() { return this.path.fileDatabase + "repositoryEnv.conf" }),
		// 友情链接配置文件的文件路径
		"linksConf": defer( function() { return this.path.fileDatabase + "linksEnv.conf" }),
	},
	"api": {
		// api的转发地址，用来实现获取和修改引导信息的
		"originUrl": "http://localhost:9000"
	},
	"serve": {
		// 服务启动的端口
		"port": 2233,
	},
	nginx: {
		// 是否启用nginx配置，本地调式的时候可能没安装nginx，可以设置为关闭
		enable: false,
		// 重启nginx的命令，实际部署环境由于权限等原因，重启的命令可能会不同
		reloadCmd: "nginx -s reload",
	},
	util: {
	}
}
