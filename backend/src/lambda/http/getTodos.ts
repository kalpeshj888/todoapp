import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId  } from '../utils'
import { getAllTodos } from '../../businessLogic/todos'
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // TODO: Get all TODO items for a current user
    const userId = getUserId(event)
    console.log('Processing Event:', event)
    const todos = await getAllTodos(userId)

    return {
        statusCode : 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body : JSON.stringify({
          items:todos
        })
      }
}

