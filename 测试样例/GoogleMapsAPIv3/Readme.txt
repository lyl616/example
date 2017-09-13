Google Maps API v3离线开发包

在09年的时候，我就写过一篇Google Maps API离线开发包(没有网络也可以开发Gmap了)，后来liongis大虾又重新整理了一份新的包，甚至出了v3版的离线包。今天在liongis大虾的基础上，我重新整理释放一份离线开发包给大家，和liongis的离线包相比，仅将版本由3.4.x升级到3.8.2，这应该是现阶段最新的包，最简单的一个区别：放大地图的时候，比原版平滑顺畅的多，这当然最需要感谢的，是Google的改进，增加了一层静态地图覆盖，放大的时候又异步平滑加载，所以效果非常好。
废话不多说，除了上述说到的改进，我顺便附送一份世博地图的tile，实现的效果大致如下：preview.jpg
这一效果算是叠加自定义瓦片地图的形式实现的自己地图离线显示。
需要特别说明的是：
1、本离线开发包内仅实现了功能离线，即js源码和部分控件图片的离线，地图仍然使用Google Tile。
2、从思路上讲，将Google Tile下载到本地，或者自行切割tile，都是一种将地图离线的方法，原则上都可以实现。
关于tile的命名和获取方法，待下回分解。祝大家用好这份离线包，如有兴趣可以一起讨论交流。
下载地址：http://sharesh.googlecode.com/files/GoogleMapsAPIv3_OfflinePack.zip
使用方法：解压缩到一个web服务器目录下，通过浏览器地址直接访问map-simple.html和maptype-tms.html即可，前者是简单示例，后者是瓦片地图示例。IE6、FireFox、Chrome下测试通过。

Rover Tang
2012-03-15
Rover.Tang@qq.com
http://RoverTang.com