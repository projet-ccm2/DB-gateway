import { startTestContainer, stopTestContainer } from "./testContainerSetup";

beforeAll(async () => {
  await startTestContainer();
}, 60000); // timeout long pour le démarrage du conteneur

afterAll(async () => {
  await stopTestContainer();
});
