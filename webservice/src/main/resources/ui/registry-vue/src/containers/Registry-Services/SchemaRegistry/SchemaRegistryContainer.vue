<template>
  <div>
    <div id="add-schema">
      <button role="button" type="button" class="actionAddSchema hb lg success" @click="handleAddSchema">
        <i class="fa fa-plus"></i>
      </button>
    </div>
    <div class="wrapper animated fadeIn">
      <div class="page-title-box row no-margin">
        <div class="col-md-3 col-md-offset-6 text-right">
          <div class="form-group">
            <span class="input-group">
              <input type="text" placeholder="Search by name" :value="filterValue" class="form-control" @input="onFilterChange" @keyup="onFilterKeyPress">
              <span class="input-group-addon">
                <i class="fa fa-search"></i>
              </span>
            </span>
          </div>
        </div>
        <div class="col-md-2 text-center">
          <app-Dropdown :menuList="dropDownList" @onSortByClicked="onSortByClicked"  funcName="onSortByClicked"></app-Dropdown>
        </div>
      </div>
    </div>

    <div class="row" v-if="!loading && schemaEntities.length">
      <div class="col-md-12">
        <div role="tablist" class="panel-registry">
          <app-Panel v-for="(pageData , i) in activePageData"
            :key="i"
            :funcCallback="handleSelect"
            :itemData="pageData">
            <!-- Panel header -->
            <div class="panel-title" slot="pHeader">
              <span class="hb schema-status-icon" :class="getBtnClass(pageData.compatibility)">
                <i :class="getIconClass(pageData.compatibility)"></i>
              </span>
              <div class="panel-sections first fluid-width-15">
                  <h4 ref="schemaName" class="schema-name" :title="pageData.schemaName">
                    {{filterEllipses(pageData.schemaName)}}
                  </h4>
                  <p class="schema-status" :class="pageData.compatibility.toLowerCase()">{{pageData.compatibility}}</p>
              </div>
              <div class="panel-sections">
                  <h6 class="schema-th">Type</h6>
                  <h4 :class="['schema-td', !pageData.collapsed ? 'font-blue-color' : '']">{{pageData.type}}</h4>
              </div>
              <div class="panel-sections">
                  <h6 class="schema-th">Group</h6>
                  <h4 ref="schemaGroup" :class="['schema-td', !pageData.collapsed ? 'font-blue-color' : '']" :title="pageData.schemaGroup">
                    {{filterEllipses(pageData.schemaGroup)}}
                  </h4>
              </div>
              <div class="panel-sections">
                  <h6 class="schema-th">Version</h6>
                  <h4  :class="['schema-td', !pageData.collapsed ? 'font-blue-color' : '']">{{pageData.versionsArr.length}}</h4>
              </div>
              <div class="panel-sections">
                  <h6 class="schema-th">Serializer & Deserializer</h6>
                  <h4 :class="['schema-td', !pageData.collapsed ? 'font-blue-color' : '']">
                    <router-link :to="{name: 'serdes', params: {schemaName: pageData.schemaName}}" :style="{display : 'inline'}">{{pageData.serDesInfos.length}}</router-link>
                  </h4>
              </div>
            </div>
            <!-- Panel Body -->
            <div class="panel-body" slot="pBody" v-if="!pageData.collapsed">
              <app-PanelContent :panelData="pageData"
                :handleAddVersion="handleAddVersion"
                :handleExpandView="handleExpandView">
              </app-PanelContent>
            </div>
          </app-Panel>
        </div>
      </div>
    </div>

    <!-- If loading is true  -->
    <div class="col-sm-12" v-if="loading">
      <div class="loading-img text-center" :style="{marginTop : '50px'}">
        <img src="static/img/start-loader.gif" alt="loading" />
      </div>
    </div>

    <!-- FSModal start here  -->
    <app-FSModal
      :modalTitle="modalTitle"
      cssClass="sm"
      ref="schemaModal"
      @resovle="handleConfirmResolve()"
      @reject="handleModalReject('schemaModal')"
      >
      <div slot="mbody">
        This is an add schema modal
     </div>
    </app-FSModal>
  </div>
</template>
<script>
  import SchemaREST from '@/rest/SchemaREST';
  import FSModal from '@/components/FSModal';
  import FSToaster from '@/components/FSToaster';
  import Utils from '@/utils/Utils';
  import NoData from '@/components/NoData';
  import DropDownVue from '@/utils/DropDown-Vue';
  import PanelVue from '@/utils/Panel-Vue';
  import PanelContent  from '@/components/PanelContent';

  export default{
    name : "SchemaRegistryContainer",

    components : {
      "app-FSModal" : FSModal,
      "app-NoData" : NoData,
      "app-Dropdown" : DropDownVue,
      "app-Panel" : PanelVue,
      "app-PanelContent" : PanelContent
    },

    data(){
      return{
        modalTitle: '',
        schemaData: [],
        filterValue: '',
        fetchLoader: true,
        sorted : {
          key : 'timestamp',
          text : 'Last Updated'
        },
        expandSchema: false,
        activePage: 1,
        pageSize: 10,
        dataFound: true,
        schemaObj : {},
        schemaText : '',
        loading : true,
        dropDownList : [
          {label : "Name",value : "name"},
          {label : "Last Updated",value : "timestamp"}
        ],
        schemaEntities : [],
        activePageData : [],
        schemaNameTagWidth : 413,
        versionDataArr : []
      };
    },

    created(){
      this.fetchData();
    },

    mounted(){
      this.btnClassChange();
    },

    beforeUpdate(){
      this.btnClassChange();
    },

    methods : {
      getBtnClass(c) {
        switch(c){
        case 'FORWARD':
          return "warning";
        case 'BACKWARD':
          return "backward";
        case 'BOTH':
          return "";
        default:
          return 'default';
        }
      },

      getIconClass(c) {
        switch(c){
        case 'FORWARD':
          return "fa fa-arrow-right";
        case 'BACKWARD':
          return "fa fa-arrow-left";
        case 'BOTH':
          return "fa fa-exchange";
        case 'NONE':
          return "fa fa-ban";
        default:
          return '';
        }
      },

      btnClassChange(){
        if(!this.loading){
          if(this.schemaData.length !== 0){
            if(this.$refs.schemaName && this.schemaNameTagWidth != this.$refs.schemaName.offsetWidth){
              this.schemaNameTagWidth = this.$refs.schemaName[0].offsetWidth;
              this.schemaGroupTagWidth= this.$refs.schemaGroup[0].offsetWidth;
            }
          }
        }
      },

      fetchData(){
        let promiseArr = [],
          schemaData = [],
          schemaCount = 0;

        const {filterValue} = this;
        const {key} = this.sorted;
        const sortBy = (key === 'name') ? key+',a' : key+',d';

        return SchemaREST.searchAggregatedSchemas(sortBy, filterValue).then((schema) => {
          if (schema.responseMessage !== undefined) {
            FSToaster.error(schema.responseMessage);
          } else {
            schema.entities.map((obj, index) => {
              let {name, schemaGroup, type, description, compatibility, evolve} = obj.schemaMetadata;
              schemaCount++;

              const versionsArr = [];
              let currentVersion = 0;
              if(obj.versions.length){
                obj.versions.forEach((v) => {
                  versionsArr.push({
                    versionId: v.version,
                    description: v.description,
                    schemaText: v.schemaText,
                    schemaName: name,
                    timestamp: v.timestamp
                  });
                });
                currentVersion = Utils.sortArray(obj.versions.slice(), 'timestamp', false)[0].version;
              }

              this.schemaData.push({
                id: (index + 1),
                type: type,
                compatibility: compatibility,
                schemaName: name,
                schemaGroup: schemaGroup,
                evolve: evolve,
                collapsed: true,
                versionsArr:  versionsArr,
                currentVersion: currentVersion,
                serDesInfos: obj.serDesInfos
              });
              this.schemaEntities = this.schemaData;
            });
            let dataFound = this.dataFound;
            if(!dataFound && this.schemaEntities.length){
              dataFound = true;
            }
            this.schemaData = this.schemaEntities;
            this.loading = false;
            this.dataFound = dataFound;
            if(schema.entities.length === 0) {
              this.loading = false;
            }
          }
          return this.schemaEntities;
        });
      },

      onFilterChange(e){
        this.filterValue = e.target.value;
      },

      onFilterKeyPress(e){
        if(e.key=='Enter'){
          this.filterValue = e.target.value.trim();
          this.activePage = 1;
          this.fetchData();
        }
      },

      filterSchema(entities, filterValue){
        let matchFilter = new RegExp(filterValue , 'i');
        return entities.filter(e => !filterValue || matchFilter.test(e.schemaName));
      },

      onSortByClicked(obj){
        const sortObj = {key : obj.value , text : this.sortByKey(obj.value)};
        this.sorted = sortObj;
        this.fetchData();
      },

      sortByKey(string){
        switch (string) {
        case "timestamp": return "Last Updated";
          break;
        case "name" : return "Name";
          break;
        default: return "Last Updated";
        }
      },

      handleOnEnter(s){
        // s.renderCodemirror = true;
        // this.forceUpdate();
      },

      handleOnExit(s){
        // s.renderCodemirror = false;
        // this.setState(this.state);
      },

      handleSelect(expand,item){
        let ind = _.findIndex(this.schemaData,{id: item.id});
        if(ind !== -1){
          this.schemaData[ind].collapsed = !item.collapsed;
          this.schemaData[ind].renderCodemirror = expand;
        }
      },

      selectVersion(v) {
        let {schemaData} = this;
        let obj = _.find(schemaData, {schemaName: v.schemaName});
        obj.currentVersion = v.versionId;
        this.schemaData = schemaData;
      },

      handleAddSchema() {
        this.modalTitle = 'Add New Schema';
        this.$refs.schemaModal.show();
      },

      handleAddVersion(schemaObj) {
        let obj = _.find(schemaObj.versionsArr, {versionId: schemaObj.currentVersion});
        this.schemaObj = {
          schemaName: schemaObj.schemaName,
          description: obj ? obj.description : '',
          schemaText: obj ? obj.schemaText : '',
          versionId: obj ? obj.versionId : ''
        };
        this.modalTitle = 'Edit Version';
        this.$refs.versionModal.show();
      },

      handleExpandView(schemaObj) {
        let obj = _.find(schemaObj.versionsArr, {versionId: schemaObj.currentVersion});
        this.schemaText = obj.schemaText;
        this.modalTitle = obj.schemaName;
        this.expandSchema = true;
      },

      handleSaveVersion() {
        if (this.$refs.addVersion.validateData()) {
          this.$refs.addVersion.handleSave().then((versions) => {
            if(versions && versions.compatible === false){
              FSToaster.error(versions.errorMessage);
            } else {
              if (versions.responseMessage !== undefined) {
                FSToaster.error(versions.responseMessage);
              } else {
                this.$refs.versionModal.hide();
                this.fetchData();
                let msg = "Version added successfully";
                if (this.modalTitle === 'Edit Version') {
                  msg = "Version updated successfully";
                }
                if(versions === this.schemaObj.versionId) {
                  msg = "The schema version is already present";
                  FSToaster.info(msg);
                } else {
                  FSToaster.success(msg);
                }
              }
            }
          });
        }
      },

      handleSave() {
        if (this.$refs.addSchema.validateData()) {
          this.$refs.addSchema.handleSave().then((schemas) => {
            if (schemas.responseMessage !== undefined) {
              FSToaster.error(schemas.responseMessage);
            } else {
              this.$refs.schemaModal.hide();
              this.fetchData();
              let msg = "Schema added successfully";
              if (this.id) {
                msg = "Schema updated successfully";
              }
              FSToaster.success(msg);
            }
          });
        }
      },

      handlePagination(eventKey){
        this.activePage = eventKey;
      },

      getActivePageData(allData, activePage, pageSize){
        activePage = activePage - 1;
        const startIndex = activePage*pageSize;
        return allData.slice(startIndex, startIndex+pageSize);
      },

      handleCompareVersions(schemaObj) {
        this.schemaObj = schemaObj;
        this.modalTitle = 'Compare Schema Versions';
        this.showDiffModal = true;
      },

      handleModalReject(refType){
        this.$refs[refType].hide();
      },

      filterEllipses(value){
        return Utils.ellipses(value, this.schemaNameTagWidth) ;
      }

    },

    watch : {
      schemaEntities(){
        this.activePageData = this.getActivePageData(this.schemaEntities,this.activePage,this.pageSize);
      }
    }

  };
</script>
