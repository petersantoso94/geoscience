﻿using System;
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
    public static bool DeleteData(string No, string Date)
    {
        bool isOk = false;
        if (HttpContext.Current.Request.Cookies["UserCookies"]["UserID"] == null)
        {
            return isOk;
        }
        PostDataADO post = new PostDataADO();
        post.DeleteDataELP(No, Date);
        isOk = true;
        return isOk;
    }

    [WebMethod(EnableSession = true)]
    public static bool InsertData(string date, string pointNo, string meaNo, string read1, string read2, string read3, string value, string initial, string normal, string reM, string sensor)
    {
        bool isOk = false;
        if (HttpContext.Current.Request.Cookies["UserCookies"]["UserID"] == null)
        {
            return isOk;
        }
        PostDataADO post = new PostDataADO();
        ELPData data = new ELPData(date, pointNo, meaNo, read1, read2, read3, value, initial, normal, reM, sensor);
        post.InsertDataELP(data);
        isOk = true;
        return isOk;
    }

    [WebMethod(EnableSession = true)]
    public static bool UpdateData(string date, string pointNo, string meaNo, string read1, string read2, string read3, string value, string initial, string normal, string reM, string sensor)
    {
        bool isOk = false;
        if (HttpContext.Current.Request.Cookies["UserCookies"]["UserID"] == null)
        {
            return isOk;
        }
        PostDataADO post = new PostDataADO();
        ELPData data = new ELPData( date,  pointNo,  meaNo,  read1,  read2,  read3,  value,  initial,  normal,  reM,  sensor);
        post.UpdateDataELP(data);
        isOk = true;
        return isOk;
    }

    [WebMethod(EnableSession = true)]
    public static returnELPData GetELPData(string from = "", string to = "")
    {
        returnELPData package = new returnELPData();

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
                    package.DataPackage = dao.GetELPData(from,to);
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