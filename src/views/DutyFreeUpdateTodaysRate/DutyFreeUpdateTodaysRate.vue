<template>
  <section style=" overflow-y: auto; overflow-x: hidden;">
    <div class="container" style="height:78vh; width:85vw">
      <div class="card-header p-3">
        <div class="columns">
          <div class="column">
            <b-breadcrumb align="is-left">
              <b-breadcrumb-item tag='router-link' to="" active>Rates by Central Bank</b-breadcrumb-item>
            </b-breadcrumb>
          </div>
        </div>
      </div>
      <change-request v-if="hasPermission('df-cbsl-approve')" :data="crData" :filter-out="filterOutFromCR"
        :is-loading="crIsLoading" @approve-or-reject="approve_or_reject" />
      <div v-show="hasPermission('df-cbsl-create')" class="mt-2 p-5 mb-2">
        <div class="columns">
          <div class="column is-two-fifths">
            <p><b>Add Today's Rate</b></p>
            <b-field class="mt-2" label="Select Date" horizontal style="padding:20px 0; font-size: 15px;">
              <b-datepicker v-model="Today" size="is-small" :show-week-number="false" placeholder="Click to select..."
                icon="calendar-today" trap-focus style="width: 200px;">
              </b-datepicker>

              <b-dropdown :disabled="isTableLoading" class="is-pulled-right" v-model="selectedCurrencyFilter"
                aria-role="list">
                <template #trigger>
                  <b-button size="is-small" icon-right="menu-down" outlined
                    style="border: none; box-shadow: none; font-size: 14px;">
                    <b>{{ selectedCurrencyFilter.text }}</b>
                  </b-button>
                </template>
                <b-dropdown-item v-for="item in currencyFilters" :key="item.id" :value="item" aria-role="listitem">
                  <span>{{ item.text }}</span>
                </b-dropdown-item>
              </b-dropdown>

            </b-field>
          </div>
          <div class="column is-one-quarter">
            <b-field label="Rate(LKR):" style="padding:20px 0; max-width: 200px;">
              <b-input v-model="Rate" size="is-small" placeholder="0.00"></b-input>
            </b-field>
          </div>
          <div class="column is-narrow mt-3">
            <div>
              <div v-if="errorMessage" class="has-text-danger">
                {{ errorMessage }}
              </div>
              <b-field label="Upload a CSV file">
                <b-upload v-model="file" accept=".csv" name="file" @input="handleFileUpload">
                  <a class="button" style="width:100px;">
                    <img src="../../assets/Group csv.png" alt="csv file">
                  </a>
                </b-upload>
                <div v-if="fileName">{{ fileName }}</div>
              </b-field>
            </div>
          </div>
          <div class="column">
            <b-button type="is-primary" class="mt-6" size="is-small" style="width:90px; height:30px;" @click="submitData"
              :disabled="submitting">Submit
            </b-button>
          </div>
        </div>
      </div>
      <hr v-show="hasPermission('df-cbsl-create')">
      <div class="mt-1 p-5">
        <p><b>Past Rates</b></p>
        <div class="columns">
          <div class="column is-narrow mt-5">
            <b-dropdown @change="loadData" :disabled="isTableLoading" v-model="selectedFilter" aria-role="list">
              <template #trigger>
                <b-button size="is-small" icon-right="menu-down" outlined
                  style="border: none; box-shadow: none; font-size: 14px;">
                  <b>{{ selectedFilter.text }}</b>
                </b-button>
              </template>
              <b-dropdown-item v-for="item in filters" :key="item.id" :value="item" aria-role="listitem">
                <span>{{ item.text }}</span>
              </b-dropdown-item>
            </b-dropdown>
          </div>
          <div class="column mt-1">
            <b-field label="Select Date" horizontal style="padding:20px 0;">
              <b-datepicker v-model="fromDate" @input="onFromDateChange()" size="is-small" :show-week-number="false"
                placeholder="Click to select..." icon="calendar-today" trap-focus></b-datepicker>
              <b-field class="is-small" label="To" horizontal>
                <b-datepicker v-model="toDate" @input="filterChanged = true" size="is-small" :min-date="fromDate"
                  :show-week-number="false" placeholder="Click to select..." icon="calendar-today" trap-focus>
                </b-datepicker>
              </b-field>
            </b-field>
          </div>
          <div class="column">
            <div class="is-flex is-justify-content-flex-start pl-5">
              <b-button type="is-primary" class="mt-5 is-small" @click="loadData" style="width:90px; height:30px;">Submit
              </b-button>
            </div>
          </div>
        </div>

        <div style="max-width: 1020px;">
          <b-table :loading="isTableLoading" :data="data" bordered>
            <b-table-column field="id" label="Date" v-slot="props" width="200px">
              {{ formatDate(props.row.date) }}
            </b-table-column>
            <b-table-column field="type" label="Currency" v-slot="props" width="200px">
              {{ props.row.currency }}
            </b-table-column>
            <b-table-column field="type" label="Buy Rate(LKR)" v-slot="props" width="200px">
              {{ props.row.exchange_rate.toFixed(4) }}
            </b-table-column>
          </b-table>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import NetworkManager from "@/network";
import ChangeRequest from "@/components/ChangeRequest"
// import Papa from "papaparse";
// import XLSX from "xlsx"

export default {
  name: "DutyFreeUpdateTodaysRate",
  components: {
    ChangeRequest
  },
  data() {
    return {
      Today: new Date(),
      crData: [],
      filterOutFromCR: ['id', 'created_at', 'updated_at', 'locked'],
      crIsLoading: false,
      filterChanged: false,
      filteredList: ['id', 'Date', 'currency'],
      filters: [
        { value: 'USD', text: 'USD' },
        { value: 'INR', text: 'INR' },
        { value: 'GPB', text: 'GPB' },
        { value: 'EUR', text: 'EUR' },
        { value: 'JPY', text: 'JPY' },
        { value: 'CAD', text: 'CAD' },

      ],
      currencyFilters: [
        { value: 'USD', text: 'USD' },
        { value: 'INR', text: 'INR' },
        { value: 'GPB', text: 'GPB' },
        { value: 'EUR', text: 'EUR' },
        { value: 'JPY', text: 'JPY' },
        { value: 'CAD', text: 'CAD' },

      ],
      file: null,
      fileName: '',
      errorMessage: '',
      disabled: {
        value: 0
      },
      parsedCsvData: [],
      isTableLoading: false,
      data: [],
      Rate: '',
      fromDate: new Date(),
      toDate: new Date(),
      selectedFilter: { value: 'USD', text: 'USD' },
      selectedCurrencyFilter: { value: 'USD', text: 'USD' },
      submitting: false,
    }
  },

  watch: {
    fromDate() {
      this.filterChanged = true
    },

    toDate() {
      this.filterChanged = true
    }
  },

  methods: {
    handleFileUpload() {
      if (!this.file) {
        return;
      }

      // Check file size (adjust the limit as needed)
      const maxSize = 50000000; // 50MB
      if (this.file.size > maxSize) {
        this.errorMessage = 'File size exceeds the maximum limit of 50MB';
        this.fileName = '';
        return;
      }

      this.fileName = this.file.name;
      this.errorMessage = '';

      const reader = new FileReader();

      reader.onload = () => {
        const fileContent = reader.result;

        // console.log('File content:', fileContent);
        if (this.fileName.endsWith('.csv')) {
          console.log(fileContent);
          this.parseCsv(fileContent);
        } else {
          this.errorMessage = 'Unsupported file format';
        }
      };
      console.log(this.file)
      // Pass the File object directly to readAsArrayBuffer
      reader.readAsArrayBuffer(this.file);
    },

    parseCsv(fileContent) {
      const textContent = new TextDecoder('utf-8').decode(fileContent);
      const lines = textContent.split('\n'); // Split into lines
      const headers = lines[0].split(','); // Assuming the first line contains headers
      const data = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const entry = {};

        for (let j = 0; j < headers.length; j++) {
          let value = values[j].trim(); // Remove leading/trailing whitespace
          value = value.replace(/\r$/, ''); // Remove carriage return character if present
          entry[headers[j]] = value;
        }

        data.push(entry);
      }
      this.parsedCsvData = data
      console.log('Parsed CSV data:', data);
      // this.bulkUpdate(data);
    },
    bulkUpdate() {
      const self = this;
      console.log(self.parsedCsvData);
      const exchangeRates = self.parsedCsvData.map((row) => {
        // Check if the "Exchange_Rate" column exists in the row
        const exchangeRateColumnName = Object.keys(row).find(key => key.trim() === 'Exchange_Rate');

        if (exchangeRateColumnName) {
          // Remove any non-numeric characters and convert to a float
          const exchangeRateValue = parseFloat(row[exchangeRateColumnName].replace(/[^0-9.]/g, ''));

          return {
            date: row['Date'],
            currency: row['Currency'],
            exchange_rate: isNaN(exchangeRateValue) ? null : exchangeRateValue, // Handle NaN values
          };
        } else {
          // Handle the case where "Exchange Rate" column is missing or undefined
          return {
            date: row['Date'],
            currency: row['Currency'],
            exchange_rate: null, // Set exchange_rate to null if the column is missing
          };
        }
      });
      const payload = {
        exchangeRates,
      };
      console.log(payload);

      NetworkManager.apiRequest('api/dutyfree/DFExchangeRate/bulk-update', payload, (response) => {
        if (response.statusCode === 200) {
          const params = {
            type: 'is-success',
            message: 'Exchange rates uploaded successfully',
          };
          this.fileName= ''
          self.$buefy.toast.open(params);
          

        } else {
          const params = {
            type: 'is-warning',
            message: 'File upload failed: ' + response.data.message,
          };
          self.$buefy.toast.open(params);
        }
        location.reload()
      });
    }
    ,
    submitData() {
      if (this.file) {
        // if (!this.fileName) {
        // // The file has no name, show an error message or take appropriate action.
        // this.errorMessage = 'you want to upload a new file';
        // return;
        // }
        // A file is uploaded, call the bulk-update API
        this.bulkUpdate();
      } else {
        // No file uploaded, call the rateUpdate function
        this.rateUpdate();
      }
    },
    onFileChange(file) {
      this.file = file;
    },
    onFromDateChange: function () {
      const self = this

      if (self.toDate.getTime() < self.fromDate.getTime()) {
        self.toDate = self.fromDate
      }
    },
    rateUpdate: function () {
      const self = this

      if (self.Rate <= 0) {
        const params = {
          type: 'is-warning',
          message: "Please enter a valid rate"
        }
        self.$buefy.toast.open(params)
        return
      }

      self.submitting = true

      self.Today.setSeconds(1)

      self.isTableLoading = true
      let data = {
        Date: self.formatDateTime(self.Today),
        currency: self.selectedCurrencyFilter.text,
        exchange_rate: self.Rate

      }
      console.log(data)

      NetworkManager.apiRequest('api/dutyfree/DFExchangeRate/create-exchange-rate', data, function (e) {
        if (e.statusCode === 200) {
          const params = {
            type: 'is-success',
            message: 'Update sent for approval'
          }
          self.$buefy.toast.open(params)

        } else if (e.statusCode === 400) {
          const params = {
            type: 'is-warning',
            message: e.data.message
          }
          self.$buefy.toast.open(params)

        } else {
          const params = {
            type: 'is-warning',
            message: 'update save failed!.'
          }
          self.$buefy.toast.open(params)

        }
        self.isTableLoading = false
        self.submitting = false
        location.reload()
      })
    },
    loadData: function () {
      const self = this

      // Check if user has selected a date range or currency
      if (self.fromDate && self.toDate && self.selectedFilter) {
        // Use selected date range and currency to retrieve data
        self.fromDate.setSeconds(1)
        self.toDate.setSeconds(0)
        let data = {
          date_from: self.formatDateTime(self.fromDate),
          date_to: self.formatDateTime(self.toDate),
          currency: self.selectedFilter.text
        }
        self.showFullScreenLoader()
        NetworkManager.apiRequest('api/dutyfree/DFExchangeRate/list-exchange-rate', data, function (e) {
          if (e.statusCode === 200) {
            self.crData = e.data.changeRequests
            self.data = e.data.exchange_rate
          }
          self.hideFullScreenLoader()
        })
      }
    },

    approve_or_reject: function (data) {
      const self = this
      this.crIsLoading = true

      NetworkManager.apiRequest('api/dutyfree/DFExchangeRate/approve-exchange-rate', data, function (e) {
        if (e.statusCode === 200) {
          const params = {
            type: 'is-success',
            message: 'update ' + data.actionTaken + ' successfully'
          }
          self.$buefy.toast.open(params)
          location.reload()
        } else {
          const params = {
            type: 'is-warning',
            message: 'update ' + data.actionTaken + ' failed!'
          }
          self.$buefy.toast.open(params)
        }

        self.crIsLoading = false
      })
    }
  },

  mounted() {
    let fromDate = new Date()
    fromDate.setHours(0)
    fromDate.setMinutes(0)
    fromDate.setSeconds(0)
    fromDate.setDate(fromDate.getDate() - 10)

    let toDate = new Date()
    toDate.setHours(23)
    toDate.setMinutes(59)
    toDate.setSeconds(59)

    this.fromDate = fromDate
    this.toDate = toDate

    this.loadData()
    this.data.disabled.value = 0
  }
}
</script>

<style></style>