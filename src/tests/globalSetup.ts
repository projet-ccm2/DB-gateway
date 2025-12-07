import { startTestContainer } from "./integration/testContainerSetup";

export default async function globalSetup() {
  await startTestContainer();
}
