import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import {Link} from '@material-ui/core'
//import {Link} from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

const styles = (theme) => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarSecondary: {
    justifyContent: 'space-between',
    overflowX: 'auto',
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
});

class Header extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      mList : [],
      mListSize : 0,
    };
  }
  routeChange = e => {
    if(sessionStorage.isLogin !== 'true')
      this.props.history.push("/signin/");
    else{
      fetch('http://127.0.0.1:5000/ajax/logout', {method:'GET',credentials:'include'}
    ).then(e => e.json()).then(e => {
      sessionStorage.clear();
      window.location.reload(true);
    })

    }
  };
  componentDidMount() {
    fetch('http://127.0.0.1:5000/ajax/menulist', {method:'GET'}
    ).then(e => e.json()).then(e => {
      this.setState({
        mList : e,
        mListSize : e.length,
      });
    })
    

  }
  handleClick = () => {

  }
  render() {

    const {title, classes } = this.props;
    return (<React.Fragment>
      <Toolbar className={classes.toolbar}>
        <Button size="small">Subscribe</Button>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          className={classes.toolbarTitle}
        >
          {title}
        </Typography>
        <IconButton>
          <SearchIcon />
        </IconButton>
        <Button onClick={this.routeChange} variant="outlined" size="small">
          {(sessionStorage.isLogin !== 'true') ? 'Sign in' : 'Logout'}
        </Button>
      </Toolbar>
      <Toolbar component="nav" variant="dense" className={classes.toolbarSecondary}>
        {this.state.mList.map((section) => (
          <Link
            color="inherit"
            noWrap
            key={section.title}
            variant="body2"
            onClick={() => {this.props.history.push(section.url);}}
            className={classes.toolbarLink}
          >
            {section.title}
          </Link>
        ))}
      </Toolbar>
    </React.Fragment>
  );
  }
}

Header.propTypes = {
  sections: PropTypes.array,
  title: PropTypes.string,
};

export default  withRouter(withStyles(styles)(Header));