<template>
  <div>
    <div v-if="errorMessage" class="has-text-danger">
      {{ errorMessage }}
    </div>
    <b-field label="Upload a CSV file">
      <b-upload v-model="file" accept=".csv" name="csvFile" @input="handleFileUpload">
        <a class="button" style="width:200px;height:200px;">
          <img src="../assets/Group csv.png" alt="csv file">
        </a>
      </b-upload>
      <div v-if="fileName">{{ fileName }}</div>
    </b-field>
    <div v-if="tableData">
      <b-table :data="tableData" :columns="tableColumns"></b-table>
    </div>
  </div>
</template>

<script>
import Papa from 'papaparse';
// import NetworkManager from "@/network"

export default {
  name: 'CsvUploadComponent',
  props: ['filterList', 'fromDate', 'toDate'],
  data() {
    return {
      file: null,
      fileName: '',
      errorMessage: '',
      tableData: null,
      tableColumns: [
        {
          field: 'date',
          label: 'Date',
          sortable: true
        },
        {
          field: 'nic',
          label: 'NIC',
          sortable: true
        },
        {
          field: 'passport',
          label: 'Passport',
          sortable: true
        },
        {
          field: 'reference',
          label: 'Reference',
          sortable: true
        },
        {
          field: 'currency',
          label: 'Currency',
          sortable: true
        },
        {
          field: 'amount',
          label: 'Remitted Amount',
          sortable: true
        }
      ]
    };
  },
  methods: {
    handleFileUpload() {
      // Check file size
      if (this.file.size > 50000000) {
        this.errorMessage = 'File size exceeds the maximum limit of 50MB';
        this.fileName = '';
        this.tableData = null;
        return;
      }

      this.fileName = this.file.name;
      this.errorMessage = '';

      // Parse the file using Papa.parse()
      Papa.parse(this.file, {
        header: true,
        beforeFirstChunk: (chunk) => {
          const self = this
          // Check if 'nic' and 'passport' fields exist in the file
          const fields = chunk.split('\n')[0].split(',');
          if (!fields.includes('nic')) {
            self.errorMessage = 'The CSV file must contain "NIC" field'
            self.tableData = [];
            throw new Error(this.errorMessage);
          }
        },
        complete: (results) => {
          const self = this
          let isValid = true

          let arr = []

          results.data.forEach(function (item) {
            console.log('This is the item',item)
            if (item.nic) {
              if (!self.filterList.includes(item.nic.toLowerCase())) {
                isValid = false
              }
              if (item.date) {
                let date = new Date(item.date)


                console.log(date)
                console.log(self.fromDate)
                console.log(self.toDate)
                console.log(item.date)

                if (date.getTime() >= self.fromDate.getTime() && date.getTime() <= self.toDate.getTime()) {
                  item.date = self.formatDate(date)
                  arr.push(item)
                }
                else {
                  isValid = false;
                }
              }
              else {
                isValid = false
              }
            }
          })

          if (isValid) {
            self.tableData = arr;
            console.log('tableData is assigned:', self.tableData)
            self.$emit('input', self.tableData)
          }
          else {
            self.errorMessage = 'Some fields in the CSV file is invalid';
            console.log('tableData is empty:', self.tableData);
            self.tableData = [];
            console.log('tableData is empty:', self.tableData);
            throw new Error(self.errorMessage);
          }
        },
        error: (error) => {
          console.error(error);
        },
      });
    },
  },

};
</script>

<!-- <b-upload ref="fileInput" accept=".csv" @change="handleFileUpload">
  <a class="button" style="width:200px;height:200px;">
    <img src="../assets/Group csv.png" alt="">
  </a>
  <div v-if="csvFileName">
    Uploaded file: {{ csvFileName }}
  </div>
</b-upload> -->
<style>
.has-text-danger {
  color: #f14668;
}
</style>