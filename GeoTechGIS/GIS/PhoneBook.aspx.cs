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
        if (HttpContext.Current.Session["user"] == null)
        {
            return isOk;
        }
        PostDataADO post = new PostDataADO();
        post.DeleteDataPhonebook(No);
        isOk = true;
        return isOk;
    }

    [WebMethod(EnableSession = true)]
    public static bool InsertData(string No, string Name, string PhoneNo, string Alert, string Alarm1, string Alarm2, string Work, string Fail, string Email)
    {
        bool isOk = false;
        if (HttpContext.Current.Session["user"] == null)
        {
            return isOk;
        }
        PostDataADO post = new PostDataADO();
        PhoneBookData data = new PhoneBookData(Convert.ToInt32(No), Name, PhoneNo, Alert, Alarm1, Alarm2, Work, Fail, Email);
        post.InsertDataPhonebook(data);
        isOk = true;
        return isOk;
    }

    [WebMethod(EnableSession = true)]
    public static bool UpdateData(string No, string Name, string PhoneNo, string Alert, string Alarm1, string Alarm2, string Work, string Fail, string Email)
    {
        bool isOk = false;
        if (HttpContext.Current.Session["user"] == null)
        {
            return isOk;
        }
        PostDataADO post = new PostDataADO();
        PhoneBookData data = new PhoneBookData(Convert.ToInt32(No), Name, PhoneNo, Alert, Alarm1, Alarm2, Work, Fail,Email);
        post.UpdateDataPhonebook(data);
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