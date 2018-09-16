using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;
using System.IO;

public partial class Login : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    { }

    //帳號驗證
    [WebMethod(EnableSession = true)]
    public static bool GetAccount(string account, string password)
    {
        bool isOk = false;
        LoginADO User = new LoginADO();

        isOk = User.CheckUser(account, password);

        return isOk;
    }


    //判斷Session (測試用)
    [WebMethod(EnableSession = true)]
    public static bool checkSession()
    {
        return HttpContext.Current.Session["name"] != null ? true : false;
    }

    //測試用
    [WebMethod(EnableSession = true)]
    public static List<NewestData> GetNewestDatas()
    {
        List<NewestData> list = new List<NewestData>();
        ProjectDataADO get = new ProjectDataADO("MRT_CK570J");

        list = get.GetGeoAutoMRTDataNewestData();

        return list;
    }
    //測試用
    [WebMethod(EnableSession = true)]
    public static string checkAndCheckDicrecty()
    {
        string ans = "";
        HttpContext Path = HttpContext.Current;
        if (Directory.Exists(Path.Server.MapPath("Test").ToString()))
        {
            ans += "有這個資料夾";
        }
        else
        {
            Directory.CreateDirectory(Path.Server.MapPath("Test").ToString());
            ans += "沒有這個資料夾 但是已經建立好";
        }
        return ans;
    }

}