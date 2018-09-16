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
    public static bool PostExcelData(string ProjectName)
    {
        bool isOk = false;
        
        isOk = true;
        return isOk;
    }

    [WebMethod(EnableSession = true)]
    public static returnPhoneBookData GetPhoneBookData()
    {
        returnPhoneBookData package = new returnPhoneBookData();

        if (HttpContext.Current.Session["user"] == null)
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
                    package.DataPackage = dao.GetPhoneBookData();
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