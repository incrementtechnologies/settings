<template>
  <div class="holder">
    <button class="btn btn-primary pull-right" style="margin-bottom: 10px;" @click="showModal('create')">Add Account</button>
    <filter-product v-bind:category="category" 
      :activeCategoryIndex="0"
      :activeSortingIndex="0"
      @changeSortEvent="retrieve($event.sort, $event.filter)"
      :grid="['list']">
    </filter-product>
    <table class="table table-bordered table-responsive" v-if="data !== null">
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
            <button class="btn btn-primary" @click="showModal('update', item)" v-if="user.userID !== item.account.id">EDIT</button>
            <button class="btn btn-danger" @click="remove(item.id, item.account.id)" v-if="user.userID !== item.account.id">DELETE</button>
          </td>
        </tr>
      </tbody>
    </table>
    <Pager
      :pages="numPages"
      :active="activePage"
      :limit="limit"
      v-if="data !== null"
    />
    <empty v-if="data === null" :title="'No accounts yet!'" :action="'Please add new account.'" :icon="'far fa-smile'" :iconColor="'text-primary'"></empty>
    <create-modal ref="modal" :property="createSubAccountModal"></create-modal>
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
import SubAccount from './CreateSubAccount.js'
import Pager from 'src/components/increment/generic/pager/Pager.vue'
export default {
  mounted(){
    this.retrieve({'id': 'asc'}, {column: 'id', value: ''})
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      data: null,
      createSubAccountModal: SubAccount,
      numPages: null,
      activePage: 1,
      limit: 5,
      category: [{
        title: 'Sub-Accounts',
        sorting: [{
          title: 'Username ascending',
          payload: 'username',
          payload_value: 'asc',
          type: 'text'
        }, {
          title: 'Username descending',
          payload: 'username',
          payload_value: 'desc',
          type: 'text'
        }, {
          title: 'Email ascending',
          payload: 'email',
          payload_value: 'asc',
          type: 'text'
        }, {
          title: 'Email descending',
          payload: 'email',
          payload_value: 'desc',
          type: 'text'
        }, {
          title: 'Status ascending',
          payload: 'T1.status',
          payload_value: 'asc',
          type: 'text'
        }, {
          title: 'Status descending',
          payload: 'T1.status',
          payload_value: 'desc',
          type: 'text'
        }]
      }],
      currentFilter: null,
      currentSort: null
    }
  },
  components: {
    'filter-product': require('components/increment/ecommerce/filter/Product.vue'),
    'empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue'),
    'create-modal': require('components/increment/generic/modal/Modal.vue'),
    Pager
  },
  methods: {
    retrieve(sort, filter){
      if(filter !== null){
        this.currentFilter = filter
      }
      if(sort !== null){
        this.currentSort = sort
      }
      let parameter = {
        condition: [{
          value: this.currentFilter.value + '%',
          column: this.currentFilter.column,
          clause: 'like'
        }, {
          value: this.user.userID,
          column: 'account_id',
          clause: '='
        }],
        limit: this.limit,
        sort: this.currentSort,
        offset: (this.activePage > 0) ? ((this.activePage - 1) * this.limit) : this.activePage
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('sub_accounts/retrieve_by_filter', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
          console.log(this.data)
          this.numPages = parseInt(response.size / this.limit) + (response.size % this.limit ? 1 : 0)
        }else{
          this.data = null
          this.numPages = null
        }
      })
    },
    showModal(action, item = null){
      this.$refs.modal.errorMessage = null
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
              data.value = '********'
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
      $('#loading').css({display: 'block'})
      this.APIRequest('sub_accounts/delete', parameter).then(response => {
        let parameterAccount = {
          id: accountId
        }
        this.APIRequest('accounts/delete', parameterAccount).then(response => {
          $('#loading').css({display: 'none'})
          this.retrieve({'id': 'asc'}, {column: 'id', value: ''})
        })
      })
    }
  }
}
</script>
