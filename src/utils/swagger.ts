import swaggerJsDoc from "swagger-jsdoc"
import {version} from "../../package.json"
import swaggerJsdoc from "swagger-jsdoc"

const options: swaggerJsDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "My brand API - Documentation",
            version,
            description: 'Description of my API here',
            contact: {
                name: 'Rene MUCYO',
                email: 'renemucyo1@gmail.com',
                url: 'https://mucyorene.github.io/my-brand/',
            },
        },
        host: "localhost:2000",
        servers: [
            {
                url: 'http://localhost:2000',
                description: 'My-brand server'
            },
        ],
        tags: [],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                }
            }
        },
    },
    apis: ['./src/routes/*.ts', "./src/controllers/*.ts", './src/models/*.ts', './dist/*.js']
};


const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec