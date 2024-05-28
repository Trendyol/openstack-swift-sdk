# Openstack Swift SDK

Welcome to the Openstack Swift SDK! This SDK allows you to interact with Openstack Swift, a highly available, distributed, and consistent object storage system. With this SDK, you can easily manage and manipulate your data stored in Openstack Swift.

## Features

- Authentication with Openstack Swift using application credentials.
- CRUD operations on containers and objects.
- Upload and download objects.
- Manage metadata of containers and objects.
- List objects in a container with various filters.

## Installation

To install the SDK, use npm:

```bash
npm install @trendyol-js/openstack-swift-sdk
```

## Usage

Here is a quick guide on how to use the Openstack Swift SDK.

### Configuration

First, set up your Openstack Swift configuration. You can do this by setting environment variables or by directly passing the configuration object.

```typescript
import { SwiftClientConfiguration } from '@trendyol-js/openstack-swift-sdk';

const config = new SwiftClientConfiguration();
config.authEndpoint = 'https://your-openstack-auth-endpoint';
config.swiftEndpoint = 'https://your-openstack-swift-endpoint';
config.credentialId = 'your-application-credential-id';
config.secret = 'your-application-credential-secret';
```

### Initialization

Create an instance of SwiftClient using the configuration.

```typescript
import { SwiftClient } from '@trendyol-js/openstack-swift-sdk';

const swiftClient = new SwiftClient(config);
```

### Authentication

The SDK handles authentication for you. It obtains a token and automatically includes it in your requests.

### Operations

#### Download an Object

Download an object from a container.

```typescript
const container = 'my-container';
const path = 'my-object';

const downloadResponse = await swiftClient.download(container, path);

if (downloadResponse instanceof DownloadResponse) {
  const stream = downloadResponse.data;
  // Process the stream
} else {
  console.log('Object not found');
}
```

#### Upload an Object

Upload an object to a container.

```typescript
import { Readable } from 'stream';

const container = 'my-container';
const path = 'my-object';
const stream = Readable.from('Hello, Openstack Swift!');

await swiftClient.upload(container, path, stream);
```

#### List Objects

List objects in a container with a prefix and limit.

```typescript
const container = 'my-container';
const prefix = 'my-prefix';
const limit = 10;

const objects = await swiftClient.list(container, prefix, limit);

objects.forEach(obj => {
  console.log(`Object: ${obj.name}, Size: ${obj.bytes}`);
});
```

#### Get Container Metadata

Get metadata of a container.

```typescript
const container = 'my-container';

const metadata = await swiftClient.getContainerMetadata(container);

if (metadata instanceof ContainerMetaResponse) {
  console.log(`Size: ${metadata.size}, Last Modified: ${metadata.lastModified}`);
} else {
  console.log('Container not found');
}
```

#### Get Object Metadata

Get metadata of an object.

```typescript
const container = 'my-container';
const path = 'my-object';

const metadata = await swiftClient.getMetadata(container, path);

if (metadata instanceof ObjectMetaResponse) {
  console.log(`Size: ${metadata.size}, Content Type: ${metadata.contentType}`);
} else {
  console.log('Object not found');
}
```

#### Delete an Object

Delete an object from a container.

```typescript
const container = 'my-container';
const path = 'my-object';

const success = await swiftClient.delete(container, path);

if (success) {
  console.log('Object deleted successfully');
} else {
  console.log('Failed to delete object');
}
```

## Development

### Scripts

- `test`: Run tests using Jest.
- `build`: Compile TypeScript to JavaScript.
- `lint`: Run TypeScript and ESLint checks.
- `lint:fix`: Automatically fix linting issues.

### Pre-commit Hooks

Husky is used to run lint-staged, which formats code with Prettier before committing.

## Contributing

We welcome contributions to the Openstack Swift SDK. Please fork the repository and submit pull requests with your improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

We hope you find this SDK useful! If you encounter any issues or have suggestions, please open an issue on our [GitHub repository](https://github.com/Trendyol/openstack-swift-sdk). Happy coding!