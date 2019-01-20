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
          <div>
            <svg viewBox="0 0 110 110">
              <path d="M55,0C25.881,0,2.062,22.634,0.14,51.267l28.525,11.507C31.172,61.029,34.214,60,37.5,60 c0.706,0,1.396,0.063,2.076,0.155l13.426-19.691C53.021,29.159,62.19,20,73.5,20C84.822,20,94,29.178,94,40.5S84.822,61,73.5,61 c-0.01,0-0.021-0.001-0.031-0.001L52.944,74.385C52.97,74.754,53,75.124,53,75.5C53,84.061,46.061,91,37.5,91 c-7.565,0-13.855-5.422-15.218-12.591L2.118,70.107C8.685,93.134,29.866,110,55,110c30.376,0,55-24.624,55-55 C110,24.625,85.376,0,55,0z M37.5,84c-0.915,0-1.795-0.148-2.621-0.416l-0.004,0.01l-0.252-0.104 c-0.243-0.087-0.48-0.185-0.712-0.293l-6.805-2.801C28.945,84.295,32.902,87,37.5,87C43.851,87,49,81.852,49,75.5 S43.851,64,37.5,64c-1.406,0-2.747,0.265-3.993,0.727l7.2,2.904c0.05,0.021,0.1,0.039,0.149,0.061l0.56,0.226l-0.015,0.037 C44.131,69.368,46,72.213,46,75.5C46,80.194,42.194,84,37.5,84z M88,40.5C88,32.492,81.508,26,73.5,26S59,32.492,59,40.5 S65.492,55,73.5,55S88,48.508,88,40.5z M63,40.5C63,34.701,67.701,30,73.5,30S84,34.701,84,40.5S79.299,51,73.5,51 S63,46.299,63,40.5z" />
            </svg>
          </div>
          <button onClick={this.login}>login</button>
        </div>
      );
    }
  }
}

export default Login;
