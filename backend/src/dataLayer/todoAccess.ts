import * as AWS  from 'aws-sdk'
import { TodoItem } from '../models/TodoItem'   

export class TodoAccess {

    constructor(
        private readonly docClient =  new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE){
        }

    async getAllTodos(userID: string): Promise<TodoItem[]> {

    const result = await this.docClient.query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userID
        }
      }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

}