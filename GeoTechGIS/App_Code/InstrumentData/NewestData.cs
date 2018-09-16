using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// NewestData 的摘要描述
/// </summary>
public class NewestData
{
    public int PointIdx { get; set; }
    //0: 正常工作 1: 尚未測量 2.失效 3. 尚未安裝
    public int DeviceStatus { get; set; }
    //0: 正常 1: Alert 2:Alarm 3:Action。取得數值之後做判斷
    public int ValueStatus { get; set; }
    public string GageType { get; set; }
    public string PointNo { get; set; }
    public string Area { get; set; }
    public string Station { get; set; }
    public string Date { get; set; }
    public string Unit { get; set; }
    public string Sensor { get; set; }
    public string GageDescription { get; set; }
    public double MinusAlert { get; set; }
    public double MinusAlarm { get; set; }
    public double MinusAction { get; set; }
    public double PlusAlert { get; set; }
    public double PlusAlarm { get; set; }
    public double PlusAction { get; set; }
    public double Value { get; set; }
    public double Value2 { get; set; }
    public double Value3 { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public bool hasLatLng { get; set; }
    //儀器副稱
    public string Legend { get; set; }
    public NewestData()
    {}

    public NewestData(int pointidx, int devicestats, int valuestats, string gagetype, string pointno, string area, string station,
        string date, string unit, string sensor, string gagedescription, double minusalert, double minusalarm, double minusaction,
        double plusalert, double plusalarm, double plusaction, double value, double value2, double value3, double latitude, double longitude, bool haslatlng, string legend)
    {
        this.PointIdx = pointidx;
        this.DeviceStatus = devicestats;
        this.ValueStatus = valuestats;
        this.GageType = gagetype;
        this.PointNo = pointno;
        this.Area = area;
        this.Station = station;
        this.Date = date;
        this.Unit = unit;
        this.Sensor = sensor;
        this.GageDescription = gagedescription;
        this.MinusAlert = minusalert;
        this.MinusAlarm = minusalarm;
        this.MinusAction = minusaction;
        this.PlusAlarm = plusalarm;
        this.PlusAlert = plusalert;
        this.Value = value;
        this.Value2 = value2;
        this.Value3 = value3;
        this.Latitude = latitude;
        this.Longitude = longitude;
        this.hasLatLng = haslatlng;
        this.PlusAction = plusaction;
        this.Legend = legend;
    }

}