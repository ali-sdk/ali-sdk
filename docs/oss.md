# OSS Usage

OSS, Open Storage Service. Equal to well know Amazon [S3](http://aws.amazon.com/s3/).

## Create account

Go to [OSS website](http://www.aliyun.com/product/oss), create a new account for new user.
Only Chinese page available right now. If you need translation, contact us.

After account created, you can create the OSS instance and get the `accessKeyId` and `accessKeySecret`.

## Create A Bucket Instance

Each OSS instance required `accessKeyId`, `accessKeySecret` and `bucket`.

### #oss(options)

Create a Bucket store instance.

options:

- accessKeyId {String} access key you create on aliyun console website
- accessKeySecret {String} access secret you create
- bucket {String} the bucket you want to access
- [host] {String} optional, OSS server host, default is `oss.aliyuncs.com`
- [timeout] {String|Number} instance level timeout for all operations, default is `60s`

example:

```js
var oss = require('ali-sdk/lib/oss');

var store = oss({
  accessKeyId: 'your access key',
  accessKeySecret: 'your access secret',
  bucket: 'your bucket name'
});
```

## Bucket Operations

TBD

## Object Operations

All operations function is [generator], except `signatureUrl`.

generator function format: `functionName*(...)`.

### .put*(name, file[, options])

Add an object to the bucket.

parameters:

- name {String} object name store on OSS
- file {String|Buffer|ReadStream} object local path, content buffer or ReadStream content instance
- [options] {Object} optional parameters
  - [timeout] {Number} the operation timeout
  - [mime] {String} custom mime
  - [meta] {Object} user meta, will send with `x-oss-meta-` prefix string
    e.g.: `{ uid: 123, pid: 110 }`
  - [headers] {Object} extra headers, detail see [RFC 2616](http://www.w3.org/Protocols/rfc2616/rfc2616.html)
    - 'Cache-Control' cache control for download
    - 'Content-Disposition' object name for download
    - 'Content-Encoding' object content encoding for download
    - 'Expires' expires time (milliseconds) for download

Success will return the object information.

object:

- name {String} object name
- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

example:

- Add an object through local file path

```js
var filepath = '/home/ossdemo/demo.txt';
var object = yield store.put('ossdemo/demo.txt', filepath);
console.log(object);

{
  name: 'ossdemo/demo.txt',
  res: {
    status: 200,
    headers: {
      date: 'Tue, 17 Feb 2015 13:28:17 GMT',
      'content-length': '0',
      connection: 'close',
      etag: '"BF7A03DA01440845BC5D487B369BC168"',
      server: 'AliyunOSS',
      'x-oss-request-id': '54E341F1707AA0275E829244'
    },
    size: 0,
    rt: 92
  }
}
```

- Add an object through content buffer

```js
var object = yield store.put('ossdemo/buffer', new Buffer('foo content'));
console.log(object);

{
  name: 'ossdemo/buffer',
  res: {
    status: 200,
    headers: {
      date: 'Tue, 17 Feb 2015 13:28:17 GMT',
      'content-length': '0',
      connection: 'close',
      etag: '"xxx"',
      server: 'AliyunOSS',
      'x-oss-request-id': '54E341F1707AA0275E829243'
    },
    size: 0,
    rt: 92
  }
}
```

- Add an object through readstream

```js
var filepath = '/home/ossdemo/demo.txt';
var object = yield store.put('ossdemo/readstream.txt', fs.createReadStream(filepath));
console.log(object);

{
  name: 'ossdemo/readstream.txt',
  res: {
    status: 200,
    headers: {
      date: 'Tue, 17 Feb 2015 13:28:17 GMT',
      'content-length': '0',
      connection: 'close',
      etag: '"BF7A03DA01440845BC5D487B369BC168"',
      server: 'AliyunOSS',
      'x-oss-request-id': '54E341F1707AA0275E829242'
    },
    size: 0,
    rt: 92
  }
}
```

### .head*(name[, options])

Head an object and get the meta info.

parameters:

- name {String} object name store on OSS
- [options] {Object} optional parameters
  - [timeout] {Number} the operation timeout
  - [headers] {Object} extra headers, detail see [RFC 2616](http://www.w3.org/Protocols/rfc2616/rfc2616.html)
    - 'If-Modified-Since' object modified after this time will return 200 and object meta,
        otherwise return 304 not modified
    - 'If-Unmodified-Since' object modified before this time will return 200 and object meta,
        otherwise throw PreconditionFailedError
    - 'If-Match' object etag equal this will return 200 and object meta,
        otherwise throw PreconditionFailedError
    - 'If-None-Match' object etag not equal this will return 200 and object meta,
        otherwise return 304 not modified

Success will return the object's meta information.

object:

- status {Number} response status, maybe 200 or 304
- meta {Object} object user meta, if not set on `put()`, will return null.
    If return status 304, meta will be null too
- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

example:

- Head an exists object and get user meta

```js
yield this.store.put('ossdemo/head-meta', new Buffer('foo'), {
  meta: {
    uid: 1,
    path: 'foo/demo.txt'
  }
});
var object = this.store.head('ossdemo/head-meta');
console.log(object);

{
  status: 200,
  meta: {
    uid: '1',
    path: 'foo/demo.txt'
  },
  res: { ... }
}
```

- Head a not exists object

```js
var object = this.store.head('ossdemo/head-meta');
// will throw NoSuchKeyError
```

### .get*(name, file[, options])

### .delete*(name[, options])

### .signatureUrl(name)

## Known Errors

Each error return by OSS server will contains these properties:

- name {String} error name
- message {String} error message
- requestId {String} uuid for this request, if you meet some unhandled problem,
    you can send this request id to OSS engineer to find out what's happend.
- hostId {String} OSS cluster name for this request

name | status | message | message in Chinese
---  | ---    | ---     | ---
AccessDeniedError | 403 | Access Denied | 拒绝访问
BucketAlreadyExistsError | 409 | Bucket already exists | Bucket 已经存在
BucketNotEmptyError | 409 | Bucket is not empty | Bucket 不为空
EntityTooLargeError | 400 | Entity too large | 实体过大
EntityTooSmallError | 400 | Entity too small | 实体过小
FileGroupTooLargeError | 400 | File group too large | 文件组过大
InvalidLinkNameError | 400 | Link name can't be the same as the object name | Object Link 与指向的 Object 同名
LinkPartNotExistError | 400 | Can't link to not exists object | Object Link 中指向的 Object 不存在
ObjectLinkTooLargeError | 400 | Too many links to this object | Object Link 中 Object 个数过多
FieldItemTooLongError | 400 | Post form fields items too large | Post 请求中表单域过大
FilePartInterityError | 400 | File part has changed | 文件 Part 已改变
FilePartNotExistError | 400 | File part not exists | 文件 Part 不存在
FilePartStaleError | 400 | File part stale | 文件 Part 过时
IncorrectNumberOfFilesInPOSTRequestError | 400 | Post request contains invalid number of files | Post 请求中文件个数非法
InvalidArgumentError | 400 | Invalid format argument | 参数格式错误
InvalidAccessKeyIdError | 400 | Access key id not exists | Access Key ID 不存在
InvalidBucketNameError | 400 | Invalid bucket name | 无效的 Bucket 名字
InvalidDigestError | 400 | Invalid digest | 无效的摘要
InvalidEncryptionAlgorithmError | 400 | Invalid encryption algorithm | 指定的熵编码加密算法错误
InvalidObjectNameError | 400 | Invalid object name | 无效的 Object 名字
InvalidPartError | 400 | Invalid part | 无效的 Part
InvalidPartOrderError | 400 | Invalid part order | 无效的 part 顺序
InvalidPolicyDocumentError | 400 | Invalid policy document | 无效的 Policy 文档
InvalidTargetBucketForLoggingError | 400 | Invalid bucket on logging operation | Logging 操作中有无效的目标 bucket
InternalError | 500 | OSS server internal error | OSS 内部发生错误
MalformedXMLError | 400 | Malformed XML format | XML 格式非法
MalformedPOSTRequestError | 400 | Invalid post body format | Post 请求的 body 格式非法
MaxPOSTPreDataLengthExceededError | 400 | Post extra data too large | Post 请求上传文件内容之外的 body 过大
MethodNotAllowedError | 405 | Not allowed method | 不支持的方法
MissingArgumentError | 411 | Missing argument | 缺少参数
MissingContentLengthError | 411 | Missing `Content-Length` header | 缺少内容长度
NoSuchBucketError | 404 | Bucket not exists | Bucket 不存在
NoSuchKeyError | 404 | Object not exists | 文件不存在
NoSuchUploadError | 404 | Multipart upload id not exists | Multipart Upload ID 不存在
NotImplementedError | 501 | Not implemented | 无法处理的方法
PreconditionFailedError | 412 | Pre condition failed | 预处理错误
RequestTimeTooSkewedError | 403 | Request time exceeds 15 minutes to server time | 发起请求的时间和服务器时间超出 15 分钟
RequestTimeoutError | 400 | Request timeout | 请求超时
RequestIsNotMultiPartContentError | 400 | Invalid post content-type | Post 请求 content-type 非法
SignatureDoesNotMatchError | 403 | Invalid signature | 签名错误
TooManyBucketsError | 400 | Too many buckets on this user | 用户的 Bucket 数目超过限制


[generator]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
