using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// returnLastData 的摘要描述
/// </summary>
public class returnPosData
{
    public bool isOk { get; set; }
    public string Message { get; set; }
    public List<PosData> DataPackage { get; set; }
    public Project ProjectInfo { get; set; }
    public List<GageTypeInfomation> gageList { get; set; }
    public string[] ProjectsList { get; set; } 
    public returnPosData()
    {
    }
}