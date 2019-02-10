using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Web;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using Excel = Microsoft.Office.Interop.Excel;
using System.Reflection;

/// <summary>
/// Summary description for Class1
/// </summary>
public class ExcelWritter
{
    public ExcelWritter()
    {
    }

    public static bool writeExcel(string[][] DataPackage, string PointNo, string target, string datatype)
    {
        ExcelPackage pck = new ExcelPackage();
        var ws = pck.Workbook.Worksheets.Add(datatype);
        ws.Cells[1, 1].Value = "Point No : "+ PointNo;
        for (int row = 2;  row < DataPackage.Length; row++)
        {
            ws.Cells[row, 1].Value = DataPackage[row][0];
            ws.Cells[row, 2].Value = DataPackage[row][1];
        }

        pck.SaveAs(new FileInfo(target));
        return true;
    }
    public static bool writeExcelSID(string[][][] DataPackage, string[][] MeaDate, string target)
    {
        
        int startRow = 1;
        int dateCol = 2;
        ExcelPackage pck = new ExcelPackage();
        var ws = pck.Workbook.Worksheets.Add("SID");
        for (int i = 0, length = MeaDate.Length; i < length; i++)
        {
            ws.Cells[startRow, dateCol].Value = MeaDate[i][1];
            dateCol++;
        }
        startRow++;

        List<string> elevation = new List<string>();
        for (double i = 0; i <= 60; i += 0.50)
        {
            elevation.Add(String.Format("{0:0.00}", i));
            ws.Cells[startRow, 1].Value = String.Format("{0:0.00}", i);
            startRow++;

        }
        startRow = 2;

        int dataCol;
        for (int j = 0, valueLen = elevation.Count; j < valueLen; j++)
        {
            dataCol = 2;
            for (int i = 0, length = MeaDate.Length; i < length; i++)
            {
                for (int k = 0, checkLen = DataPackage[i].Length; k < checkLen; k++)
                {
                    string temp = String.Format("{0:0.00}", (Convert.ToDouble(DataPackage[i][k][0]) * 0.5));
                    if (temp.Equals(elevation[j]))
                    {
                        ws.Cells[startRow, dataCol].Value = DataPackage[i][k][1];
                        dataCol++;
                        break;
                    }

                }
            }
            startRow++;
        }
        pck.SaveAs(new FileInfo(target));

        return true;
    }
}