var submitForm1 = function () {
    let fileCSV = document.getElementById("importFile").files;
    console.log(fileCSV);
    let setting = {};
    setting.type = 'post';
    setting.contentType = 'Application/json; charset=utf-8';
    setting.data = fileCSV;
    setting.dataType = 'json';
    setting.url = 'Pos.aspx/PostExcelData';
    setting.success = function (res) {
        let ans;
        if (res.hasOwnProperty('d')) {
            ans = res.d;
        } else {
            ans = res;
        }
        switch (ans) {
            case true:
                //將帳號可使用的專案給導入到前端
                alert('TRUE');
                break;
            case false:
                alert('FALSE');
                break;
        }
    };
    setting.error = function (err) {
        console.error(err);
    };

    $.ajax(setting);
}
var editOrInsert = "";
var deleteData = function (element) {
    let data_no = $(element).data("point");
    let DataFormat = {};
    DataFormat = {
        No: data_no
    };
    let setting = {};
    setting.type = 'post';
    setting.contentType = 'Application/json; charset=utf-8';
    setting.data = JSON.stringify(DataFormat);
    setting.dataType = 'json';
    setting.url = 'Pos.aspx/DeleteData';
    setting.success = function (res) {
        let ans;
        if (res.hasOwnProperty('d')) {
            ans = res.d;
        } else {
            ans = res;
        }
        switch (ans) {
            case true:
                //將帳號可使用的專案給導入到前端
                window.location.replace(window.location.href);
                break;
            case false:
                alert('FALSE');
                break;
        }
    };
    setting.error = function (err) {
        console.error(err);
    };
    if (confirm("Do you want to delete this Data?") == true) {
        $.ajax(setting);
    }
}
var submitEdit = function () {
    let ajaxLink = "";

    if (editOrInsert === "edit")
        ajaxLink = 'Pos.aspx/UpdateData';
    else if (editOrInsert === "insert")
        ajaxLink = 'Pos.aspx/InsertData';
    
    let DataFormat = {};
    DataFormat = {
        pointNo: $("#PointNo").val(),
        station: $("#Station").val(),
        area: $("#Area").val(),
        factor1: $("#Factor1").val(),
        factor2: $("#Factor2").val(),
        factor3: $("#Factor3").val(),
        iniRead1: $("#IniRead1").val(),
        iniRead2: $("#IniRead2").val(),
        iniRead3: $("#IniRead3").val(),
        insDate: $("#Insdate").val(),
        iniDate: $("#IniDate").val(),
        alert: $("#Alert").val(),
        alarm: $("#Alarm").val(),
        action: $("#Action").val(),
        rem1: $("#Rem1").val(),
        rem2: $("#Rem2").val(),
        rem3: $("#Rem3").val()
    }

    let setting = {};
    setting.type = 'post';
    setting.contentType = 'Application/json; charset=utf-8';
    setting.data = JSON.stringify(DataFormat);;
    setting.dataType = 'json';
    setting.url = ajaxLink;
    setting.success = function (res) {
        let ans;
        if (res.hasOwnProperty('d')) {
            ans = res.d;
        } else {
            ans = res;
        }
        switch (ans) {
            case true:
                //將帳號可使用的專案給導入到前端
                window.location.replace(window.location.href);
                break;
            case false:
                alert('FALSE');
                break;
        }
    };
    setting.error = function (err) {
        console.error(err);
    };

    $.ajax(setting);
}
var setValueInsert = function () {
    editOrInsert = "insert";
    $("input").val("");
    $("#PointNo").removeAttr("readonly");
}
var setValueOnModal = function (element) {
    editOrInsert = "edit";
    $("#PointNo").attr("readonly", "readonly");
    let point = $(element).data("point");
    let station = $(element).data("station");
    let area = $(element).data("area");
    let factor1 = $(element).data("factor1");
    let factor2 = $(element).data("factor2");
    let factor3 = $(element).data("factor3");
    let iniread1 = $(element).data("iniread1");
    let iniread2 = $(element).data("iniread2");
    let iniread3 = $(element).data("iniread3");
    let insdate = $(element).data("insdate").split(' ')[0].split('/');
    let inidate = $(element).data("inidate").split(' ')[0].split('/');
    let alert = $(element).data("alert");
    let alarm = $(element).data("alarm");
    let action = $(element).data("action");
    let rem1 = $(element).data("rem1");
    let rem2 = $(element).data("rem2");
    let rem3 = $(element).data("rem3");


    $("#PointNo").val(point);
    $("#Station").val(station);
    $("#Area").val(area);
    $("#Factor1").val(factor1);
    $("#Factor2").val(factor2);
    $("#Factor3").val(factor3);
    $("#IniRead1").val(iniread1);
    $("#IniRead2").val(iniread2);
    $("#IniRead3").val(iniread3);
    $("#Rem1").val(rem1);
    $("#Rem2").val(rem2);
    $("#Rem3").val(rem3);
    $("#Alert").val(alert);
    $("#Alarm").val(alarm);
    $("#Action").val(action);
    $("#IniDate").val(inidate[2] + "-" + (inidate[0].length === 2 ? inidate[0] : ("0" + inidate[0])) + "-" + (inidate[1].length === 2 ? inidate[1] : ("0" + inidate[1])));
    $("#Insdate").val(insdate[2] + "-" + (insdate[0].length === 2 ? insdate[0] : ("0" + insdate[0])) + "-" + (insdate[1].length === 2 ? insdate[1] : ("0" + insdate[1])));
}

var config = {
    load: function () {
        let setting = {};

        setting.type = 'post';
        setting.contentType = 'Application/json; charset=utf-8';
        setting.data = '';
        setting.dataType = 'json';
        setting.url = 'Pos.aspx/GetPosData';
        setting.success = function (res) {
            let ans = res.hasOwnProperty('d') ? res.d : res;
            if (!ans.isOk) {
                alert(ans.Message);
                window.location.href = "../Login.aspx";
            } else {
                MainData = ans;
                config.ShowOnThePage(ans);
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
    },
    //將資料丟到列表
    SetOnTable: function (Instruments) {
        if (Instruments.length === 0) {
            return false;
        }

        let InputArray = [];

        Instruments.forEach(function (element) {
            InputArray.push({
                0: element.PointNo,
                1: element.Station,
                2: element.Area,
                3: element.Factor1,
                4: element.Factor2,
                5: element.Factor3,
                6: element.IniRead1,
                7: element.IniRead2,
                8: element.IniRead3,
                9: element.InsDate,
                10: element.IniDate,
                11: element.Alert,
                12: element.Alarm,
                13: element.Action,
                14: element.Rem1,
                15: element.Rem2,
                16: element.Rem3,
                17: '<button class="fa fa-edit" style="margin:10px;" type="button" onclick="setValueOnModal(this)" data-toggle="modal" data-target="#editValue" data-point="' +
                    element.PointNo + '" data-station="' + element.Station + '" data-area="' + element.Area + '" data-factor1="' + element.Factor1 + '" data-factor2="' +
                    element.Factor2 + '" data-factor3="' + element.Factor3 + '" data-iniread1="' + element.IniRead1 + '" data-iniread2="' + element.IniRead2 + '" data-iniread3="' +
                    element.IniRead3 + '" data-insdate="' + element.InsDate + '" data-inidate="' + element.IniDate + '" data-alert="' + element.Alert + '"  data-alarm="' +
                    element.Alarm + '" data-action="' + element.Action + '" data-rem1="' + element.Rem1 + '" data-rem2="' + element.Rem2 + '" data-rem3="' +
                    element.Rem3 + '"></button>' +
                    '<button class="fas fa-trash-alt" style="margin:10px;" type="button" onclick="deleteData(this)" data-point="' + element.PointNo + '"></button>'
            });

        });

        ValueTable.rows.add(InputArray)
            .draw();

    }
};

$(document).ready(function () {
    config.load();
});