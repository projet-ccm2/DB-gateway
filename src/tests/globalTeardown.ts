import { stopTestContainer } from "./integration/testContainerSetup";

export default async function globalTeardown() {
  await stopTestContainer();
}
