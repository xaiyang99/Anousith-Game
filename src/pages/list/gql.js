import { gql } from "apollo-boost";

export const REWARD_LIST = gql`
  query Rewards(
    $where: RewardWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    rewards(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
      total
      data {
        id
        title
        rewardCode
        detail
        image
        qty
        isPublic
        createdAt
        updatedAt
        startDate
        endDate
      }
    }
  }
`;

export const PRE_SIGNED_URL = gql`
  query Query($name: String!) {
    preSignedUrl(name: $name) {
      url
    }
  }
`;

export const ADD_REWARD = gql`
  mutation Mutation($data: RewardInput!) {
    createReward(data: $data) {
      id
    }
  }
`;

export const UPDATE_REWARD = gql`
  mutation Mutation($data: RewardInput!, $where: RewardWhereInputOne!) {
    updateReward(data: $data, where: $where) {
      id
    }
  }
`;

export const GET_REWARD_BY_ID = gql`
  query Reward($rewardWhere: RewardWhereInputOne!) {
    reward(where: $rewardWhere) {
      id
      title
      rewardCode
      detail
      image
      qty
      th
      startDate
      endDate
      isPublic
      createdAt
      updatedAt
    }
  }
`;

export const LIST_ITEMS = gql`
  query Query(
    $where: ItemForRewardWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    itemForRewards(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
    ) {
      total
      data {
        id
        trackingId
        customerId
        isPublic
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_REWARD = gql`
  mutation DeleteRewardMutation($where: RewardWhereInputOne!) {
    deleteReward(where: $where) {
      id
    }
  }
`;
