import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId  } from '../utils'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as uuid from 'uuid'
import * as AWS  from 'aws-sdk'
const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const bucketName = process.env.TODOIMAGES_S3_BUCKET

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log('Processing event: ', event)
  const userId = getUserId(event);
  const todoId = uuid.v4()
  const createdAt =  new Date().toISOString()  
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  
  const newItem = {
    userId: userId, 
    createdAt: createdAt,
    todoId: todoId,
    name: newTodo.name,
    dueDate: newTodo.dueDate,
    done : false,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
  }

  await docClient.put({
    TableName: todosTable,
    Item: newItem
  }).promise()
  
  // TODO: Implement creating a new TODO item
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem
    })
  }
}
