ali-sdk
=======

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Gittip][gittip-image]][gittip-url]
[![David deps][david-image]][david-url]
[![iojs version][iojs-image]][iojs-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/ali-sdk.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ali-sdk
[travis-image]: https://img.shields.io/travis/ali-sdk/ali-sdk.svg?style=flat-square
[travis-url]: https://travis-ci.org/ali-sdk/ali-sdk
[coveralls-image]: https://img.shields.io/coveralls/ali-sdk/ali-sdk.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/ali-sdk/ali-sdk?branch=master
[gittip-image]: https://img.shields.io/gittip/fengmk2.svg?style=flat-square
[gittip-url]: https://www.gittip.com/fengmk2/
[david-image]: https://img.shields.io/david/ali-sdk/ali-sdk.svg?style=flat-square
[david-url]: https://david-dm.org/ali-sdk/ali-sdk
[iojs-image]: https://img.shields.io/badge/io.js-%3E=_1.0-green.svg?style=flat-square
[iojs-url]: http://iojs.org/
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.11.14-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/ali-sdk.svg?style=flat-square
[download-url]: https://npmjs.org/package/ali-sdk

SDK include all aliyun, taobao, tmall, alibaba open serivces.

## Goal of this module

Let global users can all use ali's services more easily.

## Support Services

### aliyun

name | status     | description | version | usage          | origin api
---  | ---        | ---         | ---     | ---            | ---
OSS  | DONE       | Simple Store like S3 | -       | [OSS Usage]    | [OSS API](http://docs.aliyun.com/#/oss/api-reference/abstract)
OTS  | TODO       | Table Store like HBase | -       | [OTS Usage]    | [OTS API](http://docs.aliyun.com/#/ots/API-Reference/actions&ActionsSummary)
OCS  | ING        | Cache Service like Memcached | -       | [OCS Usage]    | [OCS protocol](http://docs.aliyun.com/#/ocs/Getting-Started/ocs-supported-protocol)
ECS  | TODO       | Elastic Compute like EC2 | -       | [ECS Usage]    | -
RDS  | ING        | Relational Database like MySQL | -       | [RDS Usage]    | -
DRDS | TODO       | Distribute Relational Database | -       | [DRDS Usage]   | [DRDS API](http://help.aliyun.com/knowledge_detail.htm?knowledgeId=5974369)
SLB  | TODO       | Server Load Balancer | -       | [SLB Usage]    | -
CDN  | TODO       | Content Delivery Network | -       | [CDN Usage]    | -
SLS  | TODO       | Simple Log Service | -       | [SLS Usage]    | [SLS API](http://docs.aliyun.com/#/sls/api/overview)
MQS  | TODO       | Message Queue | 2014-07-08 | [MQS Usage] | [MQS-API](http://imgs-storage.cdn.aliyuncs.com/help/mqs/MQS-API-Reference_2014-07-08.pdf)
OpenSearch | TODO | Search Engine | - | [OpenSearch Usage] | [OpenSearch API](http://help.opensearch.aliyun.com/index.php?title=API%E6%96%87%E6%A1%A3)
MTS | TODO       | Multimedia Transcoding Service | v1501 | [MTS Usage] | [MTS API](http://imgs-storage.cdn.aliyuncs.com/help/mts/%E9%98%BF%E9%87%8C%E4%BA%91%E5%A4%9A%E5%AA%92%E4%BD%93%E8%BD%AC%E7%A0%81%E6%9C%8D%E5%8A%A1API%E5%8F%82%E8%80%83%E6%89%8B%E5%86%8Cv1501.pdf)
ACE | TODO       | Aliyun Cloud Engine | - | [ACE Usage] | [ACE API]
ESS | TODO       | Elastic Scaling | - | [ESS Usage] | [ESS API](http://imgs-storage.cdn.aliyuncs.com/help/ess/%E5%BC%B9%E6%80%A7%E4%BC%B8%E7%BC%A9%E6%9C%8D%E5%8A%A1API%E6%89%8B%E5%86%8C.pdf)
OAS | TODO       | Archive Service | - | [OAS Usage] | [OAS API](http://help.aliyun.com/knowledge_detail.htm?knowledgeId=5974642)
KVStore | ING    | Key-Value Store like Redis | - | [KVStore Usage] | [KVStore API](http://docs.aliyun.com/#/kvstore/quick-start/kvstore-redis-command)
ODPS | TODO      | Data Processing like Hadoop | - | [ODPS Usage] | [ODPS API](http://docs.aliyun.com/#/odps)
ADS | TODO       | Analytic Database, Realtime OLAP | - | [ADS Usage] | [ADS API]

### taobao

TBD

### tmall

TBD

### alibaba

TBD

## License

[MIT](LICENSE)


[OSS Usage]: docs/oss.md
[OTS Usage]: docs/ots.md
[OCS Usage]: docs/ocs.md
[ECS Usage]: docs/ecs.md
[RDS Usage]: docs/rds.md
[SLB Usage]: docs/slb.md
[CDN Usage]: docs/cdn.md
[SLS Usage]: docs/sls.md
[MQS Usage]: docs/mqs.md
[OpenSearch Usage]: docs/openserach.md
[MTS Usage]: docs/mts.md
[ACE Usage]: docs/ace.md
[ESS Usage]: docs/ess.md
[DRDS Usage]: docs/drds.md
[OAS Usage]: docs/oas.md
[KVStore Usage]: docs/kvstore.md
[ODPS Usage]: docs/odps.md
[ADS Usage]: docs/ads.md
