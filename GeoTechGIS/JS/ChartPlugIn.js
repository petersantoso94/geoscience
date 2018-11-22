'user strict'


var nowDate = new Date();
var FromDate = new Date(nowDate.getFullYear(), nowDate.getMonth() - 1, nowDate.getDate()); // 往前1個月

var chartFromDate = $('#chartFromDate').datetimepicker({
    format: 'Y/m/d h:m:s',
});

var chartToDate = $('#chartToDate').datetimepicker({
    format: 'Y/m/d h:m:s',
});

var dateFormat = 'yy/mm/dd';

function getDate(element) {
    let data;
    try {
        data = $.datepicker.parseDate(dateFormat, element.value);
    } catch (error) {
        data = null;
    }
    return data;
}

//Alarm Table 建立實體物件
var valueTable = $('#AlarmTable').DataTable({
    scrollY: "448px",
    scrollCollapse: false,
    //scrollX: false,
    columnDefs: [{
        className: 'dt-center',
        targets: '_all'
    }],
    bAutoWidth: true,
    // pageLength: 12
});

//調整寬度
$('a[data-toggle="tab"]').on('shown.bs.tab', function () {
    $('#MultipleDataList').css('width', '100%').dataTable().fnAdjustColumnSizing();
});

//當視窗大小變化 咼度調整
$(window).on('resize', function () {
    if ($.fn.DataTable.isDataTable('#MultipleDataList')) {
        $('#MultipleDataList').css('width', '100%').dataTable().fnAdjustColumnSizing();
    }
});