import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import MainFeaturedPost from './MainFeaturedPost';
import FeaturedPost from './FeaturedPost';
import Main from './Main';
import Sidebar from './Sidebar';
import Footer from './Footer';

import WritePost from './WritePost'

const styles = (theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
});


class Blog extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      curMenuIdx : -1,
      curPage : 0,
      featuredPosts : [],
      mainFeaturedPost : {},
      numPosts : 0,
      mList:[],
      mListSize:0,
      load:false,
    }
  }
  is_number(x)
  {
    const reg = /^\d+$/;
    return reg.test(x);
  }
  ajax_update(){
    fetch('http://127.0.0.1:5000/ajax/menulist', {method:'GET'}
    ).then(e => e.json()).then(e => {
      const mlist = e;
      const mid = this.props.match.params.id;
      if(this.is_number(mid)){
        if(0 <= Number(mid) <= e.length - 1)
        {
          fetch('http://127.0.0.1:5000/ajax/getPosts/' + mid).then(e => e.json()).then(e => {
            this.setState({
                        mList : mlist,
                        mListSize : mlist.length,
                        curMenuIdx : mid,
                        curPage : 0,
                        numPosts : e.length,
                        featuredPosts :e,
                        mainFeaturedPost : mlist[mid],
                      });
          });
          
        }
      }else{
        window.location.href = 'http://127.0.0.1:3000/menu/0'
      }

    })
  }
  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.ajax_update();
    }
  }
  componentDidMount() {
    
    this.ajax_update();
  }
  routeChange = e => {
    sessionStorage.menuid = this.props.match.params.id;
    this.props.history.push("/writePost/");
  };
  render(){
    const {classes} = this.props;
    console.log(this.props);
    return (

      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="lg">
          
          <main>
            <MainFeaturedPost post={this.state.mainFeaturedPost} />
            <Grid container spacing={4}>
              {(this.state.numPosts > 0) && this.state.featuredPosts.map((post) => (
                <FeaturedPost key={post.title} post={post} />
              ))}
              
            </Grid>
            <br></br>
            {(sessionStorage.isLogin === 'true') && <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={this.routeChange}
          >Add Post</Button>}
          </main>
        </Container>
        <Footer title="Footer" description="Something here to give the footer a purpose!" />
      </React.Fragment>
    );
  }
}
Blog.defaultProps = {id:-1};

export default  withStyles(styles)(Blog);