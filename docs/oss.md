# OSS Usage

OSS, Open Storage Service. Equal to well know Amazon [S3](http://aws.amazon.com/s3/).

## Summary

- [Data Regions](#data-regions)
- [Create Account](#create-acount)
- [Create A Bucket Instance](#create-a-bucket-instance)
  - [#oss(options)](#ossoptions)
- [Bucket Operations](#bucket-operations)
  - Base
    - [.listBuckets*(query[, options])](#listbucketsquery-options)
    - [.putBucket*(name, region[, options])](#putbucketname-region-options)
    - [.useBucket(name, region)](#usebucketname-region)
    - [.deleteBucket*(name, region[, options])](#deletebucketname-region-options)
  - ACL
    - [.putBucketACL*(name, region, acl[, options])](#putbucketaclname-region-acl-options)
    - [.getBucketACL*(name, region[, options])](#getbucketaclname-region-options)
  - Logging
    - [.putBucketLogging*(name, region, prefix[, options])](#putbucketloggingname-region-prefix-options)
    - [.getBucketLogging*(name, region[, options])](#getbucketloggingname-region-options)
    - [.deleteBucketLogging*(name, region[, options])](#deletebucketloggingname-region-options)
  - Website
    - [.putBucketWebsite*(name, region, config[, options])](#putbucketwebsitename-region-config-options)
    - [.getBucketWebsite*(name, region[, options])](#getbucketwebsitename-region-options)
    - [.deleteBucketWebsite*(name, region[, options])](#deletebucketwebsitename-region-options)
  - Referer
    - [.putBucketReferer*(name, region, allowEmpty, referers[, options])](#putbucketreferername-region-allowempty-referers-options)
    - [.getBucketReferer*(name, region[, options])](#getbucketreferername-region-options)
    - [.deleteBucketReferer*(name, region[, options])](#deletebucketreferername-region-options)
  - Lifecycle
    - [.putBucketLifecycle*(name, region, rules[, options])](#putbucketlifecyclename-region-rules-options)
    - [.getBucketLifecycle*(name, region[, options])](#getbucketlifecyclename-region-options)
    - [.deleteBucketLifecycle*(name, region[, options])](#deletebucketlifecyclename-region-options)
- [Object Operations](#object-operations)
  - [.list*(query[, options])](#listquery-options)
  - [.put*(name, file[, options])](#putname-file-options)
  - [.head*(name[, options])](#headname-options)
  - [.get*(name, file[, options])](#getname-file-options)
  - [.getStream*(name[, options])](#getstreamname-options)
  - [.delete*(name[, options])](#deletename-options)
  - [.copy*(name, sourceName[, options])](#copyname-sourcename-options)
  - [.putMeta*(name, meta[, options])](#putmetaname-meta-options)
  - [.deleteMulti*(names[, options])](#deletemultinames-options)
  - [.signatureUrl(name)](#signatureurlname)
- [Known Errors](#known-errors)

## Data Regions

OSS current have 5 data regions.

name | country | city | domain
---  | ---     | ---  | ---
oss-cn-hangzhou | China | HangZhou | oss-cn-hangzhou.aliyuncs.com
oss-cn-qingdao | China | QingDao | oss-cn-qingdao.aliyuncs.com
oss-cn-beijing | China | BeiJing | oss-cn-beijing.aliyuncs.com
oss-cn-hongkong | China | HongKong | oss-cn-hongkong.aliyuncs.com
oss-cn-shenzhen | China | ShenZhen | oss-cn-shenzhen.aliyuncs.com

## Create Account

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
- [bucket] {String} the default bucket you want to access
  If you don't have any bucket, please use `putBucket()` create one first.
- [region] {String} the bucket data region location, please see [Data Regions](#data-regions),
  default is `oss-cn-hangzhou`
  Current available: `oss-cn-hangzhou`, `oss-cn-qingdao`, `oss-cn-beijing`, `oss-cn-hongkong` and `oss-cn-shenzhen`
- [internal] {Boolean} access OSS with aliyun internal network or not, default is `false`
  If your servers are running on aliyun too, you can set `true` to save lot of money.
- [timeout] {String|Number} instance level timeout for all operations, default is `60s`

example:

```js
var oss = require('ali-sdk').oss;

var store = oss({
  accessKeyId: 'your access key',
  accessKeySecret: 'your access secret',
  bucket: 'your bucket name'
  region: 'oss-cn-hongkong'
});
```

## Bucket Operations

### .listBuckets*(query[, options])

List buckets in this account.

parameters:

- [query] {Object} query parameters, default is `null`
  - [prefix] {String} search buckets using `prefix` key
  - [marker] {String} search start from `marker`, including `marker` key
  - [max-keys] {String|Number} max buckets, default is `100`, limit to `1000`
- [options] {Object} optional parameters
  - [timeout] {Number} the operation timeout

Success will return buckets list on `buckets` properties.

- buckets {Array<BucketMeta>} bucket meta info list
  Each `BucketMeta` will contains blow properties:
    - name {String} bucket name
    - region {String} bucket store data region, e.g.: `oss-cn-hangzhou-a`
    - creationDate {String} bucket create GMT date, e.g.: `2015-02-19T08:39:44.000Z`
- owner {Object} object owner, including `id` and `displayName`
- isTruncated {Boolean} truncate or not
- nextMarker {String} next marker string
- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

example:

- List top 10 buckets

```js
var result = yield store.listBuckets({
  "max-keys": 10
});
console.log(result);
```

### .putBucket*(name, region[, options])

Create a new bucket.

parameters:

- name {String} bucket name
  If bucket exists and not belong to current account, will throw BucketAlreadyExistsError.
  If bucket not exists, will create a new bucket and set it's ACL.
- region {String} the bucket data region location, please see [Data Regions](#data-regions),
  Current available: `oss-cn-hangzhou`, `oss-cn-qingdao`, `oss-cn-beijing`, `oss-cn-hongkong` and `oss-cn-shenzhen`
  If change exists bucket region, will throw BucketAlreadyExistsError.
  If region value invalid, will throw InvalidLocationConstraintError.
- [options] {Object} optional parameters
  - [timeout] {Number} the operation timeout

Success will return the bucket name on `bucket` properties.

- bucket {String} bucket name
- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

example:

- Create a bucket name `helloworld` location on HongKong

```js
yield store.putBucket('helloworld', 'oss-cn-hongkong');
// use it by default
store.useBucket('helloworld', 'oss-cn-hongkong');
```

### .deleteBucket*(name, region[, options])

Delete an empty bucket.

parameters:

- name {String} bucket name
  If bucket is not empty, will throw BucketNotEmptyError.
  If bucket is not exists, will throw NoSuchBucketError.
- region {String} the bucket data region location, please see [Data Regions](#data-regions),
  Current available: `oss-cn-hangzhou`, `oss-cn-qingdao`, `oss-cn-beijing`, `oss-cn-hongkong` and `oss-cn-shenzhen`
- [options] {Object} optional parameters
  - [timeout] {Number} the operation timeout

Success will return:

- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

example:

- Delete the exists 'helloworld' bucket on 'oss-cn-hongkong'

```js
yield store.deleteBucket('helloworld', {
  region: 'oss-cn-hongkong'
});
```

### .useBucket(name, region)

Use the bucket.

parameters:

- name {String} bucket name
- region {String} the bucket data region location, please see [Data Regions](#data-regions),
  Current available: `oss-cn-hangzhou`, `oss-cn-qingdao`, `oss-cn-beijing`, `oss-cn-hongkong` and `oss-cn-shenzhen`

example:

- Use `helloworld` as the default bucket

```js
store.useBucket('helloworld', 'oss-cn-hongkong');
```

---

### .putBucketACL*(name, region, acl[, options])

Update the bucket ACL.

parameters:

- name {String} bucket name
- region {String} the bucket data region location, please see [Data Regions](#data-regions),
  Current available: `oss-cn-hangzhou`, `oss-cn-qingdao`, `oss-cn-beijing`, `oss-cn-hongkong` and `oss-cn-shenzhen`
- acl {String} access control list, current available: `public-read-write`, `public-read` and `private`
- [options] {Object} optional parameters
  - [timeout] {Number} the operation timeout

Success will return:

- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

example:

- Set bucket `helloworld` to `public-read-write`

```js
yield store.putBucketACL('helloworld', 'oss-cn-hongkong', 'public-read-write');
```

### .getBucketACL*(name, region[, options])

Get the bucket ACL.

parameters:

- name {String} bucket name
- region {String} the bucket data region location, please see [Data Regions](#data-regions),
  Current available: `oss-cn-hangzhou`, `oss-cn-qingdao`, `oss-cn-beijing`, `oss-cn-hongkong` and `oss-cn-shenzhen`
- [options] {Object} optional parameters
  - [timeout] {Number} the operation timeout

Success will return:

- acl {String} acl settiongs string
- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

example:

- Get bucket `helloworld`

```js
var result = yield store.getBucketACL('helloworld', 'oss-cn-hongkong');
console.log(result.acl);
```

---

### .putBucketLogging*(name, region, prefix[, options])

Update the bucket loggging settiongs.
Log file will create every one hour and name format: `<prefix><bucket>-YYYY-mm-DD-HH-MM-SS-UniqueString`.

parameters:

- name {String} bucket name
- region {String} the bucket data region location, please see [Data Regions](#data-regions),
  Current available: `oss-cn-hangzhou`, `oss-cn-qingdao`, `oss-cn-beijing`, `oss-cn-hongkong` and `oss-cn-shenzhen`
- [prefix] {String} prefix path name to store the log files
- [options] {Object} optional parameters
  - [timeout] {Number} the operation timeout

Success will return:

- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

example:

- Enable bucket `helloworld` logging and save with prefix `logs/`

```js
yield store.putBucketLogging('helloworld', 'oss-cn-hongkong', 'logs/');
```

### .getBucketLogging*(name, region[, options])

Get the bucket loggging settiongs.

parameters:

- name {String} bucket name
- region {String} the bucket data region location, please see [Data Regions](#data-regions),
  Current available: `oss-cn-hangzhou`, `oss-cn-qingdao`, `oss-cn-beijing`, `oss-cn-hongkong` and `oss-cn-shenzhen`
- [options] {Object} optional parameters
  - [timeout] {Number} the operation timeout

Success will return:

- enable {Boolean} enable logging or not
- prefix {String} prefix path name to store the log files, maybe `null`
- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

example:

- Get bucket `helloworld` logging settings

```js
var result = yield store.getBucketLogging('helloworld', 'oss-cn-hongkong');
console.log(result.enable, result.prefix);
```

### .deleteBucketLogging(name, region[, options])

Delete the bucket loggging settiongs.

parameters:

- name {String} bucket name
- region {String} the bucket data region location, please see [Data Regions](#data-regions),
  Current available: `oss-cn-hangzhou`, `oss-cn-qingdao`, `oss-cn-beijing`, `oss-cn-hongkong` and `oss-cn-shenzhen`
- [options] {Object} optional parameters
  - [timeout] {Number} the operation timeout

Success will return:

- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

---

### .putBucketWebsite*(name, region, config[, options])

Set the bucket as a static website.

parameters:

- name {String} bucket name
- region {String} the bucket data region location, please see [Data Regions](#data-regions),
  Current available: `oss-cn-hangzhou`, `oss-cn-qingdao`, `oss-cn-beijing`, `oss-cn-hongkong` and `oss-cn-shenzhen`
- config {Object} website config, contains blow properties:
  - index {String} default page, e.g.: `index.html`
  - [error] {String} error page, e.g.: 'error.html'
- [options] {Object} optional parameters
  - [timeout] {Number} the operation timeout

Success will return:

- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

example:

```js
yield store.putBucketWebsite('hello', 'oss-cn-hangzhou', {
  index: 'index.html'
});
```

### .getBucketWebsite*(name, region[, options])

Get the bucket website config.

parameters:

- name {String} bucket name
- region {String} the bucket data region location, please see [Data Regions](#data-regions),
  Current available: `oss-cn-hangzhou`, `oss-cn-qingdao`, `oss-cn-beijing`, `oss-cn-hongkong` and `oss-cn-shenzhen`
- [options] {Object} optional parameters
  - [timeout] {Number} the operation timeout

Success will return:

- index {String} index page
- error {String} error page, maybe `null`
- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

### .deleteBucketWebsite*(name, region[, options])

Delete the bucket website config.

parameters:

- name {String} bucket name
- region {String} the bucket data region location, please see [Data Regions](#data-regions),
  Current available: `oss-cn-hangzhou`, `oss-cn-qingdao`, `oss-cn-beijing`, `oss-cn-hongkong` and `oss-cn-shenzhen`
- [options] {Object} optional parameters
  - [timeout] {Number} the operation timeout

Success will return:

- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

---

### .putBucketReferer*(name, region, allowEmpty, referers[, options])

Set the bucket request `Referer` white list.

parameters:

- name {String} bucket name
- region {String} the bucket data region location, please see [Data Regions](#data-regions),
  Current available: `oss-cn-hangzhou`, `oss-cn-qingdao`, `oss-cn-beijing`, `oss-cn-hongkong` and `oss-cn-shenzhen`
- allowEmpty {Boolean} allow empty request referer or not
- referers {Array<String>} `Referer` white list, e.g.:
  ```js
  [
    'https://npm.taobao.org',
    'http://cnpmjs.org'
  ]
  ```
- [options] {Object} optional parameters
  - [timeout] {Number} the operation timeout

Success will return:

- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

example:

```js
yield store.putBucketReferer('hello', 'oss-cn-hangzhou', false, [
  'https://npm.taobao.org',
  'http://cnpmjs.org'
]);
```

### .getBucketReferer*(name, region[, options])

Get the bucket request `Referer` white list.

parameters:

- name {String} bucket name
- region {String} the bucket data region location, please see [Data Regions](#data-regions),
  Current available: `oss-cn-hangzhou`, `oss-cn-qingdao`, `oss-cn-beijing`, `oss-cn-hongkong` and `oss-cn-shenzhen`
- [options] {Object} optional parameters
  - [timeout] {Number} the operation timeout

Success will return:

- allowEmpty {Boolean} allow empty request referer or not
- referers {Array<String>} `Referer` white list
- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

### .deleteBucketReferer*(name, region[, options])

Delete the bucket request `Referer` white list.

parameters:

- name {String} bucket name
- region {String} the bucket data region location, please see [Data Regions](#data-regions),
  Current available: `oss-cn-hangzhou`, `oss-cn-qingdao`, `oss-cn-beijing`, `oss-cn-hongkong` and `oss-cn-shenzhen`
- [options] {Object} optional parameters
  - [timeout] {Number} the operation timeout

Success will return:

- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

---

### .putBucketLifecycle*(name, region, rules[, options])

Set the bucket object lifecycle.

parameters:

- name {String} bucket name
- region {String} the bucket data region location, please see [Data Regions](#data-regions),
  Current available: `oss-cn-hangzhou`, `oss-cn-qingdao`, `oss-cn-beijing`, `oss-cn-hongkong` and `oss-cn-shenzhen`
- rules {Array<Rule>} rule config list, each `Rule` will contains blow properties:
  - [id] {String} rule id, if not set, OSS will auto create it with random string.
  - prefix {String} store prefix
  - status {String} rule status, allow values: `Enabled` or `Disabled`
  - [days] {Number|String} expire after the `days`
  - [date] {String} expire date, e.g.: `2022-10-11T00:00:00.000Z`
    `date` and `days` only set one.
- [options] {Object} optional parameters
  - [timeout] {Number} the operation timeout

Success will return:

- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

example:

```js
yield store.putBucketLifecycle('hello', 'oss-cn-hangzhou', [
  {
    id: 'delete after one day',
    prefix: 'logs/',
    status: 'Enabled',
    days: 7
  },
  {
    prefix: 'logs2/',
    status: 'Disabled',
    date: '2022-10-11T00:00:00.000Z'
  }
]);
```

### .getBucketLifecycle*(name, region[, options])

Get the bucket object lifecycle.

parameters:

- name {String} bucket name
- region {String} the bucket data region location, please see [Data Regions](#data-regions),
  Current available: `oss-cn-hangzhou`, `oss-cn-qingdao`, `oss-cn-beijing`, `oss-cn-hongkong` and `oss-cn-shenzhen`
- [options] {Object} optional parameters
  - [timeout] {Number} the operation timeout

Success will return:

- rules {Array<Rule>} the lifecycle rule list
- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

### .deleteBucketLifecycle*(name, region[, options])

Delete the bucket object lifecycle.

parameters:

- name {String} bucket name
- region {String} the bucket data region location, please see [Data Regions](#data-regions),
  Current available: `oss-cn-hangzhou`, `oss-cn-qingdao`, `oss-cn-beijing`, `oss-cn-hongkong` and `oss-cn-shenzhen`
- [options] {Object} optional parameters
  - [timeout] {Number} the operation timeout

Success will return:

- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

---

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
    - 'Cache-Control' cache control for download, e.g.: `Cache-Control: public, no-cache`
    - 'Content-Disposition' object name for download, e.g.: `Content-Disposition: somename`
    - 'Content-Encoding' object content encoding for download, e.g.: `Content-Encoding: gzip`
    - 'Expires' expires time (milliseconds) for download, e.g.: `Expires: 3600000`

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

Get an object from the bucket.

parameters:

- name {String} object name store on OSS
- [file] {String|WriteStream} file path or WriteStream instance to store the content
  If `file` is null or ignore this parameter, function will return info contains `content` property.
- [options] {Object} optional parameters
  - [timeout] {Number} the operation timeout
  - [headers] {Object} extra headers, detail see [RFC 2616](http://www.w3.org/Protocols/rfc2616/rfc2616.html)
    - 'Range' get specifying range bytes content, e.g.: `Range: bytes=0-9`
    - 'If-Modified-Since' object modified after this time will return 200 and object meta,
        otherwise return 304 not modified
    - 'If-Unmodified-Since' object modified before this time will return 200 and object meta,
        otherwise throw PreconditionFailedError
    - 'If-Match' object etag equal this will return 200 and object meta,
        otherwise throw PreconditionFailedError
    - 'If-None-Match' object etag not equal this will return 200 and object meta,
        otherwise return 304 not modified

Success will return the info contains response.

object:

- [content] {Buffer} file content buffer if `file` parameter is null or ignore
- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

If object not exists, will throw NoSuchKeyError.

example:

- Get an exists object and store it to the local file

```js
var filepath = '/home/ossdemo/demo.txt';
yield store.get('ossdemo/demo.txt', filepath);
```

_ Store object to a writestream

```js
yield store.get('ossdemo/demo.txt', somestream);
```

- Get an object content buffer

```js
var result = yield store.get('ossdemo/demo.txt');
console.log(Buffer.isBuffer(result.content));
```

- Get a not exists object

```js
var filepath = '/home/ossdemo/demo.txt';
yield store.get('ossdemo/not-exists-demo.txt', filepath);
// will throw NoSuchKeyError
```

### .getStream*(name[, options])

Get an object read stream.

parameters:

- name {String} object name store on OSS
- [options] {Object} optional parameters
  - [timeout] {Number} the operation timeout
  - [headers] {Object} extra headers
    - 'If-Modified-Since' object modified after this time will return 200 and object meta,
        otherwise return 304 not modified
    - 'If-Unmodified-Since' object modified before this time will return 200 and object meta,
        otherwise throw PreconditionFailedError
    - 'If-Match' object etag equal this will return 200 and object meta,
        otherwise throw PreconditionFailedError
    - 'If-None-Match' object etag not equal this will return 200 and object meta,
        otherwise return 304 not modified

Success will return the stream instance and response info.

object:

- stream {ReadStream} readable stream instance
    if response status is not 200, stream will be `null`.
- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

If object not exists, will throw NoSuchKeyError.

example:

- Get an exists object stream

```js
var result = yield store.getStream('ossdemo/demo.txt');
result.stream.pipe(fs.createWriteStream('some file.txt'));
```

### .delete*(name[, options])

Delete an object from the bucket.

parameters:

- name {String} object name store on OSS
- [options] {Object} optional parameters
  - [timeout] {Number} the operation timeout

Success will return the info contains response.

object:

- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

If delete object not exists, will also delete success.

example:

- Delete an exists object

```js
yield store.delete('ossdemo/someobject');
```

- Delete a not exists object

```js
yield store.delete('ossdemo/some-not-exists-object');
```

### .copy*(name, sourceName[, options])

Copy an object from `sourceName` to `name`.

parameters:

- name {String} object name store on OSS
- sourceName {String} source object name
  If `sourceName` start with `/`, meaning it's a full name contains the bucket name.
  e.g.: `/otherbucket/logo.png` meaning copy `otherbucket` logn.png object to current bucket.
- [options] {Object} optional parameters
  - [timeout] {Number} the operation timeout
  - [meta] {Object} user meta, will send with `x-oss-meta-` prefix string
    e.g.: `{ uid: 123, pid: 110 }`
    If the `meta` set, will override the source object meta.
  - [headers] {Object} extra headers
    - 'If-Match' do copy if source object etag equal this,
      otherwise throw PreconditionFailedError
    - 'If-None-Match' do copy if source object etag not equal this,
      otherwise throw PreconditionFailedError
    - 'If-Modified-Since' do copy if source object modified after this time,
        otherwise throw PreconditionFailedError
    - 'If-Unmodified-Since' do copy if source object modified before this time,
        otherwise throw PreconditionFailedError

Success will return the copy result in `data` property.

object:

- data {Object} copy result
  - lastModified {String} object last modified GMT string
  - etag {String} object etag contains `"`, e.g.: `"5B3C1A2E053D763E1B002CC607C5A0FE"`
- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

If source object not exists, will throw NoSuchKeyError.

example:

- Copy same bucket object

```js
var result = yield store.copy('newName', 'oldName');
```

- Copy other bucket object

```js
var result = yield store.copy('logo.png', '/other-bucket/logo.png');
```

### .putMeta*(name, meta[, options])

Set an exists object meta.

parameters:

- name {String} object name store on OSS
- meta {Object} user meta, will send with `x-oss-meta-` prefix string
  e.g.: `{ uid: 123, pid: 110 }`
  If `meta: null`, will clean up the exists meta
- [options] {Object} optional parameters
  - [timeout] {Number} the operation timeout

Success will return the copy result in `data` property.

- data {Object} copy result
  - lastModified {String} object last modified GMT date, e.g.: `2015-02-19T08:39:44.000Z`
  - etag {String} object etag contains `"`, e.g.: `"5B3C1A2E053D763E1B002CC607C5A0FE"`
- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

If object not exists, will throw NoSuchKeyError.

example:

- Update exists object meta

```js
var result = yield store.putMeta('ossdemo.txt', {
  uid: 1, pid: 'p123'
});
console.log(result);
```

- Clean up object meta

```js
yield store.putMeta('ossdemo.txt', null);
```

### .deleteMulti*(names[, options])

Delete multi objects in one request.

parameters:

- names {Array<String>} object names, max 1000 objects in once.
- [options] {Object} optional parameters
  - [quiet] {Boolean} quiet mode or verbose mode, default is `false`, verbose mode
    quiet mode: if all objects delete succes, return emtpy response.
      otherwise return delete error object results.
    verbose mode: return all object delete results.
  - [timeout] {Number} the operation timeout

Success will return delete success objects in `deleted` property.

- [deleted] {Array<String>} deleted object names list
- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

example:

- Delete multi objects in quiet mode

```js
var result = yield store.deleteMulti(['obj1', 'obj2', 'obj3'], {
  quiet: true
});
```

- Delete multi objects in verbose mode

```js
var result = yield store.deleteMulti(['obj1', 'obj2', 'obj3']);
```

### .list*(query[, options])

List objects in the bucket.

parameters:

- [query] {Object} query parameters, default is `null`
  - [prefix] {String} search object using `prefix` key
  - [marker] {String} search start from `marker`, including `marker` key
  - [delimiter] {String} delimiter search scope
    e.g. `/` only search current dir, not including subdir
  - [max-keys] {String|Number} max objects, default is `100`, limit to `1000`
- [options] {Object} optional parameters
  - [timeout] {Number} the operation timeout

Success will return objects list on `objects` properties.

- objects {Array<ObjectMeta>} object meta info list
  Each `ObjectMeta` will contains blow properties:
    - name {String} object name on oss
    - lastModified {String} object last modified GMT date, e.g.: `2015-02-19T08:39:44.000Z`
    - etag {String} object etag contains `"`, e.g.: `"5B3C1A2E053D763E1B002CC607C5A0FE"`
    - type {String} object type, e.g.: `Normal`
    - size {Number} object size, e.g.: `344606`
    - storageClass {String} storage class type, e.g.: `Standard`
    - owner {Object} object owner, including `id` and `displayName`
- prefixes {Array<String>} prefix list
- isTruncated {Boolean} truncate or not
- nextMarker {String} next marker string
- res {Object} response info, including
  - status {Number} response status
  - headers {Object} response headers
  - size {Number} response size
  - rt {Number} request total use time (ms)

example:

- List top 10 objects

```js
var result = yield store.list();
console.log(result.objects);
```

- List `fun/` dir including subdirs objects

```js
var result = yield store.list({
  perfix: 'fun/'
});
console.log(result.objects);
```

- List `fun/` dir objects, not including subdirs

```js
var result = yield store.list({
  perfix: 'fun/',
  delimiter: '/'
});
console.log(result.objects);
```

### .signatureUrl(name)

Create a signature url for directly download.

parameters:

- name {String} object name store on OSS
- [options] {Object} optional parameters
  - [expires] {Number} after expires seconds, the url will become invalid, default is `1800`
  - [timeout] {Number} the operation timeout

Success will return signature url.

example:

- Get an object signature url for download

```js
var url = store.signatureUrl('ossdemo.txt');
console.log(url);
```

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
