import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import * as AWS from 'aws-sdk'
import { getUserId  } from '../utils'
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log('Processing event: ', event)
  const docClient = new  AWS.DynamoDB.DocumentClient()
  const todosTable =  process.env.TODOS_TABLE
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
 

  const done =   updatedTodo.done
 // const dueDate =  updatedTodo.dueDate
 //const name =   updatedTodo.name

  //Check if TodoId exists

  if (!todoId) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'todoId is not provided'
      })
    }
  }
  
  const result = await docClient.update({
    TableName: todosTable,
    Key: {
      userId : userId,
      todoId : todoId
      },
      //UpdateExpression: 'set done= :done , name= :name ,  dueDate= :dueDate  ',
      UpdateExpression: 'set done= :done',
      ConditionExpression : 'todoId = :todoId',
      ExpressionAttributeValues:{
        
        ':done' :done,
        ':todoId':todoId
    },
    ReturnValues:"UPDATED_NEW"
  }).promise()

const items = result.Attributes
  
if (items!=null) {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(items)
    
  }
}
return {
  statusCode: 404,
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  body: 'Bad update request'
}
  
}
