using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// NewestData 的摘要描述
/// </summary>
public class PosData
{
    public string PointNo { get; set; }
    //0: 正常工作 1: 尚未測量 2.失效 3. 尚未安裝
    public string Station { get; set; }
    //0: 正常 1: Alert 2:Alarm 3:Action。取得數值之後做判斷
    public string Area { get; set; }
    public float Factor1 { get; set; }
    public float Factor2 { get; set; }
    public float Factor3 { get; set; }
    public float IniRead1 { get; set; }
    public float IniRead2 { get; set; }
    public float IniRead3 { get; set; }
    public string InsDate { get; set; }
    public string IniDate { get; set; }
    public float Alert { get; set; }
    public float Alarm { get; set; }
    public float Action { get; set; }
    public string Rem1 { get; set; }
    public string Rem2 { get; set; }
    public string Rem3 { get; set; }
    public PosData()
    {}

    public PosData(string pointNo, string station, string area, float factor1, float factor2, float factor3, float iniRead1, float iniRead2, float iniRead3, string insDate, string iniDate, float alert, float alarm, float action, string rem1, string rem2, string rem3)
    {
        PointNo = pointNo;
        Station = station;
        Area = area;
        Factor1 = factor1;
        Factor2 = factor2;
        Factor3 = factor3;
        IniRead1 = iniRead1;
        IniRead2 = iniRead2;
        IniRead3 = iniRead3;
        InsDate = insDate;
        IniDate = iniDate;
        Alert = alert;
        Alarm = alarm;
        Action = action;
        Rem1 = rem1;
        Rem2 = rem2;
        Rem3 = rem3;
    }
}