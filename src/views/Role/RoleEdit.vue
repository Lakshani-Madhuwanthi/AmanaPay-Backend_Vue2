<template>
  <section>
    <div class="card-header p-3">
      <div class="columns" style="width: 100%">
        <div class="column">
          <b-breadcrumb
              align="is-left"
          >
            <b-breadcrumb-item tag='router-link' to="/roles" >Role</b-breadcrumb-item>
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
            :type="roleData.role_name.class"
            :message="roleData.role_name.message">
          <template slot="label">Role Name <span class="has-text-danger">*</span></template>
          <b-input @blur="roleData.role_name.blur()" v-model="roleData.role_name.value" maxlength="100" expanded></b-input>
        </b-field>

        <b-field
            horizontal
            :type="roleData.userType.class"
            :message="roleData.userType.message">
          <template slot="label">User Type <span class="has-text-danger">*</span></template>
          <b-select @blur="roleData.userType.blur()" v-model="roleData.userType.value" placeholder="Select a Type" >
            <option value=""  disabled selected>Select a Type</option>
            <option value="BACKEND" :key="1">Backend User</option>
            <option value="MERCHANTADMIN" :key="2">Merchant Admin</option>
            <option value="DFBANK" :key="3">Bank User (Duty Free)</option>
            <option value="DFMERCHANT" :key="4">Merchant (Duty Free)</option>
            <option value="DFCBSLUSER" :key="5">CBSL User (Duty Free)</option>
            <option value="DFCUSTOM" :key="6">SL Customs (Duty Free)</option>
            <option value="DFMINISTRY" :key="7">Ministry of Foreign Affairs (Duty Free)</option>
            <option value="DFAASL" :key="8">AASL</option>
            <option value="CUSTOMADMIN" :key="9">Custom Admin</option>
          </b-select>
        </b-field>

        <b-field
             horizontal
             :type="roleData.user_level.class"
             :message="roleData.user_level.message">
          <template slot="label">User Level <span class="has-text-danger">*</span></template>
          <b-select @blur="roleData.user_level.blur()" v-model="roleData.user_level.value" placeholder="Select a Branch" >
            <option :value="''"  disabled selected>Select a Level</option>
            <option v-for="level in userLevels" v-bind:value="level.level" :key="level.id">{{ level.title }}</option>
          </b-select>
        </b-field>


        <b-field horizontal>
          <div class="block"></div>
        </b-field>


        <b-field horizontal
             :type="roleData.permissions.class"
             :message="roleData.permissions.message">
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

                  <b-field>
                    <b-checkbox v-model="permissionItem.checked" @input="permissionChanged()" >{{ permissionItem.value }}</b-checkbox>
                  </b-field>

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
            <b-radio v-model="roleData.disabled.value"

                     name="status"
                     :native-value="0">
              Active
            </b-radio>
            <b-radio v-model="roleData.disabled.value"
                     name="status"
                     :native-value="1"
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
  name: "RoleEdit",
  data() {
    return {
      userLevels: [],
      permissionsList: [],
      roleData: {
        role_name: new FieldValidator(
            /^([A-Za-z\d]*\s?[A-Za-z\d]+){3,}$/,
            "Role name can only have alphanumeric characters and should be at least 3 characters long"
        ),

        userType: new FieldValidator(
            /^\w+$/,
            "Please select a type"
        ),

        user_level: new FieldValidator(
            /^[\S\s\d]+$/,
            "Please select a user level"
        ),
        permissions: new FieldValidator(
            /^[\S\s\d]+$/,
            "Please select at least one permission"
        ),
        disabled: new FieldValidator()
      },

      checkBoxVal: false
    }
  },

  computed: {
    permissionsListRef(){
      const self = this
      const list = []

      self.permissionsList.forEach(function (item){
        console.log(item.userType)
        if(item.userType === self.roleData.userType.value){
          list.push(item)
        }
      })

      return list
    }
  },

  methods: {
    permissionChanged: function() {
      const self = this

      self.roleData.permissions.value = ""
      self.permissionsList.forEach(function (group){
        group.permissions.forEach(function (item){
          if(item.checked){
            self.roleData.permissions.value += (self.roleData.permissions.value !== '' ? "|" : '') + item.value
          }
        })
      })
    },

    getRoleForEdit: function (){
      const self = this

      const data = {
        id : self.$route.params.id
      }

      NetworkManager.apiRequest('api/dutyfree/DFRole/get-for-edit', data, function (e){
        if(e.statusCode === 200){
          const role = e.data.role
          self.roleData.role_name.value = role.role_name
          self.roleData.userType.value = role.user_type
          self.roleData.user_level.value = role.user_level
          self.roleData.disabled.value = role.disabled

          role.permissions.forEach(function (item){
            self.roleData.permissions.value += (self.roleData.permissions.value === '' ? '' : '|') + item
          })

          self.permissionsList.forEach(function (group){
            group.permissions.forEach(function (perm){
              perm.checked = role.permissions.includes(perm.value)
            })
          })
        }

        self.hideFullScreenLoader()
      })
    },

    initialData: function (){
      const self = this

      self.showFullScreenLoader()

      NetworkManager.apiRequest('api/dutyfree/DFRole/initial-create-data', {}, function (e){
        if(e.statusCode === 200){

          self.userLevels = e.data.userLevels

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

          self.getRoleForEdit()
        }
      })
    },

    validate: function (){
      const self = this
      let isValid = true

      Object.keys(self.roleData).forEach(function(key) {
         if(!self.roleData[key].validate()) isValid = false
      })

      return isValid
    },

    validateAndSubmit: function (){
      const self = this

      if(self.validate()){

        let selectedPermissions = self.roleData.permissions.value.split('|')

        const data = {
          id : self.$route.params.id,
          role_name : self.roleData.role_name.value,
          user_type : self.roleData.userType.value,
          user_level : self.roleData.user_level.value,
          disabled : self.roleData.disabled.value,
          permissions : selectedPermissions
        }

        NetworkManager.apiRequest('api/dutyfree/DFRole/edit', data, function (e){
          if(e.statusCode === 200){
            const params = {
              type: 'is-success',
              message: 'Role sent for approval'
            }
            self.$buefy.toast.open(params)
            self.$router.go(-1)
          }
          else {
            const params = {
              type: 'is-warning',
              message: 'Role edit failed!.'
            }
            self.$buefy.toast.open(params)
          }
        })
      }
    }
  },

  mounted() {
    this.roleData.disabled.value = 0
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
