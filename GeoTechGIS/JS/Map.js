// 'user strict'
//全部儀器資訊
var MainData = [],
    //儀器標記選單[標記,資訊視窗,該儀器的資料]
    MarkerList = [],
    //地圖控制
    Map2,
    // 圖表控制
    MainChart,

    measureTool;

var config = {
    //進來讀檔案
    load: function () {
        let setting = {};

        setting.type = 'post';
        setting.contentType = 'Application/json; charset=utf-8';
        setting.data = '';
        setting.dataType = 'json';
        setting.url = 'Map.aspx/GetNewestDatas';
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
    //在網站上面
    ShowOnThePage: function (element) {
        //專案列表清單
        this.SetToProjectList(element.ProjectsList, element.ProjectInfo.ProjectName);
        //專案標題
        this.SetProjectTitle(element.ProjectInfo.ProjectName, element.ProjectInfo.ProjectDescript);
        //顯示地圖
        this.SetTheOnMap(element.ProjectInfo.MapType, element.ProjectInfo.Lat, element.ProjectInfo.Lng);
        //回到原始位置預設
        this.MapDefaultListener(element.ProjectInfo.MapType, element.ProjectInfo.Lat, element.ProjectInfo.Lng);
        //視窗圖利
        this.SetLegned(element.DataPackage);
        //儀器位置
        this.SetMarker(element.DataPackage);
        //狀態分類
        this.CalStatusTpye(element.DataPackage);
        //右方列表清單 
        this.SetOnTheList(element.DataPackage);
        //設定條件選擇(車站 區域 儀器類型 文字搜索)
        this.SetListSelectBar(element.DataPackage);
    },
    //設定專案選單
    SetToProjectList: function (list, showPro) {
        let str = '<option>' + showPro + '</option>';
        list.forEach(function (item) {
            str += item !== showPro ? '<option>' + item + '</option>' : '';
        });

        $('select#projectSelect').html(str);
    },
    //下標題
    SetProjectTitle: function (Title, SubTitle) {
        $('a#projectName').text(Title);
        $('a#porjectDescript').text(SubTitle);
    },
    //顯示地圖並且訂好座標和位置
    SetTheOnMap: function (Type, Lat, Lng) {
        let position = Type === 1 ? {
                lat: Lat,
                lng: Lng
            } : {
                lat: 23.921695,
                lng: 121.082554
            },
            zoomScale = Type === 1 ? 16 : 8;

        Map2 = new google.maps.Map(document.getElementById('map'), {
            center: position,
            zoom: zoomScale,
            disableDefaultUI: false,
            // mapTypeControl: false,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain']
            },
            zoomControl: false,
            streetViewControl: false
        });

        measureTool = new MeasureTool(Map2, {
            showSegmentLength: true,
            tooltip: true,
            unit: MeasureTool.UnitTypeId.METRIC // metric, imperial, or nautical
        });

        //measureTool.addListener('measure_start', () => {
            //console.log('started');
            //      measureTool.removeListener('measure_start')
        //});
        //measureTool.addListener('measure_end', (e) => {
        //    console.log('ended', e.result);
            //      measureTool.removeListener('measure_end');
        //});
        //measureTool.addListener('measure_change', (e) => {
        //    console.log('changed', e.result);
            //      measureTool.removeListener('measure_change');
        //});

        //地圖拖曳結束後 就重新刷LIST
        Map2.addListener('dragend', function () {
            config.SetAllButtonReset();
            let Position = Map2.getBounds(),
                North = parseFloat(Position.getNorthEast().lat().toFixed(9)),
                South = parseFloat(Position.getSouthWest().lat().toFixed(9)),
                East = parseFloat(Position.getNorthEast().lng().toFixed(9)),
                West = parseFloat(Position.getSouthWest().lng().toFixed(9)),
                str = '';

            MarkerList.forEach(function (element) {
                let Lat = element[0].getPosition().lat(),
                    Lng = element[0].getPosition().lng();

                if (Lng < East && Lng > West && Lat > South && Lat < North) {
                    str += element[0].getVisible() ? '<li>' + element[2].PointNo + '</li>' : '';
                }
            });

            $('ul#showISelectionList').html(str);
        });

        //縮放倍率更改  就重新刷LIST
        Map2.addListener('zoom_changed', function () {
            config.SetAllButtonReset();
            let Position = Map2.getBounds(),
                North = parseFloat(Position.getNorthEast().lat().toFixed(9)),
                South = parseFloat(Position.getSouthWest().lat().toFixed(9)),
                East = parseFloat(Position.getNorthEast().lng().toFixed(9)),
                West = parseFloat(Position.getSouthWest().lng().toFixed(9)),
                str = '';

            MarkerList.forEach(function (element) {
                let Lat = element[0].getPosition().lat(),
                    Lng = element[0].getPosition().lng();

                if (Lng < East && Lng > West && Lat > South && Lat < North) {
                    str += element[0].getVisible() ? '<li>' + element[2].PointNo + '</li>' : '';
                }
            });

            $('ul#showISelectionList').html(str);
        });
    },
    //右邊列表清單設定
    SetListSelectBar: function (Items) {
        let Legend = [],
            Station = [],
            Area = [];

        Items.forEach(function (element) {
            Legend.push(element.Legend);
            Station.push(element.Station);
            Area.push(element.Area);
        });

        Legend = Legend.filter(function (ele, index, arr) {
            return arr.indexOf(ele) === index
        });
        Station = Station.filter(function (ele, index, arr) {
            return arr.indexOf(ele) === index
        });
        Area = Area.filter(function (ele, index, arr) {
            return arr.indexOf(ele) === index
        });

        this.SetSelectBar('select#mapStationSelect', Station);
        this.SetSelectBar('select#IDAreaSelect', Area);
        this.SetSelectBar('select#IDTypsSelect', Legend);
    },
    //選擇Select
    SetSelectBar: function (SelectItem, items) {
        let target = $(SelectItem),
            str = '',
            TypeList = [];

        switch (target.attr('id')) {
            case 'mapStationSelect':
                str = '<option value="0">All Station</option>';
                break;
            case 'IDAreaSelect':
                str = '<option value="0">All Area</option>';
                break;
            case 'IDTypsSelect':
                str = '<option value="0">All Type</option>';
                break;
        }

        items.forEach(function (element) {
            TypeList.push(element);
        });

        TypeList = TypeList.filter(function (ele, index, arr) {
            return arr.indexOf(ele) === index;
        });

        TypeList.forEach(function (element) {
            str += '<option value="' + element + '">' + element + '</option>';
        });

        target.html(str);
    },
    //Select Listener Start
    SelectStationListener: $('select#mapStationSelect').on('change', function () {
        let ChooseItme,
            SearchBar,
            ShowTarget,
            Legend = [],
            Area = [],
            str = '',
            FilterItems;

        ChooseItme = $('option:selected', this).val();
        SearchBar = $('#IDSearch');
        ShowTarget = $('ul#showISelectionList');

        config.SetAllButtonReset();
        switch (ChooseItme === '0') {
            case true:
                FilterItems = MainData.DataPackage;
                break;
            case false:
                FilterItems = config.FilterStation(MainData.DataPackage, ChooseItme);
                break;
        }

        // 顯示/隱藏圖利全開
        config.SetAllLegendOn();

        //將資料丟到列表
        FilterItems.forEach(function (element) {
            Area.push(element.Area);
            Legend.push(element.Legend);
            str += '<li>' + element.PointNo + '</li>';
        });
        //顯示到列表
        ShowTarget.html(str);

        //淨空搜尋
        SearchBar.val();

        //重新顯示區域和儀器類型
        config.SetSelectBar('select#IDAreaSelect', Area);
        config.SetSelectBar('select#IDTypsSelect', Legend);

        // 地圖圖例的控制顯示
        MarkerList.forEach(function (items) {
            for (let i = 0; i < FilterItems.length; i++) {
                if (items[2].PointNo === FilterItems[i].PointNo) {
                    items[0].setVisible(true);
                    break;
                } else {
                    items[0].setVisible(false);
                }
            }
        });
    }),
    SelectAreaListener: $('select#IDAreaSelect').on('change', function () {
        let StationChoose,
            ChooseItme,
            SearchBar,
            ShowTarget,
            Legend = [],
            str = '',
            FilterItems;


        StationChoose = $('option:selected', 'select#mapStationSelect').val();
        ChooseItme = $('option:selected', this).val();
        SearchBar = $('#IDSearch');
        ShowTarget = $('ul#showISelectionList');

        config.SetAllButtonReset();
        switch (ChooseItme === '0') {
            case true:
                FilterItems = config.FilterStation(MainData.DataPackage, StationChoose);
                break;
            case false:
                FilterItems = config.FilterStation(MainData.DataPackage, StationChoose);
                FilterItems = config.FilterArea(FilterItems, ChooseItme);
                break;
        }

        // 顯示/隱藏圖利全開
        config.SetAllLegendOn();

        //將資料丟到列表
        FilterItems.forEach(function (element) {
            Legend.push(element.Legend);
            str += '<li>' + element.PointNo + '</li>';
        });
        //顯示到列表
        ShowTarget.html(str);

        //淨空搜尋
        SearchBar.val();

        //重新顯示區域和儀器類型
        config.SetSelectBar('select#IDTypsSelect', Legend);

        // 地圖圖例的控制顯示
        MarkerList.forEach(function (items) {
            for (let i = 0; i < FilterItems.length; i++) {
                if (items[2].PointNo === FilterItems[i].PointNo) {
                    items[0].setVisible(true);
                    break;
                } else {
                    items[0].setVisible(false);
                }
            }
        });
    }),
    SelectLegendListener: $('select#IDTypsSelect').on('change', function () {
        let StationChoose,
            AreaChoose,
            ChooseItme,
            SearchBar,
            ShowTarget,
            str = '',
            FilterItems;

        StationChoose = $('option:selected', 'select#mapStationSelect').val();
        AreaChoose = $('option:selected', 'select#IDAreaSelect').val();
        ChooseItme = $('option:selected', this).val();
        SearchBar = $('#IDSearch');
        ShowTarget = $('ul#showISelectionList');
        config.SetAllButtonReset();

        switch (ChooseItme === '0') {
            case true:
                FilterItems = config.FilterStation(MainData.DataPackage, StationChoose);
                FilterItems = config.FilterArea(FilterItems, AreaChoose);
                break;
            case false:
                FilterItems = config.FilterStation(MainData.DataPackage, StationChoose);
                FilterItems = config.FilterArea(FilterItems, AreaChoose);
                FilterItems = config.FilterLegend(FilterItems, ChooseItme);
                break;
        }

        // 顯示/隱藏圖利全開
        config.SetAllLegendOn();

        //將資料丟到列表
        FilterItems.forEach(function (element) {
            str += '<li>' + element.PointNo + '</li>';
        });
        //顯示到列表
        ShowTarget.html(str);

        //淨空搜尋
        SearchBar.val();

        // 地圖圖例的控制顯示
        MarkerList.forEach(function (items) {
            for (let i = 0; i < FilterItems.length; i++) {
                if (items[2].PointNo === FilterItems[i].PointNo) {
                    items[0].setVisible(true);
                    break;
                } else {
                    items[0].setVisible(false);
                }
            }
        });
    }),
    SearchListener: $('#IDSearch').on('keyup', function () {
        let StationChoose = '',
            AreaChoose = '',
            LegendChoose = '',
            ItemChoose = '',
            ShowTarget,
            FilterItems,
            str = '';

        StationChoose = $('option:selected', 'select#mapStationSelect').val();
        AreaChoose = $('option:selected', 'select#IDAreaSelect').val();
        LegendChoose = $('option:selected', 'select#IDAreaSelect').val();
        ItemChoose = $('#IDSearch').val();
        ShowTarget = $('ul#showISelectionList');
        config.SetAllButtonReset();

        switch (ItemChoose.length === 0) {
            case true:
                FilterItems = config.FilterStation(MainData.DataPackage, StationChoose);
                FilterItems = config.FilterArea(FilterItems, AreaChoose);
                FilterItems = config.FilterLegend(FilterItems, LegendChoose);
                break;
            case false:
                FilterItems = config.FilterStation(MainData.DataPackage, StationChoose);
                FilterItems = config.FilterArea(FilterItems, AreaChoose);
                FilterItems = config.FilterLegend(FilterItems, LegendChoose);
                FilterItems = config.FilterSerchBar(FilterItems, ItemChoose);
                break;
        }

        // 顯示/隱藏圖利全開
        config.SetAllLegendOn();

        //將資料丟到列表
        FilterItems.forEach(function (element) {
            str += '<li>' + element.PointNo + '</li>';
        });
        //顯示到列表
        ShowTarget.html(str);

        // 地圖圖例的控制顯示
        MarkerList.forEach(function (items) {
            for (let i = 0; i < FilterItems.length; i++) {
                if (items[2].PointNo === FilterItems[i].PointNo) {
                    items[0].setVisible(true);
                    break;
                } else {
                    items[0].setVisible(false);
                }
            }
        });
    }),
    FilterSerchBar: function (data, rule) {
        let res;

        switch (rule.length === 0) {
            case true:
                res = data;
                break;
            case false:
                res = data.filter(function (element) {
                    if (element.PointNo.indexOf(rule) !== -1) {
                        return element;
                    }
                })
                break;
        }
        return res;
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
    //Select Listener End
    //顯示在右邊清單
    SetOnTheList: function (Items) {
        let list = $('ul#showISelectionList'),
            content = '';

        this.MakeAAAList(Items);
        Items.forEach(function (element) {
            if (element.ValueStatus !== 0) {
                content += '<li>' + element.PointNo + '</li>';
            }
        });
        list.html(content);
    },
    ListListener: $('ul#showISelectionList').on('click', function (e) {
        let Target = $(e.target),
            Instrument;

        //全部統一
        $('li', this).css({
            'background': '#FFF',
            'color': '#525E66'
        });

        // //選定目標改色
        Target.css({
            'background': '#525E66',
            'color': '#FFF'
        });

        //預設將所有資訊都關掉
        MarkerList.forEach(function (element) {
            element[1].close();
        });

        Instrument = MarkerList.filter(function (element) {
            return element[2].PointNo === Target.text();
        })[0];

        //顯示要訊息
        config.ShowOnInfoList(Instrument[2]);

        //設定置頂
        Instrument[0].setAnimation(google.maps.Animation.BOUNCE);

        //動畫延遲
        setTimeout(function () {
            Instrument[0].setAnimation(null);
        }, 1100);

        //將地圖中心點為點選儀器
        Map2.setCenter(Instrument[0].getPosition());
        Map2.setZoom(20);

        // 開啟資訊視窗
        config.SetAllInfoOff();
        Instrument[1].open();

    }),
    //選定儀器的資訊
    ShowOnInfoList: function (Item) {
        let str = '',
            showInfo = $('ul#showISelectionInfoInfo');

        str += '<li>Insturment: <a>' + Item.PointNo + '</a></li>';
        str += '<li>Area: <a>' + Item.Area + '</a></li>';
        str += '<li>Type: <a>' + Item.GageType + '</a></li>';
        str += '<li>last Reading: <a>' + Item.Value + ' ' + Item.Unit + '</a></li>';
        str += '<li>last Reading Date: <a>' + Item.Date + '</a></li>';
        showInfo.html(str);
    },
    MakeAAAList: function (Instrumemts) {
        let ActionList = [],
            AlarmList = [],
            AlertList = [];

        Instrumemts.forEach(function (element) {
            switch (element.ValueStatus) {
                case 1:
                    ActionList.push(element);
                    break;
                case 2:
                    AlarmList.push(element);
                    break;
                case 3:
                    AlertList.push(element);
                    break;
            }
        });

        //將數值抓到AAATABLE
        this.SetAAATable(AAAActionTable, ActionList, $('table#ActionTable'));
        this.SetAAATable(AAAAlarmTable, AlarmList, $('table#AlarmTable'));
        this.SetAAATable(AAAAlertTable, AlertList, $('table#AlertTable'));

    },
    //塞到AAA表格上面
    SetAAATable: function (AAATable, List, Target) {
        let InputArray = [],
            TableWrapper;

        //修改TABLE CSS
        TableWrapper = '#' + Target.attr('id') + '_wrapper';
        //塞到 
        switch (List.length !== 0) {
            case true:
                List.forEach(function (element) {
                    InputArray.push({
                        '0': element.PointNo,
                        '1': element.GageType,
                        '2': element.Value,
                        '3': element.Date.split(' ')[0]
                    });
                });
                AAATable.rows
                    .add(InputArray)
                    .draw();
                if (List.Length <= 10) {
                    $('.dataTables_scrollBody', $(TableWrapper)).height(411);
                } else {
                    $('.dataTables_scrollBody', $(TableWrapper)).height(448);
                }
                break;
            case false:
                $('.dataTables_scrollBody', $(TableWrapper)).height(448);
                break;
        }
    },
    //地圖回復到預設值
    MapDefaultListener: function (Type, Lat, Lng) {
        $('button#default').off('click')
            .on('click', function () {
                let position = Type === 1 ? {
                        lat: Lat,
                        lng: Lng
                    } : {
                        lat: 23.921695,
                        lng: 121.082554
                    },
                    zoomScale = Type === 1 ? 16 : 8;
                Map2.panTo(position);
                Map2.setZoom(zoomScale);
            });
    },
    //警戒值狀況按鈕
    CalStatusTpye: function (Items) {
        let All = 0,
            Action = 0,
            Alarm = 0,
            Alert = 0,
            Stop = 0,
            Normal = 0;

        Items.forEach(function (element) {
            All++;
            if (element.DeviceStatus === 0) {
                switch (element.ValueStatus) {
                    case 0:
                        Normal++
                        break;
                    case 1:
                        Action++;
                        break;
                    case 2:
                        Alarm++;
                        break;
                    case 3:
                        Alert++
                        break;
                }
            } else {
                Stop++;
            }
        });
        //將MARKLIST的數字顯示在上面
        $('a#allCount').text(All);
        $('a#normalCount').text(Normal);
        $('a#actionCount').text(Action);
        $('a#alarmCount').text(Alarm);
        $('a#alertCount').text(Alert);
        $('a#stopCount').text(Stop);
    },
    //放標記在地圖上
    SetMarker: function (Items) {
        Items.forEach(function (element) {
            let content = '',
                position = {},
                icon = '',
                marker,
                info;

            //標記(儀器)座標
            position = {
                lat: element.Latitude,
                lng: element.Longitude
            }

            //圖例擷取
            icon = config.GetIcon(element);

            //新增標記
            marker = new google.maps.Marker({
                position: position,
                map: Map2,
                icon: icon
            });

            //資訊視窗內文
            content += '<h5>' + element.GageDescription + '</h5>' +
                '<p>' + element.PointNo + '</p>' +
                '<p>Value:  ' + (element.Value === -99999 ? ' ' : element.Value) + element.Unit + '</p>' +
                '<p>Date:  ' + element.Date + '</p>' +
                '<p><button type="button" onclick="config.SetToDrawTheChart(\'' + element.PointNo + '\')">Show Chart</button>' +
                '<p><button type="button" onclick="config.SetToDrawThePicture(\'' + element.PointNo + '\')">Show Picture</button>';

            //新增資訊視窗(用套件)
            info = new SnazzyInfoWindow({
                marker: marker,
                content: content,
                offset: {
                    top: '-5px'
                },
                callbacks: {
                    //當INFO 視窗關掉的時候 將LIST的標記關掉
                    // afterClose: function () {
                    //     console.log('我關掉了' + element.PointNo);
                    //     $('li', 'ul#showISelectionList').each(function () {
                    //         $(this).css({
                    //             'background': '#FFF',
                    //             'color': '#525E66'
                    //         });
                    //     });
                    // }
                }
            });

            //只有顯示有狀況版本

            if (element.ValueStatus !== 0 || element.DeviceStatus !== 0) {
                marker.setVisible(true);
            } else {
                marker.setVisible(false);
            }

            //點即出現資訊視窗
            marker.addListener('click', function (e) {
                //把所有INFO 關掉
                config.SetAllInfoOff();
                info.open();

                //直接找到list顯示的儀器
                $('li', 'ul#showISelectionList').each(function (index) {
                    // console.log($(this).text());
                    if ($(this).text() === element.PointNo) {
                        $(this).css({
                            'background': '#525E66',
                            'color': '#FFF'
                        });

                        let LiTagHeight = parseFloat($(this).height());
                        $('#showISelection').scrollTop((LiTagHeight * index));
                    } else {
                        $(this).css({
                            'background': '#FFF',
                            'color': '#525E66'
                        });
                    }
                });
            });

            //存放格式: 標記 資訊視窗 該儀器相關資料
            MarkerList.push([marker, info, element]);
        });
    },
    //取得圖例
    GetIcon: function (Items) {
        if (Items.DeviceStatus === 0) {
            switch (Items.ValueStatus) {
                case 0:
                    return '../Images/Legend/' + Items.Legend + '-Normal.png';
                case 1:
                    return '../Images/Legend/' + Items.Legend + '-Action.png';
                case 2:
                    return '../Images/Legend/' + Items.Legend + '-Alarm.png';
                case 3:
                    return '../Images/Legend/' + Items.Legend + '-Alert.png';
            }
        } else {
            return '../Images/Legend/' + Items.Legend + '-Stop.png';
        }
    },
    //圖例列表控制
    SetLegned: function (Items) {
        let gageTypeList = [],
            LengedAndDescript = [],
            content = '',
            target;

        target = $('table#selectInstrumentOnMap').find('tbody');
        Items.forEach(function (element) {
            gageTypeList.push(element.Legend);
        });

        //刪除重複
        gageTypeList = gageTypeList.filter(function (ele, index, array) {
            return array.indexOf(ele) === index;
        });

        for (let i = 0; i < gageTypeList.length; i++) {
            for (let j = 0; j < Items.length; j++) {
                if (Items[j].Legend === gageTypeList[i]) {
                    LengedAndDescript.push([gageTypeList[i], Items[j].GageDescription]);
                    break;
                }
            }
        }

        LengedAndDescript.forEach(function (element) {
            content += '<tr>' +
                '<td><input type="checkbox" value="' + element[0] + '" checked ></td>' +
                '<td><img src="../Images/Legend/' + element[0] + '.png"/></td>' +
                '<td>' + element[1] + '</td>' +
                '</tr>';
        });
        target.html(content);
        target.off('click', 'tr');

        //偵測點
        target.on('change', 'input', function (e) {
            //按下之後的結果
            let type = $(this).val(),
                status = $(this).prop('checked'),
                //去將顯示在地圖的儀器資訊符合的關掉
                str = '';

            //圖例控制
            MarkerList.forEach(function (element) {
                if (element[2].Legend === type) {
                    element[0].setVisible(status);
                }
            });

        });

    },
    //顯示全部按鈕START LEGEND 都打勾
    SetShowAll: $("button#markerAll").on('click', function () {
        let str = '',
            showTarget;

        config.SetAllButtonReset();
        config.SetAllLegendOn();

        showTarget = $('ul#showISelectionList');

        //顯示已經按下
        $(this).toggleClass('active');
        //$(this).addClass('active');
        MarkerList.forEach(function (element) {
            element[0].setVisible(true);
            str += '<li>' + element[2].PointNo + '</li>';
        });

        showTarget.html(str);
    }),
    SetShowNormal: $("button#markerNormal").on('click', function () {
        let str = '',
            showTarget;

        config.SetAllButtonReset();
        config.SetAllLegendOn();

        showTarget = $('ul#showISelectionList');
        //顯示已經按下
        $(this).addClass('active');
        MarkerList.forEach(function (element) {
            if (element[2].ValueStatus === 0) {
                element[0].setVisible(true);
                str += '<li>' + element[2].PointNo + '</li>';
            } else {
                element[0].setVisible(false);
            }
        });
        showTarget.html(str);
    }),
    SetShowAction: $("button#markerAction").on('click', function () {
        let str = '',
            showTarget;

        config.SetAllButtonReset();
        config.SetAllLegendOn();

        showTarget = $('ul#showISelectionList');
        //顯示已經按下
        $(this).addClass('active');
        MarkerList.forEach(function (element) {
            if (element[2].ValueStatus === 1) {
                element[0].setVisible(true);
                str += '<li>' + element[2].PointNo + '</li>';
            } else {
                element[0].setVisible(false);
            }
        });
        showTarget.html(str);
    }),
    SetShowAlarm: $("button#markerAlarm").on('click', function () {
        let str = '',
            showTarget;

        config.SetAllButtonReset();
        config.SetAllLegendOn();

        showTarget = $('ul#showISelectionList');
        //顯示已經按下
        $(this).addClass('active');
        MarkerList.forEach(function (element) {
            if (element[2].ValueStatus === 2) {
                element[0].setVisible(true);
                str += '<li>' + element[2].PointNo + '</li>';
            } else {
                element[0].setVisible(false);
            }
        });
        showTarget.html(str);
    }),
    SetShowAlert: $("button#markerAlert").on('click', function () {
        let str = '',
            showTarget;

        config.SetAllButtonReset();
        config.SetAllLegendOn();

        showTarget = $('ul#showISelectionList');
        //顯示已經按下
        $(this).addClass('active');
        MarkerList.forEach(function (element) {
            if (element[2].ValueStatus === 3) {
                element[0].setVisible(true);
                str += '<li>' + element[2].PointNo + '</li>';
            } else {
                element[0].setVisible(false);
            }
        });
        showTarget.html(str);
    }),
    SetShowStop: $("button#markerStop").on('click', function () {
        let str = '',
            showTarget;

        config.SetAllButtonReset();
        config.SetAllLegendOn();

        showTarget = $('ul#showISelectionList');

        //顯示已經按下
        $(this).addClass('active');
        MarkerList.forEach(function (element) {
            if (element[2].ValueStatus === 4 || element[2].DeviceStatus !== 0) {
                element[0].setVisible(true);
                str += '<li>' + element[2].PointNo + '</li>';
            } else {
                element[0].setVisible(false);
            }
        });
        showTarget.html(str);
    }),
    //顯示全部按鈕 END
    //將所有按鈕顯示為未按下狀態
    SetAllButtonReset: function () {
        $('ul#markerList').find('li')
            .each(function () {
                $(this).find('button')
                    .removeClass('active');
            })
    },
    //所有圖例全部打開
    SetAllLegendOn: function () {
        let target = $('table#selectInstrumentOnMap').find('tbody');

        target.find('tr').each(function () {
            $('td>input', this).prop('checked', true);
        });
    },
    //將全部的INFO 都關閉
    SetAllInfoOff: function () {
        if (MarkerList.length === 0) {
            return false;
        }

        MarkerList.forEach(function (element) {
            element[1].close();
        });

    },
    //顯示出圖視窗 並且選擇儀器資料的畫圖  尚未完成
    SetToDrawTheChart: function (PointNo) {
        $('#showChart').modal('toggle');

        //找到選擇儀器的資訊
        let Instrument = MainData.DataPackage.filter(function (element) {
            if (element.PointNo === PointNo) {
                return element;
            }
        })[0];
        this.SetChartReset();
        this.SetChartAAABoxControl(Instrument);
        this.GetDrawData(Instrument, 0);
    },
    SetToDrawThePicture: function (PointNo) {
        let Instrument = MainData.DataPackage.filter(function (element) {
            if (element.PointNo === PointNo) {
                return element;
            }
        })[0];
        this.GetDrawPicture(Instrument);
    },
    //將圖表的按鈕區回復到原始設定
    SetChartReset: function () {
        let ButtonTarget = $('label', 'div#MapPartChartOneInstrumentDefault');
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
        let Action = $('#chartboxAction'),
            Alarm = $('#chartboxAlarm'),
            Alert = $('#chartboxAlert'),
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
        AjaxSetting.url = 'Map.aspx/GetDrawDataStableInterval';
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

                $("#instrument_picture_chart").html("<img src='../Images/" + ans.Picture + "' style='width:100%'>");
            }
        };
        AjaxSetting.error = function (err) {
            console.log(err);
        }

        $.ajax(AjaxSetting);
    },
    GetDrawPicture: function (Instrument) {
        let DataFormat = {},
            AjaxSetting = {},
            ans;

        DataFormat = {
            PointIdx: Instrument.PointIdx,
            PointNo: Instrument.PointNo,
            GageType: Instrument.GageType
        }

        AjaxSetting.type = 'post';
        AjaxSetting.url = 'Map.aspx/GetDrawDataPicture';
        AjaxSetting.contentType = 'Application/json; charset=utf-8';
        AjaxSetting.data = JSON.stringify(DataFormat);
        AjaxSetting.dataType = 'json';
        AjaxSetting.success = function (res) {
            ans = res.hasOwnProperty('d') ? res.d : res;

            console.log(ans);
            if (!ans.isOk) {
                alert(ans.Message);
            } else {
                let imageURL = ans.Picture;
                $('#showInstrumentPicture').modal('toggle');
                $("#instrument_picture").html("<img src='../Images/" + imageURL + "' style='width:100%'>");
            }
        };
        AjaxSetting.error = function (err) {
            console.log(err);
        }

        $.ajax(AjaxSetting);
    },
    //自選區間顯示
    SetSelfChooseDateListener: function (Instrument) {
        FromDate.on('change', function () {
            //視覺控制 將固定區按鈕消除
            $('label', '#MapPartChartOneInstrumentDefault').removeClass('active')
                .find('input')
                .prop('checked', false);

            let StartDate = $(this).val(),
                EndDate = ToDate.val();

            //呼叫自選區間方法
            config.GetSelfChooseChartData(Instrument, StartDate, EndDate);
        });

        ToDate.on('change', function () {
            //呼叫自選區間方法
            $('label', '#MapPartChartOneInstrumentDefault').removeClass('active')
                .find('input')
                .prop('checked', false);

            let StartDate = FromDate.val(),
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
            FromDate.datepicker('setDate', null);
            ToDate.datepicker('setDate', EndDate);
        } else {
            year = parseInt(Range[0].Date.split(' ')[0].split('/')[0]);
            month = parseInt(Range[0].Date.split(' ')[0].split('/')[1]);
            day = parseInt(Range[0].Date.split(' ')[0].split('/')[2]);
            StartDate = new Date(year, (month - 1), day);

            FromDate.datepicker('setDate', StartDate);

            year = parseInt(Range[Range.length - 1].Date.split(' ')[0].split('/')[0]);
            month = parseInt(Range[Range.length - 1].Date.split(' ')[0].split('/')[1]);
            day = parseInt(Range[Range.length - 1].Date.split(' ')[0].split('/')[2]);
            EndDate = new Date(year, (month - 1), day);

            ToDate.datepicker('setDate', EndDate);
        }
    },
    //事件
    SetChartListener: function (Instrument) {
        $('label', '#MapPartChartOneInstrumentDefault').off()
            .on('click', function (e) {
                console.log($(this).index())
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

        MainChart = new Highcharts.chart(chartAttr);

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
            marginTop: 100
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
            layout: "vertical",
            align: 'center',
            verticalAlign: 'top',
            floating: true,
            borderWidth: '2px',
            text: dataItem.PointNo,
            y: 60
        };
        return legendCube;
    },
    //Title
    GetTitleObject: function () {
        let titleCube = {
            text: 'Single Instruments Chart'
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
    GetYAxisMax: function (data, Item) {
        let max = 0;
        data.map(function (element) {
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
    GetYAxisMin: function (data, Item) {
        let min = 10000;
        data.map(function (element) {
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
    GetSelectLabelLine: function (action, alarm, alert, data) {
        let labelLine = [],
            noSetting = -99999,
            count = 0,
            actionLine = [],
            alarmLine = [],
            alertLine = [];

        if (action) {
            count += 4;
        }
        if (alarm) {
            count += 2;
        }
        if (alert) {
            count++;
        }
        switch (count) {
            case 0:
                break;
            case 1:
                alertLine = this.GetAlertLine(data.PlusAlert, data.MinusAlert, data.Unit);
                break;
            case 2:
                alarmLine = this.GetAlarmLine(data.PlusAlarm, data.MinusAlarm, data.Unit);
                break;
            case 3:
                alertLine = this.GetAlertLine(data.PlusAlert, data.MinusAlert, data.Unit);
                alarmLine = this.GetAlarmLine(data.PlusAlarm, data.MinusAlarm, data.Unit);
                break;
            case 4:
                actionLine = this.GetActionLine(data.PlusAction, data.MinusAction, data.Unit);
                break;
            case 5:
                alertLine = this.GetAlertLine(data.PlusAlert, data.MinusAlert, data.Unit);
                actionLine = this.GetActionLine(data.PlusAction, data.MinusAction, data.Unit);
                break;
            case 6:
                alarmLine = this.GetAlarmLine(data.PlusAlarm, data.MinusAlarm, data.Unit);
                actionLine = this.GetActionLine(data.PlusAction, data.MinusAction, data.Unit);
                break;
            case 7:
                alertLine = this.GetAlertLine(data.PlusAlert, data.MinusAlert, data.Unit);
                alarmLine = this.GetAlarmLine(data.PlusAlarm, data.MinusAlarm, data.Unit);
                actionLine = this.GetActionLine(data.PlusAction, data.MinusAction, data.Unit);
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
    //地圖選擇區塊
    MapFunction: $('div#mapFunction').on('click', function (event) {
        $(this).find('label')
            .each(function (index) {
                if ($(this).find('input').prop('checked') && !$(this).is(event.target)) {
                    config.SetMapFunctionOff(index, $(this));
                } else if ($(this).is(event.target)) {
                    config.SetMapFunctionOn(index, $(this));
                }
            });
    }),
    SetMapFunctionOn: function (FunctionIndex, UI) {
        switch (FunctionIndex) {
            case 0:
                //開啟功能
                if ($('#resume').hasClass('hide')) {
                    $('#resume').removeClass('hide');
                    let restore = {};
                    restore.center = Map2.getCenter();
                    restore.zoom = Map2.getZoom();
                    this.FunctionParameter.HistoryCenter[this.FunctionParameter.HistoryCenter.length] = restore;
                } else {
                    $('#resume').addClass('hide');
                }
                //呼叫功能
                this.SelectZoom(Map2, UI);
                break;
        }
    },
    SetMapFunctionOff: function (functionIndex, UI) {
        UI.removeClass('active')
            .find('input')
            .prop('checked', false);

        switch (functionNumber) {
            case 0:
                $('#resume').addClass('hide');
                //關閉功能
                this.SelectZoom(Map2, UI);
                break;
        }
    },
    //地圖功能參數
    FunctionParameter: {
        SelectAreaCheck: false,
        HistoryCenter: [],
        BoundForm: undefined
    },
    //地圖縮放功能
    SelectZoom: function (Map2, UI) {
        let Rectangle;

        if (!Rectangle) {
            Rectangle = new google.maps.Rectangle({
                strokeColor: '#003362',
                strokeOpacity: 0.5,
                strokeWeight: 1,
                fillColor: '#003362',
                fillOpacity: 0.25
            });
            google.maps.event.addListener(Rectangle, 'mousemove', function (e) {
                config.onMouseMove(Rectangle, e);
            });
        }

        if (UI) {
            Map.setOptions({
                draggable: config.FunctionParameter.SelectAreaCheck
            });

            if (this.FunctionParameter.SelectAreaCheck) {
                this.FunctionParameter.SelectAreaCheck = false;
                Rectangle.setMap();
            } else {
                this.FunctionParameter.SelectAreaCheck = true;
            }
        }

        let mouseMoveListener = google.maps.event.addListener(Map2, 'mousemove', function (e) {
            config.onMouseMove(Rectangle, e);
        });

        google.maps.event.addListenerOnce(Map2, 'mousedown', function (e) {
            if (!config.FunctionParameter.SelectAreaCheck) {
                return false;
            }

            let restoreInfo = {};
            restoreInfo.center = Map2.getCenter();
            restoreInfo.zoom = Map2.getZoom();

            let Position = config.FunctionParameter.HistoryCenter.length;
            config.FunctionParameter.HistoryCenter[Position] = restoreInfo;
            Rectangle.setMap(Map2);

            config.FunctionParameter.BoundForm = e.latLng;

            let Bounds = new google.maps.LatLngBounds(config.FunctionParameter.BoundForm);
            Rectangle.setBounds(Bounds);
            Rectangle.setMap(Map2);

            return false;
        });

        let RectangleMouseClickListener = google.maps.event.addListenerOnce(Rectangle, 'mouseup', function (e) {
            if (!config.FunctionParameter.SelectAreaCheck) {
                return false;
            }

            let Bounds = new google.maps.LatLngBounds(config.FunctionParameter.BoundForm),
                str = '';

            Bounds.extend(e.latLng);
            Rectangle.setMap();

            Map2.fitBounds(Bounds);
            google.maps.event.removeListener(mouseMoveListener);
            google.maps.event.removeListener(MapMouseClickListener);

            let Position = Map2.getBounds(),
                North = parseFloat(Position.getNorthEast().lat().toFixed(9)),
                South = parseFloat(Position.getSouthWest().lat().toFixed(9)),
                East = parseFloat(Position.getNorthEast().lng().toFixed(9)),
                West = parseFloat(Position.getSouthWest().lng().toFixed(9));

            MarkerList.forEach(function (element) {
                let Lat = element[0].getPosition().lat(),
                    Lng = element[0].getPosition().lng();

                if (Lng < East && Lng > West && Lat > South && Lat < North) {
                    str += element[0].getVisible() ? '<li>' + element[2].PointNo + '</li>' : '';
                }
            });

            $('ul#showISelectionList').html(str);
            config.SelectZoom(Map2);
        });

        let MapMouseClickListener = google.maps.event.addListenerOnce(Map2, 'mouseup', function (e) {
            if (!config.FunctionParameter.SelectAreaCheck) {
                return false;
            }

            let Bounds = new google.maps.LatLngBounds(config.FunctionParameter.BoundForm),
                str = '';

            Bounds.extend(e.latLng);
            Rectangle.setMap();

            Map2.fitBounds(Bounds);
            google.maps.event.removeListener(mouseMoveListener);
            google.maps.event.removeListener(RectangleMouseClickListener);

            let Position = Map2.getBounds(),
                North = parseFloat(Position.getNorthEast().lat().toFixed(9)),
                South = parseFloat(Position.getSouthWest().lat().toFixed(9)),
                East = parseFloat(Position.getNorthEast().lng().toFixed(9)),
                West = parseFloat(Position.getSouthWest().lng().toFixed(9));

            MarkerList.forEach(function (element) {
                let Lat = element[0].getPosition().lat(),
                    Lng = element[0].getPosition().lng();

                if (Lng < East && Lng > West && Lat > South && Lat < North) {
                    str += element[0].getVisible() ? '<li>' + element[2].PointNo + '</li>' : '';
                }
            });

            $('ul#showISelectionList').html(str);
            config.SelectZoom(Map2);
        });
    },
    //滑鼠事件
    onMouseMove: function (Rectangle, e) {
        if (!this.FunctionParameter.SelectAreaCheck) {
            return false;
        }

        let Bounds = new google.maps.LatLngBounds(this.FunctionParameter.BoundForm);
        Bounds.extend(e.latLng);
        Rectangle.setBounds(Bounds);
    },
    //回到上一部
    SetLastStepForSelectArea: $('button#resume').on('click', function () {
        if (config.FunctionParameter.HistoryCenter.length === 0) {
            return false;
        }

        let LastStep = config.FunctionParameter.HistoryCenter[config.FunctionParameter.HistoryCenter.length - 1];
        config.FunctionParameter.HistoryCenter.pop();

        Map2.setCenter(LastStep.center);
        Map2.setZoom(LastStep.zoom);

        let Bounds = Map2.getBounds(),
            North = parseFloat(Bounds.getNorthEast().lat().toFixed(9)),
            South = parseFloat(Bounds.getSouthWest().lat().toFixed(9)),
            East = parseFloat(Bounds.getNorthEast().lng().toFixed(9)),
            West = parseFloat(Bounds.getSouthWest().lng().toFixed(9)),
            str = '';

        MarkerList.forEach(function (element) {
            let Lat = element[0].getPosition().lat(),
                Lng = element[0].getPosition().lng();

            if (Lng < East && Lng > West && Lat > South && Lat < North) {
                str += element[0].getVisible() ? '<li>' + element[2].PointNo + '</li>' : '';
            }
        });

        $('ul#showISelectionList').html(str);
    }),
    //GOOGLE Map 圖標的顯示和隱藏
    SetMapLegendToggle: $('button#MapLegend').on('click', function () {
        console.log($(this).text());
        switch ($(this).hasClass('active')) {
            case true:
                $(this).text('Map Legend Off')
                    .removeClass('active');
                Map2.setOptions({
                    styles: [{
                        featureType: 'all',
                        elementType: 'labels',
                        stylers: [{
                            visibility: 'off'
                        }]
                    }]
                });
                break;
            case false:
                $(this).text('Map Legend On')
                    .addClass('active');
                Map2.setOptions({
                    styles: [{
                        featureType: 'all',
                        elementType: 'labels',
                        stylers: [{
                            visibility: 'on'
                        }]
                    }]
                });
                break;
        }

    }),
    //專案選單偵聽
    ProjectListener: $('select#projectSelect').on('change', function () {
        let target = {
                ProjectName: $(this).find('option:selected').text()
            },
            setting = {};

        setting.type = 'post';
        setting.contentType = 'Application/json; charset=utf-8';
        setting.data = JSON.stringify(target);
        setting.dataType = 'json';
        setting.url = 'Map.aspx/changeProject';
        setting.success = function (res) {
            let ans = res.hasOwnProperty('d') ? res.d : res;
            if (!ans.isOk) {
                location.reload()
            } else {
                alert('執行發生錯誤，請刷新頁面');
            }
        };
        setting.error = function (err) {
            console.error(err);
        };

        $.ajax(setting);
    })
};

/* ================================================================================== */

$(document).ready(function () {
    config.load();
});