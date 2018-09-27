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
public class PostDataADO
{
    private readonly string config = ConfigurationManager.AppSettings["Address"] + "localhost;" +
                                     ConfigurationManager.AppSettings["CO2"] +
                                     ConfigurationManager.AppSettings["BaseAccPwd"];

    private SqlConnection con = null;
    private SqlCommand cmd = null;
    private SqlDataReader read = null;
    private SqlDataAdapter adapter = null;
    HttpContext context;

    public PostDataADO()
    {
        con = new SqlConnection(config);
        cmd = new SqlCommand("", con);
        context = HttpContext.Current;
    }

    public bool UpdateDataPos(PosData data)
    {
        bool isOk = false;

        cmd.CommandText = "UPDATE PosELP " +
   "SET [Station] = '" + data.Station +
      "',[Area] = '" + data.Area +
      "',[Factor1] = '" + data.Factor1 +
      "',[Factor2] = '" + data.Factor2 +
      "',[Factor3] = '" + data.Factor3 +
      "',[IniRead1] = '" + data.IniRead1 +
      "',[IniRead2] = '" + data.IniRead2 +
      "',[IniRead3] = '" + data.IniRead3 +
      "',[InsDate] = '" + data.InsDate +
      "',[IniDate] = '" + data.IniDate +
      "',[Alert] = '" + data.Alert +
      "',[Alarm] = '" + data.Alarm +
      "',[Action] = '" + data.Action +
      "',[ReM1] = '" + data.Rem1 +
      "',[ReM2] = '" + data.Rem2 +
      "',[ReM3] = '" + data.Rem3 +
      "' WHERE [PointNo] = '" + data.PointNo + "'";

        con.Open();
        read = cmd.ExecuteReader();
        isOk = read.HasRows ? true : isOk;
        read.Close();
        con.Close();
        return isOk;
    }

    public bool InsertDataPos(PosData data)
    {
        bool isOk = false;

        cmd.CommandText = "INSERT INTO PosELP VALUES('" +
            data.PointNo + "'" +
   ",'" + data.Station +
      "', '" + data.Area +
      "', '" + data.Factor1 +
      "', '" + data.Factor2 +
      "', '" + data.Factor3 + "', NULL, NULL, NULL"+
      ", '" + data.IniRead1 +
      "', '" + data.IniRead2 +
      "', '" + data.IniRead3 +
      "', '" + data.InsDate +
      "', '" + data.IniDate +
      "', '" + data.Alert +
      "', '" + data.Alarm +
      "', '" + data.Action +
      "', '" + data.Rem1 +
      "', '" + data.Rem2 +
      "', '" + data.Rem3 +
      "',NULL)";

        con.Open();
        read = cmd.ExecuteReader();
        isOk = read.HasRows ? true : isOk;
        read.Close();
        con.Close();
        return isOk;
    }

    public bool DeleteDataPos(string no)
    {
        bool isOk = false;

        cmd.CommandText = "DELETE FROM PosELP WHERE PointNo = '" + no + "'";
        con.Open();
        read = cmd.ExecuteReader();
        isOk = read.HasRows ? true : isOk;
        read.Close();
        con.Close();
        return isOk;
    }

    public bool UpdateDataPhonebook(PhoneBookData data)
    {
        bool isOk = false;

        cmd.CommandText = "UPDATE PhoneBookSMS SET " +
           "Name = '" + data.Name + "'" +
           ",MobileNo= '" + data.MobileNo + "'" +
           ",[Alert Selected] = '" + data.Alert + "'" +
           ",[Alarm1 Selected] = '" + data.Alert1 + "'" +
           ",[Alarm2 Selected] = '" + data.Alert2 + "'" +
           ",[Work Suspension Selected] = '" + data.WorkSuspension + "'" +
           ",[Fail Selected] =  '" + data.Fail + "',Email = '"+data.Email+"' WHERE No = '" + data.No + "'";
        con.Open();
        read = cmd.ExecuteReader();
        isOk = read.HasRows ? true : isOk;
        read.Close();
        con.Close();
        return isOk;
    }

    public bool InsertDataPhonebook(PhoneBookData data)
    {
        bool isOk = false;
        int numberID = 1;
        DataTable DataList = new DataTable();
        cmd.CommandText = "SELECT TOP 1 No FROM PhoneBookSMS ORDER BY No DESC";
        adapter = new SqlDataAdapter(cmd);
        adapter.Fill(DataList);

        foreach (DataRow item in DataList.Rows)
        {
            numberID = Convert.ToInt32(item["No"]);
        }
        numberID++;
        cmd.CommandText = "INSERT INTO PhoneBookSMS VALUES" +
       "('" + numberID + "', '" + data.Name + "'" +
       ", '" + data.MobileNo + "'" +
       ", '" + data.Alert + "'" +
       ", '" + data.Alert1 + "'" +
       ", '" + data.Alert2 + "'" +
       ", '" + data.WorkSuspension + "'" +
       ", '" + data.Fail + "', '" + data.Email + "')";
        con.Open();
        read = cmd.ExecuteReader();
        isOk = read.HasRows ? true : isOk;
        read.Close();
        con.Close();
        return isOk;
    }

    public bool DeleteDataPhonebook(string no)
    {
        bool isOk = false;

        cmd.CommandText = "DELETE FROM PhoneBookSMS WHERE No = '" + no + "'";
        con.Open();
        read = cmd.ExecuteReader();
        isOk = read.HasRows ? true : isOk;
        read.Close();
        con.Close();
        return isOk;
    }

    //判斷帳戶 並且登入帳號相關資訊儲存在Session
    public bool InsertData(InstrumentView data)
    {
        bool isOk = false;

        cmd.CommandText = "INSERT INTO LastData VALUES" +
           "('" + data.PointIdx + "'" +
           ", '" + data.PointNo + "'" +
           ", '" + data.GageDescription + "'" +
           ", '" + data.Area + "'" +
           ", '" + data.Station + "'" +
           ", '" + data.GageType + "'" +
           ", '" + data.Unit + "'" +
           ", '" + data.Sensor + "'" +
           ", '" + data.Date + "'" +
           ", '" + data.Value + "'" +
           ", '" + data.Value2 + "'" +
           ", '" + data.Value3 + "'" +
           ", '" + data.Lat + "'" +
           ", '" + data.Lng + "'" +
           ", '" + data.hasLatLng + "'" +
           ", '" + data.PlusAlert + "'" +
           ", '" + data.PlusAlarm + "'" +
           ", '" + data.PlusAction + "'" +
           ", '" + data.MinusAlert + "'" +
           ", '" + data.MinusAlarm + "'" +
           ", '" + data.MinusAction + "'" +
           ", '" + data.ValueStatus + "'" +
           ", '" + data.DeviceStatus + "'" +
           ", '" + data.LanguageID + "'" +
           ", '" + data.GageTypeForLegend + "')";
        con.Open();
        read = cmd.ExecuteReader();
        isOk = read.HasRows ? true : isOk;
        read.Close();
        con.Close();
        return isOk;
    }

}