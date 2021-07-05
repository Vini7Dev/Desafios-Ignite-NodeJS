import { document } from '../utils/dynamodbClient';
import { uuid } from 'uuidv4';

interface IRequestBodyProps {
    title: string;
    deadline: string;
}

export const handle = async (event) => {
    const { userid: user_id } = event.pathParameters;
    const { title, deadline } = JSON.parse(event.body) as IRequestBodyProps;

    const id = uuid();

    const todoCreated = await document.put({
        TableName: 'todos',
        Item: {
            id,
            user_id,
            title,
            deadline,
            done: false,
        },
    }).promise();

    return {
        statusCode: 201,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoCreated),
    }
};