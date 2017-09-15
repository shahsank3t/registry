<template>
  <div class="row">
    <template v-if="versionObj">
      <div class="col-sm-3">
        <h6 class="schema-th">Description</h6>
        <p>{{versionObj.description}}</p>
      </div>
      <div class="col-sm-6">
        <h6 v-if="panelData.renderCodemirror && panelData.evolve" key="e.1" class="version-number-text">VERSION&nbsp;{{versionObj.versionId}}</h6>,
        <button v-if="panelData.renderCodemirror && panelData.evolve" key="e.2" type="button" class="btn btn-link btn-edit-schema" @click="addVersionClicked(panelData)">
          <i class="fa fa-pencil"></i>
        </button>
        <button v-else key="e.3" type="button" class="btn btn-link btn-expand-schema" @click="expandViewClicked(panelData)">
          <i class="fa fa-arrows-alt"></i>
        </button>



      </div>
      <div class="col-sm-3">
        <h6 class="schema-th">Change Log</h6>
      </div>
    </template>
    <template v-else>
      No versionObj
    </template>
  </div>
</template>
<script>
  export default{
    name : "PanelContent",
    props : ["panelData","handleAddVersion","handleExpandView"],
    data(){
      return {
        versionObj : {}
      };
    },

    created(){
      this.fetchVersion(this.panelData);
    },

    methods : {
      fetchVersion(data){

      },

      addVersionClicked(item){
        // this.handleAddVersion(item);
      },

      expandViewClicked(item){
        // this.handleExpandView(item);
      }
    }
  };
</script>
