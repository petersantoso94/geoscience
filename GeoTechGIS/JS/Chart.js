'user strict'
var mainData = [],
    chartControl;
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
        this.SetAreaSelect(element.DataPackage);
        this.SetSensorSelect(element.DataPackage);
        this.SetSensorList(element.DataPackage);
    },
    //show area
    SetAreaSelect: function (Items) {
        let AreaArray = [],
            str = '<option value="0">All</option>';

        Items.forEach(function (element) {
            AreaArray.push(element.Area);
        });

        AreaArray = AreaArray.filter(function (element, index, arr) {
            return arr.indexOf(element) === index;
        }).forEach(function (element) {
            str += '<option value=' + element + '>' + element + '</option>';
        });

        $('select#chartPartAreaSelect').html(str);
    },
    //當AREA變化的時候的偵聽氣
    AreaSelectListener: $('select#chartPartAreaSelect').on('change', function () {
        let AreaTarget = $('option:selected', 'select#chartPartAreaSelect').val(),
            Items = mainData.DataPackage,
            str = '<option value="0">All</option>',
            SenserArray = [],
            PointNolist = [],
            list = '';
        console.log(AreaTarget);
        switch (AreaTarget === '0') {
            case true:
                Items.forEach(function (element) {
                    SenserArray.push(element.Legend);
                    PointNolist.push(element.PointNo);
                });

                SenserArray.filter(function (element, index, arr) {
                    return arr.indexOf(element) === index;
                }).forEach(function (element) {
                    str += '<option value="' + element + '">' + element + '</option>';
                });
                break;
            case false:
                Items.filter(function (element) {
                    return element.Area === AreaTarget;
                }).forEach(function (element) {
                    SenserArray.push(element.Legend);
                    PointNolist.push(element.PointNo);
                });

                SenserArray.filter(function (element, index, arr) {
                    return arr.indexOf(element) === index;
                }).forEach(function (element) {
                    str += '<option value="' + element + '">' + element + '</option>';
                });
                break;
        }
        PointNolist.forEach(function (element) {
            list += '<option value="' + element + '">' + element + '</option>';
        });

        $('select#chartPartSensortypeSelect').html(str);
        $('select#chartSelectInstrument').html(list);
    }),
    //Show Sensor
    SetSensorSelect: function (Items) {
        let AreaTarget = $('option:selected', 'select#chartPartAreaSelect').val(),
            SenserArray = [],
            str = '<option value="0">All</option>';

        Items.forEach(function (element) {
            SenserArray.push(element.Legend);
        });
        console.log(SenserArray);
        SenserArray = SenserArray.filter(function (element, index, arr) {
            return arr.indexOf(element) === index;
        });
        SenserArray.forEach(function (element) {
            str += '<option value="' + element + '">' + element + '</option>';
        });

        console.log(SenserArray);
        $('select#chartPartSensortypeSelect').html(str);
    },
    SensorSelectListener: $('select#chartPartSensortypeSelect').on('change', function () {
        let AreaTarget = $('option:selected', 'select#chartPartAreaSelect').val(),
            target = $('option:selected', this).val(),
            Items = mainData.DataPackage,
            str = '',
            SensorArray = [],
            show = $('select#chartSelectInstrument');

        switch (target === '0') {
            case true:
                Items = config.FilterArea(Items, AreaTarget);
                break;
            case false:
                Items = config.FilterArea(Items, AreaTarget);
                Items = config.FilterSensor(Items, target);
                break;
        }

        Items.forEach(function (element) {
            str += '<option value="' + element.PointNo + '">' + element.PointNo + '</option>';
        });

        show.html(str);
    }),
    //顯示儀器
    SetSensorList: function (Items) {
        let Sensor = [],
            str = '',
            show = $('select#chartSelectInstrument');

        Items.forEach(function (element) {
            Sensor.push(element.PointNo);
        });

        Sensor.filter(function (element, index, arr) {
            return arr.indexOf(element) === index;
        }).forEach(function (element) {
            str += '<option value="' + element + '">' + element + '</option>';
        });
        show.html(str);
    },
    FilterArea: function (data, rule) {
        let Items;

        switch (rule === '0') {
            case true:
                Items = data;
                break;
            case false:
                Items = data.filter(function (element, index, arr) {
                    return element.Area === rule;
                });
                break;
        }
        return Items;
    },
    FilterSensor: function (data, rule) {
        let Items;

        switch (rule === '0') {
            case true:
                Items = data;
                break;
            case false:
                Items = data.filter(function (element, index, arr) {
                    return element.Legend === rule;
                });
                break;
        }
        return Items;
    },
    DrawListener: $('button#chartDrawChart').on('click', function () {
        console.log(chartFromDate.val());
        console.log(chartToDate.val());
        let PointNoTarget = $('option:selected', 'select#chartSelectInstrument').val(),
            fromDate = chartFromDate.val(),
            toDate = chartToDate.val(),
            YMax = $('input#chartYAxisMax').val() === '' ? -99999 : parseFloat($('input#chartYAxisMax').val()),
            YMin = $('input#chartYAxisMin').val() === '' ? -99999 : parseFloat($('input#chartYAxisMin').val()),
            Action = $('input#chartActionVisable').prop('checked'),
            Alarm = $('input#chartAlarmVisable').prop('checked'),
            Alert = $('input#chartAlertVisable').prop('checked'),
            DataInfo = {},
            Item;



        if (PointNoTarget === undefined) {
            alert('Please select a Item');
            return false;
        }
        Item = mainData.DataPackage.filter(function (element) {
            return element.PointNo === PointNoTarget;
        })[0];

        config.GetDrawData(Item, YMax, YMin, Action, Alarm, Alert, fromDate, toDate);

    }),
    //抓取資料
    GetDrawData: function (data, Ymax, Ymin, Action, Alarm, Alert, fromDate, todate) {
        let DataFormat = {},
            AjaxSetting = {};

        DataFormat = {
            PointIdx: data.PointIdx,
            PointNo: data.PointNo,
            GageType: data.GageType,
            StartDate: fromDate,
            EndDate: todate
        };

        AjaxSetting.type = 'post';
        AjaxSetting.url = 'Chart.aspx/GetDrawDataSelfChooseInterval';
        AjaxSetting.contentType = 'Application/json; charset=utf-8';
        AjaxSetting.data = JSON.stringify(DataFormat);
        AjaxSetting.dataType = 'json';
        AjaxSetting.success = function (res) {
            ans = res.hasOwnProperty('d') ? res.d : res;
            console.log(ans)
            //console.log(ans);
            if (!ans.isOk) {

            } else {
                //開始畫圖
                config.DrawChart(data, ans.ChartData, Ymax, Ymin, Action, Alarm, Alert);
                //開始列表格
                config.SetToTable(data, ans.ChartData);
            }
        };
        AjaxSetting.error = function (err) {
            console.log(err);
        }

        $.ajax(AjaxSetting);
    },
    SetToProjectList: function (list, showPro) {
        let str = '<option>' + showPro + '</option>';
        list.forEach(function (item) {
            str += item !== showPro ? '<option>' + item + '</option>' : '';
        });

        $('select#projectSelect').html(str);
    },
    DrawChart: function (Instrument, DrawData, Ymax, Ymin, Action, Alarm, Alert) {
        let ChartField = this.GetChartObject(),
            xAxisField = this.GetXAxisObject(Instrument),
            yAxisField = this.GetYAxisObject(Instrument, DrawData, Ymax, Ymin, Action, Alarm, Alert),
            LegendField = this.GetLegendObject(Instrument),
            TitleField = this.GetTitleObject(),
            subTitleField = this.GetSubTitleObject(Instrument),
            seriesField = this.GetSeriesObject(Instrument, DrawData),
            chartAttr = {};

        chartAttr = {
            chart: ChartField,
            xAxis: xAxisField,
            yAxis: yAxisField,
            legend: LegendField,
            title: TitleField,
            subtitle: subTitleField,
            series: seriesField
        };

        chartControl = new Highcharts.chart(chartAttr);
    },
    //Chart 參數 Start
    GetChartObject: function () {
        let chartCube = {
            renderTo: 'MultipleChart',
            type: 'line',
            zoomType: 'xy',
            plotBorderColor: '#e6e6e6',
            plotBorderWidth: 2,
            marginRight: 200
        };
        return chartCube;
    },
    //歷時曲線X軸
    GetXAxisObject: function (dataItem) {
        let xAxisCube = {
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%Y-%b-%e'
                //day:'%Y-%b-%e %H:%M'
            },
            title: {
                text: dataItem.PointNo
            },
            gridLineWidth: '1px'
        };
        return xAxisCube;
    },
    //Y軸
    GetYAxisObject: function (dataItem, totalData, selfMax, selfMin, Action, Alarm, Alert) {
        let max = 0,
            min = 100000,
            labelLine = [],
            actionLine = [],
            alarmLine = [],
            alertLine = [],
            unit = dataItem.Unit;

        //警戒線部分 有-99999 則不畫線
        actionLine = Action ? this.GetActionLine(dataItem.PlusAction, dataItem.MinusAction, unit) : [];
        alarmLine = Alarm ? this.GetAlarmLine(dataItem.PlusAlarm, dataItem.MinusAlarm, unit) : [];
        alertLine = Alert ? this.GetAlertLine(dataItem.PlusAlert, dataItem.MinusAlert, unit) : [];
        actionLine.map(function (element) {
            labelLine.push(element);
        });
        alarmLine.map(function (element) {
            labelLine.push(element);
        });
        alertLine.map(function (element) {
            labelLine.push(element);
        });
        console.log(selfMax);
        console.log(selfMin);
        // 比較大小
        max = this.GetYAxisMax(totalData, dataItem, selfMax);
        min = this.GetYAxisMin(totalData, dataItem, selfMin);
        let yAxisCube = {
            // softmax: max,
            // softmin: min,
            max: max,
            min: min,
            title: {
                text: 'unit:  ' + dataItem.Unit,
                rotation: 0,
                x: -20
            },
            plotLines: labelLine
        };
        return yAxisCube;
    },
    //Legend
    GetLegendObject: function (dataItem) {
        let legendCube = {
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: '2px',
            text: dataItem.PointNo,
            y: -50
        };
        return legendCube;
    },
    //Title
    GetTitleObject: function () {
        let titleCube = {
            text: 'Instrumemts Chart'
        };
        return titleCube;
    },
    GetSubTitleObject: function (dataItem) {
        let subTitleCube = {
            text: 'Instrument No.: ' + dataItem.PointNo
        };
        return subTitleCube;
    }, //該儀器資料 歷時資訊
    GetSeriesObject: function (dataItem, historyData) {
        let seriesCube = [],
            chartData = [];
        chartData = this.GetChartData(historyData);
        if (historyData.length === 0) {
            return [];
        } else {
            seriesCube = [{
                pointInterval: 15 * 24 * 3600 * 1000,
                data: chartData,
                name: dataItem.PointNo,
                pointStart: chartData[0][0]
            }];
        }
        return seriesCube;
    },
    GetActionLine: function (plus, minus, unit) {
        let labelLine = [],
            noSetting = -99999;
        if (plus !== noSetting && minus !== noSetting) {
            labelLine = [{
                label: {
                    text: 'Action: ' + plus + ' ' + unit,
                    style: {
                        color: '#f71e01',
                        fontWeight: 'bold'
                    }
                },
                value: plus,
                width: 2,
                color: '#f71e01'
            }, {
                label: {
                    text: 'Action: ' + minus + ' ' + unit,
                    style: {
                        color: '#f71e01',
                        fontWeight: 'bold'
                    }
                },
                value: minus,
                width: 2,
                color: '#f71e01'
            }];
        }
        return labelLine;
    },
    GetAlarmLine: function (plus, minus, unit) {
        let labelLine = [],
            noSetting = -99999;
        if (plus !== noSetting && minus !== noSetting) {
            labelLine = [{
                label: {
                    text: 'Alarm: ' + plus + ' ' + unit,
                    style: {
                        color: '#f7a001',
                        fontWeight: 'bold'
                    }
                },
                value: plus,
                width: 2,
                color: '#f7a001'
            }, {
                label: {
                    text: 'Alarm: ' + minus + ' ' + unit,
                    style: {
                        color: '#f7a001',
                        fontWeight: 'bold'
                    }
                },
                value: minus,
                width: 2,
                color: '#f7a001'
            }];
        }
        return labelLine;
    },
    GetAlertLine: function (plus, minus, unit) {
        let labelLine = [],
            noSetting = -99999;
        if (plus !== noSetting && minus !== noSetting) {
            labelLine = [{
                label: {
                    text: 'Alert: ' + plus + ' ' + unit,
                    style: {
                        color: '#ffed00',
                        fontWeight: 'bold'
                    }
                },
                value: plus,
                width: 2,
                color: '#ffed00'
            }, {
                label: {
                    text: 'Alert: ' + minus + ' ' + unit,
                    style: {
                        color: '#ffed00',
                        fontWeight: 'bold'
                    }
                },
                value: minus,
                width: 2,
                color: '#ffed00'
            }];
        }
        return labelLine;
    },
    //歷時資料 該儀器資訊
    GetYAxisMax: function (Instrument, Item, Ymax) {
        let max = 0;
        Instrument.map(function (element) {
            if (max < element.Value && element.Value !== -99999) {
                max = element.Value;
            }
        });
        if (max < Item.PlusAlert && Item.PlusAlert !== -99999) {
            max = Item.PlusAlert;
        }
        if (max < Item.PlusAlarm && Item.PlusAlarm !== -99999) {
            max = Item.PlusAlarm;
        }
        if (max < Item.PlusAction && Item.PlusAction !== -99999) {
            max = Item.PlusAction;
        }
        if (max > 0) {
            max = max * 1.2;
        } else if (max < 0) {
            max = max * 0.8;
        }
        if (Ymax === -99999) {
            return max;
        } else if (Ymax > max) {
            max = Ymax;
            return max;
        } else {
            return max;
        }
    },
    //歷時資料 該儀器資訊
    GetYAxisMin: function (Instrument, Item, Ymin) {
        let min = 10000;
        Instrument.map(function (element) {
            if (min > element.Value && element.Value !== -99999) {
                min = element.Value
            }
        });
        if (min > Item.MinusAlert && Item.MinusAlert !== -99999) {
            min = Item.MinusAlert;
        }
        if (min > Item.MinusAlarm && Item.MinusAlarm !== -99999) {
            min = Item.MinusAlarm;
        }
        if (min > Item.MinusAction && Item.MinusAction !== -99999) {
            min = Item.MinusAction;
        }
        if (min > 0) {
            min = min * 0.8;
        } else if (min < 0) {
            min = min * 1.2;
        }

        if (Ymin === -99999) {
            return min;
        } else if (Ymin < min) {
            min = Ymin;
            return min;
        } else {
            return min;
        }
    },
    //歷時資料處理
    GetChartData: function (historyData) {
        let chartFormat = [];
        historyData.map(function (element, index) {
            if (element.Value !== -99999) {
                let year = element.Date.split(' ')[0].split('/')[0];
                let month = element.Date.split(' ')[0].split('/')[1];
                let day = element.Date.split(' ')[0].split('/')[2];
                let hour = element.Date.split(' ')[1].split(':')[0];
                let minute = element.Date.split(' ')[1].split(':')[1];
                // let second = element.Date.split(' ')[1].split(':')[2];
                let date = Date.UTC(year, month - 1, day, hour, minute);
                chartFormat.push([date, Math.round(element.Value * 1000) / 1000]);
            }
        });
        return chartFormat;
    },
    //當 AAA 變動時判斷狀況
    GetSelectLabelLine: function (Action, Alarm, Alert, Instrument) {
        let labelLine = [],
            noSetting = -99999,
            count = 0,
            actionLine = [],
            alarmLine = [],
            alertLine = [];

        if (Action) {
            count += 4;
        }
        if (Alarm) {
            count += 2;
        }
        if (Alert) {
            count++;
        }
        switch (count) {
            case 0:
                break;
            case 1:
                alertLine = this.GetAlertLine(Instrument.PlusAlert, Instrument.MinusAlert, Instrument.Unit);
                break;
            case 2:
                alarmLine = this.GetAlarmLine(Instrument.PlusAlarm, Instrument.MinusAlarm, Instrument.Unit);
                break;
            case 3:
                alertLine = this.GetAlertLine(Instrument.PlusAlert, Instrument.MinusAlert, Instrument.Unit);
                alarmLine = this.GetAlarmLine(Instrument.PlusAlarm, Instrument.MinusAlarm, Instrument.Unit);
                break;
            case 4:
                actionLine = this.GetActionLine(Instrument.PlusAction, Instrument.MinusAction, Instrument.Unit);
                break;
            case 5:
                alertLine = this.GetAlertLine(Instrument.PlusAlert, Instrument.MinusAlert, Instrument.Unit);
                actionLine = this.GetActionLine(Instrument.PlusAction, Instrument.MinusAction, Instrument.Unit);
                break;
            case 6:
                alarmLine = this.GetAlarmLine(Instrument.PlusAlarm, Instrument.MinusAlarm, Instrument.Unit);
                actionLine = this.GetActionLine(Instrument.PlusAction, Instrument.MinusAction, Instrument.Unit);
                break;
            case 7:
                alertLine = this.GetAlertLine(Instrument.PlusAlert, Instrument.MinusAlert, Instrument.Unit);
                alarmLine = this.GetAlarmLine(Instrument.PlusAlarm, Instrument.MinusAlarm, Instrument.Unit);
                actionLine = this.GetActionLine(Instrument.PlusAction, Instrument.MinusAction, Instrument.Unit);
                break;
        }
        alertLine.map(function (element) {
            labelLine.push(element);
        });
        alarmLine.map(function (element) {
            labelLine.push(element);
        });
        actionLine.map(function (element) {
            labelLine.push(element);
        });
        return labelLine;
    },
    //秀在列表上
    SetToTable: function (Item, data) {
        let head = $('thead', 'table#MultipleDataList'),
            body = $('tbody', 'table#MultipleDataList'),
            name = $('p#SensorItem'),
            str = '';

        if ($.fn.DataTable.isDataTable('#MultipleDataList')) {
            $('#MultipleDataList').dataTable().destory();
        }

        name.html(Item.PointNo).css('text-align', 'center');
        str += '<tr><th>Date</th><th>Value</th></tr>';
        head.html(str);
        str = '';

        data.forEach(function (element) {
            str += '<tr><td>' + element.Date + '</td><td>' + Math.round(element.Value * 1000) / 1000 + Item.Unit + '</td></tr>';
        });

        body.html(str);

        $('table#MultipleDataList').DataTable({
            // scrollY: "448px",
            scrollCollapse: false,
            //scrollX: false,
            columnDefs: [{
                className: 'dt-center',
                targets: '_all'
            }],
            bAutoWidth: true,
            // pageLength: 12
        });
    },
    //更改專案
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