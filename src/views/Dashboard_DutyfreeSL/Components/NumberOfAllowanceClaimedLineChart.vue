<template>
    <div class="card" style="margin: 10px; min-height: 300px">
      <div class="card-content">
        <div style="font-weight: bold; margin-left: 10px">Value Of Claimed Allowances</div>
  
        <vue-apex-charts ref="lineChart" type="line" height="250" :options="chartOptions" :series="chartSeries"></vue-apex-charts>
      </div>
    </div>
  </template>
    
    <script>
    import VueApexCharts from "vue-apexcharts";
    import NetworkManager from "@/network";
    
    export default {
      name: "NumberOfAllowanceClaimedLineChart",
      components: { VueApexCharts },
      data() {
        return {

            chartSeries: [],
            chartOptions: {
                chart: {
                    height: 250,
                    type: 'line',
                    zoom: {
                        enabled: false
                    },
                    toolbar: {
                        show: false // hide the toolbar
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth',
                    width: 2
                },
                title: {
                    text: ''
                },
                grid: {
                    row: {
                        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                        opacity: 0.5
                    },
                },
                xaxis: {
                    categories: [],
                    title: {
                        text: 'Months'
                    }
                },
                yaxis: {
                    title: {
                        text: 'Number of Allowances'
                    }
                },
                legend: {
                    position: 'top'
                }
            }

        }
    },
    
      methods: {
        loadData: function() {
          const self = this;
    
          NetworkManager.apiRequest('api/DFDashboard/custom-allowance-claimed', {}, function(e) {
            if (e.statusCode === 200) {
              const seriesData = {};
    
              // Initialize seriesData object with an empty array for each unique name
              e.data.filteredList.forEach(item => {
                if (!seriesData[item.name]) {
                  seriesData[item.name] = Array(e.data.months.length).fill(0);
                }
              });
    
              // Populate seriesData with the claimed_amount values for each name and month
              e.data.filteredList.forEach(item => {
                const monthIndex = e.data.months.indexOf(item.month);
                seriesData[item.name][monthIndex] += item.claimed_amount;
              });
    
              // Prepare the series array for chartSeries
              self.chartSeries = Object.keys(seriesData).map(name => ({
                name,
                data: seriesData[name]
              }));
    
              self.$refs.lineChart.updateOptions({
                xaxis: {
                  categories: e.data.months
                }
              });
            } else {
              // Handle the error case
            }
          });
        }
      },
    
      mounted() {
        this.loadData();
      }
    };
    </script>
    
    
  <style scoped></style>
  <!-- data() {
    return {
      chartOptions: {
        // ...existing options...
      },
      chartSeries: [] // To store the series data dynamically
    };
  }, -->