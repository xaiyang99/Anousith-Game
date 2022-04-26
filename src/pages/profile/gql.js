import { gql } from "apollo-boost";

export const GET_RANK_BY_ID = gql`
  query Query($rankWhere: RankWhereInputOne!) {
    rank(where: $rankWhere) {
      id
      title
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
