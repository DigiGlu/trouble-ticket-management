<template>
  <div class="troubleTicketEdit">
    <div v-if="action == 'none'" class="form-horizontal">
      <div class="form-group">
        <div class="col-sm-3">
          <label>Id</label>
          <input 
          type="string"
          class="form-control"
          v-model="troubleTicket.id"/>
        </div>
        <div class="col-sm-3">
          <label>Type</label>
          <input 
          type="string"
          class="form-control"
          v-model="troubleTicket.type"/>
        </div> 
        <div class="col-sm-3">
          <label>Severity</label>
          <input 
          type="string"
          class="form-control"
          v-model="troubleTicket.severity"/>
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-9">
          <label>Description</label>
          <input 
          type="string"
          class="form-control"
          v-model="troubleTicket.description"/>
        </div>
      </div>
    </div>
    <h3 v-if="action != 'none'">Status change to {{action}}</h3>
    <div v-if="action != 'none'" class="form-horizontal">
      <div class="form-group">
        <div class="col-sm-9">
          <label>Status change reason</label>
          <input 
          type="string"
          class="form-control"
          v-model="troubleTicket.statusChangeReason"/>
        </div>
      </div>
    </div>
    <div id="buttongroup">    
      <button class="btn btn-default footer-btn" @click="$emit('cancelevent')">Cancel</button>
      <button v-if="action != 'none'" class="btn btn-primary" @click="changeStatus()">Change status</button>
      <button v-if="action == 'none'" class="btn btn-primary" @click="save()">Save</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

var config = require( '../config.json' );

export default {
  name: 'troubleTicketEdit',
  data () {
    return {
      troubleTicket: {},
      troubleTicketId: this.$route.params.troubleTicketId,
      action: this.$route.params.action
    }
  },
  created: function() {
    this.fetchData()
  },
  methods: {
    fetchData: function(){
        let self = this;
        const url = config.server_url + config.api_endpoint_hal + 
          "troubleTicket/" + this.troubleTicketId
        axios.get(url, {
          dataType: 'json',
          headers: {
            'Accept': 'application/json'
          },
          mode: 'no-cors' 
        })
        .then(function (response) {
          self.troubleTicket = response.data
        })
        .catch(function (error) {
          console.log(error)
        })
      },
    save: function() {
        let self = this;

        let request = {
          url: config.server_url + config.api_endpoint_hal + 
          "troubleTicket/" + this.troubleTicketId,
          data: JSON.stringify(self.troubleTicket),
          method: 'PUT',
          headers : {
            "Content-Type" : "application/json"
            }
        }

        axios( request ).then(function (response) {
            console.log( 'SUCCESS: ', JSON.stringify(response))
        })
        .catch(function (error) {

        })
      this.$emit('troubleticketupdate', self.troubleTicket)
    },
    changeStatus: function() {
        let self = this;

        let request = {
          url: config.server_url + config.api_endpoint_hal + 
          "troubleTicket/" + this.troubleTicketId,
          data: "{ status: " + self.action + 
                ", statusChangeReason: " + self.troubleTicket.statusChangeReason + "}",
          method: 'PATCH',
          headers : {
            "Content-Type" : "application/json"
            }
        }

         axios( request ).then(function (response) {
            console.log( 'SUCCESS: ', JSON.stringify(response))
        })
        .catch(function (error) {

        })
      this.$emit('troubleticketupdate', self.troubleTicket)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#buttongroup {
  margin-top: 40px;
  text-align: right;
}
div {
}
th, td {
  text-align: left
}

h1, h2 {
  font-weight: normal;
}

h4, pre {
  text-align: left;
}
ul {
  list-style-type: none;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
