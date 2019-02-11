$('.loading').hide();
var Type = { dataType: "SP" };
var point = { no: "" };
var date = { from: "", to: "" };
var url = "GetExcelPath";

var resetFilter = function (element) {
    $("#filterFromDate").val("");
    $("#filterToDate").val("");
    $("#holeNo").html("");
    $("#dataType").val("SP");
    Type = { dataType: "SP" };
    date = { from: "", to: "" };
}

var submit_filter = function (element) {
    $('.loading').show();
    let from_ = $("#filterFromDate").val();
    let to_ = $("#filterToDate").val();
    let DataFormat = {};
    if (!from_ || !to_) {
        if (!from_ && !to_)
            alert("Date is Empty!");
        else if (!from_)
            alert("From date is Empty!");
        else if (!to_)
            alert("To date is Empty!");
        $('.loading').hide();
    } else {
        DataFormat = {
            from: from_,
            to: to_,
            pointno: $("#holeNo").val(),
            type: Type.dataType
        };
        if (Type.dataType == "Sid") {
            DataFormat = {
                from: from_,
                to: to_,
                holeno: $("#holeNo").val()
            };
        }
        let setting = {};
        setting.type = 'post';
        setting.contentType = 'Application/json; charset=utf-8';
        setting.data = JSON.stringify(DataFormat);
        setting.dataType = 'json';
        setting.url = 'ExportExcel.aspx/' + url;
        setting.success = function (res) {
            let ans;
            if (res.hasOwnProperty('d')) {
                ans = res.d;
            } else {
                ans = res;
            }
            if (ans.isOk) {
                $('.loading').hide();
                if (ans.Path == "non") {
                    $('.loading').hide();
                    alert('Data is empty for ' + $("#holeNo").val());
                } else {
                    window.location.href = ans.Path;
                }
            } else {
                $('.loading').hide();
                alert('Data is empty for ' + $("#holeNo").val());
            }
        };
        setting.error = function (err) {
            console.error(err);
        };
        $.ajax(setting);
    }
}

$("#dataType").on("change", function () {

    Type.dataType = $(this).val();
    $("#holeNo").html("");
    if ($(this).val() == "Sid") {
        $('#pointorhole').html("Hole");
        url = "GetExcelPathSid";
        getHoleNo.load();
    } else {
        $('#pointorhole').html("Point");
        url = "GetExcelPath";
        GetPointData.load();
    }
})

var getHoleNo = {
    load: function () {
        let setting = {};
        setting.type = 'post';
        setting.contentType = 'Application/json; charset=utf-8';
        setting.dataType = 'json';
        setting.url = 'ExportExcel.aspx/GetHoleData';
        setting.success = function (res) {
            let ans = res.hasOwnProperty('d') ? res.d : res;
            if (!ans.isOk) {
                alert(ans.Message);
                window.location.href = "../Login.aspx";
            } else {
                MainData = ans;
                getHoleNo.ShowOnThePage(ans);
            }
        };
        setting.error = function (err) {
            console.error(err);
        };

        $.ajax(setting);
    },
    ShowOnThePage: function (element) {
        //更改專案欄位
        this.SetToProjectList(element.ProjectsList, element.ProjectInfo.ProjectName);
        //專案標題
        this.SetProjectTitle(element.ProjectInfo.ProjectName, element.ProjectInfo.ProjectDescript);
        //顯示在列表上面
        this.SetOnTable(element.DataPackage);
    },
    SetProjectTitle: function (Title, SubTitle) {
        $('a#projectName').text(Title);
        $('a#porjectDescript').text(SubTitle);
    },
    SetToProjectList: function (list, showPro) {
        let str = '<option>' + showPro + '</option>';
        list.forEach(function (item) {
            str += item !== showPro ? '<option>' + item + '</option>' : '';
        });

        $('select#projectSelect').html(str);
    }, SetOnTable: function (Instruments) {
        if (Instruments.length === 0) {
            return false;
        }
        var htmlContent = "";
        Instruments.forEach(function (element) {
            htmlContent += "<option value='" + element + "'>" + element + "</option>";
        })
        $("#holeNo").html(htmlContent);
    }
}

var GetPointData = {
    load: function () {
        let setting = {};
        setting.type = 'post';
        setting.contentType = 'Application/json; charset=utf-8';
        setting.data = JSON.stringify(Type);
        setting.dataType = 'json';
        setting.url = 'ExportExcel.aspx/GetPointData';
        setting.success = function (res) {
            let ans = res.hasOwnProperty('d') ? res.d : res;
            if (!ans.isOk) {
                alert(ans.Message);
                window.location.href = "../Login.aspx";
            } else {
                MainData = ans;
                GetPointData.ShowOnThePage(ans);
            }
        };
        setting.error = function (err) {
            console.error(err);
        };
        setting.done = function (res) {

        }
        $.ajax(setting);
    },
    ShowOnThePage: function (element) {
        //更改專案欄位
        this.SetToProjectList(element.ProjectsList, element.ProjectInfo.ProjectName);
        //專案標題
        this.SetProjectTitle(element.ProjectInfo.ProjectName, element.ProjectInfo.ProjectDescript);
        //顯示在列表上面
        this.SetOnTable(element.DataPackage);
    },
    SetProjectTitle: function (Title, SubTitle) {
        $('a#projectName').text(Title);
        $('a#porjectDescript').text(SubTitle);
    },
    SetToProjectList: function (list, showPro) {
        let str = '<option>' + showPro + '</option>';
        list.forEach(function (item) {
            str += item !== showPro ? '<option>' + item + '</option>' : '';
        });

        $('select#projectSelect').html(str);
    }, SetOnTable: function (Instruments) {
        if (Instruments.length === 0) {
            return false;
        }
        var htmlContent = "";
        var counter = 0;
        Instruments.forEach(function (element) {
            htmlContent += "<option value='" + element + "'>" + element + "</option>";
            counter++;
        })
        $("#holeNo").html(htmlContent);

    }
}

$(document).ready(function () {
    GetPointData.load();
});