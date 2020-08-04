import React from 'react';
import Blog from './Blog'
import WritePost from './WritePost'
import { Route, Switch } from 'react-router-dom';
import Header from './Header'
import SignIn from './SignIn';
class App extends React.Component {
  render(){
  return (
    <div>
      <Header title="Blog" />
      <Switch>
      <Route path="/menu/:id"
      component={Blog}/>
      <Route path="/writePost/"
      component={WritePost}/>
      <Route path="/signin/"
      component={SignIn}/>
      <Route component={Blog}/>
      </Switch>
    </div>
  );
  }
}

export default App;
