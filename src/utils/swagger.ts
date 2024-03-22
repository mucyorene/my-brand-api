import express, {Express,} from "express";
import swaggerUI from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"
import {version} from "../../package.json"
import * as http from "http";

const options: swaggerJsDoc.Options = {
    definition: {
        openApi: "1.0.0",
        info: {
            title: "My brand API - Documentation",
            version,
            description: 'Description of my API here',
            termsOfService: 'https://mysite.com/terms',
            contact: {
                name: 'Rene MUCYO',
                email: 'renemucyo1@gmail.com',
                url: 'https://mucyorene.github.io/my-brand/',
            },
            license: {
                name: 'Apache 2.0',
                url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
            },
        },
        components: {
            securitySchemas: {
                bearerAuth: {
                    type: http,
                    scheme: "bearer",
                    bearerFormat: "JWT"
                },
            },
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/routers.ts', './src/models/*.ts', './dist/*.js']
};
const swaggerSpec = swaggerJsDoc(options)

function swaggerDoc(app: Express, port: number) {
    //Swagger page
    app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))
    //Docs in JSON Format
    app.get('docs.json', (req: express.Request, res: express.Response) => {
        res.setHeader('content-Type', 'application/json')
        res.send(swaggerSpec)
    });
}

export default swaggerDoc