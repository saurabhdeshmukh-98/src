const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const excelJs = require("exceljs");
const PDFDocument = require("pdfkit");
const UploadExcel = require("../entity/xlsx_file");
const axios=require('axios')
const read = async (req, res) => {
    let data = [];
    let msg = [];
    const path = req.file.path;
    console.log("path",req.file.path);
    const wb = new excelJs.Workbook();
    await wb.xlsx.readFile(req.file.path);
    fs.unlinkSync(req.file.path)
    const sheetCount = wb.worksheets.length;
  
    // Check empty sheets
    if (sheetCount === 0) {
      msg.push({ message: "Workbook empty." });
    } else {
      for (let i = 0; i < sheetCount; i++) {
        let sheet = wb.worksheets[i];
        sheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
          if (rowNumber === 1) {
            // Checking if Header exists
            if (!row.hasValues) {
              msg.push({ status: "Error", message: "Empty Headers" });
            } else if (row.values[1] !== "Name" || row.values[2] !== "Age") {
              msg.push({
                location: "Row " + rowNumber,
                message: "Incorrect Headers",
              });
            }
          }
          // Checking only those rows which have a value
          else if (row.hasValues) {
            const alphabetRegex = new RegExp(/[a-zA-Z]+/);
            const numberRegex = new RegExp(/[0-9]+/);
            if (
              row.cellCount === 2 &&
              row.values[1] !== undefined &&
              row.values[2] !== undefined &&
              alphabetRegex.test(row.values[1]) &&
              numberRegex.test(row.values[2])
            ) {
              data.push({ Name: row.values[1], Age: row.values[2] });
            } else {
              msg.push({
                location: "Row " + rowNumber,
                message: "Incorrect or missing values.",
              });
            }
          }
        });
      }
    }
  console.log("Msg: ", msg);
  console.log("data: ", data);
  let resp;
  if (errMsg.length > 0) {
    throw "Unable to Upload Excel file";
  } else {
    resp = await user.bulkCreate(data);
  }
  if (resp.length > 0) {
    await axios.get("http://localhost:5051/get");
  }
};


const DownloadPDFfile = async (req, res) => {
  try {
    const resp = await UploadExcel.findAll({
      where: {},
      attributes: {
        exclude: ["Name", "id"],
      },
    });
    //console.log(resp);

    let sum = 0;
    let count = 0;
    let array = [];
    for (let index = 0; index < resp.length; index++) {
      array.push(parseInt(resp[index].Age));
      count++;
    }
    array.map((res) => {
      sum += res;
    });

    console.log("Sum of age:", sum);
    console.log("Count :", count);

    // Create a document
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream("./Upload/Name_Age_output.pdf"));
    doc
      .fontSize(25)
      .text(
        `total records in xlsx file: ${count} || average:${(
          sum / count
        ).toPrecision(3)}`
      );
    doc.end();
    res.send("pdf converted successfully");
  } catch (error) {
    console.log(error);
  }
};

//Validation function
function validateHeaders(headerRow) {
  if (headerRow[1] !== "Name" || headerRow[2] !== "Age") {
    return { status: "ERROR", location: "ROW 1", message: "Incorrect Header." };
  } else {
    return { status: "SUCCESS" };
  }
}

function onlyAlphabets(str) {
  return /^[a-zA-Z]+$/.test(str);
}

function containsOnlyNumbers(str) {
  return /^[0-9]+$/.test(str);
}

module.exports = {
  read,
  DownloadPDFfile,
};
