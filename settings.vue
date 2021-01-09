<template>
  <div class="notification-holder">
    <span class="header">Broadcasting</span>
    <span class="content">
      <span class="inputs">
        <div class="item" style="margin-top: 25px;" v-for="(item, index) in options" :key="index" >
          <span v-if="common.broadcastSetting[index].flag === true">
            <span class="details">
              <label class="title">{{item.title}}</label>
              <label v-if="value === 'manual'" class="definition">Turn on auto broadcast to automatically send orders to riders once accepted.</label>
              <label v-if="value === 'auto'" class="definition">Turn off auto broadcast to manually send trigger the broadcast orders to riders once accepted.</label>
            </span>
            <span class="icon" v-if="data !== null">
              <i class="fa fa-toggle-on text-primary action-link" v-if="data[item.column] === 'auto' " @click="update(data.id, item.column, 'manual')"></i>
              <i class="fa fa-toggle-off text-danger action-link"  v-if="data[item.column] === 'manual'" @click="update(data.id, item.column, 'auto')"></i>
            </span>
            <span class="icon" v-if="data === null">
              <i class="fa fa-toggle-off text-danger action-link" @click="create(item.column)"></i>
            </span> 
          </span>
        </div>
      </span>
      <span class="sidebar">
      </span>
    </span>
  </div>
</template>
<style scoped>
.notification-holder{
  width: 95%;
  float: left;
  margin-left: 5%;
}
.header{
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 24px;
  border-bottom: solid 1px #ddd;
  float: left;
}
.content{
  width: 100%;
  min-height: 50px;
  float: left;
  overflow-y: hidden;
}
.content .error{
  width: 100%;
  float: left;
  height: 40px;
  line-height: 40px;
}
.inputs{
  width: 65%;
  float: left;
  margin-right: 5%;
  min-height: 50px;
  overflow-y: hidden;
}
.sidebar{
  width: 30%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
}
.sidebar-header{
  height: 40px;
  line-height: 40px;
  width: 100%;
  float: left;
}
.sidebar .image{
  width: 100%;
  float: left;
  min-height: 200px;
  overflow-y: hidden;
  text-align: center;
}
.item{
  width: 100%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
}
.item .details{
  width: 80%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
}
.details label{
  width: 100%;
  float: left;
}
.details .definition{
  color: #555;
}
.item .icon{
  width: 20%;
  float: left;
  height: 50px;
  text-align: right;
  line-height: 50px;
}
.icon i{
  font-size: 35px;
}
@media screen and (max-width: 992px){
  .holder{
    width: 96%;
    margin-left: 2%;
    margin-right: 2%;
  }
  .sidebar, .inputs{
    width: 100%;
    margin-right: 0%;
    margin-left: 0%;
  }
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import axios from 'axios'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
export default {
  mounted(){
    this.retrieve()
  },
  data(){
    return {
      user: AUTH.user,
      tokenData: AUTH.tokenData,
      config: CONFIG,
      data: null,
      value: 'manual',
      options: [{
        title: 'Broadcasting',
        column: 'payload_value'
      }],
      common: COMMON
    }
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
      $('#loading').css({display: 'block'})
      this.APIRequest('payloads/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data[0]
          this.value = response.data[0].payload_value
        }else{
          this.data = null
        }
      })
    },
    create(type){
      let parameter = {
        account_id: this.user.userID,
        payload: 'broadcast',
        payload_value: 'auto'
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('payloads/create', parameter).then(response => {
        this.retrieve()
      })
    },
    update(id, type, value){
      console.log(id, type, value)
      let parameter = null
      switch(type){
        case 'payload_value': parameter = {
          id: id,
          payload_value: value
        }
          break
      }
      this.updateRequest(parameter)
    },
    updateRequest(parameter){
      console.log(parameter)
      $('#loading').css({display: 'block'})
      this.APIRequest('payloads/update', parameter).then(response => {
        this.retrieve()
      })
    }
  }
}
</script>
