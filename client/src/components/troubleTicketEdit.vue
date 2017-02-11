<template>
  <div class="editContext">
    <div class="form-horizontal">
      <div class="form-group">
        <div class="col-sm-6">
          <label>Context Id</label>
          <input 
          type="string"
          class="form-control"
          readonly
          v-model="context.id"/>
        </div>
        <div class="col-sm-3">
          <label>Type</label>
          <input 
          type="string"
          class="form-control"
          readonly
          v-model="context.type"/>
        </div> 
        <div class="col-sm-3" v-if="context.availability">
          <label>Availablity</label>
          <input 
          type="string"
          class="form-control"
          v-model="context.availability.value"/>
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-6" v-if="context.position">
          <label>Position</label>
          <input 
          type="string"
          class="form-control"
          v-model="context.position.value"/>
        </div>
      </div>
    </div>
    <div id="buttongroup">    
      <button class="btn btn-default footer-btn" @click="$emit('cancelevent')">Cancel</button>
      <button class="btn btn-primary" @click="save()">Save</button>
      <button class="btn btn-primary" @click="fetchData()">Refresh</button>

      <button type="button" class="btn btn-default" data-toggle="modal" data-target="#myModal">
        Browse JSON
      </button>
      <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title" id="myModalLabel">Context as JSON document (development only)</h4>
            </div>
            <div class="modal-body">
              <pre>{{ JSON.stringify(context, null, '\t')}}</pre>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'editContext',
  data () {
    return {
      context: {},
      contextId: this.$route.params.contextId
    }
  },
  mounted: function() {
    this.fetchData()
  },
  methods: {
    fetchData: function(){
        let self = this;
        const url = 'http://localhost:1026/v2/entities/' + this.contextId
        axios.get(url, {
          dataType: 'json',
          headers: {
            'Accept': 'application/json'
          },
          mode: 'no-cors' 
        })
        .then(function (response) {
          self.context = response.data
        })
        .catch(function (error) {
          console.log(error)
        })
      },
    save: function() {
      let context = this.context
      this.$emit('updatecontext', context)
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
