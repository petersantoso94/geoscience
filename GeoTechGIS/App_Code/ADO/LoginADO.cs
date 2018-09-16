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
public class LoginADO
{
    private readonly string config = ConfigurationManager.AppSettings["Address"] + "localhost;" +
                                     ConfigurationManager.AppSettings["Account"] +
                                     ConfigurationManager.AppSettings["BaseAccPwd"];

    private SqlConnection con = null;
    private SqlCommand cmd = null;
    private SqlDataReader read = null;
    private SqlDataAdapter adapter = null;
    HttpContext context;

    public LoginADO()
    {
        con = new SqlConnection(config);
        cmd = new SqlCommand("", con);
        context = HttpContext.Current;
    }

    //判斷帳戶 並且登入帳號相關資訊儲存在Session
    public bool CheckUser(string ac, string pw)
    {
        bool isOk = false;
        User user = new User();

        pw = pw.Equals("") ? "is NULL" : "like '" + pw + "'";
        cmd.CommandText = "SELECT UserID, Password " +
                          "FROM Membership " +
                          "WHERE(UserID LIKE '" + ac + "') AND(Password " + pw + ")";
        con.Open();
        read = cmd.ExecuteReader();
        isOk = read.HasRows ? true : isOk;
        read.Close();
        con.Close();

        if (isOk)
        {
            user.Account = ac;
            user.ProjectList = this.GetUserProjectList(ac);
            context.Session.Add("user", user);
        }
        return isOk;
    }
    //取得該會員現在有的專案
    private List<Project> GetUserProjectList(string ac)
    {
        List<Project> projectList = new List<Project>();
        DataTable table = new DataTable();

        cmd.CommandText = "SELECT Projects.ProjectName, Projects.DBName, Projects.ProjectDescript, Projects.Company, Projects.Client, " +
                          "Projects.MapType, Projects.DataBaseType, Projects.Lat, Projects.Lng " +
                          "FROM Projects INNER JOIN UserInProjects ON Projects.ProjectName = UserInProjects.Projects " +
                          "WHERE(UserInProjects.UserID LIKE '" + ac + "') AND(Projects.LanguageID = '1')";

        adapter = new SqlDataAdapter(cmd);
        adapter.Fill(table);

        foreach (DataRow item in table.Rows)
        {
            Project list = new Project();
            list.ProjectName = item["ProjectName"].ToString();
            list.SetPorjectDB(item["DBName"].ToString());
            list.ProjectDescript = item["ProjectDescript"].ToString();
            list.custom = item["Client"].ToString();
            list.company = item["company"].ToString();
            list.MapType = Convert.ToInt32(item["MapType"]);
            list.DataBaseStyle = Convert.ToInt32(item["DataBaseType"]);
            list.Lat = Convert.ToDouble(item["Lat"]);
            list.Lng = Convert.ToDouble(item["Lng"]);
            projectList.Add(list);
        }
        return projectList;
    }
}