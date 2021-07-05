import { document } from '../utils/dynamodbClient';

export const handle = async (event) => {
    const { userid: user_id } = event.pathParameters;

    const userTodoList = await document.query({
        TableName: 'todos',
        KeyConditionExpression: 'user_id = :user_id',
        ExpressionAttributeValues: {
            ':user_id': user_id,
        }
    }).promise();

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userTodoList),
    }
};
