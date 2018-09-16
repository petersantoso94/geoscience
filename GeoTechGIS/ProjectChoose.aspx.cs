using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;
using System.IO;


public partial class ProjectChoose : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
    }

    //判斷是否還在登入狀況
    [WebMethod(EnableSession = true)]
    public static bool GetSession()
    {
        return HttpContext.Current.Session["user"] != null ? true : false;
    }

    //顯示專案列表
    [WebMethod(EnableSession = true)]
    public static List<String> getProjectList()
    {
        List<string> list = new List<string>();
        if (GetSession())
        {
            User user = (User)(HttpContext.Current.Session["user"]);

            //判斷專案裡面
            foreach (Project item in user.ProjectList)
            {
                list.Add(item.ProjectName);
                switch (hasTheFile(item.ProjectName))
                {
                    case false:
                        creatNewProjectFile(item.ProjectName);
                        break;
                }
            }
        }
        else
        {
            return list;
        }
        return list;
    }

    //將選擇的資料存到SESSION 在下一個頁面讀取
    [WebMethod(EnableSession = true)]
    public static string nextPage(string[] projects)
    {
        string path = ".\\GIS\\";
        string selectProject = projects[0];
        List<Project> ProjectList = ((User)(HttpContext.Current.Session["user"])).ProjectList;

        HttpContext.Current.Session["selectedProjects"] = projects;
        HttpContext.Current.Session["showProjects"] = selectProject;

        //判斷是否有地圖切頁面
        foreach (Project item in ProjectList)
        {
            if (item.ProjectName.Equals(selectProject))
            {
                switch (item.MapType)
                {
                    case 0:
                        path += "InstructmentList.aspx";
                        break;
                    case 1:
                        path += "Map.aspx";
                        break;
                }
            }
        }
        return path;
    }



    //確認有沒有該專案資料夾
    private static bool hasTheFile(string project)
    {
        bool isOk = false;
        //負責抓路徑
        HttpContext current = HttpContext.Current;
        string Files = current.Server.MapPath("./Projects/" + project).ToString();
        System.Diagnostics.Debug.WriteLine("路徑:" + Files);
        if (Directory.Exists(Files))
        {
            System.Diagnostics.Debug.WriteLine("有資料夾");
            isOk = true;
        }
        else
        {
            System.Diagnostics.Debug.WriteLine("沒有資料夾");
            isOk = false;
        }

        return isOk;
    }

    private static void creatNewProjectFile(string project)
    {
        HttpContext current = HttpContext.Current;
        string FilePath = "/Projects/" + project;

        try
        {
            Directory.CreateDirectory(current.Server.MapPath(FilePath));
            Directory.CreateDirectory(current.Server.MapPath(FilePath + "/Data"));
            Directory.CreateDirectory(current.Server.MapPath(FilePath + "/Factor"));
            Directory.CreateDirectory(current.Server.MapPath(FilePath + "/Photo"));
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine(ex.Message.ToString());

        }
    }
}