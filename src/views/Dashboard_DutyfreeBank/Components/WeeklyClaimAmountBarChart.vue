<template>
  <div class="card" style="margin: 10px;">
    <div class="card-content">
      <div class="columns">
        <div class="column is-four-fifths" style="font-weight: bold; margin-left: 10px">Monthly Duty Free Claim Request - Customers
        </div>
        
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
        name: 'DF Requests',
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
            text: 'months'
          }
        },
        yaxis: {
          title: {
            text: 'Number of Allowances'
          }
        },
        dataLabels: {
              enabled: false // set this to false to remove the data labels
            },
      },
    }
  },

  methods: {
    loadData: function () {
      const self = this
      NetworkManager.apiRequest('api/DFDashboard/get-total-requests-by-month', {}, function (e) {
        if (e.statusCode === 200) {
          self.series = e.data.transactions
          self.$refs.barChart.updateOptions({
            xaxis: {
              categories: e.data.monthNames
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
  