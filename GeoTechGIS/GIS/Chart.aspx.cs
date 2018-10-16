using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;

public partial class GIS_Chart : System.Web.UI.Page
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
}