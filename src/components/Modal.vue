<template>
  <div class="modal">
     <div class="modal-box">
        <p>{{this.modalMessage}}</p>
        <button @click="$emit('close-modal')">Close</button>
     </div>
  </div>
</template>

<script>
export default {
   props: ['modalMessage'],
}
</script>

<style lang="scss" scoped>
.modal {
   display: flex;
   justify-content: center;
   align-items: center;
   z-index: 999;
   position: absolute;
   width: 100%;
   height: 100%;;
   background-color: rgba(0,0,0,0.7);
   
   .modal-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 2px;
    width: 300px;
    padding: 40px 30px 20px 30px;
    background-color: #fff;

    p {
      text-align: center;
    }

    button {
      align-self: center;
    }
  }
}

</style>