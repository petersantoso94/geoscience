<!--<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Map.aspx.cs" Inherits="GIS_Map" %>-->

    <!DOCTYPE html>

    <html xmlns="http://www.w3.org/1999/xhtml">

    <head runat="server">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Cache-Control" content="no-cache" />
        <meta http-equiv="Expires" content="0" />
        <link rel="shortcut icon" href="../Images/favicon/favicon.ico" />
        <title>MAP</title>
        <!-- Bootstrap 4 CSS-->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ"
            crossorigin="anonymous" />
        <script src="https://code.jquery.com/jquery-3.1.1.slim.min.js" integrity="sha384-A7FZj7v+d/sdmMqp/nOQwliLvUsJfDHW+k9Omg/a/EheAdgtzNs3hpfag6Ed950n"
            crossorigin="anonymous"></script>
        <!-- Jquery  -->
        <script src="https://code.jquery.com/jquery-3.1.0.js"></script>
        <!-- font-awesome -->
        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN"
            crossorigin="anonymous" />

        <!-- Jquery UI -->
        <link href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css" rel="stylesheet" type="text/css" />
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

        <!-- DataTable -->
        <link href="https://cdn.datatables.net/1.10.16/css/jquery.dataTables.min.css" rel="stylesheet" type="text/css" />
        <script src="https://cdn.datatables.net/1.10.16/js/jquery.dataTables.min.js"></script>

        <!-- DataTable 的按鈕套件 -->
        <link href="https://cdn.datatables.net/buttons/1.3.1/css/buttons.dataTables.min.css" rel="stylesheet" type="text/css" />
        <script src="https://cdn.datatables.net/buttons/1.3.1/js/dataTables.buttons.min.js"></script>

        <!-- DataTable JQ套件 -->
        <link href="https://cdn.datatables.net/1.10.16/css/dataTables.jqueryui.min.css" rel="stylesheet" type="text/css" />
        <!-- <link href="//code.jquery.com/ui/1.11.4/themes/base/jquery-ui.css" rel="stylesheet" type="text/css" /> -->
        <script src="https://cdn.datatables.net/1.10.16/js/dataTables.jqueryui.min.js"></script>

        <!-- DataTable 功能套件 -->
        <script src="//cdn.datatables.net/buttons/1.3.1/js/buttons.flash.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>

        <!-- DataTable 儲存成PDF 功能套件 -->
        <script src="//cdn.rawgit.com/bpampuch/pdfmake/0.1.27/build/pdfmake.min.js"></script>
        <script src="//cdn.rawgit.com/bpampuch/pdfmake/0.1.27/build/vfs_fonts.js"></script>

        <!-- DataTable 按鈕 功能套件 -->
        <script src="//cdn.datatables.net/buttons/1.3.1/js/buttons.html5.min.js"></script>

        <!-- DataTable 按鈕 瀏覽器列印 功能套件 -->
        <script src="//cdn.datatables.net/buttons/1.3.1/js/buttons.print.min.js"></script>

        <!-- HighChart 圖表套件 -->
        <!-- highCharts -->
        <script src="https://code.highcharts.com/highcharts.js"></script>
        <!-- highCharts 擴充 -->
        <script src="https://code.highcharts.com/modules/data.js"></script>
        <script src="https://code.highcharts.com/modules/exporting.js"></script>
        <script src="https://code.highcharts.com/modules/no-data-to-display.js"></script>
        <!--snazzy info-->
        <link rel="stylesheet" type="text/css" href="../CSS/snazzy-info-window.min.css" />
        <!-- <link rel="stylesheet" type="text/css" href="../CSS/snazzy.css" /> -->
        <!-- 自製CSS -->
        <link rel="stylesheet" type="text/css" href="../CSS/main.css" />
    </head>

    <body>
        <form id="form1" runat="server">
            <!-- Header 開頭 -->
            <div class="proBar" style="border: none;">
                <div class="container-fluid pro">
                    <div class="row">
                        <!-- 公司圖案 -->
                        <div class="col-md-2">
                            <a href="javascript:void(0)">
                                <img class="img-fluid" src="../Images/LOGO/logo.png" alt="LOGO" />
                            </a>
                        </div>
                        <!-- 專案描述 -->
                        <div class="col-md-8">
                            <h2>
                                <a id="projectName">專案名稱</a>
                            </h2>
                            <h4>
                                <a id="porjectDescript">專案描述</a>
                            </h4>
                        </div>
                        <!-- 帳戶區塊 -->
                        <div class="col-md-2">
                            <ul class="header-info-account">
                                <li>
                                    <a class="info-box">
                                        <i class="fa fa-envelope-open-o"></i>
                                        <span id="alertEvent">0</span>
                                    </a>
                                    <ul class="list hide" id="alertEventList">
                                    </ul>
                                </li>
                                <li id="accountItem">
                                    <a class="info-box" id="infoAccount">
                                        <i class="fa fa-user-o"></i>
                                    </a>
                                    <ul class="list hide" id="accountPenal" style="background: #FFF;">
                                        <li>
                                            <a id="logOut">Log out</a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <!-- TOP END -->

            <h5>
                Projects:
                <select id="projectSelect"></select>
            </h5>

            <!-- 頁籤 start-->

            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-auto">
                        <ul class="nav nav-justified tabLabel">
                            <li class="nav-item">
                                <a class="nav-link tabStyle active" href="javascript:void(0)" id="openMap">Map</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link tabStyle" href="./InstructmentList.aspx">Data</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link tabStyle" href="./Chart.aspx">Chart</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <!-- 頁籤 End -->

            <!--頁籤的內容-->
            <div class="container-fluid">
                <div class="tab-content margin">
                    <!-- Map Start -->
                    <div class="tab-pane tabContent active" id="mapTab">
                        <div class="container-fluid">
                            <div class="row margin">
                                <!-- MAP part -->
                                <div class="col-md-8">
                                    <div class="row margin">
                                        <div class="col-md-6">
                                            <label style="line-height: 37px;">Map function:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                                            <div id="mapFunction" class="btn-group" data-toggle="buttons">
                                                <label class="btn btn-outline-warning" id="selectionArea">
                                                    <input type="checkbox" name="mapOption" />Selection Area
                                                </label>
                                            </div>
                                            <label>
                                                <button type="button" class="hide" id="resume">Resume</button>
                                            </label>
                                        </div>

                                        <div class="col-md-6">
                                            <!-- 回復地圖預設 -->
                                            <button type="button" class="btn btn-secondary" id="default">Map Default</button>
                                            <!-- 地圖內建的圖標關掉 -->
                                            <button type="button" class="btn btn-secondary active" id="MapLegend">Map Legend On</button>
                                            <!-- legend button -->
                                            <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#iconModalLong">Legend Setting</button>
                                        </div>
                                    </div>
                                    <!-- 地圖類型 & 地圖 -->
                                    <div class="row margin">
                                        <!-- <div class="col-md-6"> -->
                                        <!-- 地圖類型 Start-->
                                        <!-- <label>Map Type&nbsp;&nbsp;</label> -->
                                        <!-- <ul id="mapTypeArea" class="mapTypeArea"> -->
                                        <!-- <li class="mapTypeSelected">Roadmap </li> -->
                                        <!-- <li>Satellite</li> -->
                                        <!-- <li>Hybrid</li> -->
                                        <!-- <li>Terrain</li> -->
                                        <!-- </ul> -->
                                        <!-- 地圖類型 End-->
                                        <!-- </div> -->
                                        <div class="col-md-12" style="padding:0">
                                            <!--儀器監測相關數據 start-->
                                            <!-- <label>Marker List:&nbsp;&nbsp;</label> -->
                                            <ul class="mark-block" id="markerList">
                                                <li>
                                                    <button class="btn btn-secondary btn-sm marker-type" id="markerAll" type="button">
                                                        All
                                                        <span>
                                                            <a class="marker-items" id="allCount"></a>
                                                        </span>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button class="btn btn-primary btn-sm marker-type" id="markerNormal" type="button">
                                                        Normal
                                                        <span>
                                                            <a class="marker-items" id="normalCount"></a>
                                                        </span>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button class="btn btn-success btn-sm marker-type" id="markerAlert" type="button">
                                                        Alert
                                                        <span>
                                                            <a class="marker-items" id="alertCount"></a>
                                                        </span>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button class="btn btn-warning btn-sm marker-type" id="markerAlarm" type="button">
                                                        Alarm
                                                        <span>
                                                            <a class="marker-items" id="alarmCount"></a>
                                                        </span>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button class="btn btn-danger btn-sm marker-type" id="markerAction" type="button">
                                                        Action
                                                        <span>
                                                            <a class="marker-items" id="actionCount"></a>
                                                        </span>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button class="btn btn-info btn-sm marker-type" id="markerStop" type="button">
                                                        Stop
                                                        <span>
                                                            <a class="marker-items" id="stopCount"></a>
                                                        </span>
                                                    </button>
                                                </li>
                                            </ul>
                                            <!--儀器監測相關數據 End-->
                                        </div>

                                        <div id="map"></div>
                                        <!-- <button type="button" id="saveMapImage">Copy Map</button>
                                                <a style="margin: 5px; display: none;" id="startToDownloadMap" href="####">download</a>-->
                                        <button id="toggleContour" type="button" style="margin: 0 5px;">show Contour</button>
                                        <button id="toggleTBM" type="button" style="margin: 0 5px;">show Construct</button>
                                        <!--<button id="showCAD" type="button" style="margin:0 5px;">Show CAD</button> -->
                                    </div>
                                </div>

                                <!-- MAPR PART List Start-->
                                <div class="col-md-4">
                                    <!--選擇區塊 區塊-->
                                    <!-- <p>Choice station:</p> -->

                                    <div class="row justify-content-center">
                                        <!--列表的內容-->
                                        <div class="listArea">
                                            <!--LIST 分頁頭TAB START-->
                                            <ul class="nav nav-tabs" role="tablist">
                                                <li class="nav-item">
                                                    <a class="nav-link active" data-toggle="tab" href="#InstrumentData">Instrument Data</a>
                                                </li>
                                                <!-- <li class="nav-item">
                                                            <a class="nav-link" data-toggle="tab" href="#ConstructionData">Construction Data</a>
                                                        </li> -->
                                                <li class="nav-item">
                                                    <a class="nav-link" data-toggle="tab" href="#AAAData">AAA Data</a>
                                                </li>
                                            </ul>
                                            <!--LIST 分頁TAB END-->

                                            <!-- 分頁的內文區塊 -->
                                            <div class="tab-content">
                                                <div class="tab-pane tabList active" id="InstrumentData">
                                                    <div class="row ListMargin">
                                                        <h6>Locate Instruments</h6>
                                                    </div>
                                                    <div class="row ListMargin">
                                                        <input type="text" id="IDSearch" class="ListItemWidth" />
                                                    </div>
                                                    <div class="row ListMargin">
                                                        <select id="mapStationSelect" class="ListItemWidth">
                                                            <option value="0">All Station</option>
                                                        </select>
                                                    </div>
                                                    <div class="row ListMargin">
                                                        <select id="IDAreaSelect" class="ListItemWidth">
                                                            <option value="0">All Area</option>
                                                        </select>
                                                    </div>
                                                    <div class="row ListMargin">
                                                        <h6>Instruments Tpye</h6>
                                                    </div>
                                                    <div class="row ListMargin">
                                                        <select id="IDTypsSelect" class="ListItemWidth">
                                                            <option value="0">All Type</option>
                                                        </select>
                                                    </div>
                                                    <div class="row ListMargin">
                                                        <h6>Instruments Selection</h6>
                                                    </div>
                                                    <div class="row ListMargin">
                                                        <div id="showISelection" class="ListItemWidth">
                                                            <ul id="showISelectionList">
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div class="row ListMargin">
                                                        <h6>Instruments Info</h6>
                                                    </div>
                                                    <div class="row ListMargin">
                                                        <div id="showISelectionInfo" class="ListItemWidth">
                                                            <ul id="showISelectionInfoInfo"></ul>
                                                        </div>
                                                        <br />
                                                    </div>
                                                    <!-- <div class="row">
                                                                <!-- Button trigger modal 
                                                                <button id="startForChart" type="button" class="btn btn-secondary btn-sm" data-toggle="modal" data-target="#showChart" style="margin: 2.5px 29px 0;">
                                                                    show chart
                                                                </button>
                                                            </div> -->
                                                </div>
                                                <div class="tab-pane tabList" id="ConstructionData">Comming soon</div>
                                                <div class="tab-pane tabList" id="AAAData">
                                                    <div id="aaaTable">
                                                        <!-- AAA Nav tabs -->
                                                        <ul class="nav nav-tabs" role="tablist">
                                                            <li class="nav-item">
                                                                <a class="nav-link active" data-toggle="tab" href="#Action" role="tab">Action</a>
                                                            </li>
                                                            <li class="nav-item">
                                                                <a class="nav-link" data-toggle="tab" href="#Alarm" role="tab">Alarm</a>
                                                            </li>
                                                            <li class="nav-item">
                                                                <a class="nav-link" data-toggle="tab" href="#Alert">Alert</a>
                                                            </li>
                                                        </ul>
                                                        <!-- AAA Nav tabs End-->
                                                        <!-- AAA TABLE START -->
                                                        <div class="tab-content" style="margin-top: 3px;">
                                                            <div class="tab-pane AAADataTableHeight" id="Action">
                                                                <table id="ActionTable" class="display">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Instrument ID</th>
                                                                            <th>Type</th>
                                                                            <th>Value</th>
                                                                            <th>Date</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody></tbody>
                                                                </table>
                                                            </div>
                                                            <div class="tab-pane AAADataTableHeight active" id="Alarm">
                                                                <table id="AlarmTable" class="display">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Instrument ID</th>
                                                                            <th>Type</th>
                                                                            <th>Value</th>
                                                                            <th>Date</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody></tbody>
                                                                </table>
                                                            </div>
                                                            <div class="tab-pane AAADataTableHeight" id="Alert">
                                                                <table id="AlertTable" class="display">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Instrument ID</th>
                                                                            <th>Type</th>
                                                                            <th>Value</th>
                                                                            <th>Date</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody></tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        <!-- AAA TABLE END-->
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- MAPR PART List END-->
                            </div>
                        </div>
                    </div>
                    <!-- Map End -->
                </div>
            </div>

            <!--Legend Modal -->
            <div class="modal fade" id="iconModalLong" tabindex="-1">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">Setting</h5>
                            <button type="button" class="close" data-dismiss="modal">
                                <span>&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <!--地圖儀器的顯示選擇-->
                            <div class="container">
                                <div id="showMapIconList">
                                    <table id="selectInstrumentOnMap" class="infoWindowTable">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <input type="checkbox" disabled />
                                                </th>
                                                <th>Legend</th>
                                                <th>Sensor Type</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-dismiss="modal">OK</button>
                        </div>
                    </div>
                </div>
            </div>
            <!--Legend End-->

            <!-- Map 部分的圖表視窗 -->
            <div class="modal fade" id="showChart" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="Title">Single Instrument</h5>
                            <button type="button" class="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-5">
                                        <!-- 時間軸 -->
                                        <div id="MapPartChartOneInstrumentDefault" class="btn-group" data-toggle="buttons">
                                            <label class="btn btn-secondary active" id="chartBoxAll" data-range="all">
                                                <input type="radio" name="options" checked /> All
                                            </label>
                                            <label class="btn btn-secondary" id="chartBox1year">
                                                <input type="radio" name="options" /> 1 Year
                                            </label>
                                            <label class="btn btn-secondary" id="chartBox6Months">
                                                <input type="radio" name="options" /> 2 Months
                                            </label>
                                            <label class="btn btn-secondary" id="chartBox1Month">
                                                <input type="radio" name="options" /> 1 Month
                                            </label>
                                            <label class="btn btn-secondary " id="chartBox1Week">
                                                <input type="radio" name="options" /> 1 Week
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-md-7">
                                        <label>
                                            From:&nbsp;&nbsp;
                                            <input type="text" id="fromDate" />
                                        </label>
                                        <label>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To:&nbsp;&nbsp;
                                            <input type="text" id="toDate" />
                                        </label>
                                        <!-- <button type="button" class="" id="updateChartSetting" style="float: right;">GO!</button> -->
                                        <br />
                                        <br />
                                        <label>
                                            <input type="checkbox" id="chartboxAlarm" checked /> Alarm
                                        </label>
                                        <label>
                                            <input type="checkbox" id="chartboxAction" checked /> Action
                                        </label>
                                        <label>
                                            <input type="checkbox" id="chartboxAlert" checked /> Alert
                                        </label>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-5">
                                        <div id="instrument_picture_chart">
                                            
                                        </div>
                                     </div>
                                    <div class="col-md-7"><div id="chart"></div></div>
                                </div>
                            
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Map 部分的圖表視窗 end-->

            <!-- Picture 部分的圖表視窗 -->
            <div class="modal fade" id="showInstrumentPicture" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="Title">Instrument Picture</h5>
                            <button type="button" class="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                                <div class="row">
                                    <div id="instrument_picture">
                                        
                                    </div>
                                </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Picture 部分的圖表視窗 end-->
        </form>
    </body>
    <!-- google map -->
    <!-- <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC9CzBd5Ao7HCfGfN8ruoVRHqYp0XydArI&callback=initMap" 
    async defer></script>-->
    <!--公司產生-->
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAi2I1D9qdn_7uTJlOQ1CRZxIBducv_sAI&libraries=geometry"></script>
    <script src="../JS/MeasureTool.min.js"></script>
    <!-- <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC9CzBd5Ao7HCfGfN8ruoVRHqYp0XydArI"></script> -->
    <script src="../JS/snazzy-info-window.min.js"></script>
    <!-- Image2Canvas -->
    <!-- <script src="../js/html2canvas.js"></script> -->
    <!-- canvas2Image -->
    <!-- <script src="../js/canvas2image.js"></script> -->
    <!-- Bootstrap 4  -->

    <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb"
        crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn"
        crossorigin="anonymous"></script>

    <script src="../JS/MapPlugIn.js"></script>
    <script src="../JS/Map.js"></script>



    </html>