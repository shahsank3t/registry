<template>
  <div :style="{'margin-top': '5px'}">
    <template v-if="edit">
      <select ref="stateSelect" class="stateSelect" :defaultValue="versionData.stateId">
        <option disabled :value="versionData.stateId">{{currentState}}</option>
        <template v-for="option in transitions">
          <option :value="option.targetStateId" :selected="option.targetStateId === versionData.stateId ? option.targetStateId : ''" :key="option.targetStateId">{{option.name}}</option>
        </template>
      </select>
      &nbsp;
      <a href="javascript:void(0)" class="btn-stateSelect" @click="changeState">
        <i class="fa fa-check" aria-hidden="true"></i>
      </a>
      &nbsp;
      <a href="javascript:void(0)" class="btn-stateSelect" @click="edit = false">
        <i class="fa fa-times" aria-hidden="true"></i>
      </a>
    </template>
    <template v-else>
        <span class="text-muted">{{currentState}}</span>
        <a v-if="transitions.length && showEditBtn" href="javascript:void(0)" @click="onEdit"><i class="fa fa-pencil" aria-hidden="true"></i></a>
    </template>
  </div>
</template>
<script>
  import SchemaREST from '@/rest/SchemaREST';

  export default{
    name : "ChangeState",
    props : ["versionData","StateMachine","showEditBtn"],
    data(){
      return {
        edit: false,
        transitions : this.StateMachine.getTransitionStateOptions(this.versionData.stateId),
        currentState : this.StateMachine.getStateById(this.versionData.stateId).name
      };
    },

    methods : {
      changeState(e){
        const {versionData} = this;
        SchemaREST.changeStateOfVersion(this.versionData.id, this.$refs.stateSelect.value, {}).then((res) => {
          this.versionData.stateId = parseInt(this.$refs.stateSelect.value);
          this.edit = false;
        });
      },

      onEdit(){
        this.edit = true;
      }
    },

    watch : {
      edit : function(){
        this.transitions = this.StateMachine.getTransitionStateOptions(this.versionData.stateId),
        this.currentState = this.StateMachine.getStateById(this.versionData.stateId).name;
      }
    }
  };
</script>
