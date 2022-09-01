import gql from 'graphql-tag';

export const queryChekMemberJoinGroup = gql`
  query($groupId:Int!){
    checkMemberJoinGroup(groupId: $groupId){
      status
      success
      message
    }
  }
`;
