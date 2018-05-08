


<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="zh-CN" prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb#" class="no-touch"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

    <title>全球视图</title>
    <link rel="shortcut icon" href="../../resources/img/favicon.ico">
    <link rel="stylesheet" type="text/css" href="../../resources/plugins/wmearth/styles/styles.css"/>
    <script>
        window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
        ga('create', 'UA-44235933-2', 'auto');
        ga('send', 'pageview');
        window.ctx = "${ctx}";
        window.coreApiPath = "${requestScope.coreApiContextPath}";
    </script>
    <script async="" src="../../resources/plugins/wmearth/js/analytics.js"></script>
</head>
<body>

<!--[if lte IE 9]><p id="warn">此网站需要IE10或者更高版本的浏览器。</p><![endif]-->

<div id="display" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
    <canvas id="map" class="max-screen" width="447.5" height="887.5" style="width: 358px; height: 710px;"></canvas>
    <canvas id="animation" class="fill-screen" width="358" height="710"></canvas>
    <canvas id="fastoverlay" width="179" height="355" style="width: 358px; height: 710px;"></canvas>
    <canvas id="overlay" class="fill-screen" width="358" height="710"></canvas>
    <canvas id="foreground" class="max-screen" width="447.5" height="887.5" style="width: 358px; height: 710px;"></canvas>
    <svg id="annotation" class="fill-screen" xmlns="http://www.w3.org/2000/svg" version="1.1" width="358" height="710"></svg>
</div>

<div id="tara-stats" class="invisible"></div>

<div id="notice" class="invisible">
    <p><span id="notice-hide" class="text-button invisible">✕</span><a href="https://earth.nullschool.net/zh-cn/about.html#geos-disclaimer" class="internal-link">important disclaimer</a></p>
</div>

<div id="details">
    <p id="status"></p>
    <div id="location">
        <p>
            <span id="location-coord" class="location"></span><span id="location-close" class="text-button invisible">✕</span>
        </p>
        <p>
            <span id="location-wind" class="location"></span>
            <span id="location-wind-units" class="location text-button"></span>
        </p>
        <p>
            <span id="location-value" class="location"></span>
            <span id="location-value-units" class="location text-button"></span>
        </p>
    </div>

    <div id="earth">
        <h1 id="show-menu" class="text-button" title="show menu" lang="en">设置 <span id="menu-ham" aria-hidden="true">≡</span></h1>
        <span id="progress" class="invisible"></span>
    </div>

    <div id="menu" class="invisible">
        <p>日期 | <span id="data-date" class="local"></span> <span id="toggle-zone" class="text-button"></span>
        </p>
        <p class="invisible">数据 | <span id="data-layer">Wind @ Surface</span></p>
        <p><span id="scale-label">范围 | </span><canvas id="scale" width="292" height="7"></canvas></p>
        <p class="invisible">来源 | <span id="data-center">GFS / NCEP / US National Weather Service</span></p>
        <p class="invisible">管理 | <span class="text-button" id="nav-now" title="当前状况">现在
                </span><span class="noselect"><span class="text-button" id="nav-backward-more" title="-1 Day"> « </span> – <span class="text-button" id="nav-backward" title="-3 Hours"> ‹ </span> – <span class="text-button" id="nav-forward" title="+3 Hours"> › </span> – <span class="text-button" id="nav-forward-more" title="+1 Day"> » </span></span><span class="text-button" id="show-location" title="当前位置">⊕</span><span class="text-button" id="option-show-grid" title="网格视图">网格</span><span class="text-button highlighted" id="animate-start" title="启用/停用动画">▷</span><span class="text-button" id="hd" title="高清晰度模式">高清</span>
        </p>
        <p>模式 | <span class="text-button highlighted" id="air-mode">大气</span> – <span class="text-button" id="ocean-mode">海洋</span> – <span class="text-button" id="chem-mode">化学污染物</span> – <span class="text-button" id="particulates-mode">颗粒物</span><!-- – <span
                class="text-button" id="argo-mode">Argo</span>-->
        </p>
        <p class="invisible">高度 | <span class="surface text-button highlighted" id="surface-level" title="近地面">地表</span> – <span class="surface text-button" id="isobaric-1000hPa">1000</span> – <span class="surface text-button" id="isobaric-850hPa">850</span> – <span class="surface text-button" id="isobaric-700hPa">700</span> – <span class="surface text-button" id="isobaric-500hPa">500</span> – <span class="surface text-button" id="isobaric-250hPa">250</span> – <span class="surface text-button" id="isobaric-70hPa">70</span> – <span class="surface text-button" id="isobaric-10hPa">10</span> hPa
        </p>
        <p class="wind-mode">覆盖模式 | <span class="text-button highlighted" id="wind" title="风速">风</span> – <span class="text-button" id="temp" title="温度">温度</span> – <span class="text-button" id="relative_humidity" title="相对湿度">相对湿度</span> – <span class="text-button disabled" id="wind_power_density" title="瞬时风电功率密度">WPD</span> – <span class="text-button" id="precip_3hr" title="3小时累积降水量">3HPA</span> – <span class="text-button" id="cape" title="对流可用位能（表面）">CAPE</span>
        </p>
        <p class="wind-mode"><span style="visibility:hidden">覆盖模式</span> | <span class="text-button" id="total_precipitable_water" title="水汽含量">水汽含量</span> – <span class="text-button" id="total_cloud_water" title="云中所含水汽总和">云中总水量</span> – <span class="text-button" id="mean_sea_level_pressure" title="平均海平面压力">MSLP</span> – <span class="text-button" id="misery_index" title="体感温度">体感温度</span> – <span class="text-button" id="off">无</span>
        </p>
        <p class="ocean-mode invisible">动画 | <span class="text-button" id="animate-currents" title="洋流">洋流</span> – <span class="text-button" id="animate-waves" title="波峰周期">波浪</span>
        </p>
        <p class="ocean-mode invisible">覆盖模式 | <span class="text-button" id="currents" title="洋流">洋流</span> – <span class="text-button" id="primary_waves" title="波峰周期">波浪</span>
        </p>
        <p class="ocean-mode invisible"><span style="visibility:hidden">覆盖模式</span> | <span class="text-button" id="sea_surface_temp" title="海面温度">海面温度</span> – <span class="text-button" id="sea_surface_temp_anomaly" title="海面温度异常">海温偏差值</span> – <span class="text-button" id="significant_wave_height" title="有效浪高">有效波高</span> – <span class="text-button" id="no-overlay">无</span>
        </p>
        <p class="chem-mode invisible">覆盖模式 | <span class="text-button" id="cosc" title="地表一氧化碳浓度">COsc</span> – <span class="text-button" id="co2sc" title="地表二氧化碳浓度">CO<sub>2</sub>sc</span> - <span
                class="text-button disabled" id="co"
                    title="地表一氧化碳浓度"
                >CO</span> - <span
                class="text-button disabled" id="o3"
                    title="Ozone Surface Concentration"
                >O<sub>3</sub></span> - <span
                class="text-button disabled" id="no2"
                    title="Nitrogen Dioxide Surface Concentration"
                >NO<sub>2</sub></span> - <span
                class="text-button disabled" id="so2"
                    title="Sulfur Dioxide Surface Concentration"
                >SO<sub>2</sub></span>
        </p>
        <p class="chem-mode invisible"><span style="visibility:hidden">覆盖模式</span> | <span class="text-button" id="so2smass" title="地表二氧化硫总质量">SO<sub>2</sub>sm</span>
        </p>
        <p class="chem-mode invisible"><span style="visibility:hidden">覆盖模式</span> |</p>
        <p class="particulates-mode invisible">覆盖模式 | <span class="text-button" id="duexttau" title="尘埃消光（气溶胶光学厚度，550纳米）">尘埃消光</span> - <span class="text-button" id="pm1" title="Particulate Matter &lt; 1 µm">PM<sub>1</sub></span> - <span class="text-button" id="pm25" title="Particulate Matter &lt; 2.5 µm">PM<sub>2.5</sub></span> - <span class="text-button" id="pm10" title="Particulate Matter &lt; 10 µm">PM<sub>10</sub></span>
        </p>
        <p class="particulates-mode invisible"><span style="visibility:hidden">覆盖模式</span> | <span class="text-button" id="suexttau" title="硫酸盐消光（气溶胶光学厚度，550纳米）">SO<sub>4</sub>ex</span>
        </p>
        <p class="particulates-mode invisible"><span style="visibility:hidden">覆盖模式</span> |</p>

        <!--
                    <p class="argo-mode">Pressure | <span
                        class="depth text-button" id="argo-2p5">2.5</span> – <span
                        class="depth text-button" id="argo-400">400</span> dbar
                    </p>
                    <p class="argo-mode invisible">覆盖模式 | <span
                        class="text-button" id="argo_temp_mean" title="">温度</span> – <span
                        class="text-button" id="argo_temp_anom" title="">Temp Anom</span> – <span
                        class="text-button" id="argo_salinity_mean" title="">Salinity</span> – <span
                        class="text-button" id="argo_salinity_anom" title="">Salinity Anom</span>
                    </p>
                    <p class="argo-mode invisible">Floats | <span
                        class="text-button" id="argo-planned" title="">Planned</span> – <span
                        class="text-button" id="argo-recent" title="">Recent</span> – <span
                        class="text-button" id="argo-operational" title="">Operational</span> – <span
                        class="text-button" id="argo-dead" title="">Dead</span> – <span
                        class="text-button" id="argo-none" title="">无</span>
                    </p>
        -->

        <p>投影 | <span class="proj text-button" id="atlantis" title="亚特兰蒂斯投影">A</span> – <span class="proj text-button" id="azimuthal_equidistant" title="等距方位投影">AE</span> – <span class="proj text-button" id="conic_equidistant" title="等距圆锥投影">CE</span> – <span class="proj text-button" id="equirectangular" title="等距圆柱投影">E</span> – <span class="proj text-button highlighted" id="orthographic" title="正射投影">O</span> – <span class="proj text-button" id="patterson" title="帕特森投影">P</span> – <span class="proj text-button" id="stereographic" title="立体投影">S</span> – <span class="proj text-button" id="waterman" title="沃特曼蝴蝶投影">WB</span> – <span class="proj text-button" id="winkel3" title="温克尔III投影">W3</span>
        </p>
    </div>
</div>


<!--<script async src="/js/bundle.js"></script>-->
<script type="text/javascript" src="../../resources/plugins/wmearth/js/bundle.js?v2"></script>



</body></html>