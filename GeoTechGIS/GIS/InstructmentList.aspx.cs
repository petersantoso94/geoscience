using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;

public partial class GIS_InsturctmentList : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    { }

    //取得最新的資料start
    [WebMethod(EnableSession = true)]
    public static returnLastData GetNewestDatas()
    {
        returnLastData package = new returnLastData();

        if (HttpContext.Current.Request.Cookies["UserCookies"]["UserID"] == null)
        {
            package.isOk = false;
            package.Message = "尚未登入或連線逾時";
            return package;
        }

        ProjectDataADO dao;
        User user = (User)HttpContext.Current.Session["User"];
        List<Project> projectList = user.ProjectList;
        string projectName = HttpContext.Current.Session["showProjects"].ToString();

        try
        {
            foreach (Project item in projectList)
            {
                if (item.ProjectName.Equals(projectName))
                {
                    dao = new ProjectDataADO(item.GetPorjectDB());
                    package.ProjectInfo = item;
                    switch (item.DataBaseStyle)
                    {
                        case 0:
                            package.gageList = dao.GetGeoAutoInstructmentInfo();
                            break;
                        case 1:
                            package.gageList = dao.GetGeoMRTInstructmentInfo();
                            break;
                    }
                    package.DataPackage = dao.GetGeoAutoMRTDataNewestData();
                    package.isOk = true;
                }
            }
            package.ProjectsList = (string[])HttpContext.Current.Session["selectedProjects"];
        }
        catch (Exception ex)
        {

            //package.message = "資料處理錯誤，請重新登入";
            package.Message = ex.Message.ToString();
            package.isOk = false;
        }

        return package;
    }

    [WebMethod(EnableSession = true)]
    public static bool changeProject(string ProjectName)
    {
        bool isOk = false;
        HttpContext.Current.Session["showProjects"] = ProjectName;
        isOk = true;
        return isOk;
    }

    //讀取固定區間的資料
    [WebMethod(EnableSession = true)]
    public static returnChartData GetDrawDataStableInterval(int PointIdx, string PointNo, string GageType, int StableRang)
    {
        returnChartData package = new returnChartData();
        if (HttpContext.Current.Request.Cookies["UserCookies"]["UserID"] == null)
        {
            package.isOk = false;
            package.Message = "尚未登入或連線逾時";
            return package;
        }

        User user = (User)HttpContext.Current.Session["User"];
        List<Project> projectList = user.ProjectList;
        string projectName = HttpContext.Current.Session["showProjects"].ToString();
        ChartDataADO chart;

        try
        {
            foreach (Project item in projectList)
            {
                if (item.ProjectName.Equals(projectName))
                {
                    chart = new ChartDataADO(item.GetPorjectDB());
                    switch (item.DataBaseStyle)
                    {
                        case 0:
                            package.ChartData = chart.GetGeoAutoStableIntervalToDraw(PointIdx, GageType, StableRang);
                            break;
                        case 1:
                            package.ChartData = chart.GetGeoMRTStableIntervalToDraw(PointNo, GageType, StableRang);
                            break;
                    }
                    package.isOk = true;
                }
            }
        }
        catch (Exception ex)
        {
            //package.message = "資料處理錯誤，請重新登入";
            package.Message = ex.Message.ToString();
            package.isOk = false;
        }
        return package;
    }

    //讀取自選區間的資料
    [WebMethod(EnableSession = true)]
    public static returnChartData GetDrawDataSelfChooseInterval(int PointIdx, string PointNo, string GageType, string StartDate, string EndDate)
    {
        returnChartData package = new returnChartData();
        if (HttpContext.Current.Request.Cookies["UserCookies"]["UserID"] == null)
        {
            package.isOk = false;
            package.Message = "尚未登入或連線逾時";
            return package;
        }

        User user = (User)HttpContext.Current.Session["User"];
        List<Project> projectList = user.ProjectList;
        string projectName = HttpContext.Current.Session["showProjects"].ToString();
        ChartDataADO chart;

        try
        {
            foreach (Project item in projectList)
            {
                if (item.ProjectName.Equals(projectName))
                {
                    chart = new ChartDataADO(item.GetPorjectDB());
                    switch (item.DataBaseStyle)
                    {
                        case 0:
                            package.ChartData = chart.GetGeoAutoSelectedIntervalToDraw(PointIdx, GageType, StartDate, EndDate);
                            break;
                        case 1:
                            package.ChartData = chart.GetGeoMRTSelectedIntervalToDraw(PointNo, GageType, StartDate, EndDate);
                            break;
                    }
                    package.isOk = true;
                }
            }
        }
        catch (Exception ex)
        {
            //package.message = "資料處理錯誤，請重新登入";
            package.Message = ex.Message.ToString();
            package.isOk = false;
        }


        return package;
    }

    //下載檔案
    [WebMethod(EnableSession = true)]
    public static returnFilePath GetDownloadPath(string GageType, int DataType, string FromDate, string ToDate)
    {
        returnFilePath package = new returnFilePath();
        if (HttpContext.Current.Request.Cookies["UserCookies"]["UserID"] == null)
        {
            package.isOk = false;
            package.Message = "尚未登入或連線逾時";
            return package;
        }

        User user = (User)HttpContext.Current.Session["User"];
        List<Project> projectList = user.ProjectList;
        string projectName = HttpContext.Current.Session["showProjects"].ToString();
        DownLoadADO DownFile;


        System.Diagnostics.Debug.WriteLine(GageType);
        System.Diagnostics.Debug.WriteLine(DataType);
        System.Diagnostics.Debug.WriteLine(FromDate);
        System.Diagnostics.Debug.WriteLine(ToDate);
        try
        {
            foreach (Project item in projectList)
            {
                if (item.ProjectName.Equals(projectName))
                {
                    DownFile = new DownLoadADO(item.GetPorjectDB());
                    switch (item.DataBaseStyle)
                    {
                        //Auto
                        case 0:
                            switch (GageType.Equals(0))
                            {
                                case true:
                                    break;
                                case false:
                                    package.Path = DownFile.getGeoAutoOneTypeDownPath(DataType, GageType, FromDate, ToDate);
                                    break;
                            }
                            break;
                        //MRT
                        case 1:
                            switch (GageType.Equals(0))
                            {
                                case true:
                                    //package.Path = DownFile.getGeoAutoAllTypeDownPath(DataType, GageType, FromDate, ToDate);
                                    break;
                                case false:
                                    package.Path = DownFile.getGeoMrtOneTypeDownPath(DataType, GageType, FromDate, ToDate);
                                    break;
                            }
                            break;
                    }
                    package.isOk = true;
                }
            }
        }
        catch (Exception ex)
        {
            package.Message = ex.Message.ToString();
            package.Message += "資料處理錯誤，請重新登入";
            package.isOk = false;
        }

        return package;
    }
}

