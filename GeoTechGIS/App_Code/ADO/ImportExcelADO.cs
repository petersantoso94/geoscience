using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data.SqlClient;
using System.Data;
using Newtonsoft.Json;


/// <summary>
/// LoginADO 的摘要描述
/// </summary>
public class ImportExcelADO
{
    private readonly string config = ConfigurationManager.AppSettings["Address"] + "localhost;" +
                                     ConfigurationManager.AppSettings["CO2"] +
                                     ConfigurationManager.AppSettings["BaseAccPwd"];

    private SqlConnection con = null;
    private SqlCommand cmd = null;
    private SqlDataReader read = null;
    private SqlDataAdapter adapter = null;
    HttpContext context;

    public ImportExcelADO()
    {
        con = new SqlConnection(config);
        cmd = new SqlCommand("", con);
        context = HttpContext.Current;
    }

    //判斷帳戶 並且登入帳號相關資訊儲存在Session
    public bool InsertData(InstrumentView data)
    {
        bool isOk = false;

        cmd.CommandText = "INSERT INTO LastData VALUES"+
           "('"+data.PointIdx+"'"+
           ", '"+ data.PointNo +"'"+
           ", '"+ data.GageDescription +"'"+
           ", '"+ data.Area +"'"+
           ", '"+ data.Station +"'"+
           ", '"+ data.GageType+"'"+
           ", '"+ data.Unit+"'"+
           ", '"+ data.Sensor+"'"+
           ", '"+ data.Date+"'"+
           ", '"+ data.Value+"'"+
           ", '"+ data.Value2+"'"+
           ", '"+ data.Value3+"'"+
           ", '"+ data.Lat+"'"+
           ", '"+ data.Lng+"'"+
           ", '"+ data.hasLatLng+"'"+
           ", '"+ data.PlusAlert+"'"+
           ", '"+ data.PlusAlarm+"'"+
           ", '"+ data.PlusAction+"'"+
           ", '"+ data.MinusAlert+"'"+
           ", '"+ data.MinusAlarm+"'"+
           ", '"+ data.MinusAction+"'"+
           ", '"+ data.ValueStatus+"'"+
           ", '"+ data.DeviceStatus+"'"+
           ", '"+ data.LanguageID+"'"+
           ", '"+ data.GageTypeForLegend+"')";
        con.Open();
        read = cmd.ExecuteReader();
        isOk = read.HasRows ? true : isOk;
        read.Close();
        con.Close();
        return isOk;
    }
    
}