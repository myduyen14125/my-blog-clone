<template>
  <div class="create-post">
    <BlogCoverPreview v-show="this.$store.state.blogPhotoPreview" />
    <Loading v-show="loading" />
    <div class="container">
      <div :class="{invisible : !error}" class="err-message">
        <p><span>Error:</span>{{this.errorMsg}}</p>
      </div>
      <div class="blog-info">
        <input type="text" placeholder="Enter Blog title" v-model="blogTitle">
        <div class="upload-file">
          <label for="blog-photo">Upload Cover Photo</label>
           <input type="file" ref="blogPhoto" @change="fileChange" id="blog-photo" accept=".png, .jpg, ,jpeg" />
          <button @click="openPreview" class="preview" :class="{'button-inactive' : !this.$store.state.blogPhotoFileURL}">Preview Photo</button>
          <span>File chosen: {{this.$store.state.blogPhotoName}}</span>
        </div>
      </div>
      <div class="editor">
        <vue-editor :editorOptions="editorSettings" v-model="blogHTML" useCustomImageHandler @image-added="imageHandler" />
      </div>
      <div class="blog-actions">
        <button @click="uploadBlog">Publish Blog</button>
        <router-link class="router-button" :to="{name:'BlogPreview'}">Post Preview</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/storage";
import db from "../firebase/firebaseInit";
import Loading from "../components/Loading";
import BlogCoverPreview from "../components/BlogCoverPreview";
import Quill from "quill"
window.Quill = Quill;
const ImageResize = require("quill-image-resize-module").default;
Quill.register("modules/imageResize",ImageResize);
export default {
  name: 'createPost',
  data() {
    return {
      // file: null,
      error: null,
      errorMsg: null,
      loading: null,
      editorSettings: {
        modules: {
          imageResize: {},
        },
      },
    }
  },
  components: {
    BlogCoverPreview,Loading
  },
  methods: {
    fileChange() {
      this.file = this.$refs.blogPhoto.files[0];
      const fileName = this.file.name;
      this.$store.commit("fileNameChange", fileName);
      this.$store.commit("createFileURL", URL.createObjectURL(this.file));
    },

    openPreview() {
      this.$store.commit("openPhotoPreview");
    },

    imageHandler(file, Editor, cursorLocation, resetUploader) {
      const storageRef = firebase.storage().ref();
      const docRef = storageRef.child(`documents/blogPostPhotos/${file.name}`);
      docRef.put(file).on(
        "state_changed",
        (snapshot) => {
          console.log(snapshot);
        },
        (err) => {
          console.log(err);
        },
        async () => {
          const downloadURL = await docRef.getDownloadURL();
          Editor.insertEmbed(cursorLocation, "image", downloadURL);
          resetUploader();
        }
      );
    },
     uploadBlog() {
      if (this.blogTitle.length !== 0 && this.blogHTML.length !== 0) {
        if (this.file) {
          this.loading = true;
          const storageRef = firebase.storage().ref();
          const docRef = storageRef.child(`documents/BlogCoverPhotos/${this.$store.state.blogPhotoName}`);
          docRef.put(this.file).on(
            "state_changed",
            (snapshot) => {
              console.log(snapshot);
            },
            (err) => {
              console.log(err);
              this.loading = false;
            },
            async () => {
              const downloadURL = await docRef.getDownloadURL();
              const timestamp = await Date.now();
              const dataBase = await db.collection("blogPosts").doc();
              await dataBase.set({
                blogID: dataBase.id,
                blogHTML: this.blogHTML,
                blogCoverPhoto: downloadURL,
                blogCoverPhotoName: this.blogCoverPhotoName,
                blogTitle: this.blogTitle,
                profileId: this.profileId,
                date: timestamp,
              });
              await this.$store.dispatch("getPost");
              this.loading = false;
              this.$store.commit("setDefaultBlogPost");
              this.$router.push({ name: "ViewBlog", params: { blogID: dataBase.id } });
            }
          );
          return;
        }
        this.error = true;
        this.errorMsg = "Please ensure you uploaded a cover photo!";
        setTimeout(() => {
          this.error = false;
        }, 5000);
        return;
      }
      this.error = true;
      this.errorMsg = "Please ensure Blog Title & Blog Post has been filled!";
      setTimeout(() => {
        this.error = false;
      }, 5000);
      return;
    },
  },
  computed: {
    profileId() {
      return this.$store.state.profileId;
    },
    blogCoverPhotoName() {
      return this.$store.state.blogPhotoName;
    },
    blogTitle: {
      get() {
        return this.$store.state.blogTitle;
      },
      set(payload) {
        this.$store.commit("updateBlogTitle", payload);
      },
    },
    file: {
      get() {
        return this.$store.state.file;
      },
      set(payload) {
        this.$store.commit("updateFile", payload);
      },
    },
    blogHTML: {
      get() {
        return this.$store.state.blogHTML;
      },
      set(payload) {
        this.$store.commit("newBlogPost", payload);
      },
    },
  },
}
</script>

<style lang="scss">
.create-post {
  position: relative;
  height: 100%;
  button {
    margin-top: 0;
  }
  .router-button {
    text-decoration: none;
    color: #fff;
  }
  label,
  button,
  .router-button {
    transition: 0.5s ease-in-out all;
    align-self: center;
    font-size: 14px;
    cursor: pointer;
    border-radius: 20px;
    padding: 12px 24px;
    color: #fff;
    background-color: #303030;
    text-decoration: none;
    &:hover {
      background-color: rgba(48, 48, 48, 0.7);
    }
  }
  .container {
    position: relative;
    height: 100%;
    max-width: 1078px;
    padding: 10px 25px 60px;
  }
  // error styling
  .invisible {
    opacity: 0 !important;
  }
  .err-message {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    color: #fff;
    margin-bottom: 10px;
    background-color: #303030;
    opacity: 1;
    transition: 0.5s ease all;
    p {
      font-size: 14px;
    }
    span {
      font-weight: 600;
    }
  }
  .blog-info {
    display: flex;
    margin-bottom: 32px;

    @media(max-width: 750px) {
      flex-direction: column;
    }

    input:nth-child(1) {
      min-width: 300px;
      height: 55px !important;
      font-size: 16px;
    }
    input {
      transition: 0.5s ease-in-out all;
      padding: 10px 4px;
      border: none;
      border-bottom: 1px solid #303030;

      &:focus {
        outline: none;
        // box-shadow: 0 1px 0 0 #303030;
      }
    }

    .upload-file {
      flex: 1;
      position: relative;
      display: flex;
      flex-wrap: wrap;

      label {
        margin: 15px 0 0 16px;
      }

      input {
        display: none;
      }
      .preview {
        margin: 15px 0 0 16px;
        text-transform: initial;

      }
      span {
        font-size: 12px;
        margin: 15px 0 0 16px;
        align-self: center;
        display: block;
        overflow: hidden;
      }
    }
  }
  .editor {
    height: 60vh;
    width: 100%;
    max-width: 950px;
    display: flex;
    flex-direction: column;

    .quillWrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .ql-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: scroll;
    }

    .ql-editor {
      padding: 20px 16px 30px;
      overflow: hidden;
    }
  }
  
  .blog-actions {
    margin-top: 32px;
    button {
      margin-right: 16px;
    }
  }
}
</style>