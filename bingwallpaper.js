// http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&uhd=1&uhdwidth=3840&uhdheight=2160 4k
// http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1 2k 1920 * 1080
// 每日壁纸api
// 获取Api
// 关于必应壁纸api的文章也特别多,也有很多小伙伴自己封装了接口提供给大家使用，我直接介绍官方的api

// https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN

// 首先分析一下这个接口含义，直接看后面的请求参数：

// 参数名称	值含义
// format  （非必需）	// 返回数据格式，不存在返回xml格式
// js (一般使用这个，返回json格式)
// xml（返回xml格式）
// idx  (非必需)	    // 请求图片截止天数
// 0 今天
// -1 截止中明天 （预准备的）
// 1 截止至昨天，类推（目前最多获取到7天前的图片）
// n （必需）	        // 1-8 返回请求数量，目前最多一次获取8张

// mkt  （非必需）      // 地区
// zh-CN
// ...
// 以上面url为例，可以看到返回内容为：

//
// 此时就可以得到图片部分地址了，然后通过域名+部分地址就可以直接获取图片了，如下：

// https://cn.bing.com/az/hprichbg/rb/VenetianRowing_ZH-CN6668445308_1920x1080.jpg

// https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&nc=1614319565639&pid=hp&FORM=BEHPTB&uhd=1&uhdwidth=3840&uhdheight=2160

const axios = require("axios");
const fs = require("fs");
const fsPromises = require("fs").promises;
const baseurl = "http://cn.bing.com";
const bingApiUrl =
    "/HPImageArchive.aspx?format=js&idx=0&n=1&uhd=1&uhdwidth=3840&uhdheight=2160";
const config = {
    headers: {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.92 Safari/537.36",
    },
    // 设置请求超时的毫秒数
    timeout: 5000,
};

const getBingWallpaper = async function () {
    let apiUrl = baseurl + bingApiUrl;
    let axiosRes = await axios(apiUrl, config);
    // console.log(axiosRes.data);
    let bingwallpaper = axiosRes.data.images[0];
    let imgObj = {};
    imgObj.imgDate = bingwallpaper.startdate;
    imgObj.imgtitle = bingwallpaper.title;
    imgObj.imgcopyright = bingwallpaper.copyright;
    imgObj.imgurl = baseurl + bingwallpaper.url.split("&")[0];
    console.log(imgObj);
    let savePath = "wallpaper/" + imgObj.imgDate + ".jpg";
    saveImgInfo(imgObj, savePath);
    let mdStr = `#### ${imgObj.imgDate} ${imgObj.imgtitle} \n![${imgObj.imgcopyright}](${savePath})\n${imgObj.imgcopyright}\n`;
    fsPromises.writeFile("./redame.md", mdStr, { flag: "a" });
};

const saveImgInfo = async function (imgObj, savePath) {
    config.responseType = "stream";
    let resdata = await axios(imgObj.imgurl, config);
    // console.log(resdata);
    let fsw = fs.createWriteStream(savePath);
    resdata.data.pipe(fsw);
    fsw.on("close", () => {
        console.log(" 保存完毕");
    });
};

getBingWallpaper();
