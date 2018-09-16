<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ProjectChoose.aspx.cs" Inherits="ProjectChoose" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Cache-Control" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <link rel="shortcut icon" href="./Images/favicon/favicon.ico" />
    <link rel='stylesheet' href="./CSS/pc.css" />
    <script src="https://code.jquery.com/jquery-3.1.0.js"></script>
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div class="wrapper">
            <header class="top">
                <ul class="top-item" id="headInfo">
                    <li>圖片</li>
                    <li>選擇專案</li>
                    <li>帳戶資訊</li>
                </ul>
            </header>
            <div class="container">
                <h1>drag and drop or double Click the Project to right Box</h1>
                <ul id="list">
                </ul>
                <button type="button" id="btn1">Confirm</button>
            </div>
        </div>
    </form>
</body>
<script src="JS/choice.js"></script>
</html>
