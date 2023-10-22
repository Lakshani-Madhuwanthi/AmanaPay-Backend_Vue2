<template>
  <div class="card" style="margin: 10px;  min-height: 300px">
    <div class="card-content">
      <div class="columns">
        <div class="column is-half" style="font-weight: bold; margin-left: 10px">All Duty Free
          Claims-Merchants</div>
        <div class="column">
          <b-field>
            <b-datepicker @input="loadData" v-model="dateRange" :mobile-native="false" range>
              <template v-slot:trigger>
                <div style="display: flex; align-items: center;">
                  <span style="color:blueviolet; margin-right: 5px;"><b>Custom</b></span>
                  <b-icon icon="calendar-month-outline" custom-color="blueviolet" aria-hidden="true"
                    aria-label="Calendar icon" style="color:blueviolet;" />
                </div>
              </template>
            </b-datepicker>
          </b-field>
        </div>
        <div class="column">
          <b-dropdown @change="loadData" class="is-pulled-right" v-model="selectedFilter"
            aria-role="list">
            <template #trigger>
              <b-button type="is-primary" size="is-small" icon-right="menu-down" outlined
                style="border: none; box-shadow: none; font-size: 14px;">
                <b>{{ selectedFilter.text }}</b>
              </b-button>
            </template>
            <b-dropdown-item v-for="item in filters" :key="item.id" :value="item" aria-role="listitem">
              <span>{{ item.text }}</span>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
      <div class="card-content">
        <vue-apex-charts ref="pieChart" type="pie" width="450" :options="chartOptions" :series="series"></vue-apex-charts>
      </div>
    </div>

  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import NetworkManager from "@/network";

const today = new Date()

export default {
  name: "RangeOfDutyFreePieChart",
  components: {
    VueApexCharts: VueApexCharts,
  },
  data() {
    return {
      dateRange: [today, today],
      selectedFilter: { value: 365, text: 'Last Year' },
      filters: [
        { value: 7, text: 'This Week' },
        { value: 14, text: 'Last Two Weeks' },
        { value: 30, text: 'Last Month' },
        { value: 90, text: 'Last Three Months' },
        { value: 365, text: 'Last Year' },
        { value: 0, text: 'Custom' },
      ],
      series: [],
      chartOptions: {
        chart: {
          width: 450,
          height: 500,
          type: 'pie',
        },
        labels: [],
        legend: {
          position: 'left',
        },
        title: {
          text: '',
          align: 'left'
        },
        colors: ['#CA498C', '#B977AC', '#CF9BBD', '#E6BFCE', '#FDE3DF'],
        responsive: [{
          breakpoint: 380,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            },
          }
        }]
      },
    }
  },

  watch: {
    dateRange() {
      this.selectedFilter = { value: 0, text: 'Custom' }
    },
  },
  methods: {
    formatDate: function (date) {
      let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2)
        month = '0' + month;
      if (day.length < 2)
        day = '0' + day;

      return [year, month, day].join('-');
    },
    loadData: function () {
      const self = this

      setTimeout(() => {
        const data = {
          range: self.selectedFilter.value,
          fromDate: self.formatDate(self.dateRange[0]) + "T00:00:00",
          toDate: self.formatDate(self.dateRange[1]) + "T23:59:59"
        }

        NetworkManager.apiRequest('api/DFDashboard/custom-allowance-criteria', data, function (e) {
          if (e.statusCode === 200) {
            self.series = e.data.categoryCounts

            self.$refs.pieChart.updateOptions({
              labels: e.data.categoryNames
            })

          }
          else {
            //
          }
        })
      }, 200)
    }
  },

  mounted() {
    this.loadData()
  }

}
</script>

<style scoped></style>
