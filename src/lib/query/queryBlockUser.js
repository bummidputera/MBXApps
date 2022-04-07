import gql from 'graphql-tag';

export const queryGetUserBlock = gql`
    query(
        $userId: Int
    ) {
        userBlockList (
            userId: $userId
        ) {
            userId
            userName
            firstName
            lastName
            email
            photoProfile
            image
        }
    }
`;

export const queryUnblockUser = gql`
    mutation(
        $unblockUserId: Int
    ) {
        userUnblock (
            unblockUserId: $unblockUserId
        ) {
            success
            message
        }
    }
`;

export const queryBlockUser = gql`
    mutation(
        $blockUserId: Int
    ) {
        userBlock (
            blockUserId: $blockUserId
        ) {
            success
            message
        }
    }
`;