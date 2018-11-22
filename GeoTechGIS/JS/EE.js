$('.loading').hide();
var Type = { dataType: "SP" };
var area = { area: "" };
var date = { from: "", to: "" };
var url = "GetExcelPath";

var resetFilter = function (element) {
    $("#filterFromDate").val("");
    $("#filterToDate").val("");
    $("#location").html("");
    $("#holeNo").html("");
    $("#dataType").val("SP");
    area = { area: "" };
    Type = { dataType: "SP" };
    date = { from: "", to: "" };
    $("#holeContainer").hide();
}

var submit_filter = function (element) {
    $('.loading').show();
    let from_ = $("#filterFromDate").val();
    let to_ = $("#filterToDate").val();
    let area_ = $("#location").val();
    let DataFormat = {};
    DataFormat = {
        from: from_,
        to: to_,
        area: area.area,
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
            window.location.href = ans.Path;
        } else {
            alert("Session Expired, Please Re-Login");
            window.location.href = "../Login.aspx";
        }
    };
    setting.error = function (err) {
        console.error(err);
    };
    $.ajax(setting);
}

$("#dataType").on("change", function () {

    Type.dataType = $(this).val();
    $("#location").html("");

    if ($(this).val() == "Sid") {
        url = "GetExcelPathSid";
        $("#holeContainer").show();
        getLocationData.load();
    } else {
        url = "GetExcelPath";
        $("#holeContainer").hide();
        getLocationData.load();
    }
})

$("#location").on("change", function () {
    area.area = $(this).val();
    if (Type.dataType == "Sid") {
        getHoleNo.load();
    }
})

var getHoleNo = {
    load: function () {
        let setting = {};
        setting.type = 'post';
        setting.contentType = 'Application/json; charset=utf-8';
        setting.data = JSON.stringify(area);
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

var getLocationData = {
    load: function () {
        let setting = {};
        setting.type = 'post';
        setting.contentType = 'Application/json; charset=utf-8';
        setting.data = JSON.stringify(Type);
        setting.dataType = 'json';
        setting.url = 'ExportExcel.aspx/GetLocationData';
        setting.success = function (res) {
            let ans = res.hasOwnProperty('d') ? res.d : res;
            if (!ans.isOk) {
                alert(ans.Message);
                window.location.href = "../Login.aspx";
            } else {
                MainData = ans;
                getLocationData.ShowOnThePage(ans);
                if (Type.dataType == "Sid")
                    getHoleNo.load();
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
            if (counter == 0)
                area.area = element;
            htmlContent += "<option value='" + element + "'>" + element + "</option>";
            counter++;
        })
        $("#location").html(htmlContent);

    }
}

$(document).ready(function () {
    getLocationData.load();
});