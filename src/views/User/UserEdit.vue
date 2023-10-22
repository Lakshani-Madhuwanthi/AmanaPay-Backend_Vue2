<template>
  <section>
    <div class="card-header p-3">
      <div class="columns" style="width: 100%">
        <div class="column">
          <b-breadcrumb
              align="is-left"
          >
            <b-breadcrumb-item tag='router-link' to="/users">Users</b-breadcrumb-item>
            <b-breadcrumb-item tag='router-link' to="" active >Edit</b-breadcrumb-item>
          </b-breadcrumb>
        </div>
        <div class="column">

        </div>
      </div>
    </div>

    <div class="card-content" style="overflow: auto; height: 70vh">
      <section>
        <b-field
            horizontal
            :type="userData.name.class"
            :message="userData.name.message">
          <template slot="label">Name <span class="has-text-danger">*</span></template>
          <b-input @blur="userData.name.blur()" v-model="userData.name.value" maxlength="100" expanded></b-input>
        </b-field>

        <b-field
            horizontal
            :type="userData.username.class"
            :message="userData.username.message">
          <template slot="label">Username <span class="has-text-danger">*</span></template>
          <b-input @blur="userData.username.blur()" v-model="userData.username.value" maxlength="100" expanded></b-input>
        </b-field>

        <b-field
            horizontal
            :type="userData.email.class"
            :message="userData.email.message">
          <template slot="label">Email <span class="has-text-danger">*</span></template>
          <b-input @input="userData.email.blur()" v-model="userData.email.value" maxlength="100" expanded></b-input>
        </b-field>

        <b-field
            horizontal
            :type="userData.contactNo.class"
            :message="userData.contactNo.message">
          <template slot="label">Contact No <span class="has-text-danger">*</span></template>
          <b-input @blur="userData.contactNo.blur()" v-model="userData.contactNo.value" maxlength="10"></b-input>
        </b-field>

        <b-field
            horizontal
            :type="userData.userType.class"
            :message="userData.userType.message">
          <template slot="label">User Type <span class="has-text-danger">*</span></template>
          <b-select @input="onUserTypeChange" @blur="userData.userType.blur()" v-model="userData.userType.value" placeholder="Select a Type" >
            <option value=""  disabled selected>Select a Type</option>
            <option value="BACKEND" :key="1">Backend User</option>
            <option value="MERCHANTADMIN" :key="2">Merchant Admin</option>
            <option value="DFBANK" :key="3">Bank User (Duty Free)</option>
            <option value="DFMERCHANT" :key="4">Merchant (Duty Free)</option>
            <option value="DFCBSLUSER" :key="5">CBSL User (Duty Free)</option>
            <option value="DFCUSTOM" :key="6">SL Customs (Duty Free)</option>
            <option value="DFMINISTRY" :key="7">Ministry of Foreign Affairs (Duty Free)</option>
            <option value="AUDITOR" :key="8">Auditor</option>
            <option value="DFAASL" :key="9">AASL</option>
            <option value="CUSTOMADMIN" :key="10">Custom Admin</option>
          </b-select>
        </b-field>

        <b-field
            v-if="userData.userType.value === 'BACKEND'"
            horizontal
            :type="userData.branch.class"
            :message="userData.branch.message">
          <template slot="label">Branch <span class="has-text-danger">*</span></template>
          <b-select @blur="userData.branch.blur()" v-model="userData.branch.value" placeholder="Select a Branch" >
            <option :value="''"  disabled selected>Select a Branch</option>
            <option v-for="item in branchList" v-bind:value="item.code" :key="item.id">{{ item.name }}</option>
          </b-select>
        </b-field>

        <b-field v-if="userData.userType.value === 'DFMERCHANT'" horizontal :type="userData.branch.class"
          :message="userData.branch.message">
          <template slot="label">Duty Free Merchants <span class="has-text-danger">*</span></template>
          <b-select v-if="authUser().userType !== 'DFMERCHANT'" @blur="userData.branch.blur()" v-model="userData.branch.value" placeholder="Select a Merchant" >
            <option :value="''"  disabled selected>Select a Merchant</option>
            <option v-for="item in merchantList" v-bind:value="item.id + ''" :key="item.id">{{ item.name }}</option>
          </b-select>

          <!-- <b-select v-else @blur="userData.branch.blur()" v-model="userData.branch.value" placeholder="Select a Merchant">
            <option :value="''" disabled selected>Select a Merchant</option>
            <option v-if="authUser().branch == item.id" v-for="item in merchantList" v-bind:value="item.id + ''" :key="item.id">{{ item.name }}</option>
          </b-select> -->
        </b-field>

        <b-field
            v-if="userData.userType.value === 'DFBANK'"
            horizontal
            :type="userData.branch.class"
            :message="userData.branch.message">
          <template slot="label">Banks <span class="has-text-danger">*</span></template>
          <b-select @blur="userData.branch.blur()" v-model="userData.branch.value" placeholder="Select a Bank" >
            <option :value="''"  disabled selected>Select a Bank</option>
            <option v-for="item in bankList" v-bind:value="item.bankCode" :key="item.id">{{ item.bankName }}</option>
          </b-select>
        </b-field>

        <b-field
            v-if="userData.userType.value === 'DFMERCHANT'"
            horizontal
            :type="userData.branch.class"
            :message="userData.branch.message">
          <template slot="label">Duty Free Merchants <span class="has-text-danger">*</span></template>
          <b-select @blur="userData.branch.blur()" v-model="userData.branch.value" placeholder="Select a Merchant" >
            <option :value="''"  disabled selected>Select a Merchant</option>
            <option v-for="item in merchantList" v-bind:value="item.id + ''" :key="item.id">{{ item.name }}</option>
          </b-select>
        </b-field>

        <b-field
            v-if="userData.userType.value === 'DFCBSLUSER'"
            horizontal
            :type="userData.branch.class"
            :message="userData.branch.message">
          <template slot="label">Branch <span class="has-text-danger">*</span></template>
          <b-select @blur="userData.branch.blur()" v-model="userData.branch.value" placeholder="Select a Merchant" >
            <option :value="''"  disabled selected>Select a Branch</option>
            <option v-bind:value="'CBSL'" :key="0">CBSL</option>
          </b-select>
        </b-field>

        <b-field
            v-if="userData.userType.value === 'DFCUSTOM'"
            horizontal
            :type="userData.branch.class"
            :message="userData.branch.message">
          <template slot="label">Branch <span class="has-text-danger">*</span></template>
          <b-select @blur="userData.branch.blur()" v-model="userData.branch.value" placeholder="Select a Merchant" >
            <!--            <option :value="''"  disabled selected>Select a Branch</option>-->
            <option v-bind:value="'SLCUSTOMS'" :key="0" selected>SL Customs</option>
          </b-select>
        </b-field>

        <b-field
            v-if="userData.userType.value === 'DFMINISTRY'"
            horizontal
            :type="userData.branch.class"
            :message="userData.branch.message">
          <template slot="label">Branch <span class="has-text-danger">*</span></template>
          <b-select @blur="userData.branch.blur()" v-model="userData.branch.value" placeholder="Select a Merchant" >
            <!--            <option :value="''"  disabled selected>Select a Branch</option>-->
            <option v-bind:value="'DFMINISTRY'" :key="0" selected>Ministry of Foreign Affairs</option>
          </b-select>
        </b-field>

        <b-field
            v-if="userData.userType.value === 'AUDITOR'"
            horizontal
            :type="userData.branch.class"
            :message="userData.branch.message">
          <template slot="label">Branch <span class="has-text-danger">*</span></template>
          <b-select @blur="userData.branch.blur()" v-model="userData.branch.value" placeholder="Select a Auditor" >
            <!--            <option :value="''"  disabled selected>Select a Branch</option>-->
            <option v-bind:value="'AUDITOR'" :key="0" selected>Auditor</option>
          </b-select>
        </b-field>

        <b-field
            v-if="userData.userType.value === 'CUSTOMADMIN'"
            horizontal
            :type="userData.branch.class"
            :message="userData.branch.message">
          <template slot="label">Branch <span class="has-text-danger">*</span></template>
          <b-select @blur="userData.branch.blur()" v-model="userData.branch.value" placeholder="Select a Custom Admin" >
            <option v-bind:value="'CUSTOMADMIN'" :key="0" selected>Custom Admin</option>
          </b-select>
        </b-field>

        <b-field
            horizontal
            :type="userData.role.class"
            :message="userData.role.message">
          <template slot="label">Role <span class="has-text-danger">*</span></template>
          <b-select
              @input="onRoleSelected(userData.role.value)"
              @blur="userData.role.blur()"
              v-model="userData.role.value"
              placeholder="Select a Role">
            <option :value="''"  disabled selected>Select a Role</option>
            <option
                v-for="role in roleListRef"
                v-bind:value="role.roleId"
                :key="role.roleId">{{ role.roleName }}</option>
          </b-select>


        </b-field>


        <b-field horizontal>
          <div class="block"></div>
        </b-field>


        <b-field horizontal>
          <template slot="label">Permissions</template>

          <div class="permissions-container">

            <div class="permission-group-wrapper"
                 v-for="permissionGroup in permissionsListRef"
                 :key="permissionGroup.index">

              <div class="permission-group-title">{{ permissionGroup.type }}</div>
              <div class="permission-group-permission-list">

                <div class="field"
                     v-for="permissionItem in permissionGroup.permissions"
                     :key="permissionItem.index">

                  <label class="b-checkbox checkbox check">
                    <input type="checkbox" autocomplete="on" true-value="true" value="false" :checked="permissionItem.checked" disabled>
                    <span class="check"></span>
                    <span class="control-label">{{ permissionItem.value }}</span>
                  </label>

                </div>
              </div>
            </div>
          </div>
        </b-field>

        <b-field horizontal>
          <div class="block"></div>
        </b-field>

        <b-field
            horizontal
            message=" ">
          <template slot="label">Status <span class="has-text-danger">*</span></template>
          <div class="block">
            <b-radio v-model="userData.disabled.value"
                     name="status"
                     native-value="0">
              Active
            </b-radio>
            <b-radio v-model="userData.disabled.value"
                     name="status"
                     native-value="1"
                     type="is-danger">
              Not Active
            </b-radio>

          </div>
        </b-field>

      </section>
    </div>

    <footer class="card-footer">
      <div class="columns" style="width: 100%">
        <div class="column">
          <p class="column has-text-danger is-italic">Fields marked with <big>*</big> are mandatory</p>
        </div>
        <div class="column">
          <div class="buttons is-pulled-right" style="margin: 5px">
            <b-button @click="validateAndSubmit()" :loading="false" type="is-success">Save</b-button>
            <b-button @click="$router.go(-1)"  type="is-danger">Cancel</b-button>
          </div>
        </div>
      </div>
    </footer>
  </section>
</template>

<script>
import NetworkManager from "@/network"
import { FieldValidator } from "@/helpers/validators/fieldValidator"
import {PermissionGroup, PermissionItem} from "@/views/User/Support";

export default {
  name: "UserEdit",
  data() {
    return {
      branchList: [],
      bankList: [],
      roleList: [],
      permissionsList: [],
      exchangeHouseList: [],
      providerList: [],
      merchantList: [],

      userData: {
        name: new FieldValidator(
            /^([A-Za-z\d]*\s?[A-Za-z\d]+){3,}$/,
            "Name can only have alphanumeric characters and should be at least 3 characters long"
        ),

        userType: new FieldValidator(
            /^\w+$/,
            "Please select a type"
        ),

        username: new FieldValidator(
            /^\w{3,}$/,
            "Username can only have alphanumeric characters with '_' and should be at least 3 characters long"
        ),
        email: new FieldValidator(
            /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/,
            "Please enter a valid email"
        ),
        contactNo: new FieldValidator(
            /^\d{4,32}$/,
            "Please enter a valid contact number"
        ),
        branch: new FieldValidator(
            /\w+/,
            "Please select a branch"
        ),
        role: new FieldValidator(
            /\w+/,
            "Please select a role"
        ),
        disabled: new FieldValidator()
      },

      checkBoxVal: false
    }
  },

  computed: {
    roleListRef(){
      const self = this
      const list = []

      self.roleList.forEach(function (item){
        console.log(self.userData.userType.value)
        if(item.userType === self.userData.userType.value){
          list.push(item)
        }
      })

      return list
    },

    permissionsListRef(){
      const self = this
      const list = []

      self.permissionsList.forEach(function (item){
        if(item.userType === self.userData.userType.value){
          list.push(item)
        }
      })

      return list
    },
  },

  methods: {
    onUserTypeChange: function (newVal){
      const self = this
      let x = ''

      switch (newVal){
        case 'BACKEND':
          x = "a branch"
          break
        case 'EXCHANGEHOUSE':
          x = "an exchange house"
          break
        case 'DFMERCHANT':
          x = "a merchant"
          break
        case 'DFCBSLUSER':
          x = "a branch"
          break
        case 'IPGBANK' || 'DFBANK':
          x = "a bank"
          break
      }

      self.userData.branch.blur()
      self.userData.branch.value = ''
      self.userData.role.value = ''
      self.userData.branch.errorMessage = 'Please select ' + x
    },

    initialData: function (){
      const self = this
      NetworkManager.apiRequest('api/dutyfree/DFUser/initial-create-data', {}, function (e){
        if(e.statusCode === 200){

          self.branchList = e.data.branchList
          self.bankList = e.data.bankList
          self.roleList = e.data.roleList
          self.exchangeHouseList = e.data.exchangeHouseList
          self.providerList = e.data.providerList
          self.merchantList = e.data.merchantList

          e.data.permissionsList.forEach(function (item, i){
            const groupItem = new PermissionGroup()
            groupItem.index = i
            groupItem.type = item.type
            groupItem.userType = item.userType

            item.permissions.forEach(function (perm, j){
              const permission = new PermissionItem()
              permission.index = j
              permission.value = perm
              groupItem.permissions.push(permission)
            })

            self.permissionsList.push(groupItem)
          })

          self.getUserForEdit()
        }
      })
    },

    getUserForEdit: function (){
      const self = this

      const data = {
        id : self.$route.params.id
      }
      NetworkManager.apiRequest('api/dutyfree/DFUser/get-for-edit', data, function (e){
        if(e.statusCode === 200){
          const user = e.data.customUser
          console.log(e.data.customUser);
          self.userData.name.value = user.name
          self.userData.userType.value = user.user_type
          self.userData.username.value = user.username
          self.userData.email.value = user.email
          self.userData.contactNo.value = user.contact
          self.userData.branch.value = user.branch_code
          self.userData.role.value = user.role
          self.userData.disabled.value = user.disabled

          self.onRoleSelected(user.role)
        }
      })
    },

    onRoleSelected: function (roleId){
      const self = this
      let role = null

      for (let i = 0; i < self.roleList.length; i++){
        if(self.roleList[i].roleId === roleId){
          role = self.roleList[i]
        }
      }

      if(role !== null){
        self.permissionsList.forEach(function (group){
          group.permissions.forEach(function (perm){
            perm.checked = role.permissions.includes(perm.value);
          })
        })
      }
    },

    validate: function (){
      const self = this
      let isValid = true

      Object.keys(self.userData).forEach(function(key,) {
        console.log(self.userData[key].validate())
        if(!self.userData[key].validate()) isValid = false
      })

      return isValid
    },

    validateAndSubmit: function (){
      const self = this

      if(self.validate()){
        const data = {
          id : self.$route.params.id,
          type : self.userData.userType.value,
          name : self.userData.name.value,
          email : self.userData.email.value,
          contact : self.userData.contactNo.value,
          username : self.userData.username.value,
          branch_code : self.userData.branch.value,
          role : self.userData.role.value,
          disabled : self.userData.disabled.value
        }

        NetworkManager.apiRequest('api/dutyfree/DFUser/edit', data, function (e){
          if(e.statusCode === 200){
            const params = {
              type: 'is-success',
              message: 'User sent for approval'
            }
            self.$buefy.toast.open(params)
            self.$router.go(-1)
          }
          else if(e.statusCode === 422){
            const params = {
              type: 'is-warning',
              message: e.data.message
            }
            self.$buefy.toast.open(params)
          }
          else {
            const params = {
              type: 'is-warning',
              message: 'User edit failed!.'
            }
            self.$buefy.toast.open(params)
          }
        })
      }
    }
  },

  mounted() {
    this.userData.disabled.value = 0
    this.initialData()
  }
}
</script>


<style scoped>
.permissions-container {
  display: block;
}

.permission-group-wrapper {
  display: inline-block;
  margin-right: 2rem;
  margin-bottom: 2rem;
  vertical-align: top;
}

.permission-group-title {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  font-style: italic;
}

.permission-group-permission-list {
  padding-left: 0.1rem;
}
</style>
