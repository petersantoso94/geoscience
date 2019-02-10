<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ExportExcel.aspx.cs" Inherits="GIS_Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Cache-Control" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <!-- Bootstrap 4 CSS-->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ"
        crossorigin="anonymous" />
    <script src="https://code.jquery.com/jquery-3.1.1.slim.min.js" integrity="sha384-A7FZj7v+d/sdmMqp/nOQwliLvUsJfDHW+k9Omg/a/EheAdgtzNs3hpfag6Ed950n"
        crossorigin="anonymous"></script>
    <!-- Jquery  -->
    <script src="https://code.jquery.com/jquery-3.1.0.js"></script>
    <!-- font-awesome -->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">

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
    <link href="../CSS/dataTables.jqueryui.min.css" rel="stylesheet" type="text/css" />
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
    <link rel="stylesheet" href="../css/main.css" />
    <title></title>
    <style>
        /* Absolute Center Spinner */
            .loading {
                position: fixed;
                z-index: 999;
                height: 2em;
                width: 2em;
                overflow: show;
                margin: auto;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
            }

            /* Transparent Overlay */
            .loading:before {
                content: '';
                display: block;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(rgba(20, 20, 20,.8), rgba(0, 0, 0, .8));

                background: -webkit-radial-gradient(rgba(20, 20, 20,.8), rgba(0, 0, 0,.8));
            }

            /* :not(:required) hides these rules from IE9 and below */
            .loading:not(:required) {
                /* hide "loading..." text */
                font: 0/0 a;
                color: transparent;
                text-shadow: none;
                background-color: transparent;
                border: 0;
            }

            .loading:not(:required):after {
                content: '';
                display: block;
                font-size: 10px;
                width: 1em;
                height: 1em;
                margin-top: -0.5em;
                -webkit-animation: spinner 1500ms infinite linear;
                -moz-animation: spinner 1500ms infinite linear;
                -ms-animation: spinner 1500ms infinite linear;
                -o-animation: spinner 1500ms infinite linear;
                animation: spinner 1500ms infinite linear;
                border-radius: 0.5em;
                -webkit-box-shadow: rgba(255,255,255, 0.75) 1.5em 0 0 0, rgba(255,255,255, 0.75) 1.1em 1.1em 0 0, rgba(255,255,255, 0.75) 0 1.5em 0 0, rgba(255,255,255, 0.75) -1.1em 1.1em 0 0, rgba(255,255,255, 0.75) -1.5em 0 0 0, rgba(255,255,255, 0.75) -1.1em -1.1em 0 0, rgba(255,255,255, 0.75) 0 -1.5em 0 0, rgba(255,255,255, 0.75) 1.1em -1.1em 0 0;
                box-shadow: rgba(255,255,255, 0.75) 1.5em 0 0 0, rgba(255,255,255, 0.75) 1.1em 1.1em 0 0, rgba(255,255,255, 0.75) 0 1.5em 0 0, rgba(255,255,255, 0.75) -1.1em 1.1em 0 0, rgba(255,255,255, 0.75) -1.5em 0 0 0, rgba(255,255,255, 0.75) -1.1em -1.1em 0 0, rgba(255,255,255, 0.75) 0 -1.5em 0 0, rgba(255,255,255, 0.75) 1.1em -1.1em 0 0;
            }

            /* Animation */

            @-webkit-keyframes spinner {
                0% {
                    -webkit-transform: rotate(0deg);
                    -moz-transform: rotate(0deg);
                    -ms-transform: rotate(0deg);
                    -o-transform: rotate(0deg);
                    transform: rotate(0deg);
                }
                100% {
                    -webkit-transform: rotate(360deg);
                    -moz-transform: rotate(360deg);
                    -ms-transform: rotate(360deg);
                    -o-transform: rotate(360deg);
                    transform: rotate(360deg);
                }
            }
            @-moz-keyframes spinner {
                0% {
                    -webkit-transform: rotate(0deg);
                    -moz-transform: rotate(0deg);
                    -ms-transform: rotate(0deg);
                    -o-transform: rotate(0deg);
                    transform: rotate(0deg);
                }
                100% {
                    -webkit-transform: rotate(360deg);
                    -moz-transform: rotate(360deg);
                    -ms-transform: rotate(360deg);
                    -o-transform: rotate(360deg);
                    transform: rotate(360deg);
                }
            }
            @-o-keyframes spinner {
                0% {
                    -webkit-transform: rotate(0deg);
                    -moz-transform: rotate(0deg);
                    -ms-transform: rotate(0deg);
                    -o-transform: rotate(0deg);
                    transform: rotate(0deg);
                }
                100% {
                    -webkit-transform: rotate(360deg);
                    -moz-transform: rotate(360deg);
                    -ms-transform: rotate(360deg);
                    -o-transform: rotate(360deg);
                    transform: rotate(360deg);
                }
            }
            @keyframes spinner {
                0% {
                    -webkit-transform: rotate(0deg);
                    -moz-transform: rotate(0deg);
                    -ms-transform: rotate(0deg);
                    -o-transform: rotate(0deg);
                    transform: rotate(0deg);
                }
                100% {
                    -webkit-transform: rotate(360deg);
                    -moz-transform: rotate(360deg);
                    -ms-transform: rotate(360deg);
                    -o-transform: rotate(360deg);
                    transform: rotate(360deg);
                }
            }
        div.well {
            height: 250px;
        }

        .Absolute-Center {
            margin: auto;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
        }

            .Absolute-Center.is-Responsive {
                width: 50%;
                height: 50%;
                min-width: 200px;
                max-width: 400px;
                padding: 40px;
                border: 1pt double grey;
                display: inline-block;
            }

        #logo-container {
            margin: auto;
            margin-bottom: 10px;
            width: 200px;
            height: 30px;
        }

        th {
            font-size: 13px;
        }

        td {
            font-size: 12px;
            padding: 3px !important;
        }

        .dataTables_info {
            font-size: 13px;
        }

        .dataTables_paginate {
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="loading" >Loading&#8230;</div>
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
        <div class="tab-content margin">
            <div class="tab-pane tabContent active" id="valueTab">
                <div class="container-fluid margin">
                    <div class="container-fluid">
                        <!--Data List Table Start-->
                        <h5>Date</h5>
                        <div class="row">
                            <div class="col-md-3">
                                From:
                                <input type="date" id="filterFromDate" class="form-control" />
                            </div>
                            <div class="col-md-3">
                                To:
                                <input type="date" id="filterToDate" class="form-control" />
                            </div>
                        </div>
                        <h5>Data</h5>
                        <div class="row">
                            <div class="col-md-3">
                                <label for="sel1">Data Type:</label>
                                <select class="form-control" id="dataType">
                                    <option value="SP">Settlement Point (SP)</option>
                                    <option value="SR">Extensometer (SR)</option>
                                    <option value="Sid">Inclinometer (SID)</option>
                                    <option value="ELP">Piezometer (ELP)</option>
                                </select>
                            </div>
                            <div class="col-md-3" id="holeContainer">
                                <label for="sel1"><p id="pointorhole">Hole</p> Number:</label>
                                <select class="form-control" id="holeNo">
                                </select>
                            </div>
                            <div class="col-md-2" style="padding-top: 30px;">
                                <button class="btn btn-primary" type="button" onclick="submit_filter(this)">Export Excel</button>
                                <button class="btn btn-danger" type="button" onclick="resetFilter(this)">Reset</button>
                            </div>
                        </div>
                        <!--Data List Table End-->
                    </div>
                </div>
            </div>
        </div>
    </form>
    <!--  Data 部分的圖表視窗  -->
</body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb"
    crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn"
    crossorigin="anonymous"></script>
<script src="../JS/EE.js"></script>
</html>
