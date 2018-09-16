'user strict'
var mainData = [];
var config = {
    load: function () {
        let setting = {};

        setting.type = 'post';
        setting.contentType = 'Application/json; charset=utf-8';
        setting.data = '';
        setting.dataType = 'json';
        setting.url = 'Chart.aspx/GetNewestDatas';
        setting.success = function (res) {
            let ans = res.hasOwnProperty('d') ? res.d : res;
            if (!ans.isOk) {
                alert(ans.message);
                window.location.href = "../Login.aspx";
            } else {
                console.log(ans);
                mainData = ans;
                config.ShowOnThePage(ans);
            }
        };
        setting.error = function (err) {
            console.error(err);
        };

        $.ajax(setting);
    },
    ShowOnThePage: function (element) {
        this.SetToProjectList(element.ProjectsList, element.ProjectInfo.ProjectName);
    },
    SetToProjectList: function (list, showPro) {
        let str = '<option>' + showPro + '</option>';
        list.forEach(function (item) {
            str += item !== showPro ? '<option>' + item + '</option>' : '';
        });

        $('select#projectSelect').html(str);
    },
    ProjectListener: $('select#projectSelect').on('change', function () {
        let target = {
            ProjectName: $(this).find('option:selected').text()
        }

        let setting = {};

        setting.type = 'post';
        setting.contentType = 'Application/json; charset=utf-8';
        setting.data = JSON.stringify(target);
        setting.dataType = 'json';
        setting.url = 'Chart.aspx/changeProject';
        setting.success = function (res) {
            let ans = res.hasOwnProperty('d') ? res.d : res;
            if (!ans.isOk) {
                location.reload()
            } else {

            }
        };
        setting.error = function (err) {
            console.error(err);
        };

        $.ajax(setting);
    })
};

$(document).ready(function () {
    config.load();
});