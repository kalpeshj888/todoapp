import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { getUserId  } from '../utils'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const todoId = event.pathParameters.todoId
    const docClient = new  AWS.DynamoDB.DocumentClient()
    const todosTable =  process.env.TODOS_TABLE
    const userId = getUserId(event)
    
    console.log('Processing event: ', event)

    const result = await docClient.delete({
      TableName: todosTable,
      Key: {
        userId : userId,
        todoId : todoId
        },
        ReturnValues:"ALL_OLD"
    }).promise()

    const deleteInfo = result.Attributes

    if (deleteInfo!=null )
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        deleteInfo
      })
      
    } 
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: 'Bad Delete Request'
    }
  }
