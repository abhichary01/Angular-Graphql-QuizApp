import { gql } from "apollo-angular";

// Graphql Schema to fetch questions API
export const Get_Questions = gql`
query{
  questions {
    question
    options {
      answer
      correct
    }
    
  }
}
`;

// Graphql Schema to update user details API
export const Update_Score = gql`
mutation ($name: String,$email: String,$points: Int){
  createUser(userInput:{name: $name, email: $email, points: $points}){
    _id
    name
    email
    points
  }
}

`