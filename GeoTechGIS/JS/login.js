'use strict'
var config = {};

config.acpw = {
    getInfo: $('button#btn1').on('click', function () {
        if ($('input#ac').val() === '') {
            alert('請確認帳號已經輸入');
            return false;
        }

        let inputData = {
            account: $('input#ac').val(),
            password: $('input#pw').val()
        };
        config.acpw.check(inputData);
    }),
    check: function (info) {
        let setting = {};

        setting.type = 'post';
        setting.contentType = 'Application/json; charset=utf-8';
        setting.data = JSON.stringify(info);
        setting.dataType = 'json';
        setting.url = 'Login.aspx/GetAccount'
        setting.success = function (res) {
            let ans;
            if (res.hasOwnProperty('d')) {
                ans = res.d;
            } else {
                ans = res;
            }
            switch (ans) {
                case true:
                    window.location.href = './ProjectChoose.aspx';
                    break;
                case false:
                    alert("帳號或密碼錯誤，請重新確認");
                    break;
            }
        };
        setting.error = function (err) {
            console.error(err);
        };

        $.ajax(setting);
    },
    checkSession: $('button#btn2').on('click', function () {
        let setting = {};

        setting.type = 'post';
        setting.contentType = 'Application/json; charset=utf-8';
        setting.data = '';
        setting.dataType = 'json';
        setting.url = 'Login.aspx/checkAndCheckDicrecty';
        setting.success = function (res) {
            let ans;
            if (res.hasOwnProperty('d')) {
                ans = res.d;
            } else {
                ans = res;
            }
            console.log(ans);
        };
        setting.error = function (err) {
            console.error(err);
        };

        $.ajax(setting);
    })
};


