var submitForm1 = function () {
    let fileCSV = document.getElementById("importFile").files;
    console.log(fileCSV);
    let setting = {};
    setting.type = 'post';
    setting.contentType = 'Application/json; charset=utf-8';
    setting.data = fileCSV;
    setting.dataType = 'json';
    setting.url = 'PhoneBook.aspx/PostExcelData';
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
    let data_no = $(element).data("no");
    let DataFormat = {};
    DataFormat = {
        No: data_no
    };
    let setting = {};
    setting.type = 'post';
    setting.contentType = 'Application/json; charset=utf-8';
    setting.data = JSON.stringify(DataFormat);
    setting.dataType = 'json';
    setting.url = 'PhoneBook.aspx/DeleteData';
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
        ajaxLink = 'PhoneBook.aspx/UpdateData';
    else if (editOrInsert === "insert")
        ajaxLink = 'PhoneBook.aspx/InsertData';

    let alert = "0", alert1 = "0", alert2 = "0", work = "0", fail = "0";
    if ($("#alert").prop("checked"))
        alert = "1";
    if ($("#alarm1").prop("checked"))
        alert1 = "1";
    if ($("#alarm2").prop("checked"))
        alert2 = "1";
    if ($("#worksuspension").prop("checked"))
        work = "1";
    if ($("#fail").prop("checked"))
        fail = "1";
    let DataFormat = {};
    DataFormat = {
        No: $("#no").val(),
        Name: $("#name").val(),
        PhoneNo: $("#mobileNo").val(),
        Alert: alert,
        Alarm1: alert1,
        Alarm2: alert2,
        Work: work,
        Fail: fail,
        Email: $("#email").val()
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
    $("#no").val("-1");
}
var setValueOnModal = function (element) {
    editOrInsert = "edit";
    let data_no = $(element).data("no");
    let data_email = $(element).data("email");
    let data_name = $(element).data("name");
    let data_mobile = $(element).data("mobile");
    let data_alert = $(element).data("alert");
    let data_alert1 = $(element).data("alert1");
    let data_alert2 = $(element).data("alert2");
    let data_work = $(element).data("work");
    let data_fail = $(element).data("fail");

    $("#no").val(data_no);
    $("#name").val(data_name);
    $("#mobileNo").val(data_mobile);
    $("#email").val(data_email);
    if (data_alert === 'True')
        $("#alert").attr('checked', true);
    if (data_alert1 === 'True')
        $("#alarm1").attr('checked', true);
    if (data_alert2 === 'True')
        $("#alarm2").attr('checked', true);
    if (data_work === 'True')
        $("#worksuspension").attr('checked', true);
    if (data_fail === 'True')
        $("#fail").attr('checked', true);
}

var config = {
    load: function () {
        let setting = {};

        setting.type = 'post';
        setting.contentType = 'Application/json; charset=utf-8';
        setting.data = '';
        setting.dataType = 'json';
        setting.url = 'PhoneBook.aspx/GetPhoneBookData';
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
                0: element.No,
                1: element.Name,
                2: element.MobileNo,
                3: element.Email,
                4: (element.Alert === 'True' ? '<i class="fa fa-check-circle"></i>' : '<i class="fa fa-times-circle"></i>'),
                5: (element.Alert1 === 'True' ? '<i class="fa fa-check-circle"></i>' : '<i class="fa fa-times-circle"></i>'),
                6: (element.Alert2 === 'True' ? '<i class="fa fa-check-circle"></i>' : '<i class="fa fa-times-circle"></i>'),
                7: (element.WorkSuspension === 'True' ? '<i class="fa fa-check-circle"></i>' : '<i class="fa fa-times-circle"></i>'),
                8: (element.Fail === 'True' ? '<i class="fa fa-check-circle"></i>' : '<i class="fa fa-times-circle"></i>'),
                9: '<button class="fa fa-edit" style="margin:10px;" type="button" onclick="setValueOnModal(this)" data-toggle="modal" data-target="#editValue" data-fail="' + element.Fail + '" data-email="' + element.Email + '" data-work="' + element.WorkSuspension + '" data-alert2="' + element.Alert2 + '" data-alert1="' + element.Alert1 + '" data-alert="' + element.Alert + '" data-mobile="' + element.MobileNo + '" data-name="' + element.Name + '" data-no="' + element.No + '"></button>' +
                    '<button class="fas fa-trash-alt" style="margin:10px;" type="button" onclick="deleteData(this)" data-no="' + element.No + '"></button>'
            });

        });

        ValueTable.rows.add(InputArray)
            .draw();

    }
};

$(document).ready(function () {
    config.load();
});