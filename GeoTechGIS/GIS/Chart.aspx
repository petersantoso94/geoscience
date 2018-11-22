<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Chart.aspx.cs" Inherits="GIS_Chart" %>

    <!DOCTYPE html>

    <html xmlns="http://www.w3.org/1999/xhtml">

    <head runat="server">

        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Cache-Control" content="no-cache" />
        <meta http-equiv="Expires" content="0" />
        <title>GeoTechGIS</title>
        <link rel="shortcut icon" href="../Images/favicon/favicon.ico" />
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
        <!-- 自製CSS -->
        <link rel="stylesheet" href="../css/main.css" />
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
            <!-- Header END -->

            <!-- 頁籤 start-->
            <p>
                Projects:
                <select id="projectSelect"></select>
            </p>
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-auto">
                        <ul class="nav nav-justified tabLabel">
                            <li class="nav-item">
                                <a class="nav-link tabStyle" href="./Map.aspx" id="openMap">Map</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link tabStyle" href="./InstructmentList.aspx">Data</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link tabStyle active" href="javascript:void(0)">Chart</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <!-- 頁籤 End -->

            <div class="container-fluid">
                <div class="tab-content margin">

                    <!-- Chart Tab Start-->
                    <div class="tab-pane tabContent active" id="chartTab">
                        <div class="container-fluid margin">
                            <div class="row">
                                <!-- 列表清單 START-->
                                <div class="col-md-3">
                                    <div>
                                        <table id="chartPartTable" style="width: 95%;">
                                            <!-- <tr>
                                                <td>Project</td>
                                                <td>
                                                    <select style="border: 1px solid #000; padding: 3px 0;">
                                                        <option>MRTCJ-570</option>
                                                    </select>
                                                </td>
                                            </tr> -->
                                            <!-- <tr>
                                                <td colspan="2">
                                                    <label id="chartSelectByArea">
                                                        <input name="typeChoice" type="radio" />&nbsp; By Area
                                                    </label>
                                                    <label id="chartSelectBySensor">
                                                        <input name="typeChoice" type="radio" checked />&nbsp; By Sensor
                                                    </label>
                                                </td>
                                            </tr>
                                            <tr id="chartChoiceByArea" class="hide">
                                                <td>Area
                                                </td>
                                                <td>
                                                    <select id="chartChoiceSelectArea" style="border: 1px solid #000; padding: 3px 0;">
                                                        <option value="0">All Area</option>
                                                    </select>
                                                </td>
                                            </tr> -->
                                            <tr>
                                                <td>
                                                    <label for="">Area</label>
                                                </td>
                                                <td>
                                                    <select name="" id="chartPartAreaSelect" style="width: 100%;"></select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label for="">Sensor</label>
                                                </td>
                                                <td>
                                                    <select name="" id="chartPartSensortypeSelect" style="width: 100%;"></select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label id="chartSensorMultiple">
                                                        <!-- <input type="checkbox" />&nbsp; Multiple -->
                                                    </label>
                                                </td>
                                                <td>
                                                    <select size="10" id="chartSelectInstrument" style="border: 1px solid #000; padding: 3px 0;">
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>From Date:</td>
                                                <td>
                                                    <input type="text" id="chartFromDate" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>To Date:</td>
                                                <td>
                                                    <input type="text" id="chartToDate" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Y-axis Max:</td>
                                                <td>
                                                    <input type="text" id="chartYAxisMax" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Y-axis Min:</td>
                                                <td>
                                                    <input type="text" id="chartYAxisMin" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>show Action:</td>
                                                <td>
                                                    <input type="checkbox" id="chartActionVisable" checked />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>show Alarm:</td>
                                                <td>
                                                    <input type="checkbox" id="chartAlarmVisable" checked />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>show Alert:</td>
                                                <td>
                                                    <input type="checkbox" id="chartAlertVisable" checked />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Draw Chart</td>
                                                <td>
                                                    <button type="button" id="chartDrawChart">Draw</button>
                                                </td>
                                            </tr>
                                            <%--<tr>
                                                    <td>Export Data:</td>
                                                    <td>
                                                        <!-- <button type="button" id="chartSaveData">Export Data</button> -->
                                                    </td>
                                                </tr>--%>
                                        </table>
                                    </div>
                                </div>
                                <!-- 列表清單 End-->

                                <!-- 圖表、LIST 部分 START-->
                                <div class="col-md-9">
                                    <ul class="nav nav-tabs" role="tablist">
                                        <li class="nav-item">
                                            <a class="nav-link tabStyle active" data-toggle="tab" href="#tabChartContent">chart</a>
                                        </li>
                                        <li class="nav-item tabStyle">
                                            <a class="nav-link" data-toggle="tab" href="#tabDataContent">data</a>
                                        </li>
                                    </ul>
                                    <div class="tab-content margin">
                                        <div class="tab-pane  active" style="height: 500px;" id="tabChartContent">
                                            <div id="MultipleChart"></div>
                                            <div id="noDataShow"></div>
                                        </div>
                                        <div class="tab-pane  " style="height: 500px;" id="tabDataContent">
                                            <p id="SensorItem"></p>
                                            <table id="MultipleDataList" class="hover">
                                                <thead>
                                                </thead>
                                                <tbody>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <!-- 圖表、LIST 部分 End-->
                            </div>
                        </div>
                    </div>
                    <!-- Chart Tab End-->
                </div>
            </div>
        </form>
    </body>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb"
        crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn"
        crossorigin="anonymous"></script>
    <script src="../JS/ChartPlugIn.js"></script>
    <script src="../JS/Chart.js"></script>

    </html>