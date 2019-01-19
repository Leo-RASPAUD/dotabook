import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import constants from '../constants/constants';
import authUtils from '../utils/auth';
import { API, graphqlOperation } from 'aws-amplify';
import mutations from '../mutations/User';
import queries from '../queries/User';

const BASE_URL_API = 'https://no00o21r69.execute-api.ap-southeast-2.amazonaws.com/PROD';

class Login extends React.PureComponent {
  state = {
    loading: true,
    redirect: false,
    redirectUrl: '',
  };

  componentWillMount = async () => {
    // TODO: simplify later by creating directly in the lamdbda
    const isAuth = authUtils.isAuthenticated();
    if (isAuth) {
      this.setState({ loading: false, redirect: true, redirectUrl: '/home' });
    } else {
      const parsed = window.location.href.split('&');
      if (parsed.length > 1 && !isAuth) {
        const profileId = parsed[3].split('%2Fid%2F')[1];
        const {
          data: { getUserProfile: user },
        } = await API.graphql(graphqlOperation(queries.getUserProfile, { profileId }));
        const { username, avatar, id } = user;
        await API.graphql(graphqlOperation(mutations.createUser, { username, avatar, note: 0, id }));
        window.localStorage.setItem(constants.LOCAL_STORAGE_KEY, JSON.stringify(user));
        this.setState({ redirect: true, redirectUrl: '/home' });
      }
      this.setState({ loading: false });
    }
  };

  login = async () => {
    const {
      data: { getOpenIdUrl: redirectUrl },
    } = await API.graphql(graphqlOperation(queries.getOpenIdUrl));
    this.setState({ redirect: true, redirectUrl });
  };

  render() {
    const { redirectUrl, redirect, loading } = this.state;
    if (loading) {
      return <div>loading</div>;
    }
    if (redirect) {
      return <Redirect to={{ pathname: '/steam-auth', state: { url: redirectUrl } }} />;
    } else {
      return (
        <div>
          <button onClick={this.login}>login</button>
        </div>
      );
    }
  }
}

export default Login;
