<template>
    <div>
        <div class="card" style="margin-left: 10px; margin-right: 10px">
            <div class="card-content">
                <div class="columns" style="padding: 5px">
                    <div class="column">
                        <p><b>Total Number of Customer Request   <span style="margin-left: 10px; color: #7A57D5">{{
                            requestData.customer_request }}</span></b></p>
                    </div>
                    <div class="column">
                        <p><b>Total Number of Responded Request<span style="margin-left: 10px; color: #7A57D5">{{
                            requestData.responded_request}}</span></b></p>
                    </div>
                    <div class="column">
                        <p><b>Total Number of Pending Request<span style="margin-left: 10px; color: #7A57D5">{{
                            requestData.pending_request }}</span></b></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import NetworkManager from "@/network";

export default {
    name: "TotalNumberOfDutyFreeClaims",
    data() {
        return {
            requestData: {}   
        }
    },

    methods: {
        loadData: function () {
            const self = this

            NetworkManager.apiRequest('api/DFDashboard/total-dutyfree-request', {}, function (e) {
                if (e.statusCode === 200) {
                    self.requestData = e.data
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

<style></style>