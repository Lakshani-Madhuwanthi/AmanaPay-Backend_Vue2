// import * as XLSX2 from "xlsx"
import * as XLSX from "xlsx"

import {jsPDF} from 'jspdf'
import autoTable from "jspdf-autotable"

export class TransactionExportWizard {
    title

    constructor(title)
    {
        this.title = title
    }

    exportToXlsx(reportGeneratedOn, generatedBy, selectedStartDate,
                 selectedEndDate, reportFileName, headers, jsonData){

        const self = this

        let Heading = [[]]
        let Data = []
        headers.forEach(function (item){
            Heading[0].push(item.header)
        })

        jsonData.forEach((item) => {
            let x = {}

            headers.forEach((header) => {
                x[header.dataKey] = item[header.dataKey]
            })

            Data.push(x)
        })

        console.log(jsonData)
        console.log(Data)

        //Had to create a new workbook and then add the header
        const wb = XLSX.utils.book_new()
        const sheet = XLSX.utils.json_to_sheet([])

        sheet["A1"] = { //Assign values to A1 cells
            t: "s", // cell value type (s: string)
            v: self.title, // raw value (v)
            s: {
                font: {
                    //name: 'Song Style',
                    sz: 24,
                    bold: true,
                    underline: false,
                    color: {
                        rgb: "000000"
                    }
                },
                alignment: {
                    horizontal: "left",
                    vertical: "center",
                    wrap_text: true
                }
            }
        }

        sheet["A4"] = {
            t: "s",
            v: 'On ' + reportGeneratedOn + ' by ' + generatedBy,
        }

        sheet["A6"] = { t: "s", v: 'Duration'}
        sheet["B6"] = { t: "s", v: selectedStartDate +' to '+ selectedEndDate}

        if(!sheet["!merges"]){
            sheet["!merges"] = []
        }
        //['!merges'] This property is designed for cell merging
        sheet["!merges"].push({//If not null push is null = assign
            //Merge cell index starts at 0
            s: { //s Start
                c: 0, //Beginning column
                r: 0 //Start Line
            },
            e: { //e End
                c: 26, //End Column
                r: 2 //End line
            }
        })
        sheet["!merges"].push({s: {c: 0, r: 3 }, e: { c: 26, r: 3 }})
        sheet["!merges"].push({s: {c: 0, r: 4 }, e: { c: 26, r: 4 }})
        sheet["!merges"].push({s: {c: 1, r: 5 }, e: { c: 26, r: 5 }})
        sheet["!merges"].push({s: {c: 1, r: 6 }, e: { c: 26, r: 6 }})
        sheet["!merges"].push({s: {c: 1, r: 7 }, e: { c: 26, r: 7 }})
        sheet["!merges"].push({s: {c: 1, r: 8 }, e: { c: 26, r: 8 }})

        sheet['!cols'] = [
            {wch:10},
            {wch:15},
            {wch:10},
            {wch:20},
            {wch:15}
        ]

        XLSX.utils.sheet_add_aoa(sheet, Heading, { origin: 'A10' })

        //Starting in the second row to avoid overriding and skipping headers
        XLSX.utils.sheet_add_json(sheet, Data, { origin: 'A11', skipHeader: true })

        XLSX.utils.book_append_sheet(wb, sheet, 'Sheet1')

        XLSX.writeFile(wb, reportFileName + '.xlsx')
    }

    exportToPDF(reportGeneratedOn, generatedBy, selectedStartDate,
                selectedEndDate, reportFileName, headers, jsonData){

        const self = this
        const doc = new jsPDF('l', 'mm', "a1");

        doc.setFontSize(22)
        doc.text(self.title, 30, 30)

        doc.setTextColor(20)
        doc.setFontSize(10)
        doc.text('On ' + reportGeneratedOn + ' by ' + generatedBy , 30, 42)

        doc.setTextColor(0)
        doc.setFontSize(12)
        doc.text('Duration   :  ' + selectedStartDate +' to '+ selectedEndDate , 30, 60)


        doc.setFontSize(11)
        doc.setTextColor(100)

        let col = []
        let columnStyles = {}

        // const columnWidth = 'auto'

        for (const item of headers) {
            col.push({ header: item.header, dataKey: item.dataKey })
            if(item.type === "DOUBLE") columnStyles[item.dataKey] = { halign: 'right', }
        }

        autoTable(doc, ({
            columnStyles: columnStyles, // European countries centered
            body: jsonData,
            columns: col,
            startY: 100
        }))

        doc.setProperties({
            title: self.title,
            subject: self.title
        })

        doc.save(reportFileName + '.pdf') // for download file

    }
}

