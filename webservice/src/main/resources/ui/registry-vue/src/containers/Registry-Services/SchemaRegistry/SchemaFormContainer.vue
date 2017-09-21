<template>
  <form>
    <div class="row">
      <div :class="[expandCodemirror ? 'hidden' : 'col-md-6']" ref="formLeftPanel">
        <div class="form-group">
          <label>Name <span class="text-danger">*</span></label>
          <div>
            <input name="name" placeholder="Name" @input="handleValueChange" type="text"
              :class="[showError && changedFields.indexOf('name') !== -1 && name === ''
              ? 'form-control invalidInput'
              : 'form-control']" :value="name" :required="true"/>
          </div>
        </div>
        <div class="form-group">
          <label>description <span class="text-danger">*</span></label>
          <div>
            <input name="description" placeholder="Description" @input="handleValueChange" type="text"
              :class="[showError && changedFields.indexOf('description') !== -1 && description === ''
              ? 'form-control invalidInput'
              : 'form-control']" :value="description" :required="true"/>
          </div>
        </div>
        <div class="form-group">
          <label>Type <span class="text-danger">*</span></label>
          <div>
            <app-select :options="typeArr" :selectedVal="type" callBack="handleTypeChange"/>
            <!-- valueKey="type" labelKey="name" -->
          </div>
        </div>
        <div class="form-group">
          <label>Schema Group <span class="text-danger">*</span></label>
          <div>
            <input name="schemaGroup" placeholder="Schema Group" @input="handleValueChange" type="text"
              :class="[showError && changedFields.indexOf('schemaGroup') !== -1 && schemaGroup === ''
              ? 'form-control invalidInput'
              : 'form-control']" :value="schemaGroup" :required="true"/>
          </div>
        </div>
        <div class="form-group">
          <label>Compatibility</label>
          <div>
            <app-select :options="compatibilityArr" :selectedVal="compatibility" callBack="handleCompatibilityChange"/>
          </div>
        </div>
        <div class="form-group">
          <div class="checkbox">
          <label>
            <input name="evolve" @input="handleToggleEvolve" type="checkbox" :value="evolve" :checked="evolve"/>
            Evolve
          </label>
          <span v-if="!evolve" class="warning"> <i class="fa fa-exclamation-triangle" aria-hidden="true"></i> New schema versions cannot be added.</span>
        </div>
        </div>
      </div>
      <div :class="[expandCodemirror ? 'col-md-12' : 'col-md-6']">
        <div class="form-group">
          <label>
            Schema Text <span class="text-danger">*</span>
          </label>
          <a v-if="showCodemirror" key="1" class="pull-right clear-link" href="javascript:void(0)"
            @click= "handleClearClicked">
            CLEAR
          </a>
          <span v-if="showCodemirror" key="2" class="pull-right" :style="{'margin': '-1px 5px 0'}">|</span>
          <a v-if="showCodemirror" key="3" class="pull-right" href="javascript:void(0)"
            @click="expandCodemirror = !expandCodemirror">
            <i v-if="expandCodemirror" class="fa fa-compress"></i>
            <i v-else class="fa fa-expand"></i>
          </a>
          <div drag-over="handleDragOver">
            <codemirror v-if="showCodemirror" :code="schemaText" @change="handleJSONChange" :options="jsonoptions"></codemirror>
            <div v-show="!showCodemirror" ref="browseFileContainer"
              :class="['addSchemaBrowseFileContainer',(showError && validateJSON(schemaText)) ? ' invalidInput' : '']">
              <div @click="showCodemirror = true">
                <div class="main-title">Copy & Paste</div>
                <div class="sub-title m-t-sm m-b-sm">OR</div>
                <div class="main-title">Drag & Drop</div>
                <div class="sub-title" :style="{'margin-top': '-4px'}">Files Here</div>
                <div class="sub-title m-t-sm m-b-sm">OR</div>
                <div  class="m-t-md">
                  <input type="file" ref="browseFile" class="inputfile"
                   @change.stop.prevent="handleBrowseFile"/>
                  <label htmlFor="file" class="btn btn-success">BROWSE</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </form>
</template>
<script>
  import SchemaREST from '@/rest/SchemaREST';
  import FSToaster from '@/components/FSToaster';
  import { codemirror, CodeMirror } from 'vue-codemirror';
  import 'codemirror/addon/selection/active-line.js';
  import 'codemirror/addon/selection/mark-selection.js';
  import VueSelect from '@/components/VueSelect';
  import Utils from '@/utils/Utils';

  export default {
    name : "SchemaFormContainer",
    props : [],
    components : {
      "codemirror" : codemirror,
      "app-select" : VueSelect
    },
    data(){
      return {
        name: '',
        compatibility: 'BACKWARD',
        compatibilityArr: [
          {
            value: 'BACKWARD',
            text: 'BACKWARD'
          }, {
            value: 'FORWARD',
            text: 'FORWARD'
          }, {
            value: 'BOTH',
            text: 'BOTH'
          }, {
            value: 'NONE',
            text: 'NONE'
          }
        ],
        evolve: true,
        schemaText: '',
        schemaTextFile: null,
        type: 'avro',
        typeArr: [],
        schemaGroup: 'Kafka',
        description: '',
        showError: false,
        changedFields: [],
        showCodemirror: false,
        jsonoptions : {
          lineNumbers: true,
          mode: "application/json",
          styleActiveLine: true,
          foldGutter: true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
          lint: true,
          line: true
        },
        expandCodemirror : false
      };
    },

    created(){
      this.fetchData();
    },

    mounted(){
      this.setCodemirroSize();
    },

    beforeUpdate(){
      this.setCodemirroSize();
    },

    methods : {
      fetchData(){
        SchemaREST.getSchemaProviders().then((results) => {
          let arr =[];
          _.map(results.entities, (d) => {
            arr.push({
              text : d.name,
              value : d.type
            });
          });
          this.typeArr = arr;
        });
      },

      validateJSON(json){
        return !Utils.isValidJson(json);
      },

      setCodemirroSize(){
        const {JSONCodemirror, formLeftPanel, browseFileContainer} = this.$refs;
        const {expandCodemirror} = this;
        const height = formLeftPanel.clientHeight - 50;
        if(JSONCodemirror){
          if(!expandCodemirror){
            JSONCodemirror.codeMirror.setSize('100%', height);
          }else{
            JSONCodemirror.codeMirror.setSize('100%', '450px');
          }
        }else{
          browseFileContainer.style.height = height+'px';
        }
      },

      handleValueChange(e) {
        this[e.target.name] = e.target.value;
      },

      handleTypeChange(obj) {
        obj ? this.type = obj.type : this.type = '';
      },

      handleCompatibilityChange(obj) {
        obj ? this.compatibility = obj.value : this.compatibility = '';
      },

      handleJSONChange(json){
        this.schemaText = json;
      },

      handleOnDrop(e) {
        if (!e.dataTransfer.files.length) {
          this.schemaTextFile = null;
        } else {
          var file = e.dataTransfer.files[0];
          var reader = new FileReader();
          reader.onload = function(e) {
            if(Utils.isValidJson(reader.result)) {
              this.schemaTextFile = file;
              this.schemaText = reader.result;
            } else {
              this.schemaTextFile = null;
              this.schemaText = '';
            }
            this.showCodemirror = true;
          }.bind(this);
          reader.readAsText(file);
        }
      },

      handleBrowseFile(e){
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
          this.schemaTextFile = file;
          this.schemaText = reader.result;
          this.showCodemirror = true;
        }.bind(this);
        reader.readAsText(file);
      },

      handleToggleEvolve(e) {
        this.evolve = e.target.checked;
      },

      validateData() {
        let {name, type, schemaGroup, description, changedFields, schemaText} = this;
        if (name.trim() === '' || schemaGroup === '' || type === '' || description.trim() === '' || schemaText.trim() === '' || !Utils.isValidJson(schemaText.trim())) {
          if (name.trim() === '' && changedFields.indexOf("name") === -1) {
            changedFields.push("name");
          };
          if (schemaGroup.trim() === '' && changedFields.indexOf("schemaGroup") === -1) {
            changedFields.push("schemaGroup");
          }
          if (type.trim() === '' && changedFields.indexOf("type") === -1) {
            changedFields.push("type");
          }
          if (description.trim() === '' && changedFields.indexOf("description") === -1) {
            changedFields.push("description");
          }
          this.showError =  true;
          this.changedFields = changedFields;
          this.expandCodemirror = false;
          return false;
        } else {
          this.showError = false;
          return true;
        }
      },

      handleSave() {
        let data = {};
        let {name, type, schemaGroup, description, compatibility, evolve, schemaText} = this;
        data = {
          name,
          type,
          schemaGroup,
          description,
          evolve
        };
        if (compatibility !== '') {
          data.compatibility = compatibility;
        }
        return SchemaREST.postSchema({body: JSON.stringify(data)})
          .then((schemaResult)=>{
            if(schemaResult.responseMessage !== undefined){
              FSToaster.error(schemaResult.responseMessage);
            } else {
              let versionData = { schemaText, description };
              return SchemaREST.postVersion(name, {body: JSON.stringify(versionData)});
            }
          });
      },

      handleClearClicked(){
        this.schemaText = '';
        this.showCodemirror = false;
        this.expandCodemirror = false;
      }

    }
  };
</script>
