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
        host: "localhost:8080",
        servers: [
            {
                url: 'http://localhost:8080',
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
            },
            schemas: {
                UpdateEmployeeRequest: {
                    type: 'object',
                    properties: {
                        id: 0,
                        name: 'string'
                    }
                }
            }
        },
    },
    apis: ['./src/routes/*.ts', "./src/controllers/*.ts", './src/models/*.ts', './dist/*.js']
};


const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec

//
// const outputFile = './swagger_output.json';
// const endpointsFiles = ['./src/routes/routers.ts'];
//
// swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, options);


// function swaggerDoc(app: express.Application, port: number) {
//     //Swagger page
//     app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))
//     //Docs in JSON Format
//     app.get('docs.json', (req: express.Request, res: express.Response) => {
//         res.setHeader('content-Type', 'application/json')
//         res.send(swaggerSpec)
//     });
// }
//
// export default swaggerDoc