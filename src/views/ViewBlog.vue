<template>
  <div class="post-view" v-if="currentBlog">
    <div class="toggle-edit">
      <span>Toggle Editing Post</span>
      <input type="checkbox" :checked="inactiveEditPost" @click="editPost">
    </div>
    <div class="icons hehe" v-bind:class="{showIcons: inactiveEditPost}">
      <div @click="editBlog" class="icon">
        <Edit class="edit" />
      </div>
      <div @click="deletePost" class="icon">
        <Delete class="delete" />
      </div>
    </div>
    
    <div class="container quillWrapper">
      <h2>{{ this.currentBlog[0].blogTitle }}</h2>
      <h4>Posted on: {{ new Date(this.currentBlog[0].blogDate).toLocaleString("en-us", { dateStyle: "long" }) }}</h4>
      <h4>Author: {{this.author.firstName }} {{this.author.lastName}}</h4>
      <div class="blogCoverPhoto">
        <img :src="this.currentBlog[0].blogCoverPhoto" alt="" />
      </div>
      <div class="post-content ql-editor" v-html="this.currentBlog[0].blogHTML"></div>
      <div class="comment-input">
        <p class="quantityMessages">{{this.quantityMessages}} comments</p>
        <textarea type="text" placeholder="Writer your comments..." rows="3" v-model="comment"> </textarea>
        <p class="errorMsg">{{this.errorMsg}}</p>
        <div class="comment-btns">
          <button class="btn-cancel">Cancel</button>
          <button class="btn-send" @click="sendMessage">Send</button>
        </div>
      </div>
      <div class="list-comments">
        <div v-for="(comment,index) in comments" :key="'index'+index" class="comment">
          <div class="info">
            <span>{{comment.firstName.match(/(\b\S)?/g).join("") + comment.lastName.match(/(\b\S)?/g).join("")}}</span>
            <div>
              <h3>{{comment.firstName}} {{comment.lastName}}</h3>
              <p>{{new Date(comment.createdAt).toLocaleString("en-us", { dateStyle: "long" })}}</p>
            </div>
          </div>
          <p>{{comment.text}}</p>
          <div class="comment-emoij">
            <div class="comment-emoij__like" >
              <i class="fal fa-thumbs-up " @click="like(comment)" :class="{fas: comment.listUserUIDLiked.indexOf(profileId) != -1}"></i>
              <span>{{comment.like}}</span>
            </div>
            <div class="comment-emoij__dislike">
              <i class="fal fa-thumbs-down" @click="dislike(comment)" :class="{fas: comment.listUserUIDDisliked.indexOf(profileId) != -1}"></i>
              <span>{{comment.dislike}}</span>
            </div>
            <span class="comment-reply">Reply</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import db from '../firebase/firebaseInit'
import firebase from 'firebase'
import Edit from "../assets/Icons/edit-regular.svg";
import Delete from "../assets/Icons/trash-regular.svg";

export default {
  name: "ViewBlog",
  components: { Edit, Delete },
  data() {
    return {
      currentBlog: null,
      author : {},
      inactiveEditPost: true,
      countEdit: 0,
      comment : '',
      comments: [],
      quantityMessages : 0,
      errorMsg: '',
    }
  },
  async mounted() {
    this.currentBlog = await this.$store.state.blogPosts.filter(blog => {
      return blog.blogID === this.$route.params.blogID
    })
    const dataBase = await db.collection('users').doc(this.currentBlog[0].profileId)
    const dbResults = await dataBase.get()
    this.author = dbResults.data()
    db.collection("comments").where("comment.blogId","==",this.$route.params.blogID)
    .onSnapshot(
      (querySnapshot) => {
        this.comments = []
        querySnapshot.forEach((doc) => {
            this.comments.push(doc.data().comment);
        });
        this.comments.sort((a,b) => {
          return parseInt(a.createdAt) - parseInt(b.createdAt)
        })
        this.quantityMessages = this.comments.length
    })
  },
  computed: {
    profileId() {
      return this.$store.state.profileId;
    },
  },
  methods : {
    editPost() {
      this.countEdit++;
      console.log(this.author.email)
      console.log(firebase.auth().currentUser.email);
      if (this.author.email === firebase.auth().currentUser.email && this.countEdit % 2 != 0) {
        this.inactiveEditPost = false;
      }
      else if (this.author.email !== firebase.auth().currentUser.email){
        alert ("You're not the author! ")
        this.inactiveEditPost = true;
      }
      else {
        this.inactiveEditPost = true;
      }
    },
    deletePost() {
      this.$store.dispatch("deletePost", this.currentBlog[0].blogID)
      console.log("deletePost")
    },
    editBlog() {
      this.$router.push({ name: "EditBlog", params: { blogID: this.currentBlog[0].blogID } });
      console.log("editPost")
    },
    async sendMessage() {
      if(this.comment == '') {
        this.errorMsg = "Comment not be empty"
      }
      if(this.$store.state.user == null) {
        this.errorMsg = "You need to login to comments"
      }
      if(this.$store.state.user != null && this.comment != '' ) {
        this.errorMsg = ''
        const dataBase = await db.collection("comments").doc();
        const comment = {
          'commentId' : dataBase.id,
          'userUID': this.$store.state.profileId,
          'blogId' : this.currentBlog[0].blogID,
          'firstName': this.$store.state.profileFirstName,
          'lastName' : this.$store.state.profileLastName,
          'text': this.comment,
          'createdAt': Date.now(),
          'like' : 0,
          'dislike' : 0,
          'listUserUIDLiked' : [],
          'listUserUIDDisliked' : []
        }
        await dataBase.set({comment})
        .then(() => {
            this.comment = '' 
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
      }
    },
    async like (comment) {
      if(this.$store.state.user != null) {
        const dataBase = await db.collection("comments").doc(comment.commentId);
        if(comment.listUserUIDLiked.indexOf(this.profileId)) {
          await dataBase.update({
            "comment.like" : comment.like +1,
            "comment.listUserUIDLiked" : firebase.firestore.FieldValue.arrayUnion(this.profileId),
          });
          if(comment.listUserUIDDisliked.indexOf(this.profileId) != -1) {
            await dataBase.update({
              "comment.dislike" : comment.dislike -1,
              "comment.listUserUIDDisliked" : firebase.firestore.FieldValue.arrayRemove(this.profileId)
            });
          }
        } else {
          await dataBase.update({
            "comment.like" : comment.like -1,
            "comment.listUserUIDLiked" : firebase.firestore.FieldValue.arrayRemove(this.profileId)
          });
        }
      } else { 
        alert("You need to login to interact")
      }
    },
    async dislike(comment) {
      if(this.$store.state.user != null) {
        const dataBase = await db.collection("comments").doc(comment.commentId);
        if(comment.listUserUIDDisliked.indexOf(this.profileId)) {
          await dataBase.update({
            "comment.dislike" : comment.dislike +1,
            "comment.listUserUIDDisliked" : firebase.firestore.FieldValue.arrayUnion(this.profileId)
          });
          if(comment.listUserUIDLiked.indexOf(this.profileId) != -1) {
            await dataBase.update({
              "comment.like" : comment.like -1,
              "comment.listUserUIDLiked" : firebase.firestore.FieldValue.arrayRemove(this.profileId),
            });
          }
        } else {
          await dataBase.update({
            "comment.dislike" : comment.dislike -1,
            "comment.listUserUIDDisliked" : firebase.firestore.FieldValue.arrayRemove(this.profileId)
          });
        }
      } else {
        alert("You need to login to interact")
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.toggle-edit {
  display: flex;
  align-items: center;
  position: absolute;
  top: 70px;
  right: 20px;

  span {
    margin-right: 16px;
  }
  //Toggle checkbox
input[type="checkbox"] {
  position: relative;
  border: none;
  -webkit-appearance: none;
  background: #fff;
  outline: none;
  width: 55px;
  height: 25px;
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
input[type="checkbox"]:before {
  content: "";
  position: absolute;
  width: 25px;
  height: 25px;
  border-radius: 20px;
  top: 0;
  right: 0;
  background: #303030;
  transform: scale(1.1);
  transition: 750ms ease all;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
input:checked[type="checkbox"]:before {
  background: #f3f3f3;
  right: 32px;
}
}
.showIcons {
  display: none;
}
.icons {
  position: absolute;
  top: 100px;
  right: 10px;
  z-index: 10;

  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 8px;
    width: 35px;
    height: 35px;
    border: 1px solid #252525;
    border-radius: 50%;
    background-color: #fff;
    transition: 0.5s;

    &:hover {
      background-color: #252525;

      .edit, .delete {
        path {
          fill: #fff;
        }
      }
    }
    .edit, .delete {
      pointer-events: none;
      height: 15px;
      width: auto;
    }
    &:nth-child(1) {
      margin-right: 8px;
    }
  }
}

.post-view {
  h2{
    text-align: center;
    font-weight: normal;
  }
  h4{
    color: gray;
    text-align: center;
    margin: 20px auto;
    font-weight: 300;
  }

  .comment-input {
    padding: 20px;
    margin-top: 40px;

    @media (max-width:900px) {
      padding: 0;
    }

    .quantityMessages {
      margin: 10px 0;
    }

    textarea {
      padding: 10px 20px;
      flex: 1;
      outline: none;
      font-size: 18px;
      width: 100%;
    }

    .errorMsg {
      color: red;
    }

    .comment-btns {
      margin: 15px 0 0;
      display: flex;
      justify-content: flex-end;

      .btn-cancel {
        padding: 15px 24px;
        margin: 0 15px 0 0;

      }

      .btn-send {
        padding: 15px 24px;
        margin: 0;
      }
    }
  }

  .list-comments {
    margin-top: 20px;

    .comment {
      margin: 40px 0;

      .info {
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        span {
          width: 50px;
          height: 50px;
          display: block;
          background-color: #000;
          border-radius: 50%;
          margin-right: 10px;
          line-height: 50px;
          text-align: center;
          color: #fff;
        }
      }

      .comment-emoij {
        display: flex;
        margin-top: 10px;

        .comment-emoij__like, .comment-emoij__dislike {
          margin-right: 20px ;
          cursor: pointer;
        }

        .interacted {
          color: #000;
        }

        span {
          margin-left: 5px;
        }
        
        .comment-reply {
          cursor: pointer;
        }
      }
    }
  }
}
</style>