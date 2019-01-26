import React from 'react';
import styled from 'styled-components';

const Loader = styled.div`
  margin-top: ${props => (props.withMargin ? '25px' : 0)};
  height: 50px;
  width: 50px;
  background-image: url("data:image/svg+xml,%3Csvg width='50px' height='50px' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid' class='lds-ripple' style='background: none;'%3E%3Ccircle cx='50' cy='50' r='22.7987' fill='none' ng-attr-stroke='%7B%7Bconfig.c1%7D%7D' ng-attr-stroke-width='%7B%7Bconfig.width%7D%7D' stroke='%2303a9f4' stroke-width='2'%3E%3Canimate attributeName='r' calcMode='spline' values='0;40' keyTimes='0;1' dur='1' keySplines='0 0.2 0.8 1' begin='-0.5s' repeatCount='indefinite'%3E%3C/animate%3E%3Canimate attributeName='opacity' calcMode='spline' values='1;0' keyTimes='0;1' dur='1' keySplines='0.2 0 0.8 1' begin='-0.5s' repeatCount='indefinite'%3E%3C/animate%3E%3C/circle%3E%3Ccircle cx='50' cy='50' r='38.9449' fill='none' ng-attr-stroke='%7B%7Bconfig.c2%7D%7D' ng-attr-stroke-width='%7B%7Bconfig.width%7D%7D' stroke='%23ffffff' stroke-width='2'%3E%3Canimate attributeName='r' calcMode='spline' values='0;40' keyTimes='0;1' dur='1' keySplines='0 0.2 0.8 1' begin='0s' repeatCount='indefinite'%3E%3C/animate%3E%3Canimate attributeName='opacity' calcMode='spline' values='1;0' keyTimes='0;1' dur='1' keySplines='0.2 0 0.8 1' begin='0s' repeatCount='indefinite'%3E%3C/animate%3E%3C/circle%3E%3C/svg%3E");
`;

export default ({ withMargin }) => <Loader withMargin={withMargin} />;
