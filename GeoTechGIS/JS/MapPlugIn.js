'user strict'
// dataTable預設值 有資料 412 沒資料 448
//Action Table 建立實體物件
var AAAActionTable = $('#ActionTable').DataTable({
    scrollY: "448px",
    scrollCollapse: false,
    //scrollX: false,
    columnDefs: [{
        className: 'dt-center',
        targets: '_all'
    }],
    bAutoWidth: true,
    pageLength: 11
});

//Alarm Table 建立實體物件
var AAAAlarmTable = $('#AlarmTable').DataTable({
    scrollY: "448px",
    scrollCollapse: false,
    //scrollX: false,
    columnDefs: [{
        className: 'dt-center',
        targets: '_all'
    }],
    bAutoWidth: true,
    pageLength: 11
});

//Alert Table 建立實體物件
var AAAAlertTable = $('#AlertTable').DataTable({
    scrollY: "448px",
    scrollCollapse: false,
    //scrollX: false,
    columnDefs: [{
        className: 'dt-center',
        targets: '_all'
    }],
    bAutoWidth: true,
    pageLength: 11
});


//調整寬度
$('a[data-toggle="tab"]').on('shown.bs.tab', function () {
    $('#AlarmTable').css('width', '100%').dataTable().fnAdjustColumnSizing();
    $('#ActionTable').css('width', '100%').dataTable().fnAdjustColumnSizing();
    $('#AlertTable').css('width', '100%').dataTable().fnAdjustColumnSizing();
});

//當視窗大小變化 咼度調整
$(window).on('resize', function () {
    $('#AlarmTable').css('width', '100%').dataTable().fnAdjustColumnSizing();
    $('#ActionTable').css('width', '100%').dataTable().fnAdjustColumnSizing();
    $('#AlertTable').css('width', '100%').dataTable().fnAdjustColumnSizing();
});

/*============================================ 日期 ============================================*/
var nowDate = new Date();
// var FromDate = new Date(nowDate.getFullYear(), nowDate.getMonth() - 1, nowDate.getDate()); // 往前1個月


var FromDate = $('#fromDate').datepicker({
    dateFormat: 'yy/mm/dd',
    autoSize: true,
    changeMonth: true,
    changeYear: true,
    showOtherMonths: true,
    //selectOtherMonths: true,
    showMonthAfterYear: true
});
// .on('change', function () {
//     ToDateForMapChart.datepicker("option", "minDate", getDate(this));
// }).datepicker('setDate', FromDate);

var ToDate = $('#toDate').datepicker({
    dateFormat: 'yy/mm/dd',
    autoSize: true,
    changeMonth: true,
    changeYear: true,
    showOtherMonths: true,
    //selectOtherMonths: true,
    showMonthAfterYear: true,
});