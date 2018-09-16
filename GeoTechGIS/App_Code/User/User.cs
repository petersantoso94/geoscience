using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// User 的摘要描述
/// </summary>
public class User
{
    public string Account { get; set; }
    private int AccountLevel { get; set; }
    public List<Project> ProjectList { get; set; }

    string FocusProjected { get; set; }
    public User()
    { }
}