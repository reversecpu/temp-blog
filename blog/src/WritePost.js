import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {TextField, Paper} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Hidden from '@material-ui/core/Hidden';
import {EditorState} from "draft-js";
import {Editor} from "react-draft-wysiwyg"

const useStyles = makeStyles({
    root: {
      minWidth: 600,
    },
    test: {
       
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    subject: {
      margin: '0 5px',
    },
    pos: {
      marginBottom: 12,
    },
  });
  

  export default class FeaturedPost extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        editorState: EditorState.createEmpty(),
        subject: '',
        img: '',
      };
    }
    uploadImageCallBack = (file) => {
      return new Promise(
        (resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', 'http://127.0.0.1:5000/uploadimg');
          xhr.withCredentials = true;
          const data = new FormData();
          data.append('image', file);
          xhr.send(data);
          xhr.addEventListener('load', () => {
            const response = JSON.parse(xhr.responseText);
            this.setState({img:response.data.link})
            console.log(response);
            resolve(response);
          });
          xhr.addEventListener('error', () => {
            const error = JSON.parse(xhr.responseText);
            reject(error);
          });
        }
      );
    }
    onEditorStateChange = (editorState) => {
      this.setState({
        editorState,
      });
    };
    handleChange = (e) => {
      this.setState({'subject':e.target.value})
    }
    handleClick = () => {
      const formData = new FormData();
      formData.append('authorId',sessionStorage.id);
      formData.append('menuId', sessionStorage.menuid);
      formData.append('subject',this.state.subject);
      formData.append('content',this.state.editorState.getCurrentContent().getPlainText('\u0001'));
      formData.append('img',this.state.img);
      fetch('http://127.0.0.1:5000/ajax/writePost', 
    {method:'post',body:formData,credentials:'include'}
    ).then(e => e.json()).then(e => {
        console.log(e);
      if(e.result === 'ok'){
          sessionStorage.id = this.state.id;
          sessionStorage.isLogin = 'true';
          window.location.href = 'http://127.0.0.1:3000/';
      }
      else{
          this.setState({result:'ID or password is incorrect.'})
      }

    })
    }
    render(){
      const { editorState } = this.state;
      return (
        <div>
        <h2>New Post</h2>
        <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="subject"
            name="email"
            autoComplete="email"
            value={this.state.subject}
            onChange={this.handleChange}
            autoFocus
          />
        <div className='editor'>
        <Editor
          editorState={editorState}
          onEditorStateChange={this.onEditorStateChange}    
          toolbar={{
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: true },
            image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
          }}
        />
        </div>
        <Button onClick={this.handleClick} variant="contained" color="primary">
        Submit
        </Button>
        </div>
      )
    }
  }