<template>
  <div class="troubleTicketNew">
    <div class="form-horizontal">
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
    <div id="buttongroup">    
      <button class="btn btn-default footer-btn" @click="$emit('cancelevent')">Cancel</button>
      <button class="btn btn-primary" @click="save()">Create</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'troubleTicketNew',
  data () {
    return {
      troubleTicket: {
          "id": "",
          "type": "",
          "severity": "",
          "description": "",
          "status": "Submitted",
          "statusChangeReason": "Initial submission"
      }
    }
  },
  methods: {
    save: function(){
        let self = this;

        let request = {
        url: "http://localhost:10010/DSTroubleTicket/api/troubleTicketManagement/v2/troubleTicket/",
        data: JSON.stringify(self.troubleTicket),
        method: 'POST',
        headers : {
          "Content-Type" : "application/json"
          }
        }

        console.log( "Save: ", JSON.stringify(self.troubleTicket))
  
        axios(request)
        .then(function (response) {
            this.$emit('updatecontext', self.troubleTicket)
        })
        .catch(function (error) {
          console.log( 'ERROR: ', JSON.stringify(error))
        })
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
