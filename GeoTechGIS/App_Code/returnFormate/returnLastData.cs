using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// returnLastData 的摘要描述
/// </summary>
public class returnLastData
{
    public bool isOk { get; set; }
    public string Message { get; set; }
    public List<NewestData> DataPackage { get; set; }
    public Project ProjectInfo { get; set; }
    public List<GageTypeInfomation> gageList { get; set; }
    public string[] ProjectsList { get; set; } 
    public returnLastData()
    {
    }
}