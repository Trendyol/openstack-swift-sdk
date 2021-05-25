export class SwiftClientConfiguration {
  authEndpoint: string = process.env["OPENSTACK_SWIFT_AUTH_ENDPOINT"] as string;
  swiftEndpoint: string = process.env["OPENSTACK_SWIFT_ENDPOINT"] as string;
  credentialId: string = process.env["OPENSTACK_SWIFT_AUTH_ENDPOINT"] as string;
  secret: string = process.env["OPENSTACK_SWIFT_SECRET"] as string;
}
