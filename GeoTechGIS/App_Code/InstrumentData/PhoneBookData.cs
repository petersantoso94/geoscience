using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// NewestData 的摘要描述
/// </summary>
public class PhoneBookData
{
    public int No { get; set; }
    //0: 正常工作 1: 尚未測量 2.失效 3. 尚未安裝
    public string Name { get; set; }
    //0: 正常 1: Alert 2:Alarm 3:Action。取得數值之後做判斷
    public string MobileNo { get; set; }
    public string Alert { get; set; }
    public string Alert1 { get; set; }
    public string Alert2 { get; set; }
    public string WorkSuspension { get; set; }
    public string Fail { get; set; }
    public PhoneBookData()
    {}

    public PhoneBookData(int no, string name, string mobileNo, string alert, string alert1, string alert2, string workSuspension, string fail)
    {
        No = no;
        Name = name;
        MobileNo = mobileNo;
        Alert = alert;
        Alert1 = alert1;
        Alert2 = alert2;
        WorkSuspension = workSuspension;
        Fail = fail;
    }
}