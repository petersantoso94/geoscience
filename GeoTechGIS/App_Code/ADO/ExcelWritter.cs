using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Web;
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

    public static bool writeExcel(string[][][] DataPackage, List<string> Date, List<string> PointNo, string FileName, string target, string datatype)
    {
        //Create COM Objects. Create a COM object for everything that is referenced
        Excel.Application xlApp = new Excel.Application();
        Excel.Workbook xlWorkbook = xlApp.Workbooks.Open(FileName, 0, false, 5, "", "", false, Excel.XlPlatform.xlWindows, "", true, false, 0, true, false, false);
        Excel._Worksheet xlWorksheet = (Excel._Worksheet)xlWorkbook.ActiveSheet;
        int startRow = 8;
        int dateCol = 15;
        int dataCol = 15;

        if(datatype == "SR")
        {
            startRow = 1;
            dateCol = 13;
            dataCol = 13;
        }
        else if(datatype == "SP")
        {

            startRow = 1;
            dateCol = 20;
            dataCol = 20;
        }
        else if(datatype == "ELP")
        {
            startRow = 1;
            dateCol = 14;
            dataCol = 14;

        }
        xlWorksheet.Cells[startRow, dateCol] = "Point No";

        for (int i = 0, length = Date.Count; i < length; i++)
        {
            xlWorksheet.Cells[startRow, dateCol]= Date[i];
            dateCol++;
        }

        startRow++;

        for (int j = 0, valueLen = DataPackage.Length; j < valueLen; j++)
        {
            int dataColTemp = dataCol;
            xlWorksheet.Cells[startRow, dataColTemp] = PointNo[j];
            dataColTemp++;
            if (DataPackage[j].Length == 0)
            {
                startRow++;
                continue;
            }
            for (int i = 0, length = Date.Count; i < length; i++)
            {
                for (int k = 0, checkLen = DataPackage[j].Length; k < checkLen; k++)
                {
                    if (DataPackage[j][k][0].Equals(Date[i]))
                    {
                        xlWorksheet.Cells[startRow, dataColTemp] = DataPackage[j][k][1];
                        dataColTemp++;
                        break;
                    }

                }
            }
            startRow++;
        }

        xlWorkbook.SaveAs(target, Excel.XlFileFormat.xlOpenXMLWorkbook, Missing.Value,
    Missing.Value, false, false, Excel.XlSaveAsAccessMode.xlNoChange,
    Excel.XlSaveConflictResolution.xlUserResolution, true,
    Missing.Value, Missing.Value, Missing.Value);

        //cleanup
        GC.Collect();
        GC.WaitForPendingFinalizers();

        //rule of thumb for releasing com objects:
        //  never use two dots, all COM objects must be referenced and released individually
        //  ex: [somthing].[something].[something] is bad

        //release com objects to fully kill excel process from running in the background

        Marshal.ReleaseComObject(xlWorksheet);

        //close and release
        xlWorkbook.Close();
        Marshal.ReleaseComObject(xlWorkbook);

        //quit and release
        xlApp.Quit();
        Marshal.ReleaseComObject(xlApp);
        return true;
    }
        public static bool writeExcelSID(string[][][] DataPackage, string[][] MeaDate, string FileName, string target)
    {
        //Create COM Objects. Create a COM object for everything that is referenced
        Excel.Application xlApp = new Excel.Application();
        Excel.Workbook xlWorkbook = xlApp.Workbooks.Open(FileName,0, false, 5, "", "", false, Excel.XlPlatform.xlWindows, "",true, false, 0, true, false, false);
        Excel._Worksheet xlWorksheet = (Excel._Worksheet)xlWorkbook.ActiveSheet;
        int startRow = 8;
        
        int dateCol = 15;
        for (int i = 0, length = MeaDate.Length; i < length; i++)
        {
            xlWorksheet.Cells[startRow, dateCol] = MeaDate[i][1];
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
                        xlWorksheet.Cells[startRow, dataCol] = DataPackage[i][k][1];
                        dataCol++;
                        break;
                    }

                }
            }
            startRow++;
        }

        //xlWorksheet.Cells[1, 26] = "TEST WRITE";
        //iterate over the rows and columns and print to the console as it appears in the file
        //excel is not zero based!!
        //for (int i = 1; i <= rowCount; i++)
        //{
        //    for (int j = 1; j <= colCount; j++)
        //    {
        //        //new line
        //        if (j == 1)
        //            Console.Write("\r\n");
        //
        //            xlWorksheet.Cells[1, 26] = "TEST WRITE";
        //        //write the value to the console
        //        if (xlRange.Cells[i, j] != null && xlRange.Cells[i, j] != null)
        //            Console.Write(xlRange.Cells[i, j].ToString() + "\t");
        //    }
        //}

        xlWorkbook.SaveAs(target, Excel.XlFileFormat.xlOpenXMLWorkbook, Missing.Value,
    Missing.Value, false, false, Excel.XlSaveAsAccessMode.xlNoChange,
    Excel.XlSaveConflictResolution.xlUserResolution, true,
    Missing.Value, Missing.Value, Missing.Value);

        //cleanup
        GC.Collect();
        GC.WaitForPendingFinalizers();

        //rule of thumb for releasing com objects:
        //  never use two dots, all COM objects must be referenced and released individually
        //  ex: [somthing].[something].[something] is bad

        //release com objects to fully kill excel process from running in the background
  
        Marshal.ReleaseComObject(xlWorksheet);

        //close and release
        xlWorkbook.Close();
        Marshal.ReleaseComObject(xlWorkbook);

        //quit and release
        xlApp.Quit();
        Marshal.ReleaseComObject(xlApp);
        return true;
    }
}