'use strict'
const config = {
    login: function () {
        let setting = {};
        setting.type = 'post';
        setting.contentType = 'Application/json; charset=utf-8';
        setting.data = '';
        setting.dataType = 'json';
        setting.url = 'ProjectChoose.aspx/GetSession';
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
                    config.GetList();
                    break;
                case false:
                    alert('登入失敗或連線逾時');
                    window.location.href = './Login.aspx';
                    break;
            }
        };
        setting.error = function (err) {
            console.error(err);
        };

        $.ajax(setting);
    },
    GetList: function () {
        let setting = {};
        setting.type = 'post';
        setting.contentType = 'Application/json; charset=utf-8';
        setting.data = '';
        setting.dataType = 'json';
        setting.url = 'ProjectChoose.aspx/getProjectList';
        setting.success = function (res) {
            let ans;
            if (res.hasOwnProperty('d')) {
                ans = res.d;
            } else {
                ans = res;
            }
            if (ans.length !== 0) {
                config.select(ans);
            } else {
                alert('沒有專案');
            }
        };
        setting.error = function (err) {
            console.error(err);
        };

        $.ajax(setting);
    },
    select: function (list) {
        let str = '';
        list.forEach(function (element) {
            str += '<li>' + element + '</li>';
        });

        $('ul#list').html(str);
        this.listListener();
    },
    listListener: function () {
        $('li', 'ul#list').off('click').on('click', function (e) {
            $(this).toggleClass('focus');
        });
    },
    confirm: $('button#btn1').on('click', function () {
        let items = [],
            datainfo = {};
        $('ul#list').find('li').each(function () {
            switch ($(this).hasClass('focus')) {
                case true:
                    items.push($(this).text());
            }
        });

        if (items.length === 0) {
            alert('請選擇專案');
            return false;
        }

        datainfo = {
            projects: items
        };
        console.log(items);
        config.nextPage(datainfo);

    }),
    nextPage: function (list) {
        let setting = {};
        setting.type = 'post';
        setting.contentType = 'Application/json; charset=utf-8';
        setting.data = JSON.stringify(list);
        setting.dataType = 'json';
        setting.url = 'ProjectChoose.aspx/nextPage';
        setting.success = function (res) {
            let ans;
            if (res.hasOwnProperty('d')) {
                ans = res.d;
            } else {
                ans = res;
            }
            console.log(ans);
            window.location.href = ans;
        };
        setting.error = function (err) {
            console.error(err);
        };

        $.ajax(setting);
    }
};

$(document).ready(function () {
    config.login();
});


