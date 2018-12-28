import { gql } from 'apollo-boost'

const getUserQuery = gql`
    query($id:String!){
        userById(id:$id){
            name
            email
            permission
            accountsByUserid{
                nodes{
                    id
                    number
                    balance
                }
            }
            transactionsBySenderid{
                nodes{
                    id
                    recnumber
                    sendernumber
                    amount
                    date
                    note
                    userByRecid{
                        name
                    }
                }
            }
            transactionsByRecid{
                nodes{
                    id
                    recnumber
                    sendernumber
                    amount
                    date
                    note
                }
            }
        }
    }
`

const getAccountsQuery = gql`
    {
        allAccounts{
            nodes{
                balance
                number
                bank
                id
                userid
                userByUserid{
                    email
                }
            }
        }
    }
`

const addTransactionMutation = gql`
    mutation($senderid:String!, $senderaccid:UUID!, $recid:String!, $recaccid:UUID!, $amount:Float!, $note:String, $sendernumber: String!, $recnumber: String!, $date: String!){
    createTransaction(
        input:{
            transaction:{
                senderid: $senderid
                senderaccid: $senderaccid
                recid: $recid
                recaccid: $recaccid
                amount: $amount
                note: $note
                sendernumber :$sendernumber
                recnumber: $recnumber
                date: $date
            }
        }
    ){
        transaction{
            senderid
            recid
            amount
            note
        }
    }
}
`

const updateAccountMutation = gql`
    mutation($balance:Float!, $id:UUID!){
        updateAccountById(
            input:{
                id:$id
                accountPatch:{
                    balance: $balance
                }
            }
        ){
            account{
                id
                userid
                balance
            }
        }
    }
`

const getAccountByIDQuery = gql`
    query($id:UUID!){
        accountById(id:$id){
            id
            number
            balance
        }
}
`

const deleteAccountMutation = gql`
    mutation($id:UUID!){
        deleteAccountById(
            input:{
                id:$id
            }
    ){
        deletedAccountId
    }
}
`
const addUserMutation = gql`
    mutation($id:String!, $name:String!, $email:String!, $phone:String!){
    createUser(
        input:{
            user:{
                id:$id
                name:$name
                email:$email
                phone:$phone
                permission:1
            }
        }
    ){
        user{
            id
            email
            name
            phone
            permission
        }
    }
}
`

const getUserListQuery=gql`
    {
    allUsers{
        nodes{
            id
            email
            name
            accountsByUserid{
                nodes{
                    number
                    id
                }
            }
        }
    }
}
`

const addAccountMutation=gql`
mutation($userId:String!,$bank:String!,$number:String!){
    createAccount(
        input:{
            account:{
                userid:$userId
                bank:$bank
                balance:0
                number:$number
            }
        }
    ){
        account{
            number
            userid
            bank
            balance
        }
    }
}
`

export {
    getUserQuery,
    getAccountsQuery,
    addTransactionMutation,
    updateAccountMutation,
    getAccountByIDQuery,
    deleteAccountMutation,
    addUserMutation,
    getUserListQuery,
    addAccountMutation
}