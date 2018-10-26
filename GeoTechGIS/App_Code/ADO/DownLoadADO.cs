using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Text;
using Ionic.Zip;
using System.Configuration;

/// <summary>
/// DownLoadADO 的摘要描述
/// </summary>
public class DownLoadADO
{
    private string config = "";
    private SqlConnection con;
    private SqlCommand cmd;
    private SqlDataAdapter adapter;
    public DownLoadADO()
    { }
    public DownLoadADO(string databaseName)
    {
        config = ConfigurationManager.AppSettings["Address"] + "localhost;" +
                 ConfigurationManager.AppSettings["DataBaseName"] + databaseName + ";" +
                 ConfigurationManager.AppSettings["BaseAccPwd"];
        con = new SqlConnection(config);
        cmd = new SqlCommand("", con);
    }

    public string getExcelPathByHoleNo(string HoleNo, string StartDate, string EndDate)
    {
        string DataType = "SID";
        string[][][] DatePointNoList;
        string[][] MeaDateList;
        List<string> AllDateList = new List<string>();
        List<string> PointNoList = new List<string>();
        List<string> MeaNoList = new List<string>();
        string FileName = DataType + "-" + HoleNo+"-"+ DateTime.Now.ToString("yyyyMMddHHmmss") + ".csv";
        string ProjectName = HttpContext.Current.Session["showProjects"].ToString();
        string makeFilePath = HttpContext.Current.Server.MapPath("../Projects/" + ProjectName + "/Data/").ToString() + FileName;
        string FrontPath = "../Projects/" + ProjectName + "/Data/" + FileName;

        StartDate += " 00:00:00";
        EndDate += " 23:59:59";

        MeaDateList = this.GetMRTMeaNo(HoleNo,StartDate,EndDate);
        DatePointNoList = this.GetDataPerHole(MeaDateList);

        if (DatePointNoList.Length == 0) return "non";

        if (this.SaveFileSID(DatePointNoList,MeaDateList, makeFilePath))
        {
            return FrontPath;
        }
        else
        {
            return "non";
        }
    }

    public string getExcelPathByTypeArea(string DataType, string Area, string StartDate, string EndDate)
    {
        string[][][] DatePointNoList;
        List<string> AllDateList = new List<string>();
        List<string> PointNoList = new List<string>();
        string FileName = DataType + "-" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".csv";
        string ProjectName = HttpContext.Current.Session["showProjects"].ToString();
        string makeFilePath = HttpContext.Current.Server.MapPath("../Projects/" + ProjectName + "/Data/").ToString() + FileName;
        string FrontPath = "../Projects/" + ProjectName + "/Data/" + FileName;

        StartDate += " 00:00:00";
        EndDate += " 23:59:59";

        PointNoList = this.GetMRTPointNoListByArea(Area, DataType);
        AllDateList = this.GetDateList(DataType, StartDate, EndDate, PointNoList);
        DatePointNoList = this.GetPointNoData(PointNoList, DataType, StartDate, EndDate);

        if (DatePointNoList.Length == 0) return "non";

        if (this.SaveFile(DatePointNoList, AllDateList, PointNoList, makeFilePath))
        {
            return FrontPath;
        }
        else
        {
            return "non";
        }
    }

    //MRT單一種類儀器下資料下載START
    public string getGeoMrtOneTypeDownPath(int DataType, string GageType, string StartDate, string EndDate)
    {
        string[][][] DatePointNoList;
        List<string> AllDateList = new List<string>();
        List<string> PointNoList = new List<string>();
        string FileName = DateTime.Now.ToString("yyyyMMddHHmmss") + ".csv";
        string ProjectName = HttpContext.Current.Session["showProjects"].ToString();
        string makeFilePath = HttpContext.Current.Server.MapPath("../Projects/" + ProjectName + "/Data/").ToString() + FileName;
        string FrontPath = "../Projects/" + ProjectName + "/Data/" + FileName;

        StartDate += " 00:00:00";
        EndDate += " 23:59:59";

        AllDateList = this.GetMRTDateList(GageType, StartDate, EndDate);
        PointNoList = this.GetMRTPointNoList(GageType);

        DatePointNoList = this.GetMRTPointNoDateValue(PointNoList, DataType, GageType, StartDate, EndDate);

        if (DatePointNoList.Length == 0) return "non";

        if (this.SaveFile(DatePointNoList, AllDateList, PointNoList, makeFilePath))
        {
            return FrontPath;
        }
        else
        {
            return "non";
        }
    }

    //MRT全部儀器下載START
    public string getGeoMrtAllTypeDownPath(int DataType, string[] GageTypeList, string StartDate, string EndDate)
    {
        string FrontPath = "";
        string FilesPath = "";
        string ProjectName = HttpContext.Current.Session["showProjects"].ToString();

        StartDate += " 00:00:00";
        EndDate += " 23:59:59";

        for (int i = 0, GageCountLen = GageTypeList.Length; i < GageCountLen; i++)
        {
            List<string> AllDateList = new List<string>();
            List<string> AllPointNoList = new List<string>();
            string[][][] DatePointNoList;
            string FileName = GageTypeList[i] + DateTime.Now.ToString("yyyyMMddHHmmss") + ".csv";
            string MakeFilePath = HttpContext.Current.Server.MapPath("../Projects/" + ProjectName + "/Data/").ToString() + FileName;

            AllDateList = this.GetMRTDateList(GageTypeList[i], StartDate, EndDate);
            AllPointNoList = this.GetMRTPointNoList(GageTypeList[i]);
            DatePointNoList = this.GetMRTPointNoDateValue(AllPointNoList, DataType, GageTypeList[i], StartDate, EndDate);

            if (DatePointNoList.Length == 0) return "non";

            if (this.SaveFile(DatePointNoList, AllDateList, AllPointNoList, MakeFilePath))
            {
                FilesPath += MakeFilePath + "spe";
            }
            else
            {
                FilesPath = "non";
            }
        }

        if (!FilesPath.Equals("non"))
        {
            //進行壓縮動作
            string ZipFileName = DateTime.Now.ToString("yyyyMMddHHmmss") + ".zip";
            FrontPath = this.SaveZip(ProjectName, FilesPath, ZipFileName) ? "../Projects/" + ProjectName + "/Data/" + ZipFileName : "non";
        }
        return FrontPath;
    }

    //Auto 單一種類儀器下載START
    public string getGeoAutoOneTypeDownPath(int DataType, string GageType, string StartDate, string EndDate)
    {
        string[][][] DatePointIdxList;
        List<string> AllDateList = new List<string>();
        List<string> AllPointNo = new List<string>();
        List<string> AllPointIdx = new List<string>();
        string ProjectName = HttpContext.Current.Session["showProjects"].ToString();
        string FileName = DateTime.Now.ToString("yyyyMMddHHmmss") + ".csv";
        string MakeFilePath = HttpContext.Current.Server.MapPath("../Pprojects/ " + ProjectName + "/Data/").ToString() + FileName;
        string FrontPath = "";

        StartDate += " 00:00:00";
        EndDate += " 23:59:59";

        DatePointIdxList = GetPointNoAndPointIdx(AllPointIdx, AllPointNo, GageType);
        AllDateList = this.GetAutoDateList(StartDate, EndDate);

        DatePointIdxList = this.GetAutoPointNoDateValue(DatePointIdxList, AllPointIdx, AllPointNo, DataType, StartDate, EndDate);

        if (DatePointIdxList.Length == 0) return "non";

        //下載檔案
        if (this.SaveFile(DatePointIdxList, AllDateList, AllPointNo, MakeFilePath))
        {
            FrontPath = "../Projects/" + ProjectName + "/Data/" + FileName;
        }
        else
        {
            FrontPath = "non";
        }

        return FrontPath;
    }

    //Auto 多儀器下載START
    public string getGeoAutoAllTypeDownPath(int DataType, string[] GageTypeList, string StartDate, string EndDate)
    {
        string ProjectName = HttpContext.Current.Session["showProjects"].ToString();
        string FrontPath = "";
        string FilesPath = "";

        StartDate += " 00:00:00";
        EndDate += " 23:59:59";

        for (int i = 0, GageTyoeLen = GageTypeList.Length; i < GageTyoeLen; i++)
        {
            string[][][] DatePointIdxList;
            List<string> AllDateList = new List<string>();
            List<string> AllPointNo = new List<string>();
            List<string> AllPointIdx = new List<string>();
            string FileName = GageTypeList[i] + DateTime.Now.ToString("yyyyMMddHHmmss") + ".csv";
            string MakeFilePath = HttpContext.Current.Server.MapPath("../Projects/" + ProjectName + "/Data/").ToString() + FileName;

            DatePointIdxList = this.GetPointNoAndPointIdx(AllPointIdx, AllPointNo, GageTypeList[i]);
            AllDateList = this.GetAutoDateList(StartDate, EndDate);

            DatePointIdxList = this.GetAutoPointNoDateValue(DatePointIdxList, AllPointIdx, AllPointNo, DataType, StartDate, EndDate);

            if (DatePointIdxList.Length == 0)
            {
                FrontPath = "non";
                break;
            }

            //下載檔案
            if (this.SaveFile(DatePointIdxList, AllDateList, AllPointNo, MakeFilePath))
            {
                FilesPath += MakeFilePath + "spe";
            }
            else
            {
                FilesPath = "non";
                break;
            }

        }

        if (!FilesPath.Equals("non"))
        {
            //進行壓縮動作
            string ZipFileName = DateTime.Now.ToString("yyyyMMddHHmmss") + ".zip";
            FrontPath = this.SaveZip(ProjectName, FilesPath, ZipFileName) ? "../Projects/" + ProjectName + "/Data/" + ZipFileName : "non";
        }

        return FrontPath;
    }

    //=========================================執行方法內容=========================================
    private List<string> GetMRTDateList(string GageType, string startDate, string EndDate)
    {
        List<string> list = new List<string>();
        DataTable table = new DataTable();

        cmd.CommandText = "SELECT Date " +
                          "FROM List" + GageType + " " +
                          "WHERE (Date BETWEEN '" + startDate + "' " +
                          "AND '" + EndDate + "') " +
                          "ORDER BY Date";
        adapter = new SqlDataAdapter(cmd);
        adapter.Fill(table);

        foreach (DataRow item in table.Rows)
        {
            string temp = Convert.ToDateTime(item["Date"]).ToString("yyyy/MM/dd HH:mm:ss");
            list.Add(temp);
        }

        return list;
    }
    

    private List<string> GetDateList(string GageType, string startDate, string EndDate, List<string> Point)
    {
        List<string> list = new List<string>();
        DataTable table = new DataTable();
        string joined = "'" + string.Join("','", Point) + "'";
        cmd.CommandText = "SELECT DISTINCT(Date) " +
                          "FROM " + GageType + " " +
                          "WHERE (Date BETWEEN '" + startDate + "' " +
                          "AND '" + EndDate + "') AND PointNo IN (" + joined + ") " +
                          "ORDER BY Date";
        adapter = new SqlDataAdapter(cmd);
        adapter.Fill(table);

        foreach (DataRow item in table.Rows)
        {
            string temp = Convert.ToDateTime(item["Date"]).ToString("yyyy/MM/dd HH:mm:ss");
            list.Add(temp);
        }

        return list;
    }

    private string[][][] GetDataPerHole(string[][] meano )
    {
        string[][][] list = new string[meano.Length][][];
        for (int i = 0; i < meano.Length; i++)
        {
            DataTable table = new DataTable();
            cmd.CommandText = "SELECT DepthNo,DispA " +
                              "FROM HoleRec " +
                              "WHERE MeaNo = '" + meano[i][0] + "' ORDER BY DepthNo";
            adapter = new SqlDataAdapter(cmd);
            adapter.Fill(table);

            int counter = 0;
            list[i] = new string[table.Rows.Count][];
            foreach (DataRow item in table.Rows)
            {
                list[i][counter] = new string[2];
                list[i][counter][0] = item["DepthNo"].ToString();
                list[i][counter][1] = item["DispA"].ToString();
                counter++;
            }
        }

        return list;
    }

    private string[][] GetMRTMeaNo(string holeno = "", string from = "", string to = "")
    {
        string[][] list ;
        DataTable table = new DataTable();

        cmd.CommandText = "SELECT MeaNo,Date " +
                          "FROM HoleDesc " +
                          "WHERE HoleNo LIKE '%" + holeno + "%' " +
                          "AND (Date BETWEEN '" + from + "' AND '" + to + "') " +
                          "ORDER BY MeaNo";
        adapter = new SqlDataAdapter(cmd);
        adapter.Fill(table);

        int counter = 0;
        list = new string[table.Rows.Count][];
        foreach (DataRow item in table.Rows)
        {
            list[counter] = new string[2];
            list[counter][0] = item["MeaNo"].ToString();
            list[counter][1] = item["Date"].ToString();
            counter++;
        }

        return list;
    }

    private List<string> GetMRTPointNoListByArea(string area = "", string type = "")
    {
        List<string> list = new List<string>();
        DataTable table = new DataTable();

        cmd.CommandText = "SELECT DISTINCT(PointNo) " +
                          "FROM Pos" + type + " " +
                          "WHERE Area LIKE '%" + area + "%' " +
                          "ORDER BY PointNo";
        adapter = new SqlDataAdapter(cmd);
        adapter.Fill(table);

        foreach (DataRow item in table.Rows)
        {
            string temp = item["PointNo"].ToString();
            list.Add(temp);
        }

        return list;
    }

    private List<string> GetMRTPointNoList(string GageType)
    {
        List<string> list = new List<string>();
        DataTable table = new DataTable();

        cmd.CommandText = "SELECT PointNo " +
                          "FROM Pos" + GageType + " " +
                          "ORDER BY PointNo";
        adapter = new SqlDataAdapter(cmd);
        adapter.Fill(table);

        foreach (DataRow item in table.Rows)
        {
            string temp = item["PointNo"].ToString();
            list.Add(temp);
        }

        return list;
    }

    private string[][][] GetPointNoData(List<string> PointNo, string DataType, string StartDate, string EndDate)
    {
        string[][][] DatePointNoList;

        DatePointNoList = new string[PointNo.Count][][];

        for (int i = 0, len = PointNo.Count; i < len; i++)
        {
            DataTable table = new DataTable();
            // value:0 read:1
            if (DataType == "SP")
                cmd.CommandText = "SELECT Date, Settle AS Value " +
                            "FROM SP WHERE(PointNo = '" + PointNo[i] + "') " +
                            "AND (Date BETWEEN '" + StartDate + "' AND '" + EndDate + "') " +
                            "ORDER BY Date";
            else
                cmd.CommandText = "SELECT Date, Value " +
                            "FROM " + DataType + "  " +
                            "WHERE(PointNo = '" + PointNo[i] + "') " +
                            "AND (Date BETWEEN '" + StartDate + "' AND '" + EndDate + "') " +
                            "ORDER BY Date";


            adapter = new SqlDataAdapter(cmd);
            adapter.Fill(table);

            DatePointNoList[i] = new string[table.Rows.Count][];
            int index = 0;
            foreach (DataRow item in table.Rows)
            {
                DatePointNoList[i][index] = new string[2];
                DatePointNoList[i][index][0] = Convert.ToDateTime(item["Date"]).ToString("yyyy/MM/dd HH:mm:ss");
                DatePointNoList[i][index][1] = item["Value"].ToString();

                index++;
            }
        }


        return DatePointNoList;
    }

    private string[][][] GetMRTPointNoDateValue(List<string> PointNo, int DataType, string GageType, string StartDate, string EndDate)
    {
        string[][][] DatePointNoList;

        DatePointNoList = new string[PointNo.Count][][];

        for (int i = 0, len = PointNo.Count; i < len; i++)
        {
            DataTable table = new DataTable();
            // value:0 read:1
            switch (DataType)
            {
                case 0:
                    if (GageType.Equals("SP"))
                    {
                        cmd.CommandText = "SELECT Date, Settle AS Value " +
                            "FROM SP WHERE(PointNo = '" + PointNo[i] + "') " +
                            "AND (Date BETWEEN '" + StartDate + "' AND '" + EndDate + "') " +
                            "ORDER BY Date";
                    }
                    else if (GageType.Equals("TD"))
                    {
                        return new string[0][][];
                    }
                    else if (GageType.Equals("SID"))
                    {
                        return new string[0][][];
                    }
                    else
                    {
                        cmd.CommandText = "SELECT Date, Value " +
                            "FROM " + GageType + "  " +
                            "WHERE(PointNo = '" + PointNo[i] + "') " +
                            "AND (Date BETWEEN '" + StartDate + "' AND '" + EndDate + "') " +
                            "ORDER BY Date";
                    }
                    break;
                case 1:
                    if (GageType.Equals("SP"))
                    {
                        cmd.CommandText = "SELECT Date, Settle AS Read1 " +
                            "FROM SP WHERE(PointNo = '" + PointNo[i] + "') " +
                            "AND (Date BETWEEN '" + StartDate + "' AND '" + EndDate + "') " +
                            "ORDER BY Date";
                    }
                    else if (GageType.Equals("TD"))
                    {
                        return new string[0][][];
                    }
                    else if (GageType.Equals("SID"))
                    {
                        return new string[0][][];
                    }
                    else
                    {
                        cmd.CommandText = "SELECT Date, Read1 " +
                            "FROM " + GageType + "  " +
                            "WHERE(PointNo = '" + PointNo[i] + "') " +
                            "AND (Date BETWEEN '" + StartDate + "' AND '" + EndDate + "') " +
                            "ORDER BY Date";
                    }
                    break;
            }

            adapter = new SqlDataAdapter(cmd);
            adapter.Fill(table);

            DatePointNoList[i] = new string[table.Rows.Count][];
            int index = 0;
            foreach (DataRow item in table.Rows)
            {
                DatePointNoList[i][index] = new string[2];
                DatePointNoList[i][index][0] = item["Date"].ToString();
                DatePointNoList[i][index][0] = DataType == 0 ? item["Value"].ToString() : item["Read1"].ToString();

                index++;
            }
        }


        return DatePointNoList;
    }

    private bool SaveFileSID(string[][][] DataPackage, string[][] MeaDate, string SavePath)
    {
        bool isOk = false;
        StreamWriter sw = new StreamWriter(SavePath, false, Encoding.Default);
        string Pan = "Elevation (m)";
        List<string> elevation = new List<string>();
        for (int i = 0, length = MeaDate.Length; i < length; i++)
        {
            Pan += "," + MeaDate[i][1];
        }
        sw.WriteLine(Pan);
        for(double i = 0; i <= 60; i+=0.50)
        {
            elevation.Add(String.Format("{0:0.00}", i));
        }

        for (int j = 0, valueLen = elevation.Count; j < valueLen; j++)
        {
            Pan = elevation[j];
            for (int i = 0, length = MeaDate.Length; i < length; i++)
            {
                for (int k = 0, checkLen = DataPackage[i].Length; k < checkLen; k++)
                {
                    string temp = String.Format("{0:0.00}", (Convert.ToDouble(DataPackage[i][k][0]) * 0.5));
                    if (temp.Equals(elevation[j]))
                    {
                        Pan += "," + DataPackage[i][k][1];
                        break;
                    }

                }
            }
            Pan += ", ";
            sw.WriteLine(Pan);
        }


        sw.Close();
        isOk = true;

        return isOk;
    }

    private bool SaveFile(string[][][] DataPackage, List<string> Date, List<string> PointNo, string SavePath)
    {
        bool isOk = false;
        StreamWriter sw = new StreamWriter(SavePath, false, Encoding.Default);
        string Pan = "Point No";

        for (int i = 0, length = Date.Count; i < length; i++)
        {
            Pan += "," + Date[i];
        }
        sw.WriteLine(Pan);

        for (int j = 0, valueLen = DataPackage.Length; j < valueLen; j++)
        {
            Pan = PointNo[j];
            if (DataPackage[j].Length == 0)
            {
                Pan += ", ";
                continue;
            }
            for (int i = 0, length = Date.Count; i < length; i++)
            {
                for (int k = 0, checkLen = DataPackage[j].Length; k < checkLen; k++)
                {
                    if (DataPackage[j][k][0].Equals(Date[i]))
                    {
                        Pan += "," + DataPackage[j][k][1];
                        break;
                    }

                }
            }
            Pan += ", ";
            sw.WriteLine(Pan);
        }


        sw.Close();
        isOk = true;

        return isOk;
    }

    private bool SaveZip(string ProjectName, string FilesPath, string zipFilesName)
    {
        bool isOk = false;
        string[] Paths = FilesPath.Split(new char[3] { 's', 'p', 'e' });
        ZipFile zipFiles = new ZipFile();

        foreach (string file in Paths)
        {
            string FileName = file.Split('/')[file.Split('/').Length - 1];
            zipFiles.AddEntry(FileName, file);
        }

        zipFiles.Save(HttpContext.Current.Server.MapPath("../Projects/" + ProjectName + "/").ToString() + zipFilesName);
        isOk = true;
        return isOk;
    }

    private string[][][] GetPointNoAndPointIdx(List<string> PointIdx, List<string> PointNo, string GageType)
    {
        int GageTypeCode = 0;
        string[][][] Array;
        DataTable table = new DataTable();
        cmd.CommandText = "SELECT Code FROM DefineGageType WHERE (LanguageID = 0) AND(GageType = '" + GageType + "')";
        adapter = new SqlDataAdapter(cmd);
        adapter.Fill(table);

        foreach (DataRow item in table.Rows)
        {
            GageTypeCode = Convert.ToInt32(item["Code"]);
        }
        table.Clear();

        cmd.CommandText = "SELECT PointNo, PointIdx FROM ParaBase WHERE(GageTypeCode = '" + GageTypeCode + "')";
        adapter = new SqlDataAdapter(cmd);
        adapter.Fill(table);

        foreach (DataRow item in table.Rows)
        {
            PointIdx.Add(item["PointIdx"].ToString());
            PointNo.Add(item["PointNo"].ToString());
        }

        Array = new string[table.Rows.Count][][];

        return Array;
    }

    private List<string> GetAutoDateList(string StartDate, string EndStart)
    {
        List<string> list = new List<string>();
        DataTable table = new DataTable();

        //cmd.CommandText = "SELECT Date " +
        //       "FROM ListData " +
        //       "WHERE(Date BETWEEN '" + StartDate + "' AND '" + EndStart + "') " +
        //       "ORDER BY Date";

        cmd.CommandText = "SELECT Date " +
                "FROM ListDataShorten " +
                "WHERE(Date BETWEEN '" + StartDate + "' AND '" + EndStart + "') " +
                "ORDER BY Date";
        adapter = new SqlDataAdapter(cmd);
        adapter.Fill(table);

        foreach (DataRow item in table.Rows)
        {
            list.Add(item["Date"].ToString());
        }

        return list;
    }

    private string[][][] GetAutoPointNoDateValue(string[][][] target, List<string> PointIdx, List<string> PointNo, int DataType, string StartDate, string EndDate)
    {
        for (int i = 0, idxLen = PointIdx.Count; i < idxLen; i++)
        {

            DataTable table = new DataTable();
            int count = 0;

            switch (DataType)
            {
                case 0:
                    //cmd.CommandText = "SELECT Data.Value, ListData.Date " +
                    //    "FROM Data INNER JOIN ListData ON Data.MeaNo = ListData.MeaNo " +
                    //    "WHERE(ListData.Date BETWEEN '" + StartDate + "' AND '" + EndDate + "') AND(Data.PointIdx = '" + AllPointIdx[i] + "')" +
                    //    "ORDER BY ListData.Date";
                    cmd.CommandText = "SELECT DataShorten.Value, ListDataShorten.Date " +
                       "FROM DataShorten INNER JOIN ListDataShorten ON DataShorten.MeaNo = ListDataShorten.MeaNo " +
                       "WHERE(ListDataShorten.Date BETWEEN '" + StartDate + "' AND '" + EndDate + "') AND(DataShorten.PointIdx = '" + PointIdx[i] + "')" +
                       "ORDER BY ListDataShorten.Date";
                    break;
                case 1:
                    //cmd.CommandText = "SELECT Data.[Read], ListData.Date " +
                    //    "FROM Data INNER JOIN ListData ON Data.MeaNo = ListData.MeaNo " +
                    //    "WHERE(ListData.Date BETWEEN '" + StartDate + "' AND '" + EndDate + "') AND(Data.PointIdx = '" + AllPointIdx[i] + "')" +
                    //    "ORDER BY ListData.Date";
                    cmd.CommandText = "SELECT DataShorten.[Read], ListDataShorten.Date " +
                        "FROM DataShorten INNER JOIN ListDataShorten ON DataShorten.MeaNo = ListDataShorten.MeaNo " +
                        "WHERE(ListDataShorten.Date BETWEEN '" + StartDate + "' AND '" + EndDate + "') AND(DataShorten.PointIdx = '" + PointIdx[i] + "')" +
                        "ORDER BY ListDataShorten.Date";
                    break;
            }

            adapter = new SqlDataAdapter(cmd);
            adapter.Fill(table);
            target[i] = new string[table.Rows.Count][];

            foreach (DataRow item in table.Rows)
            {
                target[i][count] = new string[2];
                target[i][count][0] = item["Date"].ToString();
                switch (DataType)
                {
                    case 0:
                        target[i][count][1] = item["Value"].ToString();
                        break;
                    case 1:
                        target[i][count][1] = item["Read"].ToString();
                        break;
                }
                count++;
            }
        }

        return target;
    }
}