using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// User 的摘要描述
/// </summary>
public class InstrumentView
{
    public int PointIdx { get; set; }
    public string PointNo { get; set; }
    public string GageDescription { get; set; }
    public string Area { get; set; }
    public string Date { get; set; }
    public string Station { get; set; }
    public string GageType { get; set; }
    public string Unit { get; set; }
    public string Sensor { get; set; }
    public float Value { get; set; }
    public float Value2 { get; set; }
    public float Value3 { get; set; }
    public float Lat { get; set; }
    public float Lng { get; set; }
    public float PlusAlert { get; set; }
    public float PlusAlarm { get; set; }
    public float PlusAction { get; set; }
    public byte hasLatLng { get; set; }
        public float MinusAlert { get; set; }
    public float MinusAlarm { get; set; }

    public float MinusAction { get; set; }
    public int ValueStatus { get; set; }
    public int DeviceStatus { get; set; }
    public int LanguageID { get; set; }
    public int GageTypeForLegend { get; set; }
    public InstrumentView()
    { }
}