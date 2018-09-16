using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Project 的摘要描述
/// </summary>
public class Project
{

    public string ProjectName { get; set; }
    private string ProjectDBName { get; set; }
    public string ProjectDescript { get; set; }
    public string company { get; set; }
    public string custom { get; set; }
    //0: 沒有地圖 1: 有地圖
    public int MapType { get; set; }
    // -1:資料傳遞錯誤  0:GeoAuto架構 1: MRT 架構
    public int DataBaseStyle { get; set; }
    public double Lat { get; set; }
    public double Lng { get; set; }
    public Project()
    { }


    public string GetPorjectDB()
    {
        return this.ProjectDBName;
    }

    public void SetPorjectDB(string DBname)
    {
        this.ProjectDBName = DBname;
    }
}