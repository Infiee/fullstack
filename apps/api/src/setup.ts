import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { generateOpenApi } from '@ts-rest/open-api';
import { RouterMetadata, contract } from '@repo/rest-contract';
// import { AppConfigService } from './config/app-config.service';

export async function setupApp(app: INestApplication) {
  // const config = app.get(AppConfigService)
  // config.get('SWAGGER_ENABLE')

  // 安全模块
  // app.register(helmet);
  app.enableCors({
    // TODO: 设置允许跨域存储cookie，比如服务端是localhost:3000 客户端是8000端口，就会因为跨域导致不会设置cookie到客户端（同域名下则不会）
    credentials: true,
    origin: true,
  });

  const openApiDocument = genarateDocument();

  SwaggerModule.setup('openapi', app, openApiDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  // app.setGlobalPrefix('api');
}

/** 生成api文档 */
function genarateDocument() {
  const hasCustomTags = (metadata) => {
    return (
      !!metadata && typeof metadata === 'object' && 'openApiTags' in metadata
    );
  };
  const openApiDocument = generateOpenApi(
    contract,
    {
      info: {
        title: 'NestJS API',
        version: '0.0.1',
        description: '文档描述',
      },
      components: {
        // 添加bearerAuth
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          // BasicAuth: {
          //   type: 'http',
          //   scheme: 'basic',
          // },
        },
      },
    },
    {
      operationMapper: (operation, appRoute) => {
        const metadata = appRoute.metadata as RouterMetadata;
        return {
          ...operation,
          // TODO: 参考配置：https://swagger.io/docs/specification/authentication/bearer-authentication/
          ...(hasCustomTags(metadata)
            ? {
                tags: metadata.openApiTags,
                // description: '测试描述',
                security: [
                  // 所有接口 开启bearerAuth
                  {
                    bearerAuth: [],
                  },
                ],
              }
            : {}),
        };
      },
    },
  );
  return openApiDocument;
}
