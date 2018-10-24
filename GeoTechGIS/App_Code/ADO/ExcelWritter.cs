using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Web;
using Excel = Microsoft.Office.Interop.Excel;

/// <summary>
/// Summary description for Class1
/// </summary>
public class ExcelWritter
{
    public ExcelWritter()
    {
    }
    public static void getExcelFile()
    {

        //Create COM Objects. Create a COM object for everything that is referenced
        Excel.Application xlApp = new Excel.Application();
        Excel.Workbook xlWorkbook = xlApp.Workbooks.Open(@"E:\geo science taiwan\Report-BS-5-R-01.XLS");
        Excel._Worksheet xlWorksheet = (Excel._Worksheet)xlWorkbook.ActiveSheet;
        Excel.Range xlRange = xlWorksheet.UsedRange;

        int rowCount = xlRange.Rows.Count;
        int colCount = xlRange.Columns.Count;

        //iterate over the rows and columns and print to the console as it appears in the file
        //excel is not zero based!!
        for (int i = 1; i <= rowCount; i++)
        {
            for (int j = 1; j <= colCount; j++)
            {
                //new line
                if (j == 1)
                    Console.Write("\r\n");

                    xlWorksheet.Cells[1, 26] = "TEST WRITE";
                //write the value to the console
                if (xlRange.Cells[i, j] != null && xlRange.Cells[i, j] != null)
                    Console.Write(xlRange.Cells[i, j].ToString() + "\t");
            }
        }

        //cleanup
        GC.Collect();
        GC.WaitForPendingFinalizers();

        //rule of thumb for releasing com objects:
        //  never use two dots, all COM objects must be referenced and released individually
        //  ex: [somthing].[something].[something] is bad

        //release com objects to fully kill excel process from running in the background
        Marshal.ReleaseComObject(xlRange);
        Marshal.ReleaseComObject(xlWorksheet);

        //close and release
        xlWorkbook.Close();
        Marshal.ReleaseComObject(xlWorkbook);

        //quit and release
        xlApp.Quit();
        Marshal.ReleaseComObject(xlApp);
    }
}