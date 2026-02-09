import { startTestContainer, stopTestContainer } from "./testContainerSetup";

beforeAll(async () => {
  await startTestContainer();
}, 60000);

afterAll(async () => {
  await stopTestContainer();
});
