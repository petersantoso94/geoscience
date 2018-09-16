'user strict'
var MainData = [];
var config = {
    load: function () {
        let setting = {};

        setting.type = 'post';
        setting.contentType = 'Application/json; charset=utf-8';
        setting.data = '';
        setting.dataType = 'json';
        setting.url = 'InstructmentList.aspx/GetNewestDatas';
        setting.success = function (res) {
            let ans = res.hasOwnProperty('d') ? res.d : res;
            if (!ans.isOk) {
                alert(ans.Message);
                window.location.href = "../Login.aspx";
            } else {
                console.log(ans);
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

        let InputArray = [],
            Station = [],
            Area = [],
            Legend = [],
            Status = [],
            GageType = [],
            noSetting = -99999;

        Instruments.forEach(function (element) {
            let StatusPicture = '',
                StatusPhoto = '';

            Station.push(element.Station);
            Area.push(element.Area);
            Legend.push(element.Legend);
            GageType.push(element.GageType);

            // 警戒的圖案
            if (element.DeviceStatus === 0) {
                switch (element.ValueStatus) {
                    case 0:
                        StatusPicture = '../Images/Legend/normal.jpg';
                        StatusPhoto = 'Normal';
                        Status.push('Normal');
                        break;
                    case 1:
                        StatusPicture = '../Images/Legend/action.jpg';
                        StatusPhoto = 'Action';
                        Status.push('Action');
                        break;
                    case 2:
                        StatusPicture = '../Images/Legend/alarm.jpg';
                        StatusPhoto = 'Alarm';
                        Status.push('Alarm');
                        break;
                    case 2:
                        StatusPicture = '../Images/Legend/alert.jpg';
                        StatusPhoto = 'Alert';
                        Status.push('Alert');
                        break;
                    case 4:
                        StatusPicture = '../Images/Legend/stop.jpg';
                        StatusPhoto = 'Stop';
                        Status.push('Stop');
                        break;
                }
            } else {
                StatusPicture = '../Images/Legend/stop.jpg';
                Status.push('Stop');
            }

            InputArray.push({
                0: element.Legend,
                1: '<img src =' + StatusPicture + ' alt=' + StatusPhoto + '/>',
                2: element.PointNo,
                3: (element.Value === noSetting) ? ' ' : element.Value,
                4: element.Unit,
                5: element.Date.split(' ')[0],
                6: (element.PlusAlarm === noSetting ? ' ' : element.PlusAlarm) + ', ' + (element.MinusAlarm === noSetting ? ' ' : element.MinusAlarm),
                7: (element.PlusAction === noSetting ? ' ' : element.PlusAction) + ', ' + (element.MinusAction === noSetting ? ' ' : element.MinusAction),
                8: (element.PlusAlert === noSetting ? ' ' : element.PlusAlert) + ', ' + (element.MinusAlert === noSetting ? ' ' : element.MinusAlert),
                9: '',
                10: '<button class="fa fa-line-chart" type="button" data-toggle="modal" data-target="#valueShowChart"></button>'
            });

        });

        ValueTable.rows.add(InputArray)
            .draw();

        this.SetSelectBar('#StationSelect', Station);
        this.SetSelectBar('#AreaSelect', Area);
        this.SetSelectBar('#LegendSelect', Legend);
        this.SetSelectBar('#GageTypeSelect', GageType);
        this.SetSelectBar('#StatusSelect', Status);

    },
    //選相框
    SetSelectBar: function (SelectItem, Items) {
        let Target = $(SelectItem),
            str = '',
            TypeList = [];

        switch (Target.attr('id')) {
            case 'StationSelect':
                str = '<option value="0">All Station</option>';
                break;
            case 'AreaSelect':
                str = '<option value="0">All Area</option>';
                break;
            case 'LegendSelect':
                str = '<option value="0">All Type</option>';
                break;
            case 'GageTypeSelect':
                str = '<option value="0">All Type</option>';
                break;
            case 'StatusSelect':
                str = '<option value="0">All Status</option>';
                break;
        }

        Items.forEach(function (element) {
            TypeList.push(element);
        });

        TypeList = TypeList.filter(function (ele, index, arr) {
            return arr.indexOf(ele) === index;
        });

        TypeList.forEach(function (element) {
            str += '<option value="' + element + '">' + element + '</option>';
        });

        Target.html(str);
    },
    //儀器等級
    FilterLegend: function (data, rule) {
        let res;
        switch (rule === '0') {
            case true:
                res = data;
                break;
            case false:
                res = data.filter(function (element) {
                    if (element.Legend === rule) {
                        return element;
                    }
                });
                break;
        }
        return res;
    },
    //區域
    FilterArea: function (data, rule) {
        let res;
        switch (rule === '0') {
            case true:
                res = data;
                break;
            case false:
                res = data.filter(function (element) {
                    if (element.Area === rule) {
                        return element;
                    }
                })
                break;
        }
        return res;
    },
    //車站
    FilterStation: function (data, rule) {
        let res;
        switch (rule === '0') {
            case true:
                res = data;
                break;
            case false:
                res = data.filter(function (element) {
                    if (element.Station === rule) {
                        return rule;
                    }

                })
                break;
        }
        return res;
    },
    //儀器狀態    
    FilterStatus: function (data, rule) {
        let res;

        switch (rule) {
            case '0':
                res = data;
                break;
            case 'Normal':
                res = data.filter(function (element) {
                    if (element.ValueStatus === 0) {
                        return element;
                    }
                });
                break;
            case 'Action':
                res = data.filter(function (element) {
                    if (element.ValueStatus === 1) {
                        return element;
                    }
                });
                break;
            case 'Alarm':
                res = data.filter(function (element) {
                    if (element.ValueStatus === 2) {
                        return element;
                    }
                });
                break;
            case 'Alert':
                res = data.filter(function (element) {
                    if (element.ValueStatus === 3) {
                        return element;
                    }
                });
                break;
            case 'Stop':
                res = data.filter(function (element) {
                    if (element.ValueStatus === 4) {
                        return element;
                    }
                });
                break;
        }
        return res;
    },
    //條件選擇區間 START
    SelectStationListener: $('select#StationSelect').on('change', function () {
        let ChooseItem,
            Status = [],
            Legend = [],
            Area = [],
            FilterItems,
            InputArray = [],
            noSetting = -99999;


        ChooseItem = $('option:selected', this).val();

        switch (ChooseItem === '0') {
            case true:
                FilterItems = MainData.DataPackage;
                break;
            case false:
                FilterItems = config.FilterStation(MainData.DataPackage, ChooseItem);
                break;
        }

        FilterItems.forEach(function (element) {
            let StatusPhoto = '',
                StatusPath = '';

            Area.push(element.Area);
            Legend.push(element.Legend);

            if (element.DeviceStatus === 0) {
                switch (element.ValueStatus) {
                    case 0:
                        StatusPath = '../Images/Legend/normal.jpg';
                        StatusPhoto = 'Normal';
                        Status.push('Normal');
                        break;
                    case 1:
                        StatusPath = '../Images/Legend/action.jpg';
                        StatusPhoto = 'Action';
                        Status.push('Action');
                        break;
                    case 2:
                        StatusPath = '../Images/Legend/alarm.jpg';
                        StatusPhoto = 'Alarm';
                        Status.push('Alarm');
                        break;
                    case 3:
                        StatusPath = '../Images/Legend/alert.jpg';
                        StatusPhoto = 'Alert';
                        Status.push('Alert');
                        break;
                    case 4:
                        StatusPath = '../Images/Legend/stop.jpg';
                        StatusPhoto = 'Stop';
                        Status.push('Stop');
                        break;
                }
            } else {
                StatusPath = '../Images/Legend/stop.jpg';
                StatusPhoto = 'Stop';
                Status.push('Stop');
            }

            InputArray.push({
                0: element.Legend,
                1: '<img src="' + StatusPath + '" alt="' + StatusPhoto + '" />',
                2: element.PointNo,
                3: (element.Value === noSetting ? ' ' : element.Value),
                4: element.Unit,
                5: element.Date.split(' ')[0],
                6: (element.PlusAlarm === noSetting ? ' ' : element.PlusAlarm) + ', ' + (element.MinusAlarm === noSetting ? ' ' : element.MinusAlarm),
                7: (element.PlusAction === noSetting ? ' ' : element.PlusAction) + ', ' + (element.MinusAction === noSetting ? ' ' : element.MinusAction),
                8: (element.PlusAlert === noSetting ? ' ' : element.PlusAlert) + ', ' + (element.MinusAlert === noSetting ? ' ' : element.MinusAlert),
                9: '',
                10: '<button class="fa fa-line-chart" type="button" data-toggle="modal" data-target="#valueShowChart"></button>'
            });
        });

        config.SetSelectBar('select#AreaSelect', Area);
        config.SetSelectBar('select#LegendSelect', Legend);
        config.SetSelectBar('select#StatusSelect', Status);
        ValueTable.clear()
            .draw()
            .rows.add(InputArray)
            .draw();
    }),
    SelectAreaListener: $('select#AreaSelect').on('change', function () {
        let StationChoose = '',
            ChooseItem = '',
            Legend = [],
            Status = [],
            noSetting = -99999,
            FilterItems,
            InputArray = [];

        StationChoose = $('option:selected', 'select#StationSelect').val();
        ChooseItem = $('option:selected', this).val();

        switch (ChooseItem === '0') {
            case true:
                FilterItems = config.FilterStation(MainData.DataPackage, StationChoose);
                break;
            case false:
                FilterItems = config.FilterStation(MainData.DataPackage, StationChoose);
                FilterItems = config.FilterArea(FilterItems, ChooseItem);
                break;
        }

        FilterItems.forEach(function (element) {
            let StatusPhoto = '',
                StatusPath = '';

            Legend.push(element.Legend);

            if (element.DeviceStatus === 0) {
                switch (element.ValueStatus) {
                    case 0:
                        StatusPath = '../Images/Legend/normal.jpg';
                        StatusPhoto = 'Normal';
                        Status.push('Normal');
                        break;
                    case 1:
                        StatusPath = '../Images/Legend/action.jpg';
                        StatusPhoto = 'Action';
                        Status.push('Action');
                        break;
                    case 2:
                        StatusPath = '../Images/Legend/alarm.jpg';
                        StatusPhoto = 'Alarm';
                        Status.push('Alarm');
                        break;
                    case 3:
                        StatusPath = '../Images/Legend/alert.jpg';
                        StatusPhoto = 'Alert';
                        Status.push('Alert');
                        break;
                    case 4:
                        StatusPath = '../Images/Legend/stop.jpg';
                        StatusPhoto = 'Stop';
                        Status.push('Stop');
                        break;
                }
            } else {
                StatusPath = '../Images/Legend/stop.jpg';
                StatusPhoto = 'Stop';
                Status.push('Stop');
            }

            InputArray.push({
                0: element.Legend,
                1: '<img src="' + StatusPath + '" alt="' + StatusPhoto + '" />',
                2: element.PointNo,
                3: (element.Value === noSetting ? ' ' : element.Value),
                4: element.Unit,
                5: element.Date.split(' ')[0],
                6: (element.PlusAlarm === noSetting ? ' ' : element.PlusAlarm) + ', ' + (element.MinusAlarm === noSetting ? ' ' : element.MinusAlarm),
                7: (element.PlusAction === noSetting ? ' ' : element.PlusAction) + ', ' + (element.MinusAction === noSetting ? ' ' : element.MinusAction),
                8: (element.PlusAlert === noSetting ? ' ' : element.PlusAlert) + ', ' + (element.MinusAlert === noSetting ? ' ' : element.MinusAlert),
                9: '',
                10: '<button class="fa fa-line-chart" type="button" data-toggle="modal" data-target="#valueShowChart"></button>'
            });
        });

        config.SetSelectBar('select#LegendSelect', Legend);
        config.SetSelectBar('select#StatusSelect', Status);
        ValueTable.clear()
            .draw()
            .rows.add(InputArray)
            .draw();
    }),
    SelectLegendListener: $('select#LegendSelect').on('change', function () {
        let StationChoose = '',
            AreaChoose = '',
            ChooseItem = '',
            Status = [],
            noSetting = -99999,
            FilterItems,
            InputArray = [];

        StationChoose = $('option:selected', 'select#StationSelect').val();
        AreaChoose = $('option:selected', 'select#AreaSelect').val();
        ChooseItem = $('option:selected', this).val();

        switch (ChooseItem === '0') {
            case true:
                FilterItems = config.FilterStation(MainData.DataPackage, StationChoose);
                FilterItems = config.FilterArea(FilterItems, AreaChoose);
                break;
            case false:
                FilterItems = config.FilterStation(MainData.DataPackage, StationChoose);
                FilterItems = config.FilterArea(FilterItems, AreaChoose);
                FilterItems = config.FilterLegend(FilterItems, ChooseItem);
                break;
        }

        FilterItems.forEach(function (element) {
            let StatusPhoto = '',
                StatusPath = '';

            if (element.DeviceStatus === 0) {
                switch (element.ValueStatus) {
                    case 0:
                        StatusPath = '../Images/Legend/normal.jpg';
                        StatusPhoto = 'Normal';
                        Status.push('Normal');
                        break;
                    case 1:
                        StatusPath = '../Images/Legend/action.jpg';
                        StatusPhoto = 'Action';
                        Status.push('Action');
                        break;
                    case 2:
                        StatusPath = '../Images/Legend/alarm.jpg';
                        StatusPhoto = 'Alarm';
                        Status.push('Alarm');
                        break;
                    case 3:
                        StatusPath = '../Images/Legend/alert.jpg';
                        StatusPhoto = 'Alert';
                        Status.push('Alert');
                        break;
                    case 4:
                        StatusPath = '../Images/Legend/stop.jpg';
                        StatusPhoto = 'Stop';
                        Status.push('Stop');
                        break;
                }
            } else {
                StatusPath = '../Images/Legend/stop.jpg';
                StatusPhoto = 'Stop';
                Status.push('Stop');
            }

            InputArray.push({
                0: element.Legend,
                1: '<img src="' + StatusPath + '" alt="' + StatusPhoto + '" />',
                2: element.PointNo,
                3: (element.Value === noSetting ? ' ' : element.Value),
                4: element.Unit,
                5: element.Date.split(' ')[0],
                6: (element.PlusAlarm === noSetting ? ' ' : element.PlusAlarm) + ', ' + (element.MinusAlarm === noSetting ? ' ' : element.MinusAlarm),
                7: (element.PlusAction === noSetting ? ' ' : element.PlusAction) + ', ' + (element.MinusAction === noSetting ? ' ' : element.MinusAction),
                8: (element.PlusAlert === noSetting ? ' ' : element.PlusAlert) + ', ' + (element.MinusAlert === noSetting ? ' ' : element.MinusAlert),
                9: '',
                10: '<button class="fa fa-line-chart" type="button" data-toggle="modal" data-target="#valueShowChart"></button>'
            });
        });

        config.SetSelectBar('select#StatusSelect', Status);
        ValueTable.clear()
            .draw()
            .rows.add(InputArray)
            .draw();
    }),
    SelectStatusListener: $('select#StatusSelect').on('change', function () {
        let StationChoose = '',
            AreaChoose = '',
            LegendChoose = '',
            ChooseItem = '',
            noSetting = -99999,
            FilterItems,
            InputArray = [];

        StationChoose = $('option:selected', 'select#StationSelect').val();
        AreaChoose = $('option:selected', 'select#AreaSelect').val();
        LegendChoose = $('option:selected', 'select#LegendSelect').val();
        ChooseItem = $('option:selected', this).val();

        switch (ChooseItem === '0') {
            case true:
                FilterItems = config.FilterStation(MainData.DataPackage, StationChoose);
                FilterItems = config.FilterArea(FilterItems, AreaChoose);
                FilterItems = config.FilterLegend(FilterItems, LegendChoose);
                break;
            case false:
                FilterItems = config.FilterStation(MainData.DataPackage, StationChoose);
                FilterItems = config.FilterArea(FilterItems, AreaChoose);
                FilterItems = config.FilterLegend(FilterItems, LegendChoose);
                FilterItems = config.FilterStatus(FilterItems, ChooseItem);
                break;
        }

        FilterItems.forEach(function (element) {
            let StatusPhoto = '',
                StatusPath = '';

            if (element.DeviceStatus === 0) {
                switch (element.ValueStatus) {
                    case 0:
                        StatusPath = '../Images/Legend/normal.jpg';
                        StatusPhoto = 'Normal';
                        break;
                    case 1:
                        StatusPath = '../Images/Legend/action.jpg';
                        StatusPhoto = 'Action';
                        break;
                    case 2:
                        StatusPath = '../Images/Legend/alarm.jpg';
                        StatusPhoto = 'Alarm';
                        break;
                    case 3:
                        StatusPath = '../Images/Legend/alert.jpg';
                        StatusPhoto = 'Alert';
                        break;
                    case 4:
                        StatusPath = '../Images/Legend/stop.jpg';
                        StatusPhoto = 'Stop';
                        break;
                }
            } else {
                StatusPath = '../Images/Legend/stop.jpg';
                StatusPhoto = 'Stop';
            }

            InputArray.push({
                0: element.Legend,
                1: '<img src="' + StatusPath + '" alt="' + StatusPhoto + '" />',
                2: element.PointNo,
                3: (element.Value === noSetting ? ' ' : element.Value),
                4: element.Unit,
                5: element.Date.split(' ')[0],
                6: (element.PlusAlarm === noSetting ? ' ' : element.PlusAlarm) + ', ' + (element.MinusAlarm === noSetting ? ' ' : element.MinusAlarm),
                7: (element.PlusAction === noSetting ? ' ' : element.PlusAction) + ', ' + (element.MinusAction === noSetting ? ' ' : element.MinusAction),
                8: (element.PlusAlert === noSetting ? ' ' : element.PlusAlert) + ', ' + (element.MinusAlert === noSetting ? ' ' : element.MinusAlert),
                9: '',
                10: '<button class="fa fa-line-chart" type="button" data-toggle="modal" data-target="#valueShowChart"></button>'
            });
        });
        ValueTable.clear()
            .draw()
            .rows.add(InputArray)
            .draw();
    }),
    //條件選擇區間 END
    //要顯示圖表視窗
    ChartButtonListener: ValueTable.on('click', 'td', function () {
        let DataItem = ValueTable.row(this).data();

        if ($(this).index() === 10) {
            // 要該儀器的資料專案
            let TargetData = DataItem[2],
                FilterData;
            FilterData = MainData.DataPackage.filter(function (element) {
                if (element.PointNo === TargetData) {
                    return element;
                }
            })[0];

            // 重設圖表視窗介面
            config.SetChartReset();
            //判斷選擇儀器之警戒值
            // chartBoxModual.setAAAcheckBoxControl(FilterData, 1);
            config.SetChartAAABoxControl(FilterData);
            //抓資料
            config.GetDrawData(FilterData, 0);
        }
    }),
    //將圖表的按鈕區回復到原始設定
    SetChartReset: function () {
        let ButtonTarget = $('label', 'div#InstrumentStableInterval');
        ButtonTarget.each(function (index) {
            if (index === 0) {
                $(this).addClass('active')
                    .find('input')
                    .prop('checked', true);
            } else {
                $(this).removeClass('active')
                    .find('input')
                    .prop('checked', false);
            }
        });
    },
    //圖表上面的警戒框
    SetChartAAABoxControl: function (Instrument) {
        let Action = $('#ChartboxAction'),
            Alarm = $('#ChartboxAlarm'),
            Alert = $('#ChartboxAlert'),
            NoValue = -99999;

        if (Instrument.PlusAction === NoValue && Instrument.MinusAction === NoValue) {
            Action.prop({
                'checked': false,
                'disabled': true
            });
        } else {
            Action.prop({
                'checked': true,
                'disabled': false
            });
        }
        if (Instrument.PlusAlarm === NoValue && Instrument.MinusAlarm === NoValue) {
            Alarm.prop({
                'checked': false,
                'disabled': true
            });
        } else {
            Alarm.prop({
                'checked': true,
                'disabled': false
            });
        }
        if (Instrument.PlusAlert === NoValue && Instrument.MinusAlert === NoValue) {
            Alert.prop({
                'checked': false,
                'disabled': true
            });
        } else {
            Alert.prop({
                'checked': true,
                'disabled': false
            });
        }
    },
    //呼叫畫圖資料
    GetDrawData: function (Instrument, StableType) {
        let DataFormat = {},
            AjaxSetting = {},
            ans;

        DataFormat = {
            PointIdx: Instrument.PointIdx,
            PointNo: Instrument.PointNo,
            GageType: Instrument.GageType,
            StableRang: StableType
        }

        AjaxSetting.type = 'post';
        AjaxSetting.url = 'InstructmentList.aspx/GetDrawDataStableInterval';
        AjaxSetting.contentType = 'Application/json; charset=utf-8';
        AjaxSetting.data = JSON.stringify(DataFormat);
        AjaxSetting.dataType = 'json';
        AjaxSetting.success = function (res) {
            ans = res.hasOwnProperty('d') ? res.d : res;

            console.log(ans);
            if (!ans.isOk) {
                alert(ans.Message);
            } else {
                //讓日期顯示畫圖的區間
                config.SetDatePickerDate(ans.ChartData);
                //準備畫圖
                config.DrawData(Instrument, ans.ChartData);
                //按鈕事件
                config.SetChartListener(Instrument);
                //自選區間偵測
                config.SetSelfChooseDateListener(Instrument);
            }
        };
        AjaxSetting.error = function (err) {
            console.log(err);
        }

        $.ajax(AjaxSetting);
    },
    //自選區間顯示
    SetSelfChooseDateListener: function (Instrument) {
        FromDateChart.on('change', function () {
            //視覺控制 將固定區按鈕消除
            $('label', '#MapPartChartOneInstrumentDefault').removeClass('active')
                .find('input')
                .prop('checked', false);

            let StartDate = $(this).val(),
                EndDate = ToDateChart.val();

            //呼叫自選區間方法
            config.GetSelfChooseChartData(Instrument, StartDate, EndDate);
        });

        ToDateChart.on('change', function () {
            //呼叫自選區間方法
            $('label', '#MapPartChartOneInstrumentDefault').removeClass('active')
                .find('input')
                .prop('checked', false);

            let StartDate = FromDateChart.val(),
                EndDate = $(this).val();

            //呼叫自選區間方法
            config.GetSelfChooseChartData(Instrument, StartDate, EndDate);
        });
    },
    //讀取自選時間區間的資料
    GetSelfChooseChartData: function (Instrument, StartDate, EndDate) {
        let AjaxSetting = {},
            DataFormat = {},
            ans;

        DataFormat = {
            PointIdx: Instrument.PointIdx,
            PointNo: Instrument.PointNo,
            GageType: Instrument.GageType,
            StartDate: StartDate,
            EndDate: EndDate
        };

        AjaxSetting.type = 'post';
        AjaxSetting.contentType = 'Application/json;charset=utf-8';
        AjaxSetting.data = JSON.stringify(DataFormat);
        AjaxSetting.dataType = 'json';
        AjaxSetting.url = 'Map.aspx/GetDrawDataSelfChooseInterval';
        AjaxSetting.success = function (res) {
            ans = res.hasOwnProperty('d') ? res.d : res;
            if (!ans.isOk) {
                alert(ans.Message);
            } else {
                config.DrawData(Instrument, ans.ChartData);
            }
        };
        AjaxSetting.error = function (err) {

        };

        $.ajax(AjaxSetting);
    },
    //自動顯示區間
    SetDatePickerDate: function (Range) {
        let year,
            month,
            day,
            StartDate,
            EndDate;

        if (Range.length === 0) {
            EndDate = new Date();
            FromDateChart.datepicker('setDate', null);
            ToDateChart.datepicker('setDate', EndDate);
        } else {
            year = parseInt(Range[0].Date.split(' ')[0].split('/')[0]);
            month = parseInt(Range[0].Date.split(' ')[0].split('/')[1]);
            day = parseInt(Range[0].Date.split(' ')[0].split('/')[2]);
            StartDate = new Date(year, (month - 1), day);

            FromDateChart.datepicker('setDate', StartDate);

            year = parseInt(Range[Range.length - 1].Date.split(' ')[0].split('/')[0]);
            month = parseInt(Range[Range.length - 1].Date.split(' ')[0].split('/')[1]);
            day = parseInt(Range[Range.length - 1].Date.split(' ')[0].split('/')[2]);
            EndDate = new Date(year, (month - 1), day);

            ToDateChart.datepicker('setDate', EndDate);
        }
    },
    //事件
    SetChartListener: function (Instrument) {
        $('label', '#InstrumentStableInterval').off()
            .on('click', function (e) {
                console.log($(this).index());
                config.GetDrawData(Instrument, $(this).index());
            });
    },
    //開始畫圖
    DrawData: function (Instrument, DrawData) {
        let chartField = this.GetChartObject(),
            xAxisField = this.GetXAxisObject(Instrument),
            yAxisField = this.GetYAxisObject(Instrument, DrawData),
            legendField = this.GetLegendObject(Instrument),
            titleField = this.GetTitleObject(),
            subTitleField = this.GetSubTitleObject(Instrument),
            seriesField = this.GetSeriesObject(Instrument, DrawData),
            chartAttr = {};

        chartAttr = {
            chart: chartField,
            xAxis: xAxisField,
            yAxis: yAxisField,
            legend: legendField,
            title: titleField,
            subtitle: subTitleField,
            series: seriesField
        };

        MainChart　 = new Highcharts.chart(chartAttr);
        //event
        $('#chartboxAction').on('change', function () {
            let ActionChecked = $('#chartboxAction').prop('checked'),
                AlarmChecked = $('#chartboxAlarm').prop('checked'),
                AlertChecked = $('#chartboxAlert').prop('checked'),
                LabelLine = [],
                YAxisCube = {};
            LabelLine = config.GetSelectLabelLine(ActionChecked, AlarmChecked, AlertChecked, Instrument);
            YAxisCube = {
                plotLines: LabelLine
            };
            MainChart.update({
                yAxis: YAxisCube
            });
        });
        $('#chartboxAlarm').on('change', function () {
            let ActionChecked = $('#chartboxAction').prop('checked'),
                AlarmChecked = $('#chartboxAlarm').prop('checked'),
                AlertChecked = $('#chartboxAlert').prop('checked'),
                LabelLine = [],
                YAxisCube = {};
            LabelLine = config.GetSelectLabelLine(ActionChecked, AlarmChecked, AlertChecked, Instrument);
            YAxisCube = {
                plotLines: LabelLine
            };
            MainChart.update({
                yAxis: YAxisCube
            });
        });
        $('#chartboxAlert').on('change', function () {
            let ActionChecked = $('#chartboxAction').prop('checked'),
                AlarmChecked = $('#chartboxAlarm').prop('checked'),
                AlertChecked = $('#chartboxAlert').prop('checked'),
                LabelLine = [],
                YAxisCube = {};
            LabelLine = config.GetSelectLabelLine(ActionChecked, AlarmChecked, AlertChecked, Instrument);
            YAxisCube = {
                plotLines: LabelLine
            };
            MainChart.update({
                yAxis: YAxisCube
            });
        });
    },
    //Chart 參數 Start
    GetChartObject: function () {
        let chartCube = {
            renderTo: 'chart',
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
    GetYAxisObject: function (dataItem, totalData) {
        let max = 0,
            min = 100000,
            noSetting = -99999,
            labelLine = [],
            actionLine = [],
            alarmLine = [],
            alertLine = [],
            unit = dataItem.Unit;

        //警戒線部分 有-99999 則不畫線
        actionLine = this.GetActionLine(dataItem.PlusAction, dataItem.MinusAction, unit);
        alarmLine = this.GetAlarmLine(dataItem.PlusAlarm, dataItem.MinusAlarm, unit);
        alertLine = this.GetAlertLine(dataItem.PlusAlert, dataItem.MinusAlert, unit);
        actionLine.map(function (element) {
            labelLine.push(element);
        });
        alarmLine.map(function (element) {
            labelLine.push(element);
        });
        alertLine.map(function (element) {
            labelLine.push(element);
        });
        // 比較大小
        max = this.GetYAxisMax(totalData, dataItem);
        min = this.GetYAxisMin(totalData, dataItem);
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
            text: 'Single Instrumemts Chart'
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
    GetYAxisMax: function (Instrument, Item) {
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
        return max;
    },
    //歷時資料 該儀器資訊
    GetYAxisMin: function (Instrument, Item) {
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
        return min;
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
                let second = element.Date.split(' ')[1].split(':')[2];
                let date = Date.UTC(year, month - 1, day, hour, minute);
                chartFormat.push([date, element.Value]);
            } else {

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
    //Chart 參數 End
    //下載檔案 START
    ClickSaveData: $('button#SaveData').on('click', function () {
        let GageType = '',
            DataType = 0,
            FromDate = '',
            ToDate = '',
            GageTypeArray = [];

        //呼叫所需資料
        GageType = $('option', 'select#GageTypeSelect').val();
        DataType = $('#valueChartBoxSelectValue').prop('checked') ? 0 : 1;
        FromDate = $('#DownloadFromDate').val();
        ToDate = $('#DownloadToDate').val();


        if (GageType === '0') {
            $('select#GageTypeSelect').find('option').each(function () {
                if (!($(this).val()) === '0') {
                    GageTypeArray.push($(this).val());
                }
            });
        }
        console.log(GageTypeArray);
        //去後端叫資料
        //config.GetFile(GageType, DataType, FromDate, ToDate);
    }),
    //AJAX下載資料
    GetFile: function (GageType, DataType, FromDate, ToDate) {
        let AjaxSetting = {},
            InputData = {},
            ans;

        InputData = {
            GageType: GageType,
            DataType: DataType,
            FromDate: FromDate,
            ToDate: ToDate
        };

        AjaxSetting.type = 'post';
        AjaxSetting.url = 'InstructmentList.aspx/GetDownloadPath';
        AjaxSetting.contentType = 'Application/json; charset=utf-8';
        AjaxSetting.dataType = 'json';
        AjaxSetting.data = JSON.stringify(InputData);
        AjaxSetting.success = function (res) {
            ans = res.hasOwnProperty('d') ? res.d : res;
            console.log(res);
        };
        AjaxSetting.error = function (err) {
            console.log(err);
        }

        // $.ajax(AjaxSetting);
    },
    //下載檔案 END
    //專案變更
    ProjectListener: $('select#projectSelect').on('change', function () {
        let target = {
            ProjectName: $(this).find('option:selected').text()
        }

        let setting = {};

        setting.type = 'post';
        setting.contentType = 'Application/json; charset=utf-8';
        setting.data = JSON.stringify(target);
        setting.dataType = 'json';
        setting.url = 'InstructmentList.aspx/GetNewestDatas';
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