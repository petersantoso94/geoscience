using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using System.Configuration;
using System.IO;
using System.Text;
/// <summary>
/// ChartDataADO 的摘要描述
/// </summary>
public class ChartDataADO
{
    private string config = "";
    private SqlConnection con;
    private SqlCommand cmd;
    private SqlDataAdapter adapter;
    private string startTime = "";
    private string EndTime = "";
    public ChartDataADO()
    { }

    public ChartDataADO(string databaseName)
    {
        config = ConfigurationManager.AppSettings["Address"] + "localhost;" +
                 ConfigurationManager.AppSettings["DataBaseName"] + databaseName + ";" +
                 ConfigurationManager.AppSettings["BaseAccPwd"];
        con = new SqlConnection(config);
        cmd = new SqlCommand("", con);
    }

    //get Picture from DB
    public string GetPictureToDraw(string PointNo)
    {
        string result = "no-image-available.png";
        DataTable table = new DataTable();
        cmd.CommandText = "SELECT PictureLoc " +
                              "FROM Picture " +
                              "WHERE (PointNo = '" + PointNo + "') ";
        adapter = new SqlDataAdapter(cmd);
        adapter.Fill(table);

        if (table.Rows.Count > 0)
        {
            DataRow row = table.Rows[0];

            result = row["PictureLoc"].ToString();
        }
        else
        {
            return "no-image-available.png";
        }
        return result;
    }

    //MRT取得固定時間區塊start
    public List<DrawData> GetGeoMRTStableIntervalToDraw(string PointNo, string GageType, int StableTime)
    {
        List<DrawData> list = new List<DrawData>();
        DataTable table = new DataTable();
        string Today = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        string StartDay = this.GetStableTime(StableTime);

        if (GageType.Equals("SP"))
        {
            cmd.CommandText = "SELECT Date, Settle AS Value " +
                              "FROM " + GageType + " " +
                              "WHERE (PointNo = '" + PointNo + "') " +
                              "AND (Date BETWEEN '" + StartDay + "' AND '" + Today + "')" +
                              "ORDER BY Date, PointNo";
        }
        else if (GageType.Equals("TD"))
        {
            return new List<DrawData>();
        }
        else if (GageType.Equals("SID"))
        {
            return new List<DrawData>();
        }
        else
        {
            cmd.CommandText = "SELECT Date, Value " +
                              "FROM " + GageType + " " +
                              "WHERE (PointNo = '" + PointNo + "') " +
                              "AND (Date BETWEEN '" + StartDay + "' AND '" + Today + "')" +
                              "ORDER BY Date, PointNo";
        }
        //System.Diagnostics.Debug.WriteLine(cmd.CommandText);
        adapter = new SqlDataAdapter(cmd);
        adapter.Fill(table);
        list = this.GetDateValue(table);

        return list;
    }

    //MRT取得自訂區塊時間start
    public List<DrawData> GetGeoMRTSelectedIntervalToDraw(string PointNo, string GageType, string StartDate, string EndDate)
    {
        List<DrawData> list = new List<DrawData>();
        DataTable tempTable = new DataTable();

        //StartDate += " 00:00:00";
        //EndDate += " 00:00:00";

        if (GageType.Equals("SP"))
        {
            cmd.CommandText = "SELECT Date, Settle AS Value " +
                              "FROM " + GageType + " " +
                              "WHERE (PointNo = '" + PointNo + "') " +
                              "AND (Date BETWEEN '" + StartDate + "' AND '" + EndDate + "')" +
                              "ORDER BY Date, PointNo";
        }
        else if (GageType.Equals("TD"))
        {
            return new List<DrawData>();
        }
        else if (GageType.Equals("SID"))
        {
            return new List<DrawData>();
        }
        else
        {
            cmd.CommandText = "SELECT Date, Value " +
                              "FROM " + GageType + " " +
                              "WHERE (PointNo = '" + PointNo + "') " +
                              "AND (Date BETWEEN '" + StartDate + "' AND '" + EndDate + "')" +
                              "ORDER BY Date, PointNo";
        }

        adapter = new SqlDataAdapter(cmd);
        adapter.Fill(tempTable);
        list = this.GetDateValue(tempTable);

        return list;
    }

    //Auto取得固定時間區塊START
    public List<DrawData> GetGeoAutoStableIntervalToDraw(int PointIdx, string GageType, int StableTime)
    {
        List<DrawData> list = new List<DrawData>();
        DataTable table = new DataTable();
        string Today = DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss");
        string StartDay = this.GetStableTime(StableTime);
        //一般版本
        //cmd.CommandText = "SELECT ListData.Date, Data.Value " +
        //        "FROM ListData  INNER JOIN Data ON ListData.MeaNo = Data.MeaNo " +
        //        "WHERE(Data.PointIdx = '" + PointIdx + "') " +
        //        "AND (ListData .Date BETWEEN '" + StartDay + "' AND '" + Today + "')" +
        //        "ORDER BY ListData .Date";

        //縮短版
        cmd.CommandText = "SELECT ListDataShorten.Date, DataShorten.Value " +
                 "FROM ListDataShorten INNER JOIN DataShorten ON ListDataShorten.MeaNo = DataShorten.MeaNo " +
                 "WHERE(DataShorten.PointIdx = '" + PointIdx + "') " +
                 "AND (ListDataShorten.Date BETWEEN '" + StartDay + "' AND '" + Today + "')" +
                 "ORDER BY ListDataShorten.Date";
        adapter = new SqlDataAdapter(cmd);
        adapter.Fill(table);

        foreach(DataRow item in table.Rows){
            DrawData temp = new DrawData();
            temp.Value = item["Value"].ToString() == "" ? -99999 : Convert.ToDouble(item["Value"]);
            temp.Date = Convert.ToDateTime(item["Date"]).ToString("yyyy/MM/dd HH:mm:ss");
            list.Add(temp);
        }

        return list;
    }

    //Auto取得自選時間區塊START
    public List<DrawData> GetGeoAutoSelectedIntervalToDraw(int PointIdx,string GageType,string StartDate,string EndDate) 
    {
        List<DrawData> list = new List<DrawData>();
        DataTable table = new DataTable();

        //StartDate += " 00:00:00";
        //EndDate += " 00:00:00";

        //一般版本
        //cmd.CommandText = "SELECT ListData.Date, Data.Value " +
        //        "FROM ListData  INNER JOIN Data ON ListData.MeaNo = Data.MeaNo " +
        //        "WHERE(Data.PointIdx = '" + PointIdx + "') " +
        //        "AND (ListData .Date BETWEEN '" + StartDate + "' AND '" + EndDate + "')" +
        //        "ORDER BY ListData .Date";

        //縮短版
        cmd.CommandText = "SELECT ListDataShorten.Date, DataShorten.Value " +
                 "FROM ListDataShorten INNER JOIN DataShorten ON ListDataShorten.MeaNo = DataShorten.MeaNo " +
                 "WHERE(DataShorten.PointIdx = '" + PointIdx + "') " +
                 "AND (ListDataShorten.Date BETWEEN '" + StartDate + "' AND '" + EndDate + "')" +
                 "ORDER BY ListDataShorten.Date";
        adapter = new SqlDataAdapter(cmd);
        adapter.Fill(table);

        foreach(DataRow item in table.Rows)
        {
            DrawData temp = new DrawData();
            temp.Value = item["Value"].ToString() == "" ? -99999:Convert.ToDouble(item["Value"]);
            temp.Date = Convert.ToDateTime(item["Date"]).ToString("yyyy/MM/dd HH:mm:ss");
            list.Add(temp);
        }

        return list;
    }

    //將讀值存到列表start
    private List<DrawData> GetDateValue(DataTable valueTable)
    {
        List<DrawData> list = new List<DrawData>();

        foreach (DataRow item in valueTable.Rows)
        {
            DrawData temp = new DrawData();
            temp.Date = Convert.ToDateTime(item["Date"]).ToString("yyyy/MM/dd HH:mm");
            temp.Value = item["Value"].ToString() == "" ? -99999 : Convert.ToDouble(item["Value"]);
            list.Add(temp);
        }
        return list;
    }

    //固定時間週期設定 start
    private string GetStableTime(int stableTime)
    {
        string Date = "";
        switch (stableTime)
        {
            case 0:
                Date = DateTime.Now.AddYears(-99).ToString("yyyy-MM-dd HH:mm:ss");
                break;
            case 1:
                Date = DateTime.Now.AddYears(-1).ToString("yyyy-MM-dd HH:mm:ss");
                break;
            case 2:
                Date = DateTime.Now.AddMonths(-2).ToString("yyyy-MM-dd HH:mm:ss");
                break;
            case 3:
                Date = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd HH:mm:ss");
                break;
            case 4:
                Date = DateTime.Now.AddDays(-7).ToString("yyyy-MM-dd HH:mm:ss");
                break;
        }
        return Date;
    }


}