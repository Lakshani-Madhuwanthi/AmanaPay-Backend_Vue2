<template>
    <div class="block">
    <div style=" overflow-y: auto; overflow-x: hidden">
      <div class="container" style="height: 78vh; width: 75vw;">

        <total-number-of-duty-free-claims></total-number-of-duty-free-claims>
        <range-of-duty-free-claims></range-of-duty-free-claims>

        <div class="columns">
          <div class="column is-three-fifths">
            <all-duty-free-claims-table></all-duty-free-claims-table>
          </div>
          <div class="column is-one-fifths">
            <number-of-allowance-claimed-line-chart></number-of-allowance-claimed-line-chart>
          </div>
        </div>
         <div class="columns">
          <div class="column">
            <range-of-duty-free-pie-chart></range-of-duty-free-pie-chart>
          </div>
          <div class="column">
            <weekly-claim-amount-bar-chart></weekly-claim-amount-bar-chart>
          </div>
        </div>
      </div>
    </div>
  </div>
    
</template>
<script>
import TotalNumberOfDutyFreeClaims from "@/views/Dashboard_DutyfreeSL/Components/TotalNumberOfDutyFreeClaims";
import RangeOfDutyFreeClaims from "@/views/Dashboard_DutyfreeSL/Components/RangeOfDutyFreeClaims";
import AllDutyFreeClaimsTable from "@/views/Dashboard_DutyfreeSL/Components/AllDutyFreeClaimsTable";
import NumberOfAllowanceClaimedLineChart from "@/views/Dashboard_DutyfreeSL/Components/NumberOfAllowanceClaimedLineChart";
import RangeOfDutyFreePieChart from "@/views/Dashboard_DutyfreeSL/Components/RangeOfDutyFreePieChart";
import WeeklyClaimAmountBarChart from "@/views/Dashboard_DutyfreeSL/Components/WeeklyClaimAmountBarChart";


export default{
    name: "Dashboard_DutyfreeSL",
    components:{
        TotalNumberOfDutyFreeClaims,
        AllDutyFreeClaimsTable,
        NumberOfAllowanceClaimedLineChart,
        RangeOfDutyFreePieChart,
        WeeklyClaimAmountBarChart,
        RangeOfDutyFreeClaims
    
    }
}
</script>
<style></style>