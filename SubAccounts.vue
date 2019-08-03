<template>
  <div class="holder">
    <button class="btn btn-primary pull-right" style="margin-bottom: 10px;" @click="showModal()">Add Account</button>
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
          <td>{{item.account.Email}}</td>
          <td>{{item.account.status}}</td>
          <td>
            <label class="text-primary">EDIT</label> / 
            <label class="text-warning">DELETE</label>
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
    retrieve(){
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
    showModal(){
      $('#createSubAccountModal').modal('show')
    }
  }
}
</script>
