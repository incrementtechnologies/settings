<template>
  <div class="holder">
    <button class="btn btn-primary pull-right" style="margin-bottom: 10px;" @click="showModal('create')">Add Account</button>
    <table class="table table-bordered" v-if="data !== null">
      <thead>
        <tr>
          <td>Username</td>
          <td>Email</td>
          <td>Status</td>
          <td>Action</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{item.account.username}}</td>
          <td>{{item.account.email}}</td>
          <td>{{item.status}}</td>
          <td>
            <label class="text-primary actions" @click="showModal('update', item)">EDIT</label> / 
            <label class="text-danger actions" @click="remove(item.id, item.account.id)">DELETE</label>
          </td>
        </tr>
      </tbody>
    </table>
    <empty v-if="data === null" :title="'No accounts yet!'" :action="'Please add new account.'" :icon="'far fa-smile'" :iconColor="'text-primary'"></empty>
    <create-modal :property="createSubAccountModal"></create-modal>
  </div>
</template>
<style lang="scss" scoped>
@import "~assets/style/colors.scss";
.holder{
  width: 96%;
  float: left;
  margin-left: 2%;
}
.actions:hover{
  text-decoration: underline;
  cursor: pointer;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import axios from 'axios'
import CONFIG from 'src/config.js'
import SubAccount from 'src/modules/modal/CreateSubAccount.js'
export default {
  mounted(){
    this.retrieve()
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      data: null,
      createSubAccountModal: SubAccount
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue'),
    'create-modal': require('components/increment/generic/modal/Modal.vue')
  },
  methods: {
    retrieve(sort = null){
      let parameter = {
        condition: [{
          value: this.user.userID,
          column: 'account_id',
          clause: '='
        }]
      }
      this.APIRequest('sub_accounts/retrieve', parameter).then(response => {
        if(response.data.length > 0){
          this.data = response.data
        }else{
          this.data = null
        }
      })
    },
    showModal(action, item = null){
      switch(action){
        case 'create':
          this.createSubAccountModal = {...SubAccount}
          let inputs = this.createSubAccountModal.inputs
          inputs.map(input => {
            if(input.variable !== 'status'){
              input.value = null
            }else{
              input.value = 'Normal'
            }
            input.disabled = false
          })
          this.createSubAccountModal.params = [{
            variable: 'account_id',
            value: AUTH.user.userID
          }, {
            variable: 'referral_code',
            value: null
          }, {
            variable: 'account_id',
            value: AUTH.user.userID
          }, {
            variable: 'account_type',
            value: AUTH.user.type
          }, {
            variable: 'config',
            value: CONFIG
          }]
          break
        case 'update':
          let modalData = {...this.createSubAccountModal}
          let parameter = {
            title: 'Update Sub Account',
            route: 'sub_accounts/update',
            button: {
              left: 'Cancel',
              right: 'Update'
            },
            sort: {
              column: 'created_at',
              value: 'desc'
            },
            params: [{
              variable: 'id',
              value: item.id
            }, {
              variable: 'account_id',
              value: item.member
            }]
          }
          modalData = {...modalData, ...parameter} // updated data without input values
          let selectedData = item
          modalData.inputs.map(data => {
            if(data.variable === 'status'){
              data.value = item.status
            }
            if(data.variable === 'username'){
              data.value = item.account.username
              data.disabled = true
            }
            if(data.variable === 'email'){
              data.value = item.account.email
              data.disabled = true
            }
            if(data.variable === 'password'){
              data.value = '*****'
              data.disabled = true
            }
          })
          this.createSubAccountModal = {...modalData}
          break
      }
      $('#createSubAccountModal').modal('show')
    },
    remove(subId, accountId){
      let parameter = {
        id: subId
      }
      this.APIRequest('sub_accounts/delete', parameter).then(response => {
        let parameterAccount = {
          id: accountId
        }
        this.APIRequest('accounts/delete', parameterAccount).then(response => {
          this.retrieve()
        })
      })
    }
  }
}
</script>
