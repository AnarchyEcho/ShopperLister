<script setup lang="ts">
import { reactive, ref, useTemplateRef } from 'vue';

const localStorage = window.localStorage;
const page = ref(localStorage.getItem("routerState"));

const modal = useTemplateRef('contextModal');

document.addEventListener('click', (e) => {
  if (modal && modal.value?.open && !e.composedPath().includes(modal.value)) {
    modal.value?.close();
  }
}, { capture: true })

const formValues = ref({
  name: '',
  amount: '',
});

const reset = () => {
  formValues.value.name = '';
  formValues.value.amount = '';
}

const onSubmit = async () => {
  console.log(formValues.value);
}
</script>

<template>
  <div>
    <div class="buttonWrapperClosed" @click="() => {
      page = localStorage.getItem('routerState');
      modal?.showModal();
    }">
      <div style="position: relative;">
        <v-icon name="md-playlistadd" scale="3" fill="#232323" />
        <v-icon name="md-playlistadd" scale="3" fill="#23232340" style="position: absolute; left: 2px; top: 2px;" />
      </div>
    </div>

    <dialog class="buttonWrapperOpen" ref="contextModal">
      <div
        style="display: flex; flex-direction: row; justify-content: space-between; padding-top: 5px; padding-bottom: 5px;">
        <p style="font-size: 16px; margin: 5px 0 0 5px; padding: 0;"
          v-text="page && page != '/' ? 'Add list' : 'Add item'" />
        <div @click="modal?.close()">
          <v-icon name="bi-chevron-down" scale="1.5" />
        </div>
      </div>
      <div class="openForm">
        <div class="formWrapper">
          <label class="formText"> Name: </label>
          <input type="text" class="formInput" />
        </div>
        <div class="formWrapper" v-if="page !== 'lists'">
          <label class="formText"> Amount: </label>
          <input type="text" class="formInput" style="width: 50px;" />
        </div>
        <div @click="onSubmit" class="button">
          <p style="font-size: 14px;">Add to list</p>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style lang="scss" scoped>
.buttonWrapperClosed {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: #FFA500;
  padding: 10px;
  border-radius: 100px;
  border: solid 4px rgba(0, 0, 0, 0.3);
}

.buttonWrapperOpen {
  align-self: flex-end;
  margin-bottom: 5px;
  justify-self: center;
  background-color: #FFA500;
  border-radius: 10px;
  height: 200px;
  width: 100%;
}

.openForm {
  background-color: #404040;
  width: 100%;
  height: 173px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding-top: 20px;
}

.button {
  background-color: #FFA500;
  width: 100px;
  height: 35px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 10px;
}

.formWrapper {
  display: flex;
  gap: 15px;
  flex-direction: row;
  height: 35px;
  align-items: center;
  align-self: flex-start;
  margin-left: 5px;
}

.formInput {
  height: 35px;
  width: 250px;
  text-align: left;
  padding-left: 5px;
  padding-right: 5px;
  color: #FEFEFE;
  background-color: #505050;
  border-radius: 5px;
}

.formText {
  color: #FEFEFE;
  width: 50px;
}

.errorText {
  position: absolute;
  top: 3px;
  color: #FF3333;
}

dialog {
  margin: 0;
  padding: 0;
}

dialog::backdrop {
  pointer-events: none;
  display: none;
}
</style>
