<%@ Page Language="C#" AutoEventWireup="true" CodeFile="InstructmentList.aspx.cs" Inherits="GIS_InsturctmentList" %>

    <!DOCTYPE html>

    <html xmlns="http://www.w3.org/1999/xhtml">

    <head runat="server">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Cache-Control" content="no-cache" />
        <meta http-equiv="Expires" content="0" />
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
        <title>儀器資訊</title>
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
                                <a class="nav-link tabStyle active" href="javascript:void(0)">Data</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link tabStyle" href="./Chart.aspx">Chart</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <!-- 頁籤 End -->
            <div class="container-fluid">
                <div class="tab-content margin">

                    <!-- Value Tab Start-->
                    <div class="tab-pane tabContent active" id="valueTab">
                        <div class="container-fluid margin">
                            <div class="row">
                                <div class="col-md-2">
                                    <!-- 專案列表 -->
                                    <label>
                                        <a>Station:</a>
                                        <select class="select" id="StationSelect">
                                            <option value="0">All</option>
                                        </select>
                                    </label>
                                </div>
                                <!-- 工區 -->
                                <div class="col-md-2">
                                    <label>
                                        <a>Area:</a>
                                        <select class="select" id="AreaSelect">
                                            <option value="0">All </option>
                                        </select>
                                    </label>
                                </div>

                                <!-- 儀器種類 -->
                                <div class="col-md-2">
                                    <label>
                                        <a>Sensor type:</a>
                                        <select class="select" id="LegendSelect">
                                            <option value="0">All type</option>
                                        </select>
                                    </label>
                                </div>

                                <!-- 儀器狀態 -->
                                <div class="col-md-2">
                                    <label>
                                        <a>Status:</a>
                                        <select class="select" id="StatusSelect">
                                            <option value="0">All </option>
                                        </select>
                                    </label>
                                </div>



                                <div class="col-xs-12 col-md-4">
                                    <!-- 匯出資料 按鈕 -->
                                    <button id="btnValueSaveData" type="button" class="btn btn-primary" data-toggle="modal" data-target="#txtDataDialog" style="position: absolute; right: 50px; top: 20px;">
                                        Export Data
                                    </button>
                                </div>
                            </div>
                            <!--Data List Table Start-->
                            <div class="row container-fluid">
                                <!--DataTable Table  Start-->
                                <table id="valueTable" class="display" style="width: 100%">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Status</th>
                                            <th>Sensor Name</th>
                                            <th>Last Measured</th>
                                            <th>Unit Value</th>
                                            <th>Date</th>
                                            <th>Alarm Level</th>
                                            <th>Action Level</th>
                                            <th>Alert Level</th>
                                            <th>Remark</th>
                                            <th>Chart</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                                <!--DataTable Table End-->
                            </div>
                            <!--Data List Table End-->
                        </div>
                    </div>
                    <!-- Value Tab End-->
                </div>
            </div>

            <!--  Data 部分的圖表視窗  -->
            <div class="modal fade" id="valueShowChart" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="valueTitle">Single Instrument Box</h5>
                            <button type="button" class="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <!--value chart Box-->
                        <div class="modal-body">
                            <div class="container">
                                <div class="row">
                                    <div class="col-md-5">
                                        <div id="InstrumentStableInterval" class="btn-group" data-toggle="buttons">
                                            <label class="btn btn-secondary active" id="valueChartBoxAll" data-range="all">
                                                <input type="radio" name="options" checked /> All
                                            </label>
                                            <label class="btn btn-secondary" id="valueChartBox1year">
                                                <input type="radio" name="options" /> 1 Year
                                            </label>
                                            <label class="btn btn-secondary" id="valueChartBox6Months">
                                                <input type="radio" name="options" /> 2 Months
                                            </label>
                                            <label class="btn btn-secondary" id="valueChartBox1Month">
                                                <input type="radio" name="options" /> 1 Month
                                            </label>
                                            <label class="btn btn-secondary " id="valueChartBox1Week">
                                                <input type="radio" name="options" /> 1 Week
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-md-7">
                                        <label>
                                            From:&nbsp;&nbsp;
                                            <input type="text" id="FromDate" />
                                        </label>
                                        <label>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To:&nbsp;&nbsp;
                                            <input type="text" id="ToDate" />
                                        </label>
                                        <br />
                                        <br />
                                        <label>
                                            <input type="checkbox" id="ChartboxAlarm" checked /> Alarm
                                        </label>
                                        <label>
                                            <input type="checkbox" id="ChartboxAction" checked /> Action
                                        </label>
                                        <label>
                                            <input type="checkbox" id="ChartboxAlert" checked /> Alert
                                        </label>
                                    </div>
                                </div>
                                <hr />
                                <div class="row">
                                    <div id="chart"></div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            <!--Value Model Part End-->

            <!-- Export Modual Start -->
            <div class="modal fade" id="txtDataDialog" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Data Select</h5>
                            <button type="button" class="close" data-dismiss="modal">
                                <span>&times;</span>
                            </button>
                        </div>
                        <!-- Modual  內容 Start-->
                        <div class="modal-body">
                            <div style="margin: auto; width: 60%;">
                                <table>
                                    <tr>
                                        <td>
                                            <label>
                                                Sensor:&nbsp;&nbsp;
                                            </label>
                                        </td>
                                        <td>
                                            <select id="GageTypeSelect" style="border: 1px solid #000; padding: 3px 0;">
                                                <option value="0">All Type</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label>
                                                DataType:&nbsp;&nbsp;
                                            </label>
                                        </td>
                                        <td>
                                            <label>
                                                <input type="radio" name="choiceDataType" id="valueChartBoxSelectValue" checked />Value
                                            </label>
                                            <label>
                                                <input type="radio" name="choiceDataType" id="valueChartBoxSelectRowData" />Row Data
                                            </label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label>
                                                From:
                                            </label>
                                        </td>
                                        <td>
                                            <input type="text" id="DownloadFromDate" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label>
                                                To:
                                            </label>
                                        </td>
                                        <td>
                                            <input type="text" id="DownloadToDate" />
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <!-- Modual  內容 End-->

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" data-dismiss="modal" id="SaveData">Export</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Export Modual End -->
        </form>
    </body>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb"
        crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn"
        crossorigin="anonymous"></script>
    <script src="../JS/InstructmentListPlugIn.js"></script>
    <script src="../JS/InstructmentList.js"></script>

    </html>