import React from 'react';
import styled from 'styled-components';
import colors from '../constants/colors';
import units from '../constants/units';
import auth from '../utils/auth';
import SteamSvg from './SteamSvg';
import { Redirect } from 'react-router';
import constants from '../constants/constants';
import authUtils from '../utils/auth';
import { API, graphqlOperation } from 'aws-amplify';
import mutations from '../mutations/User';
import queries from '../queries/User';
import Button from './Button';

const Content = styled.div`
  padding-left: ${units.paddingSmall};
`;

export default class Login extends React.PureComponent {
  login = async () => {
    const {
      data: { getOpenIdUrl: redirectUrl },
    } = await API.graphql(graphqlOperation(queries.getOpenIdUrl));
    window.location.replace(redirectUrl);
  };

  render() {
    return (
      <Button onClick={this.login} variant="primary">
        <SteamSvg />
        <Content>Sign in</Content>
      </Button>
    );
  }
}
