using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// returnChartData 的摘要描述
/// </summary>
public class returnChartData
{
    public bool isOk { get; set; }
    public string Message { get; set; }
    public string Picture { get; set; }
    public List<DrawData> ChartData { get; set; }
    public returnChartData()
    {

    }
}