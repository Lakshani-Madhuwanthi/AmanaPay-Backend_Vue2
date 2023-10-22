<template>
  <div class="card" style="margin: 10px;">
    <div class="card-content">
        <div class="column" style="font-weight: bold; margin-left: 10px">Weekly Claim Amount - Customers
        </div>
    </div>
    <div class="card-content">
      <vue-apex-charts ref="barChart" type="bar" width="480" :options="chartOptions" :series="series"></vue-apex-charts>
    </div>
  </div>
</template>
  
<script>
import VueApexCharts from "vue-apexcharts";
import NetworkManager from "@/network";


export default {
  name: "WeeklyClaimAmountBarChart",
  components: {
    VueApexCharts: VueApexCharts,
  },
  data() {
    return {
      series: [{
        name: 'Amount',
        data: []
      }],
      chartOptions: {
        chart: {
          width: 480,
          type: 'bar',
          toolbar: {
        show: false
        },
        },
        colors: ['#AD51B2'],
        xaxis: {
          categories: [],
          title: {
            text: 'week'
          }
        },
        yaxis: {
          title: {
            text: 'Claim Amount(USD)'
          }
        },
        dataLabels: {
              enabled: false // set this to false to remove the data labels
            },
      },
    }
  },

  watch: {
    dateRange() {
      this.selectedFilter = { value: 0, text: 'Custom' }
    },
  },

  methods: {


    loadData: function () {
      const self = this
      NetworkManager.apiRequest('api/DFDashboard/ministry-claimed-amount', {}, function (e) {
        if (e.statusCode === 200) {
          self.series = [{
            name: 'Amount',
            data: e.data.claimed_amount
          }]
          self.$refs.barChart.updateOptions({
            xaxis: {
              categories: e.data.day,
            }
          })
        }
        else {
          //
        }
      })


    }
  },

  mounted() {
    this.loadData()
  }
}
</script>
  
<style scoped></style>
  