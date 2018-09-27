using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;

/// <summary>
/// ADONewestData 的摘要描述 
/// 專門連接最新資料和 歷時資料
/// </summary>
public class ProjectDataADO
{
    private string config = "";

    private SqlConnection con;
    private SqlCommand cmd;
    private SqlDataAdapter adapter;

    public ProjectDataADO(string databaseName)
    {
        config = ConfigurationManager.AppSettings["Address"] + "localhost;" +
                 ConfigurationManager.AppSettings["DataBaseName"] + databaseName + ";" +
                 ConfigurationManager.AppSettings["BaseAccPwd"];
        con = new SqlConnection(config);
        cmd = new SqlCommand("", con);
    }

    //elp data
    public List<ELPData> GetELPData()
    {
        List<ELPData> list = new List<ELPData>();
        DataTable DataList = new DataTable();

        cmd.CommandText = "SELECT * FROM ELP";
        adapter = new SqlDataAdapter(cmd);
        adapter.Fill(DataList);

        foreach (DataRow item in DataList.Rows)
        {
            ELPData data = new ELPData();
            data.PointNo = item["PointNo"].ToString();
            data.Date = item["Date"].ToString();
            data.MeaNo = item["MeaNo"].ToString();
            data.Read1 = (item["Read1"]).ToString();
            data.Read2 = (item["Read2"]).ToString();
            data.Read3 = (item["Read3"]).ToString();
            data.Value = (item["Value"]).ToString();
            data.Initial = (item["Initial"]).ToString();
            data.Normal = (item["Normal"]).ToString();
            data.ReM = item["ReM"].ToString();
            data.Sensor = item["Sensor"].ToString();
            list.Add(data);
        }

        return list;
    }

    //pos data
    public List<PosData> GetPosData()
    {
        List<PosData> list = new List<PosData>();
        DataTable DataList = new DataTable();

        cmd.CommandText = "SELECT * FROM PosELP";
        adapter = new SqlDataAdapter(cmd);
        adapter.Fill(DataList);

        foreach (DataRow item in DataList.Rows)
        {
            PosData data = new PosData();
            data.PointNo = item["PointNo"].ToString();
            data.Station = item["Station"].ToString();
            data.Area = item["Area"].ToString();
            data.Factor1 = (item["Factor1"]).ToString();
            data.Factor2 = (item["Factor2"]).ToString();
            data.Factor3 = (item["Factor3"]).ToString();
            data.IniRead1 = (item["IniRead1"]).ToString();
            data.IniRead2 = (item["IniRead2"]).ToString();
            data.IniRead3 = (item["IniRead3"]).ToString();
            data.InsDate = item["InsDate"].ToString();
            data.IniDate = item["IniDate"].ToString();
            data.Alert = (item["Alert"]).ToString();
            data.Alarm = (item["Alarm"]).ToString();
            data.Action = (item["Action"]).ToString();
            data.Rem1 = item["Rem1"].ToString();
            data.Rem2 = item["Rem2"].ToString();
            data.Rem3 = item["Rem3"].ToString();
            list.Add(data);
        }

        return list;
    }

    //phone book data
    public List<PhoneBookData> GetPhoneBookData()
    {
        List<PhoneBookData> list = new List<PhoneBookData>();
        DataTable DataList = new DataTable();

        cmd.CommandText = "SELECT * FROM PhoneBookSMS";
        adapter = new SqlDataAdapter(cmd);
        adapter.Fill(DataList);

        foreach (DataRow item in DataList.Rows)
        {
            PhoneBookData data = new PhoneBookData();
            data.No = Convert.ToInt32(item["No"]);
            data.Name = item["Name"].ToString();
            data.MobileNo = item["MobileNo"].ToString();
            data.Alert = (item["Alert Selected"]).ToString();
            data.Alert1 = (item["Alarm1 Selected"]).ToString();
            data.Alert2 = (item["Alarm2 Selected"]).ToString();
            data.WorkSuspension = (item["Work Suspension Selected"]).ToString();
            data.Fail = (item["Fail Selected"]).ToString();
            data.Email = (item["Email"]).ToString();
            list.Add(data);
        }

        return list;
    }

    //GeoAuto & GeoMRT 都可以使用
    public List<NewestData> GetGeoAutoMRTDataNewestData()
    {
        List<NewestData> list = new List<NewestData>();
        DataTable DataList = new DataTable();

        cmd.CommandText = "SELECT * FROM LastData WHERE (LanguageID = '0')";
        adapter = new SqlDataAdapter(cmd);
        adapter.Fill(DataList);

        foreach (DataRow item in DataList.Rows)
        {
            NewestData data = new NewestData();
            data.PointIdx = Convert.ToInt32(item["PointIdx"]);
            data.PointNo = item["PointNo"].ToString();
            data.Date = Convert.ToDateTime(item["Date"]).ToString("yyyy/MM/dd HH:mm");
            data.Area = item["Area"].ToString();
            data.Station = item["Station"].ToString();
            data.Sensor = item["Sensor"].ToString();
            data.Unit = item["Unit"].ToString();
            data.Value = Math.Round(Convert.ToDouble(item["Value"]), 4);
            data.Value2 = Math.Round(Convert.ToDouble(item["Value2"]), 4);
            data.Value3 = Math.Round(Convert.ToDouble(item["Value3"]), 4);
            data.ValueStatus = Convert.ToInt32(item["ValueStatus"]);
            data.DeviceStatus = Convert.ToInt32(item["DeviceStatus"]);
            data.GageType = item["GageType"].ToString();
            data.hasLatLng = Convert.ToBoolean(item["hasLatLng"]);
            data.Latitude = Math.Round(Convert.ToDouble(item["Lat"]), 8);
            data.Longitude = Math.Round(Convert.ToDouble(item["Lng"]), 8);
            data.MinusAction = Math.Round(Convert.ToDouble(item["MinusAction"]), 2);
            data.PlusAction = Math.Round(Convert.ToDouble(item["PlusAction"]), 2);
            data.MinusAlarm = Math.Round(Convert.ToDouble(item["MinusAlarm"]), 2);
            data.PlusAlarm = Math.Round(Convert.ToDouble(item["PlusAlarm"]), 2);
            data.MinusAlert = Math.Round(Convert.ToDouble(item["MinusAlert"]), 2);
            data.PlusAlert = Math.Round(Convert.ToDouble(item["MinusAlert"]), 2);
            data.Legend = item["GageTypeForLegend"].ToString();
            data.GageDescription = item["GageDescription"].ToString();
            list.Add(data);
        }

        return list;
    }

    //GeoAuto 的有安裝儀器的基本資訊
    public List<GageTypeInfomation> GetGeoAutoInstructmentInfo()
    {
        List<GageTypeInfomation> list = new List<GageTypeInfomation>();
        DataTable table = new DataTable();

        cmd.CommandText = "SELECT GageType, GageDescription, UnitValue AS Unit FROM DefineGageType WHERE(LanguageID = '0')";
        adapter = new SqlDataAdapter(cmd);
        adapter.Fill(table);

        foreach (DataRow item in table.Rows)
        {
            GageTypeInfomation info = new GageTypeInfomation();
            info.GageType = item["GageType"].ToString();
            info.Description = item["GageDescription"].ToString();
            info.Unit = item["Unit"].ToString();
            list.Add(info);
        }

        return list;
    }

    //GeoMRT的有安裝儀器的基本資訊
    public List<GageTypeInfomation> GetGeoMRTInstructmentInfo()
    {
        List<GageTypeInfomation> list = new List<GageTypeInfomation>();
        DataTable table = new DataTable();

        cmd.CommandText = "SELECT GageType, GageDescription, Unit FROM DefineText WHERE(LanguageID = '0')";
        adapter = new SqlDataAdapter(cmd);
        adapter.Fill(table);

        foreach (DataRow item in table.Rows)
        {
            GageTypeInfomation info = new GageTypeInfomation();
            info.GageType = item["GageType"].ToString();
            info.Description = item["GageDescription"].ToString();
            info.Unit = item["Unit"].ToString();
            list.Add(info);
        }

        return list;
    }


}