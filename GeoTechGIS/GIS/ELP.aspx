﻿<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ELP.aspx.cs" Inherits="GIS_Default" %>

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

        th { font-size: 13px; }
td { font-size: 12px;padding:3px!important; }
.dataTables_info { font-size: 13px; }
.dataTables_paginate { font-size: 13px; }
    </style>
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
        <div class="tab-content margin">
            <div class="tab-pane tabContent active" id="valueTab">
                <div class="container-fluid margin">
                    <div class="container-fluid">
                        <!--Data List Table Start-->
                        <h4>Date Filter</h4>
                        <div class="row">
                            <div class="col-md-3">From: <input type="date" id="filterFromDate" class="form-control"/></div>
                            <div class="col-md-3">To: <input type="date" id="filterToDate" class="form-control"/></div>
                            <div class="col-md-2" style="padding-top:25px;"><button class="btn btn-secondary" type="button" onclick="setFilter(this)">Filter</button>
                                <button class="btn btn-danger" type="button" onclick="resetFilter(this)">Reset</button></div>
                            </div>
                        <div class="row container-fluid">
                            <button class="fa fa-plus-square" style="margin-bottom:6px;margin-top:6px;" type="button" onclick="setValueInsert(this)" data-toggle="modal" data-target="#editValue">Add ELP Data</button>
                            <!--DataTable Table  Start-->
                            <table id="valueTable" class="display" style="width: 100%">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Point No</th>
                                        <th>Mea No</th>
                                        <th>Read1</th>
                                        <th>Read2</th>
                                        <th>Read3</th>
                                        <th>Value</th>
                                        <th>Initial </th>
                                        <th>Normal </th>
                                        <th>ReM </th>
                                        <th>Sensor </th>
                                        <th>Function</th>
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
            </div>
        </div>
    </form>
    <!--  Data 部分的圖表視窗  -->
    <div class="modal fade" id="editValue" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="valueTitle">Edit POS Data</h5>
                    <button type="button" class="close" data-dismiss="modal">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <!--value chart Box-->
                <div class="modal-body">
                    <div class="container">
                        <input type="hidden" id="no" />
                        <div class="row">
                            <div class="col-md-2">
                                <label>Date</label>
                            </div>
                            <div class="col-md-4">
                                <input type="date" id="Date" readonly="readonly"/>
                            </div>
                            <div class="col-md-2">
                                <label>Point No</label>
                            </div>
                            <div class="col-md-4">
                                <input type="text" id="PointNo" readonly="readonly"/>
                            </div>
                            <div class="col-md-2">
                                <label>Mea No</label>
                            </div>
                            <div class="col-md-4">
                                <input type="text" id="MeaNo" />
                            </div>
                            <div class="col-md-2">
                                <label>Read1</label>
                            </div>
                            <div class="col-md-4">
                                <input type="text" id="Read1" />
                            </div>
                            <div class="col-md-2">
                                <label>Read2</label>
                            </div>
                            <div class="col-md-4">
                                <input type="text" id="Read2"  />
                            </div>
                            <div class="col-md-2">
                                <label>Read3</label>
                            </div>
                            <div class="col-md-4">
                                <input type="text" id="Read3"  />
                            </div>
                            <div class="col-md-2">
                                <label>Value</label>
                            </div>
                            <div class="col-md-4">
                                <input type="text" id="Value"  />
                            </div>
                            <div class="col-md-2">
                                <label>Initial</label>
                            </div>
                            <div class="col-md-4">
                                <input type="checkbox" id="Initial" />
                                <label>Yes</label>
                            </div>
                            <div class="col-md-2">
                                <label>Normal</label>
                            </div>
                            <div class="col-md-4">
                                <input type="text" id="Normal"  />
                            </div>
                            <div class="col-md-2">
                                <label>ReM</label>
                            </div>
                            <div class="col-md-4">
                                <input type="text" id="ReM"  />
                            </div>
                            <div class="col-md-2">
                                <label>Sensor</label>
                            </div>
                            <div class="col-md-4">
                                <input type="text" id="Sensor" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" onclick="submitEdit()">Save</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <!--Value Model Part End-->
</body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb"
    crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn"
    crossorigin="anonymous"></script>
<script src="../JS/InstructmentListPlugIn.js"></script>
<script src="../JS/ELP.js"></script>
</html>
