import gql from 'graphql-tag';

export const mutationAddEvent = gql`
mutation(
  $type: EventManageEnum!
  $newEvent: EventInput
  $eventId: Int
){
eventManage(
    type: $type
    newEvent: $newEvent
    eventId: $eventId
  ){
    message
    success
    data{
      name
    }
  }
}
`;

export const getHistory = gql`
  query (
    $page: Int
    $itemPerPage: Int
    $userId: Int
  ) {
    eventTicketOrderList(
      page: $page
      itemPerPage: $itemPerPage
      userId: $userId
    ) {
      id
      status
      orderNumber
      discount
      totalAmount
      price
      createdAt
      expiredAt
      userOrderName
      userOrderPhone
      userOrderEmail
      qty
      event{
        name
        date
        startTime
        endTime
        author
        images
        provinsi
        kota
        kecamatan
        kelurahan
      }
      items {
        title
        name
        phone
        email
        idCardNumber
      }
    }
  }
`;


export const getDetailOrderEvent = gql`
  query (
    $id: Int
  ) {
    eventTicketOrderDetail(
      id: $id
    ) {
      id
      eventId
      orderNumber
      bookingId
      status
      orderNumber
      discount
      totalAmount
      price
      createdAt
      expiredAt
      userOrderName
      userOrderPhone
      userOrderEmail
      qty
      event{
        images
        ordered
        name
        date
        startTime
        endTime
        author
        images
        provinsi
        kota
        kecamatan
        kelurahan
        tickets{
          name
          id
          eventId
          quota
          reservation
          refund
          type
          createdAt
          userId
        }
      }
      items {
        name
        title
        name
        phone
        email
        idCardNumber
        uniqueCode
      }
      ticket{
        name
        id
        eventId
        quota
        reservation
        refund
        type
        createdAt
        userId
      }
      payment{
        name
      }
    }
  }
`;

export const getOwnEvent = gql`
  query (
    $page: Int
    $itemPerPage: Int
    $isFavorite: Boolean
  ) {
    eventList(
      page: $page
      itemPerPage: $itemPerPage
      isFavorite: $isFavorite
    ) {
      id
      author
      category
      name
      description
      date
      startTime
      endTime
      location
      images
      startPrice
      discountPrice
      bookedCounts
      isFavorite
      refundPolicy
      ordered
      tickets{
        id
        name
        quota
        price
        discountValue
        discountType
        categories
        event{
          name
        }
      }
    }
  }
`;

export const getDetailEvent = gql`
  query (
    $id: Int
  ) {
    eventDetail(
      id: $id
    ) {
      id
      author
      category
      userId
      name
      description
      date
      startTime
      endTime
      images
      kota
      lat
      lng
      location
      provinsi
      kecamatan
      kelurahan
      tickets{
        name
        id
        quota
        type
        reservation
        price
        refund
        price
        event{
          name
          author
          date
        }
      }
      ordered
    }
  }
`;

export const mutationOrderEvent = gql`
  mutation eventTicketOrderManage($type: EventTicketOrderManageEnum!, $newOrder: EventTicketOrderInput) {
    eventTicketOrderManage(type: $type, newOrder: $newOrder) {
      success
      message
      data{
        id
        bookingId
        ticketId
        orderNumber
        price
        vat
        discount
        totalTicketPrice
        status
        createdAt
        paidAt
        expiredAt
        totalAmount
      }
    }
  }
`;