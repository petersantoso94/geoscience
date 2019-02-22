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

    public static bool writeExcel(string[][] DataPackage, string PointNo, string target, string datatype, string template)
    {
        ExcelPackage pck = new ExcelPackage(new FileInfo(template));
        var ws = pck.Workbook.Worksheets[1];
        int startRow = 8;
        int dateCol = 15;
        int dataCol = 15;

        if (datatype == "SR")
        {
            startRow = 1;
            dateCol = 13;
            dataCol = 13;
        }
        else if (datatype == "SP")
        {

            startRow = 1;
            dateCol = 20;
            dataCol = 20;
        }
        else if (datatype == "ELP")
        {
            startRow = 1;
            dateCol = 14;
            dataCol = 14;

        }
        ws.Cells[1, dateCol].Value = "Point No : "+ PointNo;
        ws.Cells[3, dateCol].Value = "Date";
        ws.Cells[3, dateCol+1].Value = "Value";
        for (int row = 4;  row < DataPackage.Length; row++)
        {
            ws.Cells[row, dateCol].Value = DataPackage[row][0];
            ws.Cells[row, dateCol+1].Value = DataPackage[row][1];
        }

        pck.SaveAs(new FileInfo(target));
        return true;
    }
    public static bool writeExcelSID(string[][][] DataPackage, string[][] MeaDate, string target, string template)
    {
        
        int startRow = 8;
        int dateCol = 15;
        ExcelPackage pck = new ExcelPackage(new FileInfo(template));
        var ws = pck.Workbook.Worksheets[1];

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
        }

        int dataCol;
        for (int j = 0, valueLen = elevation.Count; j < valueLen; j++)
        {
            dataCol = 15;
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