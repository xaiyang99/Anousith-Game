import { gql } from "apollo-boost";

export const GET_ALL_REWARD = gql`
  query Query(
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
        th
        startDate
        endDate
        isPublic
        createdAt
        updatedAt
      }
    }
  }
`;
export const CREATE_CATALOG = gql`
  mutation Mutation($data: LuckyCatalogInput!) {
    createLuckyCatalog(data: $data) {
      id
    }
  }
`;

export const LIST_CATALOG = gql`
  query Query(
    $where: LuckyCatalogWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    luckyCatalogs(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
    ) {
      total
      data {
        id
        luckyName
        luckyNumber
        luckyAddress
        isPublic
        note
        createdAt
        updatedAt
        rewardId {
          title
          rewardCode
          image
          qty
          th
          startDate
          endDate
        }
      }
    }
  }
`;

export const LIST_ITEM = gql`
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
export const DELETE_ITEM = gql`
  mutation _idMutation($deleteItemWhere2: ItemWhereInputOne!) {
    deleteItem(where: $deleteItemWhere2) {
      _id
    }
  }
`;

export const UPDATE_ITEM = gql`
  mutation UpdateItemForRewardMutation(
    $data: ItemForRewardInput!
    $where: ItemForRewardWhereInputOne!
  ) {
    updateItemForReward(data: $data, where: $where) {
      id
    }
  }
`;
