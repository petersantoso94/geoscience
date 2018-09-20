'user strict'
//Data 頁面的套件
var forFileNowDate = new Date();
var fileName = '' + forFileNowDate.getFullYear() +
    (forFileNowDate.getMonth() + 1) +
    forFileNowDate.getDate() +
    forFileNowDate.getHours() +
    forFileNowDate.getMinutes()
//DataTable
var ValueTable = $('#valueTable').DataTable({
    'scrollY': '390px',
    'scrollCollapse': false,
    // 'scrollX': false,
    'columnDefs': [{
        'className': 'dt-center',
        'targets': '_all'
    }],
    'bAutoWidth': true,
    "pageLength": 10,
    dom: 'Bfrtip',
    buttons: [{
        extend: 'excelHtml5',
        title: fileName
    },
    {
        extend: 'pdfHtml5',
        title: fileName
    },
    {
        extend: 'csvHtml5',
        title: fileName
    }
    ]
});

//調整寬度
$('a[data-toggle="tab"]').on('shown.bs.tab', function () {
    $('#valueTable').css('width', '100%').dataTable().fnAdjustColumnSizing();
});

//當視窗大小變化 咼度調整
$(window).on('resize', function () {
    $('#valueTable').css('width', '100%').dataTable().fnAdjustColumnSizing();
});

/*================================================================================*/

var nowDate = new Date();
var FromDate = new Date(nowDate.getFullYear(), nowDate.getMonth() - 1, nowDate.getDate()); // 往前1個月


//DatePicker
var FromDateChart = $('#FromDate').datepicker({
    dateFormat: 'yy/mm/dd',
    autoSize: true,
    changeMonth: true,
    changeYear: true,
    showOtherMonths: true,
    //selectOtherMonths: true,
    showMonthAfterYear: true
});
// .on('change', function () {
//     ToDateForData.datepicker('option', 'minDate', getDate(this));
// }).datepicker('setDate', FromDate);

var ToDateChart = $('#ToDate').datepicker({
    dateFormat: 'yy/mm/dd',
    autoSize: true,
    changeMonth: true,
    changeYear: true,
    showOtherMonths: true,
    //selectOtherMonths: true,
    showMonthAfterYear: true,
});
// .datepicker('setDate', nowDate);

var downloadFromDate = $('#DownloadFromDate').datepicker({
    dateFormat: 'yy/mm/dd',
    autoSize: true,
    changeMonth: true,
    changeYear: true,
    showOtherMonths: true,
    //selectOtherMonths: true,
    showMonthAfterYear: true
}).on('change', function () {
    downloadToDate.datepicker('option', 'minDate', getDate(this))
}).datepicker('setDate', FromDate);

var downloadToDate = $('#DownloadToDate').datepicker({
    dateFormat: 'yy/mm/dd',
    autoSize: true,
    changeMonth: true,
    changeYear: true,
    showOtherMonths: true,
    //selectOtherMonths: true,
    showMonthAfterYear: true,
    minDate: FromDate
}).datepicker('setDate', nowDate);

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