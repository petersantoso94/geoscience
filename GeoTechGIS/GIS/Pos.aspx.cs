using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;

public partial class GIS_Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }

    [WebMethod(EnableSession = true)]
    public static bool DeleteData(string No)
    {
        bool isOk = false;
        if (HttpContext.Current.Request.Cookies["UserCookies"]["UserID"] == null)
        {
            return isOk;
        }
        PostDataADO post = new PostDataADO();
        post.DeleteDataPos(No);
        isOk = true;
        return isOk;
    }

    [WebMethod(EnableSession = true)]
    public static bool InsertData(string pointNo, string station, string area, string factor1, string factor2, string factor3, string iniRead1, string iniRead2, string iniRead3, string insDate, string iniDate, string alert, string alarm, string action, string rem1, string rem2, string rem3)
    {
        bool isOk = false;
        if (HttpContext.Current.Request.Cookies["UserCookies"]["UserID"] == null)
        {
            return isOk;
        }
        PostDataADO post = new PostDataADO();
        PosData data = new PosData( pointNo, station, area, factor1, factor2, factor3, iniRead1, iniRead2, iniRead3, insDate, iniDate, alert, alarm, action, rem1, rem2, rem3);
        post.InsertDataPos(data);
        isOk = true;
        return isOk;
    }

    [WebMethod(EnableSession = true)]
    public static bool UpdateData(string pointNo, string station, string area, string factor1, string factor2, string factor3, string iniRead1, string iniRead2, string iniRead3, string insDate, string iniDate, string alert, string alarm, string action, string rem1, string rem2, string rem3)
    {
        bool isOk = false;
        if (HttpContext.Current.Request.Cookies["UserCookies"]["UserID"] == null)
        {
            return isOk;
        }
        PostDataADO post = new PostDataADO();
        PosData data = new PosData(pointNo, station, area,  factor1, factor2, factor3, iniRead1, iniRead2, iniRead3, insDate, iniDate, alert, alarm, action, rem1, rem2, rem3);
        post.UpdateDataPos(data);
        isOk = true;
        return isOk;
    }

    [WebMethod(EnableSession = true)]
    public static returnPosData GetPosData()
    {
        returnPosData package = new returnPosData();

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
                    package.DataPackage = dao.GetPosData();
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
}