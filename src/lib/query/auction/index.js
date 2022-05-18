import gql from 'graphql-tag';

export const queryGetCartAuction = gql`
query(
  $page: Int
   $limit: Int
   $cartType: AuctionCartTypeEnum
   $orderDirection: AuctionOrderDirection
   $orderBy: AuctionOrderBy
) {
   auctionProduct(
    page: $page
    limit: $limit
    cartType: $cartType
    orderDirection: $orderDirection
    orderBy: $orderBy
 ) {
  id
  userId
  items{
    auctionId
    productId
    image
    name
    total
    quantity
    checked
    status
  }
  
  
 }
}
`;

export const queryGetAuction = gql`
query(
   $page: Int
    $limit: Int
    $auctionId: Int
    $productName: String
    $type: AuctionTypeScreen!
    $status: AuctionSearchStatus
 ) {
    auctionProduct(
     page: $page
     limit: $limit
     type: $type
     auctionId: $auctionId
     productName: $productName
     status: $status
  ) {
   id
   productId
   dateStart
   dateEnd
   quantity
   description
   startPrice
   buyNowPrice
   isOpen
   status
   duration
   auctionStatus
   product {
     id
     name
     categoryId
     description
     price
     initialPrice
     imageUrl
     imageProducts
     stock
     height
     width
     length
     weight
     merchantId
     productUnit
     minimumBuy
     productMassa
     status
     rating
     sold
   }
  }
 }
`;

export const mutationCrateAuction = gql`
mutation(
   $productId: Int!
   $dateStart: String!
   $timeStart: String!
   $timeDuration: Int!
   $description: String!
   $startPrice: Float!
   $buyNowPrice: Float!
   $quantity: Int!
   $bidNominal: [Int!]!
   $status: AuctionStatus!
 ) {
   auctionCreateProduct(
   productId: $productId
   dateStart: $dateStart
   timeStart: $timeStart
   timeDuration: $timeDuration
   description: $description
   startPrice: $startPrice
   buyNowPrice: $buyNowPrice
   quantity: $quantity
   bidNominal: $bidNominal
   status: $status
  ) {
   id
   productId
   dateStart
   dateEnd
   quantity
   description
   startPrice
   buyNowPrice
   isOpen
   status
   product{
     id
     name
     categoryId
     description
     price
     initialPrice
     imageUrl
     imageProducts
     stock
     height
     width
     length
     weight
     merchantId
     productUnit
     minimumBuy
     productMassa
     status
     rating
     sold
   }
  }
 }
`;

export const queryGetDetailAuction = gql`
query(
   $auctionProductId : Int
 ) {
    auctionProductDetail(
      auctionProductId : $auctionProductId
  ) {
   id
   productId
   dateStart
   dateEnd
   quantity
   description
   startPrice
   buyNowPrice
   isOpen
   status
   duration
   auctionStatus
   product {
     id
     name
     categoryId
     description
     price
     initialPrice
     imageUrl
     imageProducts
     stock
     height
     width
     length
     weight
     merchantId
     productUnit
     minimumBuy
     productMassa
     status
     rating
     sold
   }
  }
 }
`;