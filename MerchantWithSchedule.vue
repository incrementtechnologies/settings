<template>
  <div class="merchant-holder" v-if="data !== null">
    <span class="header">{{title}}</span>
    <span class="content">
      <span class="error text-danger" v-if="errorMessage !== null">
        <b>Oops!</b> {{errorMessage}}
      </span>
      <span class="error text-success" v-if="successMessage !== null">
        {{successMessage}}
      </span>
      <span class="inputs">

        <div class="form-group">
          <label for="address">Business name <label class="text-danger">*</label></label>
          <input type="text" class="form-control standard-height" placeholder="Business Name" v-model="data.name" :disabled="parseInt(data.account_id) !== parseInt(user.userID)">
        </div>

        <div class="form-group" style="margin-top: 25px;" v-if="allowed.indexOf('email') > -1">
          <label for="address">Business email address<label class="text-danger">*</label></label>
          <input type="text" class="form-control standard-height" placeholder="Business email address" v-model="data.email" :disabled="parseInt(data.account_id) !== parseInt(user.userID)">
        </div>

        <div class="form-group" style="margin-top: 25px;" v-if="allowed.indexOf('code') > -1">
          <label for="address">ABN<label class="text-danger">*</label></label>
          <input type="text" class="form-control standard-height" placeholder="Business code" v-model="data.business_code" :disabled="parseInt(data.account_id) !== parseInt(user.userID)">
        </div>

        <div class="form-group" style="margin-top: 25px;" v-if="allowed.indexOf('address') > -1">
          <label for="address">Business address <label class="text-danger">*</label></label>
          <!-- <input type="text" class="form-control" placeholder="Business Address" v-model="data.address" :disabled="parseInt(data.account_id) !== parseInt(user.userID)"> -->
          <location-merchant @onFinish="getResult($event)" :property="property"></location-merchant>
        </div>

        <div class="form-group" style="margin-top: 25px;" v-if="allowed.indexOf('information') > -1">
          <label for="address">Information</label>
          <input type="text" class="form-control standard-height" placeholder="Information" v-model="info" :disabled="parseInt(data.account_id) !== parseInt(user.userID)">
        </div>

        <div class="form-group" style="margin-top: 25px;" v-if="allowed.indexOf('information') > -1">
          <label for="address">Cuisine</label>
          <div class="row">
          <div style="width: 60%;" class="form-control column mr-2">
            <span  v-for="(item, index) in cuisineList" :key="index" class="mr-1"><b-badge><h6>{{item}}<i class="fas fa-times ml-1" @click="removeCuisine(index)" style="font-size: 11px; color: #a62e2e;"></i></h6></b-badge></span>
          </div>
          <input type="text" style="width: 30%;" class="form-control column mr-2" placeholder="Cuisine" v-model="cuisine" :disabled="parseInt(data.account_id) !== parseInt(user.userID)">
          <button class="btn btn-primary column" @click="addCuisine()" :disabled="parseInt(data.account_id) !== parseInt(user.userID)">Add</button>
          </div>
        </div>

        <!-- <div class="form-group" style="margin-top: 25px;" v-if="allowed.indexOf('website') > -1">
          <label for="address">Website</label>
          <input type="text" class="form-control" placeholder="Company website url" v-model="data.website" :disabled="parseInt(data.account_id) !== parseInt(user.userID)">
        </div> -->

        <div class="form-group" style="margin-top: 25px;" v-if="allowed.indexOf('schedule') > -1">
          <label for="address">Schedule</label>
          <input class="form-control standard-height" placeholder="Schedule" v-model="days" disabled><br>
          <button class="btn btn-secondary pull-right" v-if="!showSched" style="margin-right: 5px;" @click="showSched = true">Update Schedule</button>
          <button class="btn btn-danger pull-right" v-if="showSched" style="margin-right: 5px;" @click="showSched = false">Cancel</button>
          <button class="btn btn-secondary pull-right" v-if="showSched" style="margin-right: 5px;" @click="showSched = false, updateSchedule()">Confirm Update</button>
          <div v-if="showSched" style="width: 100%; margin-top: 40px; margin-bottom: 30px; padding-bottom: 90px;">
            <div class="row" v-for="(item, index) in scheduleDays" :key="index" style="padding: 5px;">
              <div class="column" style="width: 25%;">
                <input type="checkbox" :value="item.value" v-model="days">
                <label for="monday"> {{item.value}}</label>
              </div>
              <div class="column">
                <span>
                <vue-timepicker format="hh:mm a" placeholder="Start Time" v-model="item.startTime" :value="item.startTime"></vue-timepicker>
                <label for="monday"> - </label>  
                <vue-timepicker format="hh:mm a" placeholder="End Time" v-model="item.endTime" :value="item.endTime"></vue-timepicker>
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <button class="btn btn-primary" style="margin-bottom: 25px; margin-top: -17px;" @click="update()" v-if="parseInt(data.account_id) === parseInt(user.userID)">Update</button>
      </span>
      <span class="sidebar" v-if="createFlag === false">
        <span class="sidebar-header" style="margin-top: 25px;">Business Logo</span>
        <span class="image" v-if="data.logo !== null">
          <img :src="config.BACKEND_URL + data.logo" height="200px" width="100%" >
        </span>
        <span class="image" v-else>
          <i class="fa fa-image" ></i>
        </span>
        <span style="width: 100%; float: left; text-align: center;">
          <label v-if="data.status === 'not_verified'" class="text-grey"><i>Not verified</i></label>
          <label v-if="data.status === 'verified'" class="text-primary"><i>Verified</i></label>
        </span>
        <button class="btn btn-primary custom-block" style="margin-top: 5px; margin-bottom: 15px;" @click="showImages()" v-if="parseInt(data.account_id) === parseInt(user.userID)">Select from images
        </button>
        <button class="btn btn-primary custom-block" style="margin-top: 5px; margin-bottom: 15px;" @click="showFeaturedImages()" v-if="parseInt(data.account_id) === parseInt(user.userID)">Featured Images
        </button>
      </span>
    </span>
    <browse-images-modal :object="photoObject"></browse-images-modal>
    <featured-images-modal :object="photoObject"></featured-images-modal>
  </div>
</template>
<style scoped>
.standard-height {
  height: 45px;;
}
.merchant-holder{
  width: 95%;
  float: left;
  margin-left: 5%;
  margin-bottom: 200px;
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
.image i{
  font-size: 150px;
  line-height: 200px;
}
.image img{
  border-radius: 5px;
}
.custom-block{
  width: 100%;
  float: left;
}
.custom-block input{
  display: none;
}
.row{
  margin: 0px !important;
}
.row .left{
  padding-left: 0px !important;
}
.row .right{
  padding-right: 0px !important;
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
  .row .form-group{
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import axios from 'axios'
import CONFIG from 'src/config.js'
import VueTimepicker from 'vue2-timepicker/src/vue-timepicker.vue'
export default {
  mounted(){
    $('#loading').css({display: 'block'})
    this.retrieve()
    this.retrieveFeaturedPhotos()
    this.temp = {
      name: this.data.name,
      email: this.data.email,
      business_code: this.data.business_code,
      address: this.data.address,
      prefix: this.data.prefix,
      website: this.data.website,
      logo: this.data.logo,
      schedule: this.data.schedule
    }
  },
  data(){
    return {
      user: AUTH.user,
      tokenData: AUTH.tokenData,
      config: CONFIG,
      data: null,
      errorMessage: null,
      successMessage: null,
      newData: {
        account_id: AUTH.user.userID,
        prefix: null,
        logo: null,
        email: null,
        address: null,
        name: null,
        website: null
      },
      createFlag: false,
      photoObject: {
        url: null
      },
      temp: {
        name: null,
        email: null,
        business_code: null,
        address: null,
        prefix: null,
        website: null,
        schedule: null
      },
      showSched: false,
      days: [],
      scheduleDays: [
        {
          value: 'Monday',
          startTime: null,
          endTime: null
        },
        {
          value: 'Tuesday',
          startTime: null,
          endTime: null
        },
        {
          value: 'Wednesday',
          startTime: null,
          endTime: null
        },
        {
          value: 'Thursday',
          startTime: null,
          endTime: null
        },
        {
          value: 'Friday',
          startTime: null,
          endTime: null
        },
        {
          value: 'Saturday',
          startTime: null,
          endTime: null
        },
        {
          value: 'Sunday',
          startTime: null,
          endTime: null
        }
      ],
      test: null,
      images: null,
      property: {
        value: null,
        style: {
          height: '45px !important'
        },
        GOOGLE_API_KEY: CONFIG.GOOGLE.API_KEY,
        results: {
          style: {
          }
        }
      },
      cuisine: null,
      cuisineList: [],
      info: null
    }
  },
  props: ['title', 'allowed'],
  components: {
    'browse-images-modal': require('components/increment/generic/image/BrowseModal.vue'),
    'featured-images-modal': require('components/increment/settings/MerchantFeaturedPhotos.vue'),
    'location-merchant': require('components/increment/settings/MerchantLocation.vue'),
    VueTimepicker
  },
  methods: {
    removeCuisine(index) {
      this.cuisineList.splice(index, 1)
    },
    addCuisine() {
      if(this.cuisine !== null && this.cuisine !== '') {
        let c = this.cuisine.charAt(0).toUpperCase() + this.cuisine.slice(1).toLowerCase()
        this.cuisineList.push(c)
        this.cuisine = null
      }
    },
    getResult($event) {
      if($event !== null) {
        let address = {
          name: $event.formatted_address,
          latitude: $event.latitude,
          longitude: $event.longitude
        }
        this.data.address = address
      } else {
        this.data.address = null
      }
    },
    removeImage(id){
      let parameter = {
        id: id
      }
      this.APIRequest('images/delete', parameter).then(response => {
        this.retrieveFeaturedPhotos()
        this.selectedImage = null
      })
    },
    retrieveFeaturedPhotos(){
      const parameter = {
        condition: [{
          value: this.user.userID,
          column: 'account_id',
          clause: '='
        }, {
          value: 'featured-photo',
          column: 'category',
          clause: '='
        }],
        sort: {
          created_at: 'desc'
        }
      }
      $('#loading').css({display: 'none'})
      this.APIRequest('images/retrieve', parameter).done(response => {
        $('#loading').css({display: 'none'})
        console.log(response)
        if(response.data.length > 0){
          this.images = response.data
        }
      })
    },
    getTwentyFourHourTime(amPmString) {
      var d = new Date('1/1/2021 ' + amPmString)
      return d.getHours() + ':' + d.getMinutes()
    },
    updateSchedule() {
      let schedule = []
      this.scheduleDays.forEach((item, index) => {
        this.days.forEach(element => {
          if(item.value === element) {
            schedule.push(item)
          }
        })
      })
      if(this.days.length > 0) {
        this.data.schedule = {
          schedule: schedule
        }
      } else {
        this.data.schedule = 'NULL'
      }
    },
    retrieve(){
      if(AUTH.user.subAccount !== null && AUTH.user.subAccount.merchant !== null){
        $('#loading').css({display: 'none'})
        this.data = AUTH.user.subAccount.merchant
        return
      }
      let parameter = {
        condition: [{
          value: this.user.userID,
          column: 'account_id',
          clause: '='
        }]
      }
      this.APIRequest('merchants/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        let days = []
        // this.APIRequest('merchants/update', {id: response.data[0].id, schedule: 'NULL'}).then(response => {})
        if(response.data.length > 0){
          this.property.value = response.data[0].address
          if(response.data[0].schedule && response.data[0].schedule !== 'NULL') {
            let sched = JSON.parse(response.data[0].schedule)
            if(sched !== 'NULL' && typeof sched !== 'object') {
              sched = JSON.parse(sched)
            }
            sched && sched !== 'NULL' && sched.schedule.forEach((e, indexs) => {
              this.scheduleDays.forEach((i, index) => {
                if(e.value === i.value && e.startTime !== null && e.endTime !== null) {
                  days.push(i.value)
                  i.value = e.value
                  i.startTime = e.startTime
                  i.endTime = e.endTime
                } else if (e.value === i.value) {
                  days.push(i.value)
                }
              })
            })
          }
          let additional = null
          try {
            additional = JSON.parse(response.data[0].addition_informations)
            this.info = additional.information
            this.cuisineList = additional.cuisine
          } catch (e) {
            console.log(e)
          }
          response.data[0].addition_informations = additional
          console.log(response.data[0], 'yo')
          this.days = days
          this.data = response.data[0]
          this.createFlag = false
        }else{
          this.createFlag = true
          this.data = this.newData
        }
      })
    },
    update(url){
      // if(this.data.email !== null && AUTH.validateEmail(this.data.email) === false){
      //   this.errorMessage = 'Invalid email address.'
      //   return
      // }
      if(url) {
        this.data.logo = url
      }
      if(this.createFlag === false){
        if(this.data.name === '' || this.data.address === '' || this.data.name === null || this.data.address === null) {
          this.successMessage = null
          this.errorMessage = 'Please provide input to all required fields.'
          return
        }
        if(this.data.name !== this.temp.name || this.data.email !== this.temp.email || this.data.business_code !== this.temp.business_code || this.data.prefix !== this.temp.prefix || this.data.website !== this.temp.website || this.data.logo !== this.temp.logo || this.data.schedule !== this.temp.schedule) {
          $('#loading').css({display: 'block'})
          if(typeof this.data.schedule === 'object') {
            this.data.schedule = JSON.stringify(this.data.schedule)
          }
          if(typeof this.data.address === 'object') {
            this.data.address = JSON.stringify(this.data.address)
          }
          this.data.addition_informations = JSON.stringify({information: this.info, cuisine: this.cuisineList})
          this.APIRequest('merchants/update', this.data).then(response => {
            $('#loading').css({display: 'none'})
            if(response.data === true){
              // this.retrieve()
              this.successMessage = 'Successfully Updated!'
              this.errorMessage = null
            }else{
              this.successMessage = null
              this.errorMessage = 'Unable to Update! Please contact the administrator.'
            }
          })
        } else {
          this.successMessage = 'You did not change anything!'
        }
      }else{
        this.create(url)
      }
    },
    create(url){
      this.data.logo = url
      if(this.data.name === '' || this.data.address === '' || this.data.name === null || this.data.address === null) {
        this.successMessage = null
        this.errorMessage = 'Please provide input to all required fields.'
        return
      }
      if(this.data.email !== null && AUTH.validateEmail(this.data.email) === false){
        this.errorMessage = 'Invalid email address.'
        return
      }
      if(typeof this.data.schedule === 'object') {
        this.data.schedule = JSON.stringify(this.data.schedule)
      }
      if(typeof this.data.address === 'object') {
        this.data.address = JSON.stringify(this.data.address)
      }
      this.data.addition_informations = JSON.stringify({information: this.info, cuisine: this.cuisineList})
      $('#loading').css({display: 'block'})
      this.APIRequest('merchants/create', this.data).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data > 0){
          this.retrieve()
          this.successMessage = 'Successfully Updated!'
          this.errorMessage = null
          AUTH.checkAuthentication(null, true)
        }else{
          this.successMessage = null
          this.errorMessage = 'Unable to Update! Please contact the administrator.'
        }
      })
    },
    showFeaturedImages(){
      $('#featuredImagesModal').modal('show')
    },
    updatePhoto(object){
      this.data.logo = object.url
      this.update()
      this.hideImages()
    },
    createPhoto(object){
      this.data.logo = object.url
      this.update()
      this.hideImages()
    },
    showImages(){
      $('#browseImagesModal').modal('show')
    },
    manageImageUrl(url){
      this.update(url)
    }
  }
}
</script>
