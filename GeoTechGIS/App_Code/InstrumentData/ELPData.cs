using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// NewestData 的摘要描述
/// </summary>
public class ELPData
{
    public string Date { get; set; }
    //0: 正常工作 1: 尚未測量 2.失效 3. 尚未安裝
    public string PointNo { get; set; }
    //0: 正常 1: Alert 2:Alarm 3:Action。取得數值之後做判斷
    public string MeaNo { get; set; }
    public string Read1 { get; set; }
    public string Read2 { get; set; }
    public string Read3 { get; set; }
    public string Value { get; set; }
    public string Initial { get; set; }
    public string Normal { get; set; }
    public string ReM { get; set; }
    public string Sensor { get; set; }
    public ELPData()
    {}

    public ELPData(string date, string pointNo, string meaNo, string read1, string read2, string read3, string value, string initial, string normal, string reM, string sensor)
    {
        Date = date;
        PointNo = pointNo;
        MeaNo = meaNo;
        Read1 = read1;
        Read2 = read2;
        Read3 = read3;
        Value = value;
        Initial = initial;
        Normal = normal;
        ReM = reM;
        Sensor = sensor;
    }
}