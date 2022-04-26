import { gql } from "apollo-boost";

export const LOGIN_USER = gql`
  mutation StaffLogin($where: StaffLoginInput!) {
    staffLogin(where: $where) {
      accessToken
      data {
        id
        username
      }
    }
  }
`;
