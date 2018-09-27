var submitForm1 = function () {
    let fileCSV = document.getElementById("importFile").files;
    console.log(fileCSV);
    let setting = {};
    setting.type = 'post';
    setting.contentType = 'Application/json; charset=utf-8';
    setting.data = fileCSV;
    setting.dataType = 'json';
    setting.url = 'ELP.aspx/PostExcelData';
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
var filter = {from:"",to:""};
var setFilter = function (element) {
    filter.from = $("#filterFromDate").val();
    filter.to = $("#filterToDate").val();
    config.load();
}
var resetFilter = function (element) {
    filter.from = "";
    filter.to = "";
    $("#filterFromDate").val("");
    $("#filterToDate").val("");
    config.load();
}
var editOrInsert = "";
var deleteData = function (element) {
    let data_no = $(element).data("point");
    let data_date = $(element).data("date");
    let DataFormat = {};
    DataFormat = {
        No: data_no,
        Date: data_date
    };
    let setting = {};
    setting.type = 'post';
    setting.contentType = 'Application/json; charset=utf-8';
    setting.data = JSON.stringify(DataFormat);
    setting.dataType = 'json';
    setting.url = 'ELP.aspx/DeleteData';
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
        ajaxLink = 'ELP.aspx/UpdateData';
    else if (editOrInsert === "insert")
        ajaxLink = 'ELP.aspx/InsertData';
    
    let initial_ = "0";
    if ($("#Initial").prop("checked"))
        initial_ = "1";
    let DataFormat = {};
    DataFormat = {
        pointNo: $("#PointNo").val(),
        date: $("#Date").val(),
        meaNo: $("#MeaNo").val(),
        read1: $("#Read1").val(),
        read2: $("#Read2").val(),
        read3: $("#Read3").val(),
        value: $("#Value").val(),
        initial: initial_,
        normal: $("#Normal").val(),
        reM: $("#ReM").val(),
        sensor: $("#Sensor").val(),
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
    $("#Date").removeAttr("readonly");
}
var setValueOnModal = function (element) {
    editOrInsert = "edit";
    $("#PointNo").attr("readonly", "readonly");
    $("#Date").attr("readonly", "readonly");
    let point = $(element).data("point");
    let meano = $(element).data("meano");
    let read1 = $(element).data("read1");
    let read2 = $(element).data("read2");
    let read3 = $(element).data("read3");
    let value = $(element).data("value");
    let initial = $(element).data("initial");
    let normal = $(element).data("normal");
    let sensor = $(element).data("sensor");
    let date = $(element).data("date").split(' ')[0].split('/');
    let rem = $(element).data("rem");

    if (initial === 'True')
        $("#Initial").attr('checked', true);


    $("#PointNo").val(point);
    $("#MeaNo").val(meano);
    $("#Read1").val(read1);
    $("#Read2").val(read2);
    $("#Read3").val(read3);
    $("#Value").val(value);
    $("#Normal").val(normal);
    $("#ReM").val(rem);
    $("#Sensor").val(sensor);
    $("#Date").val(date[2] + "-" + (date[0].length === 2 ? date[0] : ("0" + date[0])) + "-" + (date[1].length === 2 ? date[1] : ("0" + date[1])));
}

var config = {
    load: function () {
        let setting = {};
        setting.type = 'post';
        setting.contentType = 'Application/json; charset=utf-8';
        setting.data =  "";
        setting.dataType = 'json';
        setting.url = 'ELP.aspx/GetELPData';
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
                0: element.Date,
                1: element.PointNo,
                2: element.MeaNo,
                3: element.Read1,
                4: element.Read2,
                5: element.Read3,
                6: element.Value,
                7: (element.Initial === 'True' ? '<i class="fa fa-check-circle"></i>' : '<i class="fa fa-times-circle"></i>'),
                8: element.Normal,
                9: element.ReM,
                10: element.Sensor,
                11: '<button class="fa fa-edit" style="margin:10px;" type="button" onclick="setValueOnModal(this)" data-toggle="modal" data-target="#editValue" data-point="' +
                    element.PointNo + '" data-date="' + element.Date + '" data-meano="' + element.MeaNo + '" data-read1="' + element.Read1 + '" data-read2="' +
                    element.Read2 + '" data-read3="' + element.Read3 + '" data-value="' + element.Value + '" data-initial="' + element.Initial + '" data-normal="' +
                    element.Normal + '" data-rem="' + element.ReM + '" data-sensor="' + element.Sensor + '"></button>' +
                    '<button class="fas fa-trash-alt" style="margin:10px;" type="button" onclick="deleteData(this)" data-point="' + element.PointNo + '" data-date="' + element.Date + '"></button>'
            });

        });

        ValueTable.rows.add(InputArray)
            .draw();

    }
};

$(document).ready(function () {
    config.load();
});