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

        <codemirror v-if="panelData.renderCodemirror" :code="versionObj.schemaText" :options="jsonOptions"></codemirror>
        <div v-else class="col-sm-12">
          <div class="loading-img text-center" :style="{'margin-top' : '50px'}">
            <img src="static/img/start-loader.gif" alt="loading" />
          </div>
        </div>
      </div>
      <div class="col-sm-3">
        <h6 class="schema-th">Change Log</h6>
        <ul class="version-tree" v-for="(v , i) in sortedVersions">
          <li :class="[panelData.currentVersion === v.version ? 'clearfix current' : 'clearfix']" :key="i">
            <a :class="[panelData.currentVersion === v.version ? 'hb version-number' : 'hb default version-number']">v{{v.version}}</a>
            <p>
              <span class="log-time-text">{{getTimeStamp(v.timestamp)}}</span>
              <br/>
              <app-ChangeState
                :versionData="v"
                :StateMachine="StateMachine"
                :showEditBtn="panelData.currentVersion === v.version">
              </app-ChangeState>
            </p>
          </li>
        </ul>
        <a v-if="sortedVersions.length > 1" class="compare-version" @click="handleCompareVersions">COMPARE VERSIONS</a>
      </div>
    </template>
    <template v-else>
      <template v-if="panelData.evolve">
        <div class="col-sm-3" key="v.k.1">
            <h6 class="schema-th">Description</h6>
            <p></p>
        </div>
        <div class="col-sm-6" key="v.k.2">
          <button v-if="panelData.renderCodemirror" type="button" class="btn btn-link btn-add-schema" @click="addVersionClicked(panelData)"}>
            <i class="fa fa-pencil"></i>
          </button>
          <codemirror v-if="panelData.renderCodemirror" :code="emptySchema" :options="jsonOptions"></codemirror>
          <div v-else class="col-sm-12">
            <div class="loading-img text-center" :style="{'margin-top' : '50px'}">
              <img src="static/img/start-loader.gif" alt="loading" />
            </div>
          </div>
        </div>
        <div class="col-sm-3" key="v.k.3">
          <h6 class="schema-th">Change Log</h6>
        </div>
      </template>
      <template v-else>
        <div :style="{'textAlign': 'center'}">NO DATA FOUND</div>
      </template>
    </template>
  </div>
</template>
<script>
  import { codemirror, CodeMirror } from 'vue-codemirror';
  import 'codemirror/addon/selection/active-line.js';
  import 'codemirror/addon/selection/mark-selection.js';
  import Utils from '@/utils/Utils';
  import ChangeState from '@/components/ChangeState';


  export default{
    name : "PanelContent",
    props : ["panelData","handleAddVersion","handleExpandView","StateMachine","handleCompareVersions"],
    components : {
      "codemirror" : codemirror,
      "app-ChangeState" : ChangeState
    },
    data(){
      return {
        versionObj : this.fetchVersion(),
        sortedVersions : this.sortedVersionsFUNC(),
        code : '',
        jsonOptions : {
          lineNumbers: true,
          mode: "application/json",
          styleActiveLine: true,
          foldGutter: true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
          lint: false,
          readOnly: true,
          line: true
        },
        schemaViewOptions : {
          lineNumbers: true,
          mode: "application/json",
          styleActiveLine: true,
          foldGutter: true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
          lint: false,
          readOnly: true,
          line: true
        },
        emptySchema : ''
      };
    },

    methods : {
      fetchVersion(){
        return _.find(this.panelData.versionsArr, {version: this.panelData.currentVersion});
      },

      sortedVersionsFUNC(){
        return Utils.sortArray(this.panelData.versionsArr.slice(), 'id', false);
      },

      getTimeStamp(time){
        return Utils.splitTimeStamp(new Date(time));
      },

      addVersionClicked(item){
        this.handleAddVersion(item);
      },

      expandViewClicked(item){
        this.handleExpandView(item);
      }
    }
  };
</script>
